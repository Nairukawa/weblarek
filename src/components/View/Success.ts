import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ISuccessView {
  total: number;
}

export class Success extends Component<ISuccessView> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}