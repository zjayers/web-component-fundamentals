class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipContainer;
    this._tooltipIcon;
    this._tooltipText = 'Default tooltip text.'
    this._tooltipVisible = false;
    this.attachShadow({ mode: 'open' })

    this.shadowRoot.innerHTML = `
    <style>
      div {
        background-color: black;
        border-radius: 3px;
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.26);
        color: white;
        left: 0.75rem;
        padding: 0.15rem;
        position: absolute;
        top: 2rem;
        z-index: 10;
      }
      
      /*Accessing the Host*/
      :host {
        background-color: lightgray;
        position: relative;
      }
      
      :host-context(p) {
        background-color: lightgreen;
      }
      
      /*Style Sloted content*/
      ::slotted(.highlight),
      :host(.important-class) {
        background-color: var(--color-primary, lightgrey);
        font-weight: bold;
      }
    </style>
    <slot></slot>
    <span>(?)</span>`;
  }

  static get observedAttributes() {
    return ['text']
  }

  connectedCallback() {
    this._tooltipIcon = this.shadowRoot.querySelector('span');

    this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
    this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))

    this.shadowRoot.appendChild(this._tooltipIcon)

    if (this.hasAttribute('text')) {
      this._tooltipText = this.getAttribute('text');
    }
  }

  disconnectedCallback() {
    this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip)
    this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }

    switch (name) {
      case 'text':
        this._tooltipText = newVal;
        break;
      default:
        break;
    }
  }

  _showTooltip() {
    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.textContent = this._tooltipText;
    this.shadowRoot.appendChild(this._tooltipContainer);
  }

  _hideTooltip() {
    this.shadowRoot.removeChild(this._tooltipContainer);
  }
}

customElements.define('custom-tooltip', Tooltip)