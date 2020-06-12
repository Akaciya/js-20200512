const MAIN_URL = 'https://course-js.javascript.ru';
export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;
  data = [];
  value = 0;
  jsonObj = {};

  constructor({
    url = '',
    range = {
      from: '',
      to: '',
    },
    label = '',
    link = '',
    formatHeading
    } = {}) {
    const {from, to} = range;
    this.params = new URLSearchParams(this.getDateJson({from, to}));
    this.url = `${MAIN_URL}/${url}`;
    this.fullUrl = `${this.url}?${this.params}`;

    this.label = label;
    this.link = link;

    this.formatHeading = formatHeading;
    this.render();

    this.getData(this.fullUrl);

  }

  getDateJson (obj) {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      acc[key] = new Date(val).toJSON();
      return acc;
    }, {});

  }

  async getData(url) {
    const response = await fetch(url);
    if (response) {
      this.jsonObj = await response.json();
      this.data = Object.values(this.jsonObj);
      this.value = Object.values(this.jsonObj).reduce((sum, current) => sum + current, 0);

      this.element.classList.remove('column-chart_loading');
      this.subElements.header.textContent = this.getSum(this.value);
      this.subElements.body.innerHTML = this.getColumnBody(this.data);
    }

  }

  getSum(value) {
    return this.formatHeading ? this.formatHeading(value) : value;
  }

  getColumnBody(data = []) {

    const maxValue = Math.max(...data);

    return data
      .map(item => {
        const scale = this.chartHeight / maxValue;
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }


  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
          ${this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  update(from, to) {
    this.params = new URLSearchParams(this.getDateJson({from, to}));
    this.fullUrl = `${this.url}?${this.params}`;
    return this.getData(this.fullUrl);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
//npm run test:specific --findRelatedTests 07-forms-fetch-api-part-2/1-column-chart/src/index.spec.js
