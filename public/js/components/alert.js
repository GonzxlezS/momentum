export class ToastAlert extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._timer = null;
        this._observer = new MutationObserver(() => this._showAlert());
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<style>
            :host {
                position: fixed;
                width: 90%;
                top: 2rem;
                left: 50%;
                transform: translateX(-50%);
                z-index: 100;
                background: lightcoral;
                color: black;
                border-radius: 1rem;
                padding: 0.5rem;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s cubic-bezier(.4,0,.2,1), transform 0.4s cubic-bezier(.4,0,.2,1);
            
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.2rem;

                font-size: 0.8rem;
            }
            
            :host(.show) {
                opacity: 1;
                pointer-events: auto;
                transform: translateX(-50%) translateY(0);
            }

            :host(.hidden) {
                display: node;
                opacity: 0;
                pointer-events: none;
                transform: translateX(-50%) translateY(-40px);
            }

            #alertClose {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                transition: color 0.2s;
            }

            #alertClose:hover {
                color: #333;
            }
        </style>
        <slot></slot>
        <button id="alertClose" type="button">&times;</button>`
        
        const alertClose = this.shadowRoot.querySelector('#alertClose');
        alertClose.addEventListener('click', () => {
            this._hideAlert();
        });


        this._observer.observe(this, { 
            childList: true, 
            characterData: true, 
            subtree: true
        });
        
        if (this.textContent.trim() !== '') this._showAlert();
    }

    disconnectedCallback() {
        this._observer.disconnect();
        clearTimeout(this._timer);
    }

    _showAlert() {
        if (this.textContent.trim() === '') return;

        clearTimeout(this._timer);
        this.classList.remove('hidden');
        this.classList.add('show');

        this._timer = setTimeout(() => {
            this._hideAlert();
        }, 5000);
    }

    _hideAlert() {
        this.classList.remove('show');
        this.classList.add('hidden');
        clearTimeout(this._timer);
        this.innerHTML = '';
    }
}

customElements.define('toast-alert', ToastAlert);