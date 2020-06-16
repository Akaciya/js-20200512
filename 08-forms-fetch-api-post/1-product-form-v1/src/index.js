import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const IMGUR_URL = 'https://api.imgur.com/3/image';
export default class ProductForm {
  element;
  subElements = {};
  form;
  options = [];
  urlCategory = '';
  urlProductPost = '';

  loadImage = () => {
    const inputFile = document.createElement('input');
    inputFile.type = "file";
    inputFile.accept = "image/*";
    inputFile.click();

    inputFile.onchange = async () => {
      const itemFile = inputFile.files[0];
      if (!itemFile) return;
      const formData = new FormData;
      formData.append('image', itemFile);
      this.form.uploadImage.classList.add("is-loading");
      try {
        const response =  await fetchJson(IMGUR_URL, {
          method : "POST",
          headers: {Authorization: `Client-ID ${IMGUR_CLIENT_ID}`},
          body   : formData
        });
        this.form.uploadImage.classList.remove("is-loading");
        const urlImage = response.data.link;
        this.imageListContainer.append(this.itemImageTemplate({url:urlImage, name:itemFile.name}));
        const imageLiItem = this.itemImageTemplate({url:urlImage, name:itemFile.name});
        console.log(this.itemImageTemplate({url:urlImage, name:itemFile.name}));
        if (urlImage) {
          //imageLiItem.querySelector('[data-delete-handle]').addEventListener('pointerdown', event => this.deleteImage);
          //imageLiItem.addEventListener('click', event => this.deleteImage(event));

          console.log(imageLiItem.querySelector('[data-delete-handle]'));

          //this.deleteImage();
        }

      } catch (err) {
        throw err;
      }

  };

  };

  deleteImage = (event) =>  {

    console.log(event.target, 1);
    if ( event.target === this.form.querySelector('[data-delete-handle]')) {
      console.log(event.target, 2);
      event.target.closest('li').remove();

    }
  };

  constructor(productId='') {

    this.productId = productId || '';
    this.urlCategory = new URL('/api/rest/categories', BACKEND_URL);
    this.urlCategory.searchParams.set('_sort', 'weight');
    this.urlCategory.searchParams.set('_refs', 'subcategory');

    this.urlProductPost = new URL('/api/rest/products', BACKEND_URL);

    this.render();
    //this.initClickUploadImage();
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getProductForm();

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    this.form = this.element.querySelector('form');
    this.imageListContainer = this.form.querySelector('[data-element="imageListContainer"]').firstElementChild;
    this.form.addEventListener('submit', event => this.onSubmit(event));
    this.initClickUploadImage();
    //console.log(this.form.querySelector('[data-delete-handle]'));
    this.initDeleteImage();
    //this.deleteImage();
    return this.element;
  }

  onSubmit(event) {
    event.preventDefault();

    const arrFormData = new FormData(this.form);
    const data = {
      id: this.productId,
      title: this.form.title.value,
      description: this.form.description.value,
      subcategory: this.form.subcategory.value,
      price: parseInt(this.form.price.value, 10),
      quantity: parseInt(this.form.quantity.value, 10),
      discount: parseInt(this.form.discount.value, 10),
      status: parseInt(this.form.status.value, 10),
      images: []
    };

    const sourceImages = [...arrFormData].filter(item => item[0] === 'source');
    const urlImages = [...arrFormData].filter(item => item[0] === 'url');

    urlImages.map((item, index) => {
      data.images.push({
        url: item[1],
        source: sourceImages[index][1]
      })
    });
    this.sendForm(data);
  };

 async sendForm(data) {
    const sender = await fetchJson(this.urlProductPost, {
      method : "PATCH",
      headers: {"Content-Type": "application/json;charset=utf-8"},
      body   : JSON.stringify(data)
    });

    const productEvent = this.productId ? new CustomEvent("product-saved", {detail: sender}) : new CustomEvent("product-updated", {detail: sender});
    this.element.dispatchEvent(productEvent);

  }

  getProductForm() {
    return `
      <div class="product-form">
        ${this.formTemplate()}
      </div>`;
  }

  nameProductTemplate() {
    return `
    <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" value="" placeholder="Название товара">
        </fieldset>
      </div>
    `
  }

  descriptionTemplate() {
    return `
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
    `
  }
  imageListTemplate() {
    return `
    <div class="form-group form-group__wide" data-element="sortable-list-container">
      <label class="form-label">Фото</label>
      <div data-element="imageListContainer">
        <ul class="sortable-list">
        </ul>
      </div>
      <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
    </div>
    `
  }

  initClickUploadImage() {
    this.form.uploadImage.addEventListener('click', this.loadImage);
  }
  initDeleteImage() {
   //if(this.imageListContainer.children.length) {
     this.imageListContainer.addEventListener('click', this.deleteImage);
   //}

  }


  itemImageTemplate({url = '', name = ''}) {
    const liItem = document.createElement("li");
    liItem.className = "products-edit__imagelist-item sortable-list__item";
    liItem.innerHTML = `<input type="hidden" name="url" value="${url}">
        <input type="hidden" name="source" value="${name}">
        <span>
          <img src="icon-grab.svg" data-grab-handle alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${url}">
          <span>${name}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle alt="delete">
        </button>`;
    return liItem;
   }

  async getCategoryList() {

    const categoryData = await fetchJson(this.urlCategory);
    categoryData.map( ({title, subcategories}) => {

      const [ subtitle ] = subcategories.filter((item) => {
        this.options.push(this.optionTemplate(item.id, `${title} > ${item.title}`));

      });
    });

    this.form.subcategory.innerHTML = this.options.join('');

  }

  optionTemplate(value, inner) {
    return `
    <option value="${value}">${inner}</option>
    `
  }

  categoryTemplate() {
    return `
    <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
        ${this.getCategoryList()}
        </select>
      </div>
    `
  }

  otherParamsTemplate() {
    return `
    <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
    `
  }

  formTemplate() {
    return `
      <form data-element="productForm" class="form-grid">
        ${this.nameProductTemplate()}
        ${this.descriptionTemplate()}
        ${this.imageListTemplate()}
        ${this.categoryTemplate()}
        ${this.otherParamsTemplate()}
        ${this.saveButtonsTemplate()}
      </form>`;
  }


  saveButtonsTemplate() {
    return `
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>`;
  }


  getSubElements(element) {
    return element.children;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    //this.element.innerHTML= '';
//    this.remove();
    this.subElements = {};
    this.element = null;
  }
}
//npm run test:specific --findRelatedTests 08-forms-fetch-api-post/1-product-form-v1/src/index.spec.js
