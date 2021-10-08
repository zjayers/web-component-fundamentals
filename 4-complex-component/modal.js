class Modal extends HTMLElement {
  constructor() {
    super();

    // Elements
    this._cancelBtn;
    this._confirmBtn;
    this._backdrop;

    // language=CSS
    this._styles = `
      :host {
        --uc-light-gray: #ccc;
      }

      :host([opened]) #modal {
        top: 15vh;
      }
      
      :host([opened]) #modal,
      :host([opened]) #backdrop {
        opacity: 1;
        pointer-events: all;
      }
      
      ::slotted(h1) {
        font-size: 1.25rem;
        margin: 0;
      }

      header {
        padding: 1rem;
        border-bottom: 1px solid var(--uc-light-gray);
      }

      #backdrop {
        background-color: rgba(0, 0, 0, 0.75);
        height: 100vh;
        left: 0;
        opacity: 0;
        pointer-events: none;
        position: fixed;
        top: 0;
        width: 100%;
      }

      #modal {
        background-color: white;
        border-radius: 3px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        left: 25%;
        opacity: 0;
        pointer-events: none;
        position: fixed;
        top: 10vh;
        transition: all 0.3s ease-out;
        width: 50%;
        z-index: 100;
      }

      #actions {
        border-top: 1px solid var(--uc-light-gray);
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
      }

      #actions button {
        margin: 0 0.25rem;
      }

      #main {
        padding: 1rem;
      }
    `
    // language=HTML
    this._template = `
      <style>${this._styles}</style>
      <div id="backdrop"></div>
      <div id="modal">
        <header>
          <slot name="title"></slot>
        </header>
        <section id="main">
          <slot></slot>
        </section>
        <section id="actions">
          <button id="cancel-btn">Cancel</button>
          <button id="confirm-btn">OK
          </button>
        </section>
      </div>
    `
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this._template;
    this.eventConfig = {
      bubbles: true,
      composed: true
    }
  }

  /**
   * On Component Mount
   */
  connectedCallback() {
    this._cancelBtn = this.shadowRoot.querySelector('#cancel-btn');
    this._backdrop = this.shadowRoot.querySelector('#backdrop');
    this._confirmBtn = this.shadowRoot.querySelector('#confirm-btn');

    this._cancelBtn.addEventListener('click', this._handleCancel.bind(this))
    this._backdrop.addEventListener('click', this._handleCancel.bind(this))
    this._confirmBtn.addEventListener('click', this._handleConfirm.bind(this))
  }

  /**
   * On Component Unmount
   */
  disconnectedCallback() {
    this._cancelBtn.removeEventListener('click', this._handleCancel.bind(this))
    this._backdrop.removeEventListener('click', this._handleCancel.bind(this))
    this._confirmBtn.removeEventListener('click',
        this._handleConfirm.bind(this))
  }

  /**
   * Open the modal
   */
  open() {
    this.setAttribute('opened', '');
  }

  /**
   * Close the modal
   */
  close() {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened');
    }
  }

  /**
   * Event Handler - cancel button clicked
   * @param event
   * @private
   */
  _handleCancel(event) {
    this.close();
    event.target.dispatchEvent(new Event('cancel', this.eventConfig));
  }

  /**
   * Event Handler - confirm button clicked
   * @param event
   * @private
   */
  _handleConfirm(event) {
    this.close();
    event.target.dispatchEvent(new Event('confirm', this.eventConfig));
  }
}

customElements.define('uc-modal', Modal)