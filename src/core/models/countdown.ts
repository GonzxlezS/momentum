import type { IDBData } from "./idb.ts";

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export interface CountdownData extends IDBData {
  name: string;
  date: Date;
  emoji: string;
  color: string;
}

export class Countdown {
  public id: number;
  public name: string;
  public date: Date;
  public emoji: string;
  public color: string;

  constructor(data: CountdownData) {
    this.id = 0;
    if (data.id) {
      this.id = data.id;
    }

    this.name = data.name;
    this.date = data.date;
    this.emoji = data.emoji;
    this.color = data.color;

    this.validate();
  }

  public validate() {
    if (this.id < 0) {
      throw new Error("Invalid ID: ID must be a non-negative integer.");
    }

    this.name = this.name.trim();
    if (this.name === "") {
      throw new Error("Invalid name: name cannot be empty.");
    }

    if (!(this.date instanceof Date) || isNaN(this.date.getTime())) {
      throw new Error("Invalid date: date object is not valid.");
    }

    this.emoji = this.emoji.trim();
    if (this.emoji === "") {
      throw new Error("Invalid emoji: cannot be empty.");
    }

    if (!hexColorRegex.test(this.color)) {
      throw new Error(
        "Invalid color: must be a valid 3 or 6 digit hex code prefixed with #.",
      );
    }
  }

  public toIDBData(): CountdownData {
    return {
      ...(this.id !== 0 && { id: this.id }),
      name: this.name,
      date: this.date,
      emoji: this.emoji,
      color: this.color,
    };
  }

  public daysLeft(): number {
    const now = new Date();

    const nowUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );

    const targetUTC = Date.UTC(
      this.date.getUTCFullYear(),
      this.date.getUTCMonth(),
      this.date.getUTCDate(),
    );

    const diffTime = targetUTC - nowUTC;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  public textColor(): string {
    let hex = this.color.replace(/^#/, "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const RsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const GsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const BsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    const luminance = 0.2126 * RsRGB + 0.7152 * GsRGB + 0.0722 * BsRGB;

    return luminance > 0.5 ? "black" : "white";
  }
}
