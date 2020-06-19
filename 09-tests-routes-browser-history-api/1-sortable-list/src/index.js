export default class SortableList {
  element;
  subElements = {};
  dragElement;
  placeElement;
  shiftX;
  shiftY;

  onDrap = (event) => {
    event.preventDefault();
    const target = event.target,
          elem = event.target.closest('.sortable-list__item');
         let handle = elem.querySelector('[data-grab-handle]');

      //если вдруг нет картинки-хваталки
      if (!handle) {
        handle = elem;
      }

    if (target === handle) {

      this.dragElement = elem;

      const { left, top } =  elem.getBoundingClientRect();
      this.shiftX = event.clientX - left;
      this.shiftY = event.clientY - top;

      this.placeElement = document.createElement('div');
      this.placeElement.className = 'sortable-list__placeholder';
      this.placeElement.style.width = `${elem.offsetWidth}px`;
      this.placeElement.style.height = `${elem.offsetHeight}px`;

      elem.classList.add('sortable-list__item_dragging');
      elem.after(this.placeElement);
      this.element.append(elem);

      this.getDragStyle(event);

      document.addEventListener("pointermove", this.onMove);
      document.addEventListener("pointerup", this.onUp);
    }
  };

  onMove =(event) => {
    this.getDragStyle(event);

    const childElem = this.element.children;
    const elemLength = childElem.length;

    for (let i = 0; i < elemLength; i++) {
      const itemElem = childElem[i],
        {top, bottom} = itemElem.getBoundingClientRect(),
            //topPointElem =  itemElem.getBoundingClientRect().top,
            //bottomPointElem = itemElem.getBoundingClientRect().bottom,
            before = event.clientY < top + itemElem.offsetHeight / 2,
            there = event.clientY > top && event.clientY < bottom;

      if (itemElem !== this.dragElement && there) {
        if (before) {
          this.element.insertBefore(this.placeElement, childElem[i]);
          break;
        }
        this.element.insertBefore(this.placeElement, childElem[i+1]);
      }
    }
  };

  onUp = (event)=> {
    this.placeElement.replaceWith(this.dragElement);
    this.dragElement.classList.remove("sortable-list__item_dragging");
    this.dragElement.style.cssText = '';

    this.removeEventListeners();
  };

  constructor({items: arr} = {}) {
    this.items = arr;
    this.render();
  }

  getDragStyle(event) {
    this.dragElement.style.left = `${event.clientX - this.shiftX}px`;
    this.dragElement.style.top = `${event.clientY - this.shiftY}px`;
    this.dragElement.style.width = `${this.placeElement.offsetWidth}px`;
    this.dragElement.style.height = `${this.placeElement.offsetHeight}px`;
  }

  deleteImage(event)  {
    const parent = event.target.closest('.sortable-list__item'),
          deleteElem = parent.querySelector('[data-delete-handle]');

    if ( parent && (event.target === deleteElem)) {
      parent.remove();
    }
  };

  get template() {
    const list = document.createElement('ul');
    list.className = 'sortable-list';
    this.items.forEach((item) => {
      item.classList.add('sortable-list__item');
      list.append(item);
    });
    return list;
  }

  render() {
    const element = document.createElement('div');

    element.append(this.template);

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();
  }

  getSubElements(element) {
    return  element.children;
  }

  initEventListeners() {
    this.element.addEventListener('pointerdown', (event) => this.onDrap(event));
    this.element.addEventListener('click', (event) => this.deleteImage(event));
  }
  removeEventListeners() {
    document.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerup", this.onUp);
    this.dragElement = null;
  }

  remove() {
    this.element.remove();
    document.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerup", this.onUp);
    this.dragElement = null;
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
//npm run test:specific --findRelatedTests 09-tests-routes-browser-history-api/1-sortable-list/src/index.spec.js
