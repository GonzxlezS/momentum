export class Countdown {
    constructor(id, name, date, emoji, color) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.emoji = emoji;
        this.color = color;                
    }

    ID() {
        if (typeof this.id !== 'number' || !Number.isInteger(this.id)) {
            const parsedId = parseInt(this.id);
            if (!isNaN(parsedId)) {
                this.id = parsedId;
            } else {
                throw new Error("Invalid id");
            }
        }
        return this.id;
    }

    validate() {
        // name
        if (typeof this.name !== 'string') {
            this.name = String(this.name);
        }
        if (this.name.trim() === '') {
            throw new Error('Invalid name: cannot be empty');
        }

        // date
        if (!(this.date instanceof Date)) {
            const parsedDate = new Date(this.date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid date');
            }
            this.date = parsedDate;
        }

        // color
        const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
        if (typeof this.color !== 'string' || !hexColorRegex.test(this.color)) {
            throw new Error('Invalid color');
        }
    }

    textColor() {
        return colorByLuminance(this.color);
    }

    daysleft() {
        const now = new Date();
        const target = new Date(this.date);

        now.setHours(0,0,0,0);
        target.setHours(0,0,0,0);

        const diffTime = target.getTime() - now.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    static fromObject(obj) {
        if (!obj) return null;
        const countdown = new Countdown(obj.id, obj.name, obj.date, obj.emoji, obj.color)
        countdown.validate();
        return countdown;
    }

    static fromForm(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key === "date") {
                value = value + "T00:00";
            }

            data[key] = value;
        }   
        return this.fromObject(data);
    }
}

function colorByLuminance(hex) {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const RsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const GsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const BsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    const luminance = 0.2126 * RsRGB + 0.7152 * GsRGB + 0.0722 * BsRGB;

    return luminance > 0.5? "black" : "white";
}