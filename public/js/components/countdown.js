import { Countdown } from "../models/countdown.js";
import "./emojiPicker.js";

export class CountdownCard extends HTMLElement {
    constructor() {
        super();
        this._countdownData = null; 
    }

    get countdownData() {
        return this._countdownData;
    }

    set countdownData(data) {
        if (!(data instanceof Countdown)) return;
        this._countdownData = data;
        this.render();
    }

    render() {
        if (!this._countdownData) return;

        this.style.background = this._countdownData.color;
        this.style.color = this._countdownData.textColor();
        
        this.innerHTML = `<div class="countdown-card-right">
            <span class="countdown-card-emoji">${this._countdownData.emoji}</span>
            <div class="countdown-card-details">
                <span class="countdown-card-name">${this._countdownData.name}</span>
                <span class="countdown-card-date">
                    ${this._countdownData.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                    })}
                </span>
            </div>
        </div>
        <div class="countdown-card-left">
            <span class="countdown-card-daysleft">${this._countdownData.daysleft()}</span>
            <span class="countdown-card-days-label">days</span>
        </div>`;
    }
}

customElements.define('countdown-card', CountdownCard);

export class CountdownCards extends HTMLElement {
    static get observedAttributes() {
        return ['data-descending'];
    }

    constructor() {
        super();
        this._countdowns = [];
        this._descending = false;
        this.attachShadow({ mode: 'open' });
    }

    get countdowns() {
        return this._countdowns;
    }

