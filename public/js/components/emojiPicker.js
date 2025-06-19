import { Picker } from 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js'

export class EmojiPicker extends HTMLDivElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._emojiBtn = null;
        this._dataSource = 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json';
        
        this._picker = new Picker({
            dataSource: this._dataSource
        });
    }

    get clickedEmoji() {
        return this._emojiBtn ? this._emojiBtn.innerText : "😀";
    }

    set clickedEmoji(emoji) {
        if (this._emojiBtn) this._emojiBtn.innerText = emoji;
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<style>
            :host {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #emojiBtn {
                font-size: 2rem;
                border: none;
                background: none;
            }

            #emojiPickerPopover {
                background-color: rgba(0,0,0,0);
            }

            :popover-open {
                border: none;
            }

            :popover-open::backdrop {
                background-color: rgba(0,0,0,0.6);
            }

            emoji-picker {
                --num-columns: 6;
                --emoji-size: 1.5rem;
                --emoji-padding: 0.2rem;
            }
        </style>

        <button id="emojiBtn" type="button" popovertarget="emojiPickerPopover" popovertargetaction="show">
        ${this.clickedEmoji}
        </button>
        <div id="emojiPickerPopover" popover></div>`;

        this._emojiBtn = this.shadowRoot.querySelector('#emojiBtn');

        const emojiPickerPopover = this.shadowRoot.querySelector('#emojiPickerPopover');
        emojiPickerPopover.appendChild(this._picker);

        this._picker.addEventListener(("emoji-click"), (event) => {
            this.clickedEmoji = event.detail.unicode;
            emojiPickerPopover.hidePopover();

            this.dispatchEvent(new CustomEvent('emoji-clicked', {
                detail: event.detail,
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('emoji-picker-popover', EmojiPicker, {extends: 'div'});