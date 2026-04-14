import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { Card } from './Card';

type TCardPreview = Pick<IProduct, 'category' | 'image' | 'description'> & {
  buttonText: string;
  disabled: boolean;
};

interface ICardPreviewActions {
  onClick: () => void;
}

export class CardPreview extends Card<TCardPreview> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardPreviewActions) {
    super(container);

    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
    this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

    this.buttonElement.addEventListener('click', actions.onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap]);
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent || '');
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set disabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}