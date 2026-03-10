import './scss/styles.scss';
import {CatalogData} from "./components/models/CatalogData.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {BasketData} from "./components/models/BasketData.ts";
import {BuyerData} from "./components/models/BuyerData.ts";
import {Api} from "./components/base/Api.ts";
import {API_URL, CDN_URL} from "./utils/constants.ts";
import {AppApi} from "./components/communications/AppApi.ts";
import {apiProducts} from "./utils/data.ts";
import {ApiListResponse, ICard} from "./types";

// Классы коммуникации
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);

// Классы модели
const events = new EventEmitter();
const catalogData = new CatalogData(events);
const basketData = new BasketData(events);
const buyerData = new BuyerData(events);

// Функции

// Преобразовывает данные товаров в формат ICard[]
function mapApoProductToCard(data:  ApiListResponse) {
    return data.items.map((product)=> ({
        ...product,
        image: CDN_URL + product.image
    }))
}

// Тестирования модели каталога
console.group('Тестирования модели каталога');

// Конвертация данных сервера в ICard[]
const mockCards: ICard[] = mapApoProductToCard(apiProducts);

// Сохранение карточек
catalogData.setCards(mockCards);
console.log('Товары успешно получены',catalogData.getCards());

// Сохранение выбранной карточки
catalogData.setPreviewCard(catalogData.getCards()[0]);
console.log('Выбранная карточка сохранена');
console.log('Выбранная карточка получена',catalogData.getPreviewCard());

// Получение карточки по id
console.log('Карточка с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9 получена',catalogData.getCard('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
console.groupEnd();

// Тестирования модели корзины
console.group('Тестирования модели корзины')

// Добавление товаров
basketData.addCard(mockCards[0]);
basketData.addCard(mockCards[1]);
console.log('Товары добавлены в корзину', basketData.getCards());

// Получение суммы товаров
console.log('Сумма товаров получена: ', basketData.getTotalPrice());

// Проверка наличия товара с переданным id в корзине
console.log('Товар с id 854cef69-976d-4c2a-a18c-2aa45046c390 есть в корзине', basketData.isInBasket('854cef69-976d-4c2a-a18c-2aa45046c390'));

// Проверка количества товаров
console.log('Количество Товаров в корзине: ', basketData.getCardsCount());

// Проверка удаления товара
basketData.removeCard('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('Товар с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9 удален', basketData.getCards());

// Проверка очистки корзины
basketData.cleanBasket();
console.log('Корзина очищена', basketData.getCards());
console.groupEnd();

// Тестирования модели покупателя
console.group('Тестирования модели покупателя')

// Проверка сохранения адреса
buyerData.setAddress('Мой адрес сегодня не улица');

// Проверка сохранения почты
buyerData.setEmail('user@gmail.com');

// Проверка сохранения способа оплаты
buyerData.setPayment('cash');

// Проверка сохранения телефона
buyerData.setPhone('8-800-555-35-35');

// Проверка получения данных покупателя
console.log('Данные покупателя сохранены:', buyerData.getUserData());

// Запуск валидации данных пользователя
console.log('Запуск валидации данных пользователя', buyerData.validateUserData());

// Проверка очистки данных покупателя
buyerData.clearData();
console.log('Данные пользователя очищены:', buyerData.getUserData());

// Запуск валидации данных пользователя
console.log('Запуск валидации данных пользователя', buyerData.validateUserData());

console.groupEnd();

// Тестирование слоя коммуникации

// Инициализация приложения
async function init() {
    console.group('Тестирования слоя коммуникации');

    // Загрузка карточек
    const apiCardsData = await api.getCards();

    // Конвертация данных сервера в ICard[]
    const cards = mapApoProductToCard(apiCardsData);
    console.log('Товары с сервера загружены');
    console.log('Карточки успешно сохранены',cards);

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
    console.groupEnd();
}

init().catch(console.error)





