import './scss/styles.scss';
import {CatalogData} from "./components/models/CatalogData.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {BasketData} from "./components/models/BasketData.ts";
import {BuyerData, TBuyerErrors} from "./components/models/BuyerData.ts";
import {Api} from "./components/base/Api.ts";
import {API_URL, AppEvents, CDN_URL} from "./utils/constants.ts";
import {AppApi} from "./components/communications/AppApi.ts";
import {IMediaCardData, TPayment} from "./types";
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
import {SuccessOrderMessage} from "./components/views/message/SuccessOrderMessage.ts";


// HTML элементы
const pageElement = ensureElement<HTMLElement>('.page');
const headerElement = ensureElement<HTMLElement>('.header', pageElement);
const catalogElement = ensureElement<HTMLElement>('.gallery', pageElement);
const modalElement = ensureElement<HTMLTemplateElement>('#modal-container', pageElement);
const previewCardElement = cloneTemplate('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket', pageElement);
const basketElement = cloneTemplate('#basket');
const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const contactsFormElement = cloneTemplate<HTMLFormElement>('#contacts');
const successOrderMessageElement = cloneTemplate('#success');


// Инициализация классов приложения

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
const headerView = new HeaderView(headerElement, events);
const catalogView = new CatalogView(catalogElement, events);
const previewCardView = new PreviewCardView(previewCardElement, events);
const modalView = new ModalView(modalElement, events);
const basketView = new BasketView(basketElement, events);
const orderFormView = new OrderFormView(orderFormElement, events);
const contactsFormView = new ContactsFormView(contactsFormElement, events);
const successOrderMessageView = new SuccessOrderMessage(successOrderMessageElement, events);


// Функция инициализации приложения
async function init() {
    // Очистка старых данных
    basketData.cleanBasket();
    buyerData.clearData();

    try {
        // Загрузка карточек
        const apiCardsData = await api.getCards();

        // Конвертация данных с сервера в формат ICard[] и сохранение их в модель
        const modelFormatCardsData = apiCardsData.items.map((product) => ({
            ...product,
            image: CDN_URL + product.image
        }));
        catalogDataModel.setCards(modelFormatCardsData);
    } catch (error) {
        console.error('Ошибка при загрузке данных товаров:', error)
    }
}

// Вспомогательные функции

// Создает элементы карточек в корзине и возвращает их в виде массива для рендера в корзине.
function createBasketCardElements() {
    return basketData.getCards().map((cardData, index) => {
        const basketCardView = new BasketCardView(
            cloneTemplate(basketCardTemplate),
            events,
            {onDelete: () => events.emit(AppEvents.BasketItemDelete, cardData)}
        );
        return basketCardView.render({index: index, ...cardData});
    })
}

// Обработчик ошибок валидации данных о заказе
function buyerOrderDataValidationHandler(data: TBuyerErrors) {
    if (data.payment) {
        return {error: data.payment, enableSubmit: false};
    }
    if (data.address) {
        return {error: data.address, enableSubmit: false};
    } else {
        return {error: '', enableSubmit: true}
    }
}

// Обработчик ошибок валидации контактных данных
function buyerContactsDataValidationHandler(data: TBuyerErrors) {
    if (data.email) {
        return {error: data.email, enableSubmit: false};
    }
    if (data.phone) {
        return {error: data.phone, enableSubmit: false};
    }
    if (data.address) {
        return {error: data.address, enableSubmit: false}
    }
    if (data.payment) {
        return {error: data.payment, enableSubmit: false}
    } else {
        return {error: '', enableSubmit: true}
    }
}


// Слушатели событий

// Слушатель сохранения данных карточек в модели.
// Создает и рендерит карточки в каталоге при сохранении данных карточек в модели.
events.on(AppEvents.CardsSaved, () => {

    // Конвертация данных карточек из модели в формат данных для карточки в каталоге
    const cardsData: IMediaCardData[] = catalogDataModel.getCards().map((item) => ({
        ...item,
        image: {src: item.image, alt: item.title}
    }));

    // Создание элементов карточек для каталога и рендер их в каталоге
    const catalogCardElements = cardsData.map((item) => {
        return new CatalogCardView(
            cloneTemplate<HTMLButtonElement>('#card-catalog'),
            events,
            {onClick: () => events.emit(AppEvents.ProductOpen, {id: item.id})}
        ).render(item);
    })
    catalogView.render({content: catalogCardElements});
})

