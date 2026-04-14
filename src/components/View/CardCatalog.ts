import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { Card } from './Card';

type TCardCatalog = Pick<IProduct, 'category' | 'image'>;

interface ICardCatalogActions {
  onClick: () => void;
}

export class CardCatalog extends Card<TCardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions: ICardCatalogActions) {
    super(container);

    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;

    this.container.addEventListener('click', actions.onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap]);
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent || '');
  }
}