import './scss/styles.scss';
import {CatalogData} from "./components/models/CatalogData.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {BasketData} from "./components/models/BasketData.ts";
import {BuyerData, TBuyerErrors} from "./components/models/BuyerData.ts";
import {Api} from "./components/base/Api.ts";
import {API_URL, AppEvents, CDN_URL} from "./utils/constants.ts";
import {AppApi} from "./components/communications/AppApi.ts";
import {ApiListResponse, ICard, IMediaCardData, TCardClickHandler, TPayment} from "./types";
import {HeaderView} from "./components/views/header/HeaderView.ts";
import {cloneTemplate, ensureElement} from "./utils/utils.ts";
import {CatalogCardView} from "./components/views/card/CatalogCardView.ts";
import {CatalogView} from "./components/views/catalog/CatalogView.ts";
import {ModalView} from "./components/views/modal/ModalView.ts";
import {PreviewCardView} from "./components/views/card/PreviewCardView.ts";
import {BasketView} from "./components/views/basket/BasketView.ts";
import {BasketCardView} from "./components/views/card/BasketCardView.ts";
import {OrderFormView} from "./components/views/form/OrderFormView.ts";
import {ContactsFormView} from "./components/views/form/ContactsFormView.ts";
// import {SuccessOrderMessage} from "./components/views/message/SuccessOrderMessage.ts";


// HTML элементы
const pageElement = ensureElement<HTMLElement>('.page');
const headerElement = ensureElement<HTMLElement>('.header', pageElement);
const catalogElement = ensureElement<HTMLElement>('.gallery', pageElement);
const modalElement = ensureElement<HTMLTemplateElement>('#modal-container', pageElement);
const previewCardTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket', pageElement);
const basketElement = cloneTemplate('#basket');
const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const contactsFormElement = cloneTemplate<HTMLFormElement>('#contacts');
// const successOrderMessageTemplateElement = ensureElement<HTMLTemplateElement>('#success', pageElement);

// Функции

// Функции преобразования данных

// Преобразовывает данные товаров в формат для модели товаров
function mapApiCardDataToModelData(data: ApiListResponse): ICard[] {
    return data.items.map((product) => ({
        ...product,
        image: CDN_URL + product.image
    }))
}

// Преобразовывает данные товаров в формат для вью карточки каталога
function mapModelCardDataToView(data: ICard[]): IMediaCardData[] {
    return data.map((item) => ({
        ...item,
        image: {src: item.image, alt: item.title}
    }));
}

// Функции обработчики

// Обработчик клика по карточке в каталоге
const catalogCardClickHandler: TCardClickHandler = (data) => {
    events.emit(AppEvents.ProductOpen, data);
}

// Обработчик клика по иконке корзины
const basketIconClickHandler = (): void => {
    events.emit(AppEvents.BasketOpen);
}

// Обработчик клика по кнопке купить в превью карточке
const previewCardBuyClickHandler: TCardClickHandler = (data) => {
    events.emit(AppEvents.ProductBuyClick, data);
}

// Обработчик клика по кнопке удаления товара в корзине
const basketCardDeleteClickHandler: TCardClickHandler = (data) => {
    events.emit(AppEvents.BasketDelete, data);
}

// Обработчик клика по кнопке оформления заказа в корзине
const basketSubmitButtonClick = (): void => {
    events.emit(AppEvents.BasketSubmit);
}

// Классы

// Класс брокера событий
const events = new EventEmitter();

// Классы коммуникации
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);

// Классы модели
const catalogDataModel = new CatalogData(events);
const basketData = new BasketData(events);
const buyerData = new BuyerData(events);

// Классы представления
const headerView = new HeaderView(headerElement, events, basketIconClickHandler);
const catalogView = new CatalogView(catalogElement, events);
const modalView = new ModalView(modalElement, events);
const basketView = new BasketView(basketElement, events, basketSubmitButtonClick);
const orderFormView = new OrderFormView(orderFormElement, events);
const contactsFormView = new ContactsFormView(contactsFormElement, events);


// Функция создания и заполнения данными карточек товаров в корзине
function createBasketCardElements() {
    return basketData.getCards().map((cardData, index) => {
        const basketCardElement = cloneTemplate(basketCardTemplate);
        const basketCardView = new BasketCardView(basketCardElement, events, basketCardDeleteClickHandler);
        return basketCardView.render({index: index, ...cardData});
    })
}

// Функция для генерации контента в корзине и её состояния
function buildBasketRenderData() {
    return basketView.render({
        totalPrice: basketData.getTotalPrice(),
        content: createBasketCardElements(),
        submitButtonDisable: basketData.getCardsCount() === 0,
    })
}

// Функция инициализации приложения
async function init() {
    // Загрузка карточек
    const apiCardsData = await api.getCards();

    // Конвертация данных с сервера в ICard[] и сохранение данных в модель
    const modelFormatCardsData = mapApiCardDataToModelData(apiCardsData);
    catalogDataModel.setCards(modelFormatCardsData);
}


// Слушатели событий

// Слушатель сохранения карточек в модели
events.on(AppEvents.CardsSaved, () => {
    const modelCardsData = catalogDataModel.getCards();
    // Данные товаров в формате карточки каталога
    const cardData = mapModelCardDataToView(modelCardsData);

    // Добавляет элементы карточек в каталог
    catalogView.content = cardData.map((item) => {
        const catalogCardElement = cloneTemplate<HTMLButtonElement>('#card-catalog');
        const catalogCardView = new CatalogCardView(catalogCardElement, events, catalogCardClickHandler);
        return catalogCardView.render(item);
    })
})

