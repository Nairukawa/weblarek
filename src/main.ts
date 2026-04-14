import './scss/styles.scss';

import { cloneTemplate } from './utils/utils';
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

// Статичные компоненты создаются один раз
const basketView = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
const previewCard = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
  onClick: () => events.emit('card:toggle'),
});
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const successView = new Success(cloneTemplate<HTMLElement>('#success'), events);

let currentModalView: TModalView = null;

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
  const items = basketModel.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
      onClick: () => events.emit('basket:remove', { id: product.id }),
    });

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  return basketView.render({
    items,
    total: basketModel.getTotal(),
    disabled: basketModel.getCount() === 0,
  });
}

function createOrderContent(): HTMLElement {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  return orderForm.render({
    address: buyer.address || '',
    payment: buyer.payment ?? '',
    valid: isOrderStepValid(errors),
    errors: getOrderErrors(errors),
  });
}

function createContactsContent(): HTMLElement {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  return contactsForm.render({
    email: buyer.email || '',
    phone: buyer.phone || '',
    valid: isContactsStepValid(errors),
    errors: getContactsErrors(errors),
  });
}

function createSuccessContent(total: number): HTMLElement {
  return successView.render({ total });
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
    const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), {
      onClick: () => events.emit('card:select', { id: product.id }),
    });

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
    });
  });

  page.catalog = cards;
});

events.on('preview:changed', () => {
  const product = catalogModel.getPreview();

  if (!product) {
    return;
  }

  currentModalView = 'preview';

  modal.render({
    content: previewCard.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
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

events.on('card:toggle', () => {
  const product = catalogModel.getPreview();

  if (!product || product.price === null) {
    return;
  }

  if (basketModel.hasProduct(product.id)) {
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

  if (!buyer.payment) {
    return;
  }

  const order: IOrder = {
    payment: buyer.payment,
    email: buyer.email,
    phone: buyer.phone,
    address: buyer.address,
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