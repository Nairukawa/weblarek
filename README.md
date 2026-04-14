Вот **готовый полный текст `README.md`**, который можно целиком заменить.

````md
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TypeScript, Vite

## Структура проекта

- `src/` — исходные файлы проекта
- `src/components/` — компоненты приложения
- `src/components/base/` — базовый код
- `src/components/Models/` — модели данных
- `src/components/View/` — компоненты представления
- `src/types/index.ts` — файл с типами
- `src/main.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами
- `index.html` — HTML-файл главной страницы

## Установка и запуск

Для установки и запуска проекта выполните команды:

```bash
npm install
npm run dev
````

или

```bash
yarn
yarn dev
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков. Пользователь может просматривать каталог товаров, открывать карточку товара в модальном окне, добавлять товары в корзину, заполнять форму заказа и отправлять заказ на сервер.

## Архитектура приложения

Приложение построено по паттерну **MVP**.

**Model** — слой данных.
Отвечает за хранение и изменение данных приложения.

**View** — слой представления.
Отвечает за отображение данных на странице и обработку действий пользователя в интерфейсе.

**Presenter** — слой логики.
Связывает модели данных, представления и коммуникационный слой. Обрабатывает события и определяет, что должно произойти при изменении данных или действиях пользователя.

Взаимодействие между классами организовано через событийную модель. Модели данных и компоненты представления генерируют события, а презентер обрабатывает их и вызывает нужные методы моделей и представлений.

## Базовый код

### Класс `Component`

Базовый класс для всех компонентов интерфейса.

Класс является дженериком и принимает в параметре `T` тип данных, которые могут быть переданы в метод `render`.

**Конструктор:**
`constructor(container: HTMLElement)` — принимает корневой DOM-элемент компонента.

**Поля класса:**
`container: HTMLElement` — корневой DOM-элемент компонента.

**Методы класса:**
`render(data?: Partial<T>): HTMLElement` — записывает переданные данные в поля класса и возвращает корневой DOM-элемент.
`setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает путь к изображению и альтернативный текст.

### Класс `Api`

Базовый класс для работы с HTTP-запросами.

**Конструктор:**
`constructor(baseUrl: string, options: RequestInit = {})` — принимает базовый адрес сервера и объект опций запроса.

**Поля класса:**
`baseUrl: string` — базовый адрес сервера.
`options: RequestInit` — объект настроек запросов.

