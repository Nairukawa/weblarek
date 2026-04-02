import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, settings } from './utils/constants';

const catalogModel = new CatalogModel();

catalogModel.setProducts(apiProducts.items);
console.log('Все товары в каталоге:', catalogModel.getProducts());

const firstProduct = apiProducts.items[0];
console.log('Первый товар:', firstProduct);

const foundProduct = catalogModel.getProduct(firstProduct.id);
console.log('Товар, найденный по id:', foundProduct);

if (foundProduct) {
  catalogModel.setPreview(foundProduct);
}

console.log('Товар для подробного просмотра:', catalogModel.getPreview());

const basketModel = new BasketModel();

console.log('Корзина сразу после создания:', [...basketModel.getItems()]);
console.log('Количество товаров в пустой корзине:', basketModel.getCount());
console.log('Стоимость пустой корзины:', basketModel.getTotal());

const secondProduct = apiProducts.items[1];

basketModel.addProduct(firstProduct);
basketModel.addProduct(secondProduct);

console.log('Корзина после добавления товаров:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Стоимость товаров в корзине:', basketModel.getTotal());
console.log('Есть ли первый товар в корзине:', basketModel.hasProduct(firstProduct.id));

basketModel.removeProduct(firstProduct);
console.log('Корзина после удаления первого товара:', basketModel.getItems());
console.log('Количество товаров после удаления:', basketModel.getCount());
console.log('Стоимость после удаления:', basketModel.getTotal());

basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());
console.log('Количество товаров после очистки:', basketModel.getCount());
console.log('Стоимость после очистки:', basketModel.getTotal());

const buyerModel = new BuyerModel();

console.log('Данные покупателя сразу после создания:', { ...buyerModel.getData() });
console.log('Ошибки валидации пустой формы:', buyerModel.validate());

buyerModel.setData({ email: 'test@test.ru' });
console.log('Покупатель после сохранения только email:', buyerModel.getData());

buyerModel.setData({ phone: '+79990000000' });
console.log('Покупатель после сохранения телефона:', buyerModel.getData());

buyerModel.setData({
  address: 'Москва, ул. Тестовая, д. 1',
  payment: 'card',
});
console.log('Покупатель после заполнения всех данных:', buyerModel.getData());

console.log('Ошибки валидации заполненной формы:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());
console.log('Ошибки после очистки данных:', buyerModel.validate());

const baseApi = new Api(API_URL, settings);
const webLarekApi = new WebLarekApi(baseApi);

webLarekApi
  .getProducts()
  .then((data) => {
    catalogModel.setProducts(data.items);
    console.log('Каталог товаров, полученный с сервера:', catalogModel.getProducts());
  })
  .catch((error) => {
    console.log('Ошибка при получении товаров с сервера:', error);
  });