    set countdowns(data) {
        this._countdowns = data;
        this._sort();
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-descending') {
            this._descending = (newValue === "true");
            this._sort();
            this.render();
        }
    }

    _sort() {
       this._countdowns.sort((a, b) => {
            return this._descending 
                ? b.daysleft() - a.daysleft() 
                : a.daysleft() - b.daysleft();
        });
    }

    _getCountdown(id) {
        if (typeof id !== 'number' || !Number.isInteger(id)) {
            const parsedId = parseInt(id);
            if (!isNaN(parsedId)) {
                id = parsedId;
            } else {
                throw new Error("Invalid id");
            }
        }

        return this._countdowns.find(countdown => countdown.ID() === id);
    }

    addCountdown(data) {
        if (!(data instanceof Countdown)) return;
        this._countdowns.push(data);
        this._sort();
        this.render();
    }

    updateCountdown(data) {
        if (!(data instanceof Countdown)) return;

        const i = this._countdowns.findIndex(item => item.ID() === data.ID());
        if (i !== -1) this._countdowns[i] = data;

        this._sort();
        this.render();
    }

    deleteCountdown(id) {
        const i = this._countdowns.findIndex(item => item.ID() === id);
        if (i !== -1) this._countdowns.splice(i, 1);

        this._sort();
        this.render();
    }

    render() {
        if (!this._content ||this._countdowns.length === 0) return;

        this._content.innerHTML = ''; 
        this._countdowns.forEach(countdown => {
            const card = document.createElement('countdown-card');
            card.countdownData = countdown;
            card.setAttribute("id", `${countdown.ID()}`);
            this._content.appendChild(card);                    
        });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<style>
            #content {
                /* Grid */
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 0.5rem 2rem;
                padding-bottom: 5rem;
            }

            countdown-card {
                border-radius: 0.5rem;

                /* Grid */
                display: grid;
                grid-template-columns: 3fr 1fr;
            }

            .countdown-card-right {
                padding: 0.5rem 0 0.5rem 0;

                /* Grid*/
                display: grid;
                grid-template-columns: 1fr 3fr;
            }

            .countdown-card-emoji {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                line-height: 1;
                font-size: 2rem;
            }

            .countdown-card-details {
                overflow-x: auto;
                white-space: nowrap;

                /* Grid*/
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 1fr;
            }

            .countdown-card-name {
                font-size: 1.5rem;
                align-self: center;
                justify-self: left;
                text-align: left;
            }

            .countdown-card-date {
                font-size: 0.8rem;
                opacity: 60%;
                align-self: center;
                justify-self: left;
                text-align: left;
            }

            .countdown-card-left {
                padding: 0.5rem 0 0.5rem 0;
                border-radius: 0 0.5rem 0.5rem 0 ;
                background-color: rgba(0, 0, 0, 0.25);
                text-align: center;

                /* Grid*/
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 1fr;
            }

            .countdown-card-daysleft {
                font-size: 1.5rem;
                align-self: end;
                justify-self: center;
                text-align: center;
            }

            .countdown-card-days-label{
                align-self: start;
                justify-self: center;
                text-align: center;
            }

            #sortBtn {
                border: none;
                pading: 0.5rem;
                border-radius: 50%;
                font-size: 1rem;

                display: block;
                margin-left: auto;
                margin-bottom: 0.5rem;

                background-color: var(--background-color);
                color: var(--text-color);

                transition: color 0.2s, background-color 0.2s;
            }
            
            :host([data-descending="true"]) #sortBtn,
            #sortBtn:hover {
                background-color: var(--text-color);
                color: var(--background-color);
            }
        </style>

        <button id="sortBtn" type="button">⇵</button>
        <div id="content"></div>`;

        const sortBtn = this.shadowRoot.querySelector('#sortBtn');
        sortBtn.addEventListener('click', () => {
            this._descending = !this._descending;
            this.setAttribute('data-descending', `${this._descending}`);
        })

        this._content = this.shadowRoot.querySelector('#content');
        this._content.addEventListener("click", (event) => {
            const clickedCard = event.target.closest('countdown-card');
            if (clickedCard) {
                this.dispatchEvent(new CustomEvent('card-clicked', {
                    detail: this._getCountdown(clickedCard.id),
                    bubbles: true,
                    composed: true
                }));
            }
        });

        this.render();
    }
}

customElements.define('countdown-cards', CountdownCards);

export class CountdownForm extends HTMLElement {
    constructor() {
        super(); 
        this._countdownData = null;
        this.attachShadow({ mode: 'open' });
        this._emojiPicker = document.createElement('div', { is: 'emoji-picker-popover' }); 
        this._form = null;
        this._deleteBtn = null;
        this._updateBtn = null;
        this._saveBtn = null;
    }

    get countdownData() {
        return this._countdownData;
    }

    set countdownData(data) {
        if (data instanceof Countdown) {;
            this._countdownData = data;
            this._hideButtons();
            this._setCountdownData();
            return;
        }
        this.resetForm();
    }

    _hideButtons() {
        if (!this._form) return;

        if (this._countdownData) {
            this._deleteBtn.classList.remove("hidden");
            this._updateBtn.classList.remove("hidden");
            this._saveBtn.classList.add("hidden");
            return;
        }
        this._deleteBtn.classList.add("hidden");
        this._updateBtn.classList.add("hidden");
        this._saveBtn.classList.remove("hidden");
    }

    _setCountdownData() {
        if (!this._countdownData || !this._form) return;

        Object.keys(this._countdownData).forEach(key => {
            const input = this._form.elements.namedItem(key);
            if (input) {
                input.value = this._countdownData[key];
            }
        });

        // emojiBtn
        this._emojiPicker.clickedEmoji = this._countdownData.emoji;

        // date
        this._form.elements.date.value = this._countdownData.date.toISOString().slice(0, 10);
    }

    resetForm() {
        this._countdownData = null;
        if (this._form) {
            this._form.reset();
            this._emojiPicker.clickedEmoji = "😀";
            this._hideButtons();
        }
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<style>
            .hidden {
                display: none;
                opacity: 0;
            }

            #countdownForm {
                display: grid;
                gap: 1.5rem;
            }

            #countdownForm input {
                font: inherit;
            }

            #emojiColorContainer {
                display: grid;
                grid-template-columns: 1fr 4fr;
            }

            #color {
                width: 100%;
                height: 3rem;
                border: none;
                background-color: var(--background-color);
            }

            .form-label {
                width: 100%;
                display: grid;
                grid-template-areas: "input";
            }

            .form-input {
                grid-area: input;

                background-color: var(--background-color);
                color: var(--text-color);

                width: 100%;
                border: 1px solid var(--text-color);
                border-radius: 0.5rem;
                padding: 0.7rem 1.5rem;
                box-sizing: border-box;
            }

            .form-text {
                grid-area: input;
                z-index: 100;

                background-color: rgba(0,0,0,0);
                color: var(--text-color);

                width: max-content;
                height: 100%;

                margin-left: 1rem;
                padding: 0 0.5rem;

                display: flex;
                align-items: center;

                transform-origin: left center;
                transition: 0.3s;
            }

            .form-input:is(:focus, :not(:placeholder-shown)) + .form-text {
                background-color: var(--background-color);
                transform: translateY(-50%) scale(0.7);
            }

            #btnContainer {
                display: flex;
                justify-content: space-around;
                align-items: center;
            }

            #btnContainer button {
                font-size: 1.2rem;
                padding: 0.5rem;
                border-radius: 0.5rem;
            }

            #discardBtn {
                background-color: var(--background-color);
                border: 2px solid grey;
                color: var(--text-color);
            }


            #discardBtn:hover {
                background-color: var(--background-color);
                color: white;
                background-color: grey;
            }

            #deleteBtn {
                background-color: var(--background-color);
                border: 2px solid red;
                color: red;
            }

            #deleteBtn:hover {
                color: white;
                background-color: red;
            }

            #updateBtn, 
            #saveBtn {
                background-color: var(--background-color);
                border: 2px solid green;
                color: green;
            }

            #updateBtn:hover,
            #saveBtn:hover {
                color: white;
                background-color: green;
            }
        </style>

        <form id="countdownForm">
            <div id="emojiColorContainer">
                <input type="color" id="color" name="color" value="#50533C" required/>
            </div>

            <label for="name" class="form-label">
                <input type="text" id="name" name="name" class="form-input" placeholder=" " autofocus required/>
                <span class="form-text">Name</span>
            </label>

            <label for="date" class="form-label">
                <input type="date" id="date" name="date" class="form-input" required />
                <span class="form-text">Date</span>
            </label>

            <input type="hidden" id="id" name="id"/>

            <input type="hidden" id="emoji" name="emoji" value="${this._emojiPicker.clickedEmoji}" required/>

            <div id="btnContainer">
                <button id="discardBtn" type="reset" form="countdownForm">Discard</button>
                <button id="deleteBtn" type="reset" form="countdownForm">Delete</button>
                <button id="updateBtn" type="submit" form="countdownForm">Update</button>
                <button id="saveBtn" type="submit" form="countdownForm">Save</button>
            </div>
        </form>`;

        const emojiColorContainer = this.shadowRoot.querySelector('#emojiColorContainer');
        emojiColorContainer.insertBefore(this._emojiPicker, emojiColorContainer.firstChild);
        
        this._form = this.shadowRoot.querySelector("#countdownForm");

        this._emojiPicker.addEventListener('emoji-clicked', (event) => {
            this._form.elements.emoji.value = event.detail.unicode;
        });

        const discardBtn = this.shadowRoot.querySelector("#discardBtn");
        this._deleteBtn = this.shadowRoot.querySelector("#deleteBtn");
        this._updateBtn = this.shadowRoot.querySelector("#updateBtn");
        this._saveBtn = this.shadowRoot.querySelector("#saveBtn");
    
        discardBtn.addEventListener('click', (event) => {
            this.resetForm();
            this.dispatchEvent(new CustomEvent('discard-countdown', {
                bubbles: true,
                composed: true,
                cancelable: true,
            }));
        });

        this._deleteBtn.addEventListener('click', (event) => {
            if (!this._form.checkValidity()) {
                this._form.reportValidity();
                return;
            }
            event.preventDefault();

            const countdown = Countdown.fromForm(this._form);

            this.dispatchEvent(new CustomEvent('delete-countdown', {
                detail: countdown,
                bubbles: true,
                composed: true
            }));
        });

        this._updateBtn.addEventListener('click', (event) => {
            if (!this._form.checkValidity()) {
                this._form.reportValidity();
                return;
            }
            event.preventDefault();

            const countdown = Countdown.fromForm(this._form);

            this.dispatchEvent(new CustomEvent('update-countdown', {
                detail: countdown,
                bubbles: true,
                composed: true
            }));
        });  

        this._saveBtn.addEventListener('click', (event) => {
            if (!this._form.checkValidity()) {
                this._form.reportValidity();
                return;
            }
            event.preventDefault();

            const countdown = Countdown.fromForm(this._form);

            this.dispatchEvent(new CustomEvent('save-countdown', {
                detail: countdown,
                bubbles: true,
                composed: true
            }));
        });
        
        this._hideButtons();
        this._setCountdownData();
    }
}

customElements.define('countdown-form', CountdownForm);