**Методы класса:**
`get<T extends object>(uri: string): Promise<T>` — выполняет GET-запрос и возвращает ответ сервера.
`post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — выполняет POST, PUT или DELETE-запрос и возвращает ответ сервера.
`handleResponse<T>(response: Response): Promise<T>` — обрабатывает ответ сервера.

### Класс `EventEmitter`

Брокер событий. Реализует паттерн «Наблюдатель» и используется для связи моделей, представлений и презентера.

**Конструктор:**
`constructor()` — не принимает параметров.

**Поля класса:**
`_events: Map<string | RegExp, Set<Function>>` — коллекция подписок на события.

**Методы класса:**
`on<T extends object>(eventName: EventName, callback: (event: T) => void): void` — подписка на событие.
`off(eventName: EventName, callback: Subscriber): void` — удаление обработчика события.
`emit<T extends object>(eventName: string, data?: T): void` — генерация события.
`onAll(callback: (event: EmitterEvent) => void): void` — подписка на все события.
`offAll(): void` — удаление всех подписок.
`trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void` — создаёт функцию, которая при вызове генерирует событие.

## Данные

В приложении используются две основные сущности: **товар** и **покупатель**.

### Интерфейс `IProduct`

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Интерфейс `IProduct` описывает товар.

**Поля интерфейса:**
`id: string` — уникальный идентификатор товара.
`description: string` — описание товара.
`image: string` — путь к изображению товара.
`title: string` — название товара.
`category: string` — категория товара.
`price: number | null` — цена товара. Значение `null` означает, что товар недоступен для покупки.

### Интерфейс `IBuyer`

```ts
interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}
```

Интерфейс `IBuyer` описывает данные покупателя.

**Поля интерфейса:**
`payment: TPayment | null` — выбранный способ оплаты. Если способ оплаты не выбран, хранится `null`.
`email: string` — электронная почта покупателя.
`phone: string` — телефон покупателя.
`address: string` — адрес доставки.

### Интерфейс `IBuyerFormErrors`

```ts
interface IBuyerFormErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}
```

Интерфейс `IBuyerFormErrors` описывает объект с ошибками валидации формы покупателя.

### Интерфейс `IProductsResponse`

```ts
interface IProductsResponse {
  total: number;
  items: IProduct[];
}
```

Интерфейс `IProductsResponse` описывает ответ сервера со списком товаров.

**Поля интерфейса:**
`total: number` — общее количество товаров.
`items: IProduct[]` — массив товаров.

### Интерфейс `IOrder`

```ts
interface IOrder extends IBuyer {
  total: number;
  items: string[];
}
```

Интерфейс `IOrder` описывает данные заказа, которые отправляются на сервер.

**Поля интерфейса:**
`total: number` — общая стоимость заказа.
`items: string[]` — массив идентификаторов товаров.

### Интерфейс `IOrderResult`

```ts
interface IOrderResult {
  id: string;
  total: number;
}
```

Интерфейс `IOrderResult` описывает ответ сервера после успешного оформления заказа.

**Поля интерфейса:**
`id: string` — идентификатор заказа.
`total: number` — итоговая стоимость заказа.

## Модели данных

### Класс `CatalogModel`

Класс `CatalogModel` хранит данные каталога товаров.

**Конструктор:**
`constructor(events: IEvents)` — принимает объект брокера событий.

**Поля класса:**
`products: IProduct[]` — массив всех товаров каталога.
`preview: IProduct | null` — товар, выбранный для подробного просмотра.
`events: IEvents` — объект брокера событий.

**Методы класса:**
`setProducts(products: IProduct[]): void` — сохраняет массив товаров и генерирует событие `catalog:changed`.
`getProducts(): IProduct[]` — возвращает массив товаров.
`getProduct(id: string): IProduct | undefined` — возвращает товар по идентификатору.
`setPreview(product: IProduct): void` — сохраняет товар для подробного просмотра и генерирует событие `preview:changed`.
`getPreview(): IProduct | null` — возвращает выбранный товар.

### Класс `BasketModel`

Класс `BasketModel` хранит товары, добавленные в корзину.

**Конструктор:**
`constructor(events: IEvents)` — принимает объект брокера событий.

**Поля класса:**
`items: IProduct[]` — массив товаров в корзине.
`events: IEvents` — объект брокера событий.

**Методы класса:**
`getItems(): IProduct[]` — возвращает массив товаров из корзины.
`addProduct(product: IProduct): void` — добавляет товар и генерирует событие `basket:changed`.
`removeProduct(product: IProduct): void` — удаляет товар и генерирует событие `basket:changed`.
`clear(): void` — очищает корзину и генерирует событие `basket:changed`.
`getTotal(): number` — возвращает общую стоимость товаров в корзине.
`getCount(): number` — возвращает количество товаров в корзине.
`hasProduct(id: string): boolean` — проверяет наличие товара в корзине по id.

### Класс `BuyerModel`

Класс `BuyerModel` хранит данные покупателя и позволяет работать с ними.

**Конструктор:**
`constructor(events: IEvents)` — принимает объект брокера событий.

**Поля класса:**
`payment: TPayment | null` — выбранный способ оплаты.
`email: string` — электронная почта покупателя.
`phone: string` — телефон покупателя.
`address: string` — адрес доставки.
`events: IEvents` — объект брокера событий.

**Методы класса:**
`setData(data: Partial<IBuyer>): void` — сохраняет данные покупателя и генерирует событие `buyer:changed`.
`getData(): IBuyer` — возвращает все данные покупателя.
`clear(): void` — очищает данные покупателя и генерирует событие `buyer:changed`.
`validate(): IBuyerFormErrors` — проверяет данные покупателя и возвращает объект ошибок.

## Слой коммуникации

Для взаимодействия приложения с сервером используется класс `WebLarekApi`.

Класс использует композицию: в конструктор передаётся объект, реализующий интерфейс `IApi`, а внутри методов используются методы `get` и `post` базового класса `Api`.

### Класс `WebLarekApi`

Класс `WebLarekApi` отвечает за работу с API приложения.

**Конструктор:**
`constructor(api: IApi)` — принимает объект, реализующий интерфейс `IApi`.

**Поля класса:**
`api: IApi` — объект для выполнения HTTP-запросов.

**Методы класса:**
`getProducts(): Promise<IProductsResponse>` — выполняет GET-запрос на эндпоинт `/product/` и возвращает объект со списком товаров.
`createOrder(order: IOrder): Promise<IOrderResult>` — выполняет POST-запрос на эндпоинт `/order/`, отправляет данные заказа и возвращает результат оформления заказа.

## Слой представления

Слой представления отвечает за отображение данных на странице и обработку действий пользователя. Компоненты представления не хранят данные приложения, а только отображают их и генерируют события или вызывают переданные обработчики.

### Класс `Page`

Класс `Page` отвечает за основные элементы страницы.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент страницы и объект брокера событий.

**Поля класса:**
`gallery: HTMLElement` — контейнер каталога товаров.
`basketButton: HTMLButtonElement` — кнопка открытия корзины.
`basketCounter: HTMLElement` — счётчик товаров в корзине.
`wrapper: HTMLElement` — обёртка страницы.
`events: IEvents` — объект брокера событий.

**Методы класса:**
`set catalog(items: HTMLElement[])` — отображает карточки товаров на странице.
`set counter(value: number)` — обновляет счётчик корзины.
`set locked(value: boolean)` — управляет состоянием страницы при открытом модальном окне.

### Класс `Modal`

Класс `Modal` отвечает за работу модального окна.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент модального окна и объект брокера событий.

**Поля класса:**
`closeButton: HTMLButtonElement` — кнопка закрытия окна.
`contentContainer: HTMLElement` — контейнер содержимого модального окна.
`events: IEvents` — объект брокера событий.

**Методы класса:**
`open(): void` — открывает модальное окно.
`close(): void` — закрывает модальное окно.
`render(data: { content: HTMLElement }): HTMLElement` — устанавливает содержимое и открывает модальное окно.
`set content(value: HTMLElement)` — заменяет содержимое модального окна.

### Класс `Card`

Класс `Card` является родительским классом для карточек товара. В него вынесен общий функционал отображения названия и цены.

**Конструктор:**
`constructor(container: HTMLElement)` — принимает DOM-элемент карточки.

**Поля класса:**
`titleElement: HTMLElement` — элемент названия товара.
`priceElement: HTMLElement` — элемент цены товара.

**Методы класса:**
`set title(value: string)` — устанавливает название товара.
`set price(value: number | null)` — устанавливает цену товара.

### Класс `CardCatalog`

Класс `CardCatalog` отвечает за отображение карточки товара в каталоге.

**Конструктор:**
`constructor(container: HTMLElement, actions: { onClick: () => void })` — принимает DOM-элемент карточки и объект с обработчиком клика.

**Поля класса:**
`categoryElement: HTMLElement` — элемент категории товара.
`imageElement: HTMLImageElement` — изображение товара.

**Методы класса:**
`set category(value: string)` — устанавливает категорию товара и класс оформления.
`set image(value: string)` — устанавливает изображение товара.

### Класс `CardPreview`

Класс `CardPreview` отвечает за отображение карточки товара в режиме подробного просмотра.

**Конструктор:**
`constructor(container: HTMLElement, actions: { onClick: () => void })` — принимает DOM-элемент карточки и объект с обработчиком клика по кнопке.

**Поля класса:**
`categoryElement: HTMLElement` — элемент категории товара.
`imageElement: HTMLImageElement` — изображение товара.
`descriptionElement: HTMLElement` — описание товара.
`buttonElement: HTMLButtonElement` — кнопка действия с товаром.

**Методы класса:**
`set category(value: string)` — устанавливает категорию товара.
`set image(value: string)` — устанавливает изображение товара.
`set description(value: string)` — устанавливает описание товара.
`set buttonText(value: string)` — устанавливает текст кнопки.
`set disabled(value: boolean)` — управляет доступностью кнопки.

### Класс `CardBasket`

Класс `CardBasket` отвечает за отображение карточки товара в корзине.

**Конструктор:**
`constructor(container: HTMLElement, actions: { onClick: () => void })` — принимает DOM-элемент карточки и объект с обработчиком клика по кнопке удаления.

**Поля класса:**
`indexElement: HTMLElement` — элемент номера товара в корзине.
`deleteButton: HTMLButtonElement` — кнопка удаления товара.

**Методы класса:**
`set index(value: number)` — устанавливает порядковый номер товара в корзине.

### Класс `Basket`

Класс `Basket` отвечает за отображение содержимого корзины.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)` — принимает DOM-элемент корзины и объект брокера событий.

