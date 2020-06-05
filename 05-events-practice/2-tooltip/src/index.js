class Tooltip {
  element;
  tooltipElement;
  tooltipText;

  eventHadler = (event) => {
    this.tooltipElement = event.target;
    this.tooltipText = this.tooltipElement.dataset.tooltip;
    if (!this.tooltipText) return;
    this.element.innerHTML = this.tooltipText;
    document.body.append(this.element);
    this.showPoint(event);
  }

  showPoint = (event)  => {
    this.element.style.left = event.clientX + 7 + 'px';
    this.element.style.top = event.clientY + 7 + 'px';
    this.tooltipElement.addEventListener('pointerout', this.outPoint);
  }


  outPoint = (event) => {
    this.tooltipElement.removeEventListener('pointerout', this.outPoint);
    this.tooltipElement.removeEventListener('pointerover', this.showPoint);
    this.remove();
  }


  constructor() {
    this.render();
  }

  get TooltipTemplate() {
    return `<div class="tooltip"></div>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.TooltipTemplate;
    this.element = element.firstElementChild;
  }

  initialize() {
    document.body.addEventListener('pointermove', this.eventHadler);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    document.body.removeEventListener('pointermove', this.eventHadler);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
