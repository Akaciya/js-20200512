export default class SortableTable {
  element;
  subElements;

    constructor(header = [], {data} = {}) {
    this.header = header;
    this.data = Object.values(data);
    this.render();
  }

  get headerTemplate() {
    const sortableTableHeader = document.createElement('div');
    sortableTableHeader.setAttribute('data-element', 'header');
    sortableTableHeader.className = 'sortable-table__header sortable-table__row';
    sortableTableHeader.append(...this.buildHeader());
    return sortableTableHeader;

  }
  get bodyTemplate() {
    const sortableTableBody = document.createElement('div');
    sortableTableBody.className = 'sortable-table__body';
    sortableTableBody.setAttribute('data-element', 'body');
    sortableTableBody.append(...this.buildBody());
    return sortableTableBody;
  }

  buildBody() {
    let arrItemBody = [];

    this.data.forEach((item) => {
      const sortableTableRow = document.createElement('div');//а в статике это тег <a>
      sortableTableRow.className = 'sortable-table__row';

      let sortableTableCell = document.createElement('div');
      sortableTableCell.className = 'sortable-table__cell';
      if (item.images) { //не будем создавать картинку, если ее нет
        let imgItem = document.createElement('img');
        imgItem.setAttribute('src', item.images[0].url);
        imgItem.setAttribute('alt', 'Image');
        imgItem.className = 'sortable-table-image';
        sortableTableCell.append(imgItem);
      }

      sortableTableRow.append(sortableTableCell);

      let titleItem = sortableTableCell.cloneNode(false);
      titleItem.textContent = item.title;
      sortableTableRow.append(titleItem);

      let quantityItem = sortableTableCell.cloneNode(false);
      quantityItem.textContent = item.quantity;
      sortableTableRow.append(quantityItem);

      let priceItem = sortableTableCell.cloneNode(false);
      priceItem.textContent = item.price;
      sortableTableRow.append(priceItem);

      let salesItem = sortableTableCell.cloneNode(false);
      salesItem.textContent = item.sales;
      sortableTableRow.append(salesItem);

      arrItemBody.push(sortableTableRow);
    });

    return arrItemBody;
  }

  get arrowSorting() {
      const sortableTableSortArrow = document.createElement('span');
      sortableTableSortArrow.className = 'sortable-table__sort-arrow';
      const  sortArrow = document.createElement('span');
      sortArrow.className = 'sort-arrow';
      sortableTableSortArrow.append(sortArrow);
      return sortableTableSortArrow;
  }

 buildHeader() {
    const arrItemHeader = [];

    this.header.forEach((item, index, arr) => {
      let sortableTableCell = document.createElement('div');
      sortableTableCell.className = 'sortable-table__cell';
      let itemTitleHeader = document.createElement('span');
      itemTitleHeader.textContent = `${arr[index].title}`;
      sortableTableCell.append(itemTitleHeader);
      //sortableTableCell.setAttribute('data-name', arr[index].id);
      sortableTableCell.setAttribute('data-sortable', `${arr[index].sortable}`);
      if (`${arr[index]}.sortable`) {
        sortableTableCell.append(this.arrowSorting)
      }
      sortableTableCell.setAttribute( 'data-id', `${arr[index].id}`);

      arrItemHeader.push(sortableTableCell);
    });

    return arrItemHeader;
  }

  sort(fieldValue, orderValue = 'asc') {

    let direction = 1;
    if (orderValue === 'desc') {
      direction = -1;
    }
    const sortType = this.header.find(item => item.id === fieldValue);
    let fnSort =
      sortType.sortType === 'string'
        ? (a, b) => direction * (a[fieldValue].localeCompare(b[fieldValue], 'ru-RU', {caseFirst: 'upper'}))
        : (a, b) => direction * (a[fieldValue] - b[fieldValue])

    ;
    this.data.sort(fnSort);

   /* function fnSort(a, b) {
      if (sortType.sortType === 'number') {
        console.log(a[fieldValue]);
        return direction * (a[fieldValue] - b[fieldValue]);
      } else  {
        return  direction * a[fieldValue].localeCompare(b[fieldValue]);
      }
    }
    this.data.sort(fnSort);
 */
    this.remove();
    this.render();

    document.querySelector(`[data-id="${fieldValue}"]`).setAttribute('data-order', `${orderValue}`);
  };
  render() {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'sortable-table';
    }
    this.subElements = {
      'header': this.headerTemplate,
      'body': this.bodyTemplate,
    };
    this.element.append(...Object.values(this.subElements)); //зачем тестам subElements ?
  }

  remove() {
      this.element.innerHTML = '';
  }

  destroy() {
    this.element.remove();
  }
}