**Поля класса:**
`list: HTMLElement` — контейнер списка товаров.
`button: HTMLButtonElement` — кнопка оформления заказа.
`price: HTMLElement` — элемент общей стоимости.
`events: IEvents` — объект брокера событий.

**Методы класса:**
`set items(items: HTMLElement[])` — отображает список товаров в корзине.
`set total(value: number)` — устанавливает общую стоимость товаров.
`set disabled(value: boolean)` — управляет доступностью кнопки оформления.

### Класс `Form`

Класс `Form` является общим родительским классом для форм.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IEvents)` — принимает DOM-элемент формы и объект брокера событий.

**Поля класса:**
`submitButton: HTMLButtonElement` — кнопка отправки формы.
`errorsElement: HTMLElement` — элемент для отображения ошибок.
`events: IEvents` — объект брокера событий.

**Методы класса:**
`set valid(value: boolean)` — управляет доступностью кнопки отправки.
`set errors(value: string)` — выводит текст ошибок формы.

### Класс `OrderForm`

Класс `OrderForm` отвечает за первую форму оформления заказа.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IEvents)` — принимает DOM-элемент формы и объект брокера событий.

**Поля класса:**
`onlineButton: HTMLButtonElement` — кнопка выбора онлайн-оплаты.
`offlineButton: HTMLButtonElement` — кнопка выбора оплаты при получении.
`addressInput: HTMLInputElement` — поле ввода адреса.

