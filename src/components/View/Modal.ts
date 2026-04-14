import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this.contentContainer = container.querySelector('.modal__content') as HTMLElement;

    this.closeButton.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentContainer.replaceChildren();
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}