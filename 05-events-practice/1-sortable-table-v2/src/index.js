export default class SortableTable {
  element;
  subElements = {};
  headersConfig = [];
  data = [];

  constructor(headersConfig, {
    data = [],
    sorted = {},
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.render();
    this.initEventListeners();
  }


  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}</div>`;
  }

  getHeaderRow({id, title, sortable, order = ''}) {
    if (id === this.sorted.id) {
      order = this.sorted.order;
    }
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow()}
      </div>
    `;
  }

  getHeaderSortingArrow() {
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

  getTableRows(data) {
      return data.map(item => `
      <div class="sortable-table__row">
        ${this.getTableRow(item, data)}
      </div>`
    ).join('');
  }

  getTableRow(item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      };
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
        ${this.getTableBody(this.sortData(this.sorted.id, this.sorted.order))}
      </div>`;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable(this.data);

    const element = wrapper.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    // NOTE: Remove sorting arrow from other columns
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === field);

    // примерно как-то так для custom, но это может неправильно ?
    this.customSorting = (a, b) => {
      if (typeof a[field] === "boolean") {
        return a[field] - b[field];
      }
      if (typeof a[field] === "string") {
        return a[field].localeCompare(b[field], 'ru');
      }
    };

    //const {sortType, customSorting} = column;
    const sortType = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], 'ru');
        case 'custom':
          return direction * this.customSorting(a, b);
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  initEventListeners() {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');

    allColumns.forEach( (item) => item.addEventListener(`click`, (event) =>{
      if (item.dataset.order === 'asc') {
        item.dataset.order = 'desc';
      } else {
        item.dataset.order = 'asc';
      }
      this.sort(item.dataset.id, item.dataset.order);
    }));
    //allColumns.forEach( (item) => item.addEventListener(`click`, this.handleEvent)); // не получилось сделать отдельно фунцию калбека
  };


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
    this.element.remove();
    this.subElements = {};
  }
}
//npm run test:specific --findRelatedTests 05-events-practice/1-sortable-table-v2/src/index.spec.js

