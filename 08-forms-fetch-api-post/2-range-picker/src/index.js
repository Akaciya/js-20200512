//import fetchJson from "../../1-product-form-v1/src/utils/fetch-json";

export default class RangePicker {
  element;
  subElements = {};
  year;
  months;
  next;
  prev;
  rangeDay;
  currentDate;
  dateFrom;
  dateTo;

  nextMonth = (event) => {
    console.log(event);
    this.to = new Date(this.currentDate.currentTo.getFullYear(), this.currentDate.currentTo.getMonth() + 1, this.currentDate.currentTo.getDate());
    this.from = new Date(this.currentDate.currentFrom.getFullYear(), this.currentDate.currentFrom.getMonth() + 1, this.currentDate.currentFrom.getDate());
    this.updateCalendar(this.from, this.to);

  };
  prevMonth =(event) => {
    this.to = new Date(this.currentDate.currentTo.getFullYear(), this.currentDate.currentTo.getMonth() - 1, this.currentDate.currentTo.getDate());
    this.from = new Date(this.currentDate.currentFrom.getFullYear(), this.currentDate.currentFrom.getMonth() - 1, this.currentDate.currentFrom.getDate());
    this.updateCalendar(this.from, this.to);
  };

  rangeDays = (event) => {
    event.stopPropagation();
    this.element.classList.add('rangepicker_open');
    this.initToggleDatePicker();



    if (this.rangeDay.includes(event.target)) {
      event.target.dataset.count = 0;
      let elemColorFrom = this.rangeDay.find((item) => item.classList.contains('rangepicker__selected-from'));
      //const elemColorTo = this.rangeDay.find((item) => item.classList.contains('rangepicker__selected-to'));
      const elemcount = this.rangeDay.filter((item) => item.dataset.count);
      let dateValueFrom, dateValueTo;

      const setDate = () => {
        if(elemColorFrom) {
          event.target.classList.add('rangepicker__selected-to');
          dateValueTo = event.target.dataset.value;
          this.dateTo = new Date(dateValueTo);
          event.target.dataset.count++;

        } else {
          event.target.classList.add('rangepicker__selected-from');
          dateValueFrom = event.target.dataset.value;
          event.target.dataset.count++;
          this.dateFrom = new Date(dateValueFrom);
        }
      };
      setDate();
      console.log(elemcount.length, 'elemcount.length');
      if (elemcount.length === 2) {

        //console.log(this.dateFrom, this.dateTo);

        const timeDiff = Math.abs(this.dateTo.getTime() - this.dateFrom.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        //console.log(diffDays + " days");

        if (this.dateTo.getTime() < this.dateFrom.getTime()) {
          [this.dateFrom, this.dateTo] = [this.dateTo, this.dateFrom];
        }

        const findIndexTo = this.rangeDay.findIndex((item) => {
          return item.dataset.value === this.dateTo.toJSON();
        });

        this.rangeDay.map((item, index) => {
          if (index < findIndexTo && index > findIndexTo-diffDays) {
            item.classList.add('rangepicker__selected-between');
            const inputFrom = this.element.querySelector('[data-element="from"]');
            const inputTo = this.element.querySelector('[data-element="to"]');
            inputFrom.innerHTML = this.dateFrom.toLocaleString();
            inputTo.innerHTML = this.dateTo.toLocaleString();
            this.element.classList.remove('rangepicker_open');
          }
        });
      }
      if (elemcount.length > 2) {
        this.rangeDay.map((item) => {
            item.className = '';
            item.classList.add('rangepicker__cell');
            item.removeAttribute('data-count');
            event.target.dataset.count = 0;
            elemColorFrom = false;
            setDate();
        });
      }

    }
  };
  documentClick =(event) => {
    if (event.target !== this.element) {
      this.element.classList.remove('rangepicker_open');
    }
  };
 constructor({from, to}) {

    this.from = from;
    this.to = to;
    this.year = new Date().getFullYear();

    this.render();
  }
  initChangeMonth() {
    this.next.addEventListener('click', this.nextMonth);
    this.prev.addEventListener('click', this.prevMonth);
  }
  initChangeDays() {
    this.element.addEventListener('click', this.rangeDays);
  }

  initToggleDatePicker() {
    document.addEventListener('click', this.documentClick);
  }
  getLocaleMonth(date) {
    this.months =  new Date(date).toLocaleString('ru', {
      month: 'long'
    });
    return this.months;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getCalendar();
   // debugger;
    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    this.miniRender();
  }

  miniRender() {
    this.element.append(this.getRangepickerSelector({from: this.from, to: this.to}));
    this.next = this.element.querySelector('.rangepicker__selector-control-right');
    this.prev = this.element.querySelector('.rangepicker__selector-control-left');

    const rangeDayAll = this.element.querySelectorAll('.rangepicker__date-grid');
    this.rangeDay = Object.values(rangeDayAll[0].children);
    this.rangeDay = this.rangeDay.concat(Object.values(rangeDayAll[1].children));

    this.initChangeMonth();
    this.initChangeDays();
  }
  updateCalendar(from, to){
    this.element.querySelector('[data-element="selector"]').remove();
    this.miniRender();
  }

  getCalendar(){
   return `
   <div class="rangepicker">
    <div class="rangepicker__input" data-element="input">
      <span data-element="from">${this.from.toLocaleString()}</span> -
      <span data-element="to">${this.to.toLocaleString()}</span>
    </div>
  </div>
   `
  }
  getSubElements(element) {
    return element.children;
  }

  getMonth(current) {

    this.year = new Date(current).getFullYear();
    const lastDayMonth = new Date(this.year, current.getMonth() +1, 0).getDate();

    const arrMonthButton = [];
    const arrMonth = Array.from({ length: lastDayMonth }, (day, i) =>  i + 1);
    arrMonth.map( (day, index) => {
      let today = new Date(this.year, current.getMonth(), day);
      arrMonthButton.push(this.daysTemplate(today.toJSON(), day, today.getDay()));
    });
      return arrMonthButton.join('');
  }

  getNameMonth(current) {
    return `
    <div class="rangepicker__month-indicator">
       <time datetime="${this.getLocaleMonth(current)}">${this.getLocaleMonth(current)}</time>
    </div>
    `
  }
  daysTemplate(date, value, weekday) {
    return `
       <button type="button" class="rangepicker__cell" data-value="${date}" style="--start-from: ${weekday}">${value}</button>
    `
  }
  getRangerPickerCalendar(current) {

    return `
    <div class="rangepicker__calendar">
        ${this.getNameMonth(current)}
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
        ${this.getMonth(current)}
        </div>
      </div>
    `
  }

   getRangepickerSelector({from, to}) {

     let currentFrom = from;
     let currentTo = to;
     this.currentDate = {currentFrom, currentTo};

     const rangepickerSelector = document.createElement('div');
     rangepickerSelector.className = 'rangepicker__selector';
     rangepickerSelector.dataset.element = 'selector';
     rangepickerSelector.innerHTML = `<div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left"></div>
        <div class="rangepicker__selector-control-right"></div>
        ${this.getRangerPickerCalendar(currentFrom)}
        ${this.getRangerPickerCalendar(currentTo)} `;
     return rangepickerSelector;
   }

  remove() {
    this.element.remove();
    document.removeEventListener("click", this.documentClick)
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.element = null;
  }
}
//npm run test:specific --findRelatedTests 08-forms-fetch-api-post/1-product-form-v1/src/index.spec.js

