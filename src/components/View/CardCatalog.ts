import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CardCatalog extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this._id });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap]);
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent || '');
  }

  render(data: IProduct): HTMLElement {
    return super.render(data);
  }
}