// Слушатель клика по карточке в каталоге.
// Получает данные карточки из модели по id, сохраняет их в модели для отображения в превью карточке,
// создает элемент карточки для превью и открывает модальное окно с этим элементом.
events.on<IMediaCardData>(AppEvents.ProductOpen, ({id}) => {
    // Получение данных карточки из модели по id
    const cardData = catalogDataModel.getCard(id);

    if (cardData) {
        // Сохранение данных карточки в модели для отображения в превью карточке
        catalogDataModel.setPreviewCard(cardData);

        // Данные карточки в формате карточки в превью
        const previewCardData = {
            ...cardData,
            image: {src: cardData.image, alt: cardData.title}
        }

        // Создание элемента карточки в превью и открытие модального окна с этим элементом
        const previewCardElement = previewCardView.render({
            ...previewCardData,
            buttonText: !cardData.price ? 'Недоступно' : basketData.isInBasket(id) ? 'Удалить из корзины' : 'Купить',
            buttonDisable: !previewCardData.price
        });
        modalView.render({content: previewCardElement});
        modalView.openModal();
    }
})

// Слушатель клика по кнопке купить/удалить в карточке превью
events.on(AppEvents.ProductBuyClick, () => {
    const cardData = catalogDataModel.getPreviewCard();
    if (cardData) {
        if (!basketData.isInBasket(cardData.id)) {
            basketData.addCard(cardData);
        } else {
            basketData.removeCard(cardData.id);
        }
        modalView.closeModal();
    }
});

// Слушатель открытия корзины
events.on(AppEvents.BasketOpen, () => {
    modalView.render({
        content: basketView.render({
            totalPrice: basketData.getTotalPrice(),
            content: createBasketCardElements(),
            submitButtonDisable: basketData.getCardsCount() === 0,
        })
    });
    modalView.openModal();
})

// Слушатель изменения корзины
events.on(AppEvents.BasketChanged, () => {
    headerView.render({counter: basketData.getCardsCount()});
    basketView.render({
        content: createBasketCardElements(),
        totalPrice: basketData.getTotalPrice(),
        submitButtonDisable: basketData.getCardsCount() === 0
    });
})

// Слушатель удаления товара из корзины
events.on(AppEvents.BasketItemDelete, (data: { id: string }) => {
    basketData.removeCard(data.id);
});

// Слушатель отправки данных корзины
events.on(AppEvents.BasketSubmit, () => {
    modalView.render({
        content: orderFormView.render({
            activePaymentButton: null,
            address: '',
            enableSubmit: false
        })
    });
});

// Слушатель выбора способа оплаты
events.on<{ payment: TPayment }>(AppEvents.OrderFormPaymentChanged, (method) => {
    buyerData.setPayment(method.payment);
})

// Слушатель сохранения способа оплаты
events.on(AppEvents.PaymentSaved, () => {
    orderFormView.render({
        ...buyerOrderDataValidationHandler(buyerData.validateUserData()),
        activePaymentButton: buyerData.getPayment()
    });
})

// Слушатель ввода адреса
events.on<{ address: string }>(AppEvents.OrderFormInput, (value) => {
    buyerData.setAddress(value.address);
})

// Слушатель сохранения адреса
events.on(AppEvents.AddressSaved, () => {
    orderFormView.render(buyerOrderDataValidationHandler(buyerData.validateUserData()));
})

// Слушатель отправки формы заказа
events.on(AppEvents.OrderFormSubmit, () => {
    const {email, phone} = buyerData.getUserData();
    modalView.render({content: contactsFormView.render({email: email, phone: phone})});
})

// Слушатель ввода email
events.on<{ email: string }>(AppEvents.ContactsFormEmailInput, (data) => {
    buyerData.setEmail(data.email);
})

// Слушатель сохранения email
events.on(AppEvents.EmailSaved, () => {
    contactsFormView.render(buyerContactsDataValidationHandler(buyerData.validateUserData()));
})

// Слушатель ввода номера телефона
events.on<{ phone: string }>(AppEvents.ContactsFormPhoneInput, (data) => {
    buyerData.setPhone(data.phone);
})

// Слушатель сохранения номера телефона
events.on(AppEvents.PhoneSaved, () => {
    contactsFormView.render(buyerContactsDataValidationHandler(buyerData.validateUserData()));
})

// Слушатель отправки формы контактов
events.on(AppEvents.ContactsFormSubmit, () => {
    // Отправляем данные заказа на сервер и в случае успеха очищаем корзину и данные покупателя, а также открываем модальное окно с сообщением об успешном оформлении заказа
    api.sendOrderData({
        ...buyerData.getUserData(),
        total: basketData.getTotalPrice(),
        items: basketData.getCards().map(product => product.id),
    })
        .then((res) => {
            basketData.cleanBasket();
            buyerData.clearData();
            modalView.render({content: successOrderMessageView.render({totalPrice: res.total})});
        });
    modalView.openModal();
})

// Слушатель сабмита сообщения об успешном оформлении заказа
events.on(AppEvents.OrderSuccessMessageSuccessConfirm, () => {
    modalView.closeModal();
})

// Инициализация приложения
init().catch(console.error);




