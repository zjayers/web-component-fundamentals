class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipContainer;
    this._tooltipText = 'Default tooltip text.'
    this.attachShadow({ mode: 'open' })

    this.shadowRoot.innerHTML = `
    <style>
      div {
        background-color: black;
        color: white;
        position: absolute;
        z-index: 10;
      }
    </style>
    <slot></slot>
    <span>(?)</span>`;
  }

  connectedCallback() {
    const htmlSpanElement = this.shadowRoot.querySelector('span');

    htmlSpanElement.addEventListener('mouseenter', this._showTooltip.bind(this))
    htmlSpanElement.addEventListener('mouseleave', this._hideTooltip.bind(this))

    this.shadowRoot.appendChild(htmlSpanElement)

    if (this.hasAttribute('text')) {
      this._tooltipText = this.getAttribute('text');
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