export default class NotificationMessage {
  element;

  constructor(message, dataObj) {
    this.message = message || 'Hello world';
    this.type = dataObj ? dataObj.type : 'success';
    this.duration = dataObj ? dataObj.duration : 2000;
    this.render();
  }

  get template() {
    return `
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
    `
  }

  render() {
    //this.type = Math.random() > 0.5 ? 'success' : 'error';
    this.switcher();
    this.element = document.createElement('div');
    this.element.classList.add('notification', this.typeClass);
    this.element.style.cssText = `--value:${this.duration/1000}s`;
    this.element.innerHTML = this.template;
  }
   show(div) {
    if (NotificationMessage.linkElement) {
      NotificationMessage.linkElement.remove();
      NotificationMessage.linkElement = null;//не уверена, надо ли оно тут. А вдруг?
    }
    div ? div.append(this.element) : document.body.append(this.element);
    NotificationMessage.linkElement = this;
    setTimeout(() => this.remove(), this.duration);
  }
  switcher() {
    if(this.type === 'error') {
      this.typeClass = 'error';
     // this.message = 'Что-то пошло не так :('
    } else {
      this.typeClass = 'success';
     // this.message = 'Данные получены!'
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
  }
}

NotificationMessage.linkElement = null;
