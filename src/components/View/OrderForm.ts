import { IEvents } from '../base/Events';
import { TPayment } from '../../types';
import { Form, IFormState } from './Form';

interface IOrderFormView extends IFormState {
  address: string;
  payment: TPayment | '';
}

export class OrderForm extends Form<IOrderFormView> {
  protected addressInput: HTMLInputElement;
  protected onlineButton: HTMLButtonElement;
  protected offlineButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
    this.onlineButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this.offlineButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;

    this.onlineButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', {
        field: 'payment',
        value: 'online',
      });
    });

    this.offlineButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', {
        field: 'payment',
        value: 'offline',
      });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | '') {
    this.onlineButton.classList.toggle('button_alt-active', value === 'online');
    this.offlineButton.classList.toggle('button_alt-active', value === 'offline');
  }
}