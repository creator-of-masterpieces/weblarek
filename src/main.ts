import './scss/styles.scss';
import {CatalogData} from "./components/models/CatalogData.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {BasketData} from "./components/models/BasketData.ts";
import {BuyerData} from "./components/models/BuyerData.ts";
import {Api} from "./components/base/Api.ts";
import {API_URL, CDN_URL} from "./utils/constants.ts";
import {AppApi} from "./components/base/AppApi.ts";
import {apiProducts} from "./utils/data.ts";

// Классы коммуникации
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi, CDN_URL)


// Классы модели
const events = new EventEmitter();
const catalogData = new CatalogData(events);
const basketData = new BasketData(events);
const buyerData = new BuyerData(events);

// Тестирования модели каталога

// Загрузка карточек
const cards = await api.getCards();
catalogData.setCards(cards);
console.log('Товары успешно загружены!',catalogData.getCards());

// Отправка данных заказа
const apiSuccesOrderResponse =  await api.sendOrderData({
    address: 'Улица Пушкина',
    email: 'email@example.com',
    phone: '8-800',
    payment: 'cash',
    total: 2200,
    items: [apiProducts.items[0].id, apiProducts.items[1].id],
})
console.log('Заказ успешно отправлен!', apiSuccesOrderResponse);


// Тестирования модели корзины
// basketData.addCard(apiProducts.items[0])
// console.log('Вот содержимое корзины: ', basketData.getCards());
//
// basketData.addCard(apiProducts.items[1])
// console.log('Вот содержимое корзины: ', basketData.getCards());
// console.log('Вот сумма товаров: ', basketData.getTotalPrice());
// console.log('товар с id 854cef69-976d-4c2a-a18c-2aa45046c390 есть в корзине', basketData.isInBasket('854cef69-976d-4c2a-a18c-2aa45046c390'));
// console.log('Товаров в корзине: ', basketData.getCardsCount());
// console.log('Корзина пустая', basketData.isEmptyBasket());
//
// basketData.removeCard('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
// console.log('Вот содержимое корзины: ', basketData.getCards());
//
// basketData.cleanBasket();
// console.log('Вот содержимое корзины: ', basketData.getCards());



// Тестирования модели покупателя
// console.log(buyerData.getUserData());
// buyerData.setAddress('Мой адрес сегодня не улица');
// buyerData.setEmail('gmail');
// buyerData.setPayment('cash');
// buyerData.setPhone('8-800');
// console.log(buyerData.getUserData());
// console.log(buyerData.isContactsDataValid());
// console.log(buyerData.isOrderDataValid());
//
// buyerData.clearData();
// console.log(buyerData.getUserData());
// console.log(buyerData.getError());
// console.log(buyerData.isContactsDataValid());
// console.log(buyerData.isOrderDataValid());




