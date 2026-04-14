import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { WebLarekApi } from './components/WebLarekApi';

import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { API_URL, settings } from './utils/constants';
import { IBuyerFormErrors, IOrder, IProduct, TPayment } from './types';

type TModalView = 'basket' | 'preview' | 'order' | 'contacts' | 'success' | null;

const events = new EventEmitter();

const page = new Page(document.body, events);
const modal = new Modal(
  document.querySelector('#modal-container') as HTMLElement,
  events
);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const baseApi = new Api(API_URL, settings);
const webLarekApi = new WebLarekApi(baseApi);

let currentModalView: TModalView = null;

function cloneTemplate(selector: string): HTMLElement {
  const template = document.querySelector(selector) as HTMLTemplateElement;
  return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

function getPreviewButtonText(product: IProduct): string {
  if (product.price === null) {
    return 'Недоступно';
  }

  return basketModel.hasProduct(product.id) ? 'Удалить из корзины' : 'Купить';
}

function getPreviewButtonDisabled(product: IProduct): boolean {
  return product.price === null;
}

function getOrderErrors(errors: IBuyerFormErrors): string {
  return [errors.payment, errors.address].filter(Boolean).join('. ');
}

function getContactsErrors(errors: IBuyerFormErrors): string {
  return [errors.email, errors.phone].filter(Boolean).join('. ');
}

function isOrderStepValid(errors: IBuyerFormErrors): boolean {
  const buyer = buyerModel.getData();

  return (
    !errors.payment &&
    !errors.address &&
    Boolean(buyer.payment) &&
    Boolean(buyer.address)
  );
}

function isContactsStepValid(errors: IBuyerFormErrors): boolean {
  const buyer = buyerModel.getData();

  return !errors.email && !errors.phone && Boolean(buyer.email) && Boolean(buyer.phone);
}

function createBasketContent(): HTMLElement {
  const basket = new Basket(cloneTemplate('#basket'), events);

  const items = basketModel.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate('#card-basket'), events);

    return card.render({
      ...product,
      index: index + 1,
    });
  });

  return basket.render({
    items,
    total: basketModel.getTotal(),
    disabled: basketModel.getCount() === 0,
  });
}

function createOrderContent(): HTMLElement {
  const form = new OrderForm(cloneTemplate('#order') as HTMLFormElement, events);
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  return form.render({
    address: buyer.address || '',
    payment: (buyer.payment as TPayment | '') || '',
    valid: isOrderStepValid(errors),
    errors: getOrderErrors(errors),
  });
}

function createContactsContent(): HTMLElement {
  const form = new ContactsForm(
    cloneTemplate('#contacts') as HTMLFormElement,
    events
  );
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  return form.render({
    email: buyer.email || '',
    phone: buyer.phone || '',
    valid: isContactsStepValid(errors),
    errors: getContactsErrors(errors),
  });
}

function createSuccessContent(total: number): HTMLElement {
  const success = new Success(cloneTemplate('#success'), events);

  return success.render({ total });
}

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
  currentModalView = null;
});

events.on('catalog:changed', () => {
  const cards = catalogModel.getProducts().map((product) => {
    const card = new CardCatalog(cloneTemplate('#card-catalog'), events);
    return card.render(product);
  });

  page.catalog = cards;
});

events.on('preview:changed', () => {
  const product = catalogModel.getPreview();

  if (!product) {
    return;
  }

  const card = new CardPreview(cloneTemplate('#card-preview'), events);

  currentModalView = 'preview';

  modal.render({
    content: card.render({
      ...product,
      buttonText: getPreviewButtonText(product),
      disabled: getPreviewButtonDisabled(product),
    }),
  });
});

events.on('basket:changed', () => {
  page.counter = basketModel.getCount();

  if (currentModalView === 'basket') {
    modal.content = createBasketContent();
  }
});

events.on('buyer:changed', () => {
  if (currentModalView === 'order') {
    modal.content = createOrderContent();
  }

  if (currentModalView === 'contacts') {
    modal.content = createContactsContent();
  }
});

events.on<{ id: string }>('card:select', ({ id }) => {
  const product = catalogModel.getProduct(id);

  if (product) {
    catalogModel.setPreview(product);
  }
});

events.on<{ id: string }>('card:toggle', ({ id }) => {
  const product = catalogModel.getProduct(id);

  if (!product || product.price === null) {
    return;
  }

  if (basketModel.hasProduct(id)) {
    basketModel.removeProduct(product);
  } else {
    basketModel.addProduct(product);
  }

  modal.close();
});

events.on('basket:open', () => {
  currentModalView = 'basket';

  modal.render({
    content: createBasketContent(),
  });
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
  const product = basketModel.getItems().find((item) => item.id === id);

  if (product) {
    basketModel.removeProduct(product);
  }
});

events.on('order:open', () => {
  currentModalView = 'order';

  modal.render({
    content: createOrderContent(),
  });
});

events.on<{ field: string; value: TPayment }>('order.payment:change', ({ value }) => {
  buyerModel.setData({
    payment: value,
  });
});

events.on<{ field: string; value: string }>('order.address:change', ({ value }) => {
  buyerModel.setData({
    address: value,
  });
});

events.on('order:submit', () => {
  const errors = buyerModel.validate();

  if (!isOrderStepValid(errors)) {
    return;
  }

  currentModalView = 'contacts';

  modal.render({
    content: createContactsContent(),
  });
});

events.on<{ field: string; value: string }>('contacts.email:change', ({ value }) => {
  buyerModel.setData({
    email: value,
  });
});

events.on<{ field: string; value: string }>('contacts.phone:change', ({ value }) => {
  buyerModel.setData({
    phone: value,
  });
});

events.on('contacts:submit', () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  if (!isContactsStepValid(errors)) {
    return;
  }

  const order: IOrder = {
    payment: buyer.payment as TPayment,
    email: buyer.email as string,
    phone: buyer.phone as string,
    address: buyer.address as string,
    total: basketModel.getTotal(),
    items: basketModel.getItems().map((item) => item.id),
  };

  webLarekApi
    .createOrder(order)
    .then((result) => {
      currentModalView = 'success';

      modal.render({
        content: createSuccessContent(result.total),
      });

      basketModel.clear();
      buyerModel.clear();
    })
    .catch((error) => {
      console.log('Ошибка при оформлении заказа:', error);
    });
});

events.on('success:close', () => {
  modal.close();
});

page.counter = basketModel.getCount();

webLarekApi
  .getProducts()
  .then((data) => {
    catalogModel.setProducts(data.items);
  })
  .catch((error) => {
    console.log('Ошибка при получении товаров с сервера:', error);
  });