import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormState {
  valid: boolean;
  errors: string;
}

export class Form<T> extends Component<T & IFormState> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsElement = container.querySelector('.form__errors') as HTMLElement;

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.getAttribute('name')}:submit`);
    });

    this.container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;

      this.events.emit(`${this.container.getAttribute('name')}.${field}:change`, {
        field,
        value,
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}