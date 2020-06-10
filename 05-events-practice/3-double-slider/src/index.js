export default class DoubleSlider {
  /*element;
  subElements = {};
  leftHandler;
  rightHandler;
  shiftX;
  rangerInner;
  progress;
  widthSlider;


  eventFunc = (event) => {

    this.widthSlider = this.rangerInner.offsetWidth;

    event.preventDefault();

    if (event.target === this.leftHandler) {
      this.shiftX = event.clientX - this.leftHandler.getBoundingClientRect().left;
    }
    if (event.target === this.rightHandler) {
      this.shiftX = event.clientX - this.rightHandler.getBoundingClientRect().right;
    }

    if(event.target) {
     document.addEventListener('pointermove', this.onMouseMove);
     document.addEventListener('pointerup', this.onMouseUp);
    }
    document.addEventListener('dragstart', () => false);

  };

  onMouseMove = (event) => {
    document.addEventListener('pointerup', (event) => {
      document.removeEventListener('pointermove', this.onMouseMove);
      /!*event.target.dispatchEvent(new CustomEvent('range-select', {
        detail: this.rangeValue,
        bubbles: true
      }))*!/
    });

    const beginInner = this.rangerInner.getBoundingClientRect().left;
    let newLeft = event.clientX - this.shiftX - beginInner;

    if( event.target.classList.contains('range-slider__thumb-left')) {
      if (newLeft < 0) {
        newLeft = 0;
      }

      if (newLeft > this.widthSlider) {
        newLeft = this.widthSlider;
      }
      //if( event.target === this.leftHandler) {
        //this.leftHandler.style.left = `${newLeft}px`;
        //let statLeft =  `${newLeft}px`;
        this.leftHandler.style.left = `${newLeft}px`;
        this.progress.style.left = this.leftHandler.style.left;
    }
    if (event.target.classList.contains('range-slider__thumb-right')) {
      let newRight = event.clientX - this.shiftX - this.rangerInner.getBoundingClientRect().right;
      if (newLeft > this.widthSlider || newRight < 0) {
        newRight = 0;
      }
      console.log(event.clientX, this.progress.getBoundingClientRect().right, "this.progress.getBoundingClientRect().right");
      if (newRight > this.widthSlider - newLeft) {
        newRight = this.widthSlider - newLeft;
      }

      this.rightHandler.style.right = `${newRight}px`;
      this.progress.style.right = this.rightHandler.style.right;
     }
      //this.lineMove();
      document.addEventListener('pointerup', this.onMouseUp);
    };

   onMouseUp = (event) => {
     document.removeEventListener('pointerup', this.onMouseUp);
     document.removeEventListener('pointermove', this.onMouseMove);
    };

   /!* lineMove = (event)  => {
      this.progress.style.left = this.leftHandler.style.left;
      this.progress.style.right = this.rightHandler.style.right;

  }*!/

   constructor() {
    this.render();
    //this.initEventListener();
  }


  initEventListener() {
    this.rangerInner = this.element.querySelector('.range-slider__inner');
    const [progress, leftHandler, rightHandler] = this.rangerInner.children;
    console.log(progress, leftHandler, rightHandler);
    this.progress = progress;
    this.leftHandler = leftHandler;
    this.rightHandler = rightHandler;

    this.leftHandler.addEventListener('pointerdown', this.eventFunc);
    this.rightHandler.addEventListener('pointerdown', this.eventFunc);
  }

  /!* getSubElements(element) {
    //{progress, left, right} = this.element.querySelector('.range-slider__inner').children;
    const els = this.element.querySelector('.range-slider__inner').children;
    return [...els].map((subElement) => {

      return subElement;
    }, {});

  }*!/
  get SliderTemplate() {
    return `<div class="range-slider">
    <span>$10</span>
    <div class="range-slider__inner">
      <span class="range-slider__progress"></span>
      <span class="range-slider__thumb-left"></span>
      <span class="range-slider__thumb-right"></span>
    </div>
    <span>$100</span>
  </div>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.SliderTemplate;
    this.element = element.firstElementChild;
    this.initEventListener();
    //document.body.append(this.element);
  }


  remove () {
    this.element.remove();
  }

  destroy() {

    this.remove();
  }*/
}
