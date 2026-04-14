import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
  protected products: IProduct[] = [];
  protected preview: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed', { products: this.products });
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProduct(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setPreview(product: IProduct): void {
    this.preview = product;
    this.events.emit('preview:changed', { preview: this.preview });
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}