**Методы класса:**
`set address(value: string)` — устанавливает адрес доставки.
`set payment(value: TPayment | '')` — устанавливает выбранный способ оплаты.

### Класс `ContactsForm`

Класс `ContactsForm` отвечает за форму контактных данных покупателя.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IEvents)` — принимает DOM-элемент формы и объект брокера событий.

**Поля класса:**
`emailInput: HTMLInputElement` — поле ввода email.
`phoneInput: HTMLInputElement` — поле ввода телефона.

**Методы класса:**
`set email(value: string)` — устанавливает email.
`set phone(value: string)` — устанавливает телефон.

### Класс `Success`

Класс `Success` отвечает за отображение сообщения об успешном оформлении заказа.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)` — принимает DOM-элемент блока успешного заказа и объект брокера событий.

**Поля класса:**
`descriptionElement: HTMLElement` — элемент текста с итоговой суммой заказа.
`closeButton: HTMLButtonElement` — кнопка закрытия сообщения.
`events: IEvents` — объект брокера событий.

**Методы класса:**
`set total(value: number)` — устанавливает текст с итоговой суммой списанных синапсов.

## События приложения

### События моделей данных

`catalog:changed` — изменился список товаров каталога.
`preview:changed` — изменился товар, выбранный для подробного просмотра.
`basket:changed` — изменилось содержимое корзины.
`buyer:changed` — изменились данные покупателя.

### События представления

`basket:open` — пользователь нажал на кнопку корзины в шапке сайта.
`modal:open` — модальное окно открыто.
`modal:close` — модальное окно закрыто.
`card:select` — пользователь нажал на карточку товара в каталоге.
`card:toggle` — пользователь нажал кнопку действия в карточке подробного просмотра товара.
`basket:remove` — пользователь нажал кнопку удаления товара из корзины.
`order:open` — пользователь нажал кнопку оформления заказа.
`order.payment:change` — пользователь изменил способ оплаты.
`order.address:change` — пользователь изменил адрес доставки.
`contacts.email:change` — пользователь изменил email.
`contacts.phone:change` — пользователь изменил телефон.
`order:submit` — пользователь отправил первую форму оформления заказа.
`contacts:submit` — пользователь отправил форму контактных данных.
`success:close` — пользователь закрыл окно успешного оформления заказа.

## Презентер

В проекте используется один презентер, так как приложение состоит из одной страницы. Отдельный класс для презентера не создавался — логика приложения реализована в файле `src/main.ts`.

Презентер связывает между собой модели данных, компоненты представления и коммуникационный слой. Он подписывается на события, которые генерируются моделями и представлениями, и в ответ выполняет нужные действия.

Для клонирования HTML-шаблонов в презентере используется утилитарная функция `cloneTemplate` из файла `src/utils/utils.ts`.

### Зона ответственности презентера

* получение списка товаров с сервера и сохранение его в модель каталога;
* обработка событий изменения данных в моделях;
* создание и обновление компонентов представления;
* открытие и закрытие модальных окон;
* обработка действий пользователя;
* подготовка данных заказа и отправка их на сервер.

### Принцип работы

Презентер не хранит данные самостоятельно и не генерирует события. Он только обрабатывает события, приходящие от моделей и представлений, и вызывает методы нужных компонентов.

Перерисовка представления выполняется:

* при обработке события изменения данных в модели;
* при открытии модального окна.

### Основные события, которые обрабатывает презентер

**События моделей данных:**
`catalog:changed`
`preview:changed`
`basket:changed`
`buyer:changed`

**События представления:**
`card:select`
`card:toggle`
`basket:open`
`basket:remove`
`order:open`
`order.payment:change`
`order.address:change`
`order:submit`
`contacts.email:change`
`contacts.phone:change`
`contacts:submit`
`success:close`