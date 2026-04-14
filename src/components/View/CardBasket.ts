import { Card } from './Card';

type TCardBasket = {
  index: number;
};

interface ICardBasketActions {
  onClick: () => void;
}

export class CardBasket extends Card<TCardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardBasketActions) {
    super(container);

    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', actions.onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}