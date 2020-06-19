import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
 /* element;
  subElements = {};
  headersConfig = [];
  data = [];

  sortOnServer = event => {
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

      this.getData(this.getUrl());
    }

  };

  constructor(headersConfig, {url = ''} = {}) {
    this.headersConfig = headersConfig;
    this.sorted = {
      _sort: headersConfig.find(item => item.sortable).id,
      _order: headersConfig.find(item => item.sortable).order || 'asc',
    };

    this.url = `${BACKEND_URL}/${url}`;
    this.render();
  }

  getUrl(start = 0, end = 30) {

    this.params = {
      _sort: this.sorted._sort,
      _order: this.sorted._order || 'asc',
      _start: start,
      _end: end
    };

    this.paramsUrl = new URLSearchParams(this.params).toString();
    this.fullUrl = `${this.url}?${this.paramsUrl}`;
    return this.fullUrl;
  }

  async getData(url) {
    const response = await fetch(url);

    const loading = `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>`;
    const noData = `<div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          По заданному критерию запроса данные отсутствуют
        </div>`;

    this.element.classList.add('sortable-table_loading');
    this.subElements.body.classList.add('sortable-table_empty');
    this.subElements.body.innerHTML = loading;

    if (response.status === 200) {
      this.jsonObj = await response.json();
      this.data = Object.values(this.jsonObj);

      this.element.classList.remove('sortable-table_loading');
      this.subElements.body.classList.remove('sortable-table_empty');

      if (!this.data.length) {
        this.subElements.body.innerHTML = noData;
      }
      this.subElements.body.innerHTML = this.getTableRows(this.data);
    } else {
      this.subElements.body.innerHTML = response.statusText;
    }

    /!* //альтернатива
     let response = await fetch(url);
     const loading = `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>`;
     const noData = `<div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
           По заданному критерию запроса данные отсутствуют
         </div>`;
     this.element.classList.add('sortable-table_loading');
     this.subElements.body.classList.add('sortable-table_empty');
     this.subElements.body.innerHTML = loading;
     const reader = response.body.getReader();
     // Шаг 2: получаем длину содержимого ответа
     const contentLength = +response.headers.get('Content-Length');
     // Шаг 3: считываем данные:
     let receivedLength = 0; // количество байт, полученных на данный момент
     this.data = []; // массив полученных двоичных фрагментов (составляющих тело ответа)
     while(true) {
       const {done, value} = await reader.read();
       if (done) {
         this.element.classList.remove('sortable-table_loading');
         this.subElements.body.classList.remove('sortable-table_empty');
         break;
       }
       this.data.push(value);
       receivedLength += value.length;
     }
   // Шаг 4: соединим фрагменты в общий типизированный массив Uint8Array
     let arrDataAll = new Uint8Array(receivedLength);
     let position = 0;
     for(let dataItem of this.data) {
       arrDataAll.set(dataItem, position);
       position += dataItem.length;
     }
   // Шаг 5: декодируем Uint8Array обратно в строку
     let result = new TextDecoder("utf-8").decode(arrDataAll);
     this.data = JSON.parse(result);
     console.log(this.data);
     this.subElements.body.innerHTML = this.getTableRows(this.data);*!/
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
        ${this.getTableRow(item, data)}
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
      </div>
      </div>`;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable(this.data);
    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);
    this.initEventListeners();
    return this.getData(this.getUrl());
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sortOnServer);
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
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }*/
}
//npm run test:specific --findRelatedTests 07-forms-fetch-api-part-2/2-sortable-table-v3/src/index.spec.js
