import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  headersConfig = [];
  data = [];
  start;
  step = 20;
  end;
  loading = false;

  infinityScroll = async(event) => {

    const tableHeight = this.element.offsetHeight;
    const scrollCurrent = window.pageYOffset;
    const innerHeight = window.innerHeight;
    const endTable = scrollCurrent + innerHeight;

    if(endTable >= tableHeight && !this.loading) {
      this.loading = true;

      this.start = this.end;
      this.end = this.start + this.step;

      this.element.classList.add("sortable-table_loading");

      const newData = await this.getData(this.getUrl());

      this.update(newData);

      this.element.classList.remove("sortable-table_loading");
      this.loading = false;
    }
  };

  sortOnServer = async(event) => {
    const columnId =  event.target.closest('[data-id]').dataset.id;

    const column = event.target.closest('[data-sortable="true"]');
    if (!column) return;

    if (column) {
      const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
      let order  = column.dataset.order;
      allColumns.forEach(column => {
        column.dataset.order = '';
      });

      column.dataset.order = order === 'asc' ?  'desc' : 'asc';

      this.sorted = {
        _sort: columnId,
        _order: column.dataset.order,
      };
      this.start = 0;
      this.end = this.step;
      this.subElements.body.innerHTML = '';
      this.subElements.body.innerHTML += this.getTableRows(await this.getData(this.getUrl()));
    }
  };

  constructor(headersConfig, {url = ''} = {}) {
    this.headersConfig = headersConfig;
    this.sorted = {
      _sort: headersConfig.find(item => item.sortable).id,
      _order: headersConfig.find(item => item.sortable).order || 'asc',
    };

    this.url = `${BACKEND_URL}/${url}`;
    this.start = 0;
    this.end = 20;
    this.render();
  }

  getUrl() {
    this.params = {
      _sort: this.sorted._sort,
      _order: this.sorted._order || 'asc',
      _start: this.start,
      _end: this.end
    };

    this.paramsUrl = new URLSearchParams(this.params).toString();
    this.fullUrl = `${this.url}?${this.paramsUrl}`;
    return this.fullUrl;
  }

  async getData(url) {

    this.element.classList.add('sortable-table_loading');
    this.subElements.body.classList.add('sortable-table_empty');

    const data = await fetchJson(url);

    this.element.classList.remove('sortable-table_loading');
    this.subElements.body.classList.remove('sortable-table_empty');

    return data;

  }
  update(data) {
      this.subElements.body.innerHTML += this.getTableRows(data);
  }
  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow ({id, title, sortable, order = ''}) {
    if (id === this.sorted._sort) {
      order = this.sorted._order;
    }
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow()}
      </div>
    `;
  }

  getHeaderSortingArrow () {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`;
  }

  getTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
      </div>`;
  }

  getTableRows (data) {

    return data.map(item => `
      <div class="sortable-table__row">
        ${this.getTableRow(item)}
      </div>`
    ).join('');
  }

  getTableRow (item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      }
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable(data) {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
         ${this.getTableBody(data)}
         <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
         <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          По заданному критерию запроса данные отсутствуют
        </div>
      </div>
      </div>`;
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable(this.data);
    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);
    const data = await this.getData(this.getUrl());

    this.subElements.body.innerHTML = this.getTableRows(data);
    this.initEventListeners();
    return data;
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sortOnServer);
    document.addEventListener('scroll', this.infinityScroll);
  }

  //sorting in the backend
  sortData(id, order) {
    const arr = [...this.data];

    const column = this.headersConfig.find(item => item._sort === id);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[id] - b[id]);
        case 'string':
          return direction * a[id].localeCompare(b[id], 'ru');
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[id] - b[id]);
      }
    });
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
    document.removeEventListener('scroll', this.infinityScroll);
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
//npm run test:specific --findRelatedTests 07-forms-fetch-api-part-2/2-sortable-table-v3/src/index.spec.js
