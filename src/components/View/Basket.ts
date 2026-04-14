import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketView {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

export class Basket extends Component<IBasketView> {
  protected list: HTMLElement;
  protected button: HTMLButtonElement;
  protected price: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.list = container.querySelector('.basket__list') as HTMLElement;
    this.button = container.querySelector('.basket__button') as HTMLButtonElement;
    this.price = container.querySelector('.basket__price') as HTMLElement;

    this.button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.list.replaceChildren(...items);
    } else {
      const empty = document.createElement('li');
      empty.textContent = 'Корзина пуста';
      this.list.replaceChildren(empty);
    }
  }

  set total(value: number) {
    this.price.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this.button.disabled = value;
  }
}