// Слушатель клика по карточке в каталоге
events.on(AppEvents.ProductOpen, (data: { id: string }) => {
    const cardData = catalogDataModel.getCard(data.id);
    if (cardData) {
        const previewCardData = {...cardData, image: {src: cardData.image, alt: cardData.title}};
        const previewCardElement = cloneTemplate(previewCardTemplateElement);
        const previewCardView = new PreviewCardView(previewCardElement, events, previewCardBuyClickHandler);
        const previewCard = previewCardView.render({
            ...previewCardData,
            buttonText: !cardData.price ? 'Недоступно' : basketData.isInBasket(data.id) ? 'Удалить из корзины' : 'Купить',
            buttonDisable: !previewCardData.price
        });
        catalogDataModel.setPreviewCard(previewCard);
        modalView.content = previewCardView.render(previewCard);
        modalView.openModal();
    }
})

// Слушатель клика по иконке корзины в шапке
events.on(AppEvents.BasketOpen, () => {
    modalView.content = buildBasketRenderData();
    modalView.openModal();
})

// Слушатель клика по кнопке купить/удалить в карточке превью
events.on(AppEvents.ProductBuyClick, (data: { id: string }) => {
    const cardData = catalogDataModel.getCard(data.id);
    if (cardData && !basketData.isInBasket(data.id)) {
        basketData.addCard(cardData);
        modalView.closeModal();
    } else if (cardData && basketData.isInBasket(data.id)) {
        basketData.removeCard(data.id);
        modalView.closeModal();
    }
})

// Слушатель изменения данных корзины товаров
events.on(AppEvents.BasketChanged, () => {
    headerView.counter = basketData.getCardsCount();
})

// Слушатель клика по кнопке удаления товара в корзине
events.on(AppEvents.BasketDelete, (data: { id: string }) => {
    basketData.removeCard(data.id);
    basketView.content = createBasketCardElements();

    modalView.content = buildBasketRenderData();
})

// Обработчик ошибок валидации данных пользователя
function buyerOrderDataValidationHandler(data: TBuyerErrors) {
    if (data.payment) {
        return {error: data.payment, submitButtonDisable: true};
    }
    if (data.address) {
        return {error: data.address, submitButtonDisable: true};
    } else {
        return {submitButtonDisable: false, error: ''}
    }
}

// Обработчик ошибок валидации данных пользователя
function buyerContactsDataValidationHandler(data: TBuyerErrors) {
    if (data.email) {
        return {error: data.email, submitButtonDisable: true};
    }
    if (data.phone) {
        return {error: data.phone, submitButtonDisable: true};
    } else {
        return {submitButtonDisable: false, error: ''}
    }
}

// Слушатель клика по кнопке оформления заказа в корзине
events.on(AppEvents.BasketSubmit, () => {
    const formValidateError = buyerOrderDataValidationHandler(buyerData.validateUserData());
    modalView.render({content: orderFormView.render(formValidateError)});
})

// Слушатель клика по кнопке выбора оплаты онлайн в форме заказа
events.on<{ payment: TPayment }>(AppEvents.FormOrderPaymentChanged, (method) => {
    buyerData.setPayment(method.payment);
})

// Слушатель сохранения метода оплаты
events.on<{ payment: TPayment }>(AppEvents.PaymentSaved, (method) => {
    const formValidateError = buyerOrderDataValidationHandler(buyerData.validateUserData());
    orderFormView.render({...formValidateError, activePaymentButton: method.payment});
})

// Слушатель ввода в поле адрес в форме заказа
events.on<{ address: string }>(AppEvents.FormOrderInput, (value) => {
    buyerData.setAddress(value.address);
})

// Слушатель сохранения адреса доставки
events.on(AppEvents.AddressSaved, () => {
    const formValidateError = buyerOrderDataValidationHandler(buyerData.validateUserData());
    orderFormView.render(formValidateError);
})

// Слушатель сабмита формы заказа
events.on(AppEvents.FormOrderSubmit, () => {
    const formValidateError = buyerContactsDataValidationHandler(buyerData.validateUserData());
    modalView.content = contactsFormView.render(formValidateError);
})

// Слушатель ввода email в форме контактных данных
events.on<{email: string}>(AppEvents.FormContactsInputEmail, (data) => {
    buyerData.setEmail(data.email);
})

// Слушатель сохранения email покупателя
events.on(AppEvents.EmailSaved, () => {
    const formValidateError = buyerContactsDataValidationHandler(buyerData.validateUserData());
    contactsFormView.render(formValidateError);
})

// Слушатель ввода номера телефона в форме контактных данных
events.on<{ phone: string}>(AppEvents.FormContactsInputPhone, (data) => {
    buyerData.setPhone(data.phone);
})

// Слушатель сохранения номера телефона покупателя
events.on(AppEvents.PhoneSaved, () => {
    const formValidateError = buyerContactsDataValidationHandler(buyerData.validateUserData());
    contactsFormView.render(formValidateError);
})

// Инициализация приложения
init().catch(console.error)


// Тестирование классов представления

// Тестирование формы контактов

// modalView.content = contactsFormView.render();
// modalView.openModal();

// Тестирование сообщения об успешном оформлении заказа
// const successOrderMessageElement = cloneTemplate(successOrderMessageTemplateElement);
// const successOrderMessageView = new SuccessOrderMessage(successOrderMessageElement, events);
//  modalView.content = successOrderMessageView.render();
//  modalView.openModal();


// Тестирование модального окна с формой


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
//     const apiSuccessOrderResponse =  await api.sendOrderData({
//         address: 'Улица Пушкина',
//         email: 'email@example.com',
//         phone: '8-800',
//         payment: 'cash',
//         total: 2200,
//         items: [apiProducts.items[0].id, apiProducts.items[1].id],
//     })
//     console.log('Заказ успешно отправлен!', apiSuccessOrderResponse);
//     console.groupEnd();
// }
//
// init().catch(console.error)





