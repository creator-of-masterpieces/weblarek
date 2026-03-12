import './scss/styles.scss';
import {CatalogData} from "./components/models/CatalogData.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {BasketData} from "./components/models/BasketData.ts";
import {BuyerData} from "./components/models/BuyerData.ts";
import {Api} from "./components/base/Api.ts";
import {API_URL, CDN_URL} from "./utils/constants.ts";
import {AppApi} from "./components/communications/AppApi.ts";
import {ApiListResponse, ICard, IMediaCardData} from "./types";
import {HeaderView} from "./components/views/header/HeaderView.ts";
import {cloneTemplate, ensureElement} from "./utils/utils.ts";
import {CatalogCardView} from "./components/views/card/CatalogCardView.ts";
import {apiProducts} from "./utils/data.ts";
import {CatalogView} from "./components/views/catalog/CatalogView.ts";
import {ModalView} from "./components/views/modal/ModalView.ts";
import {PreviewCardView} from "./components/views/card/PreviewCardView.ts";

// HTML элементы
const pageElement = ensureElement<HTMLElement>('.page');
const headerElement = ensureElement<HTMLElement>('.header', pageElement);
const catalogElement = ensureElement<HTMLElement>('.gallery', pageElement);
const modalElement = ensureElement<HTMLTemplateElement>('#modal-container', pageElement);
const previewCardElement = cloneTemplate('#card-preview');


// Классы коммуникации
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);

// Классы модели
const events = new EventEmitter();
const catalogData = new CatalogData(events);
const basketData = new BasketData(events);
const buyerData = new BuyerData(events);

// Классы представления
const headerView = new HeaderView(headerElement, events);
const catalogView = new CatalogView(catalogElement, events);
const modalView = new ModalView(modalElement, events);

// Функции

// Преобразовывает данные товаров в формат для модели товаров
function mapProductToICard(data:  ApiListResponse): ICard[] {
    return data.items.map((product)=> ({
        ...product,
        image: CDN_URL + product.image
    }))
}

// Преобразовывает данные товаров в формат для вью карточки каталога
function mapICardToCatalogCard(data: ICard[]): IMediaCardData[] {
    return data.map((item)=> ({
        ...item,
        image: {src: item.image, alt: item.title}
    }));
}

// Тестирование классов представления

// Тестирование шапки
headerView.render({counter: 2});

// Тестирование каталога

// Моковые данные товаров
const mockCards: ICard[] = mapProductToICard(apiProducts);

// Данные товаров в формате карточки каталога
const cardData = mapICardToCatalogCard(mockCards);

// Добавляет элементы карточек в каталог
catalogView.content = cardData.map((item)=> {
    const catalogCardElement = cloneTemplate<HTMLButtonElement>('#card-catalog');
    const catalogCardView = new CatalogCardView(catalogCardElement, events);
    return catalogCardView.render(item);
})

// Тестирование модального окна с превью карточки
const previewCardView = new PreviewCardView(previewCardElement, events);
const previewCard = previewCardView.render({...cardData[0], buttonText: 'Недоступно', buttonDisable: true});
modalView.content = previewCardView.render(previewCard);
modalView.openModal();

// Инициализация приложения
async function init() {
    // Загрузка карточек
    const apiCardsData = await api.getCards();

    // Конвертация данных сервера в ICard[]
    const cards = mapProductToICard(apiCardsData);
    console.log('Товары с сервера загружены');
    console.log('Товары сохранены',cards);
}

init().catch(console.error)


// // Тестирования модели каталога
// console.group('Тестирования модели каталога');
//
// // Конвертация данных сервера в ICard[]
// const mockCards: ICard[] = mapApoProductToCard(apiProducts);
//
// // Сохранение карточек
// catalogData.setCards(mockCards);
// console.log('Товары успешно получены',catalogData.getCards());
//
// // Сохранение выбранной карточки
// catalogData.setPreviewCard(catalogData.getCards()[0]);
// console.log('Выбранная карточка сохранена');
// console.log('Выбранная карточка получена',catalogData.getPreviewCard());
//
// // Получение карточки по id
// console.log('Карточка с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9 получена',catalogData.getCard('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
// console.groupEnd();
//
// // Тестирования модели корзины
// console.group('Тестирования модели корзины')
//
// // Добавление товаров
// basketData.addCard(mockCards[0]);
// basketData.addCard(mockCards[1]);
// console.log('Товары добавлены в корзину', basketData.getCards());
//
// // Получение суммы товаров
// console.log('Сумма товаров получена: ', basketData.getTotalPrice());
//
// // Проверка наличия товара с переданным id в корзине
// console.log('Товар с id 854cef69-976d-4c2a-a18c-2aa45046c390 есть в корзине', basketData.isInBasket('854cef69-976d-4c2a-a18c-2aa45046c390'));
//
// // Проверка количества товаров
// console.log('Количество Товаров в корзине: ', basketData.getCardsCount());
//
// // Проверка удаления товара
// basketData.removeCard('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
// console.log('Товар с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9 удален', basketData.getCards());
//
// // Проверка очистки корзины
// basketData.cleanBasket();
// console.log('Корзина очищена', basketData.getCards());
// console.groupEnd();
//
// // Тестирования модели покупателя
// console.group('Тестирования модели покупателя')
//
// // Проверка сохранения адреса
// buyerData.setAddress('Мой адрес сегодня не улица');
//
// // Проверка сохранения почты
// buyerData.setEmail('user@gmail.com');
//
// // Проверка сохранения способа оплаты
// buyerData.setPayment('cash');
//
// // Проверка сохранения телефона
// buyerData.setPhone('8-800-555-35-35');
//
// // Проверка получения данных покупателя
// console.log('Данные покупателя сохранены:', buyerData.getUserData());
//
// // Запуск валидации данных пользователя
// console.log('Запуск валидации данных пользователя', buyerData.validateUserData());
//
// // Проверка очистки данных покупателя
// buyerData.clearData();
// console.log('Данные пользователя очищены:', buyerData.getUserData());
//
// // Запуск валидации данных пользователя
// console.log('Запуск валидации данных пользователя', buyerData.validateUserData());
//
// console.groupEnd();
//
// // Тестирование слоя коммуникации
//
// // Инициализация приложения
// async function init() {
//     console.group('Тестирования слоя коммуникации');
//
//     // Загрузка карточек
//     const apiCardsData = await api.getCards();
//
//     // Конвертация данных сервера в ICard[]
//     const cards = mapApoProductToCard(apiCardsData);
//     console.log('Товары с сервера загружены');
//     console.log('Карточки успешно сохранены',cards);
//
//     // Отправка данных заказа
//     const apiSuccesOrderResponse =  await api.sendOrderData({
//         address: 'Улица Пушкина',
//         email: 'email@example.com',
//         phone: '8-800',
//         payment: 'cash',
//         total: 2200,
//         items: [apiProducts.items[0].id, apiProducts.items[1].id],
//     })
//     console.log('Заказ успешно отправлен!', apiSuccesOrderResponse);
//     console.groupEnd();
// }
//
// init().catch(console.error)





