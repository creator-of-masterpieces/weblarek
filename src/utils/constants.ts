/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

// Список категорий товаров
export type CategoryKey = keyof typeof categoryMap;

export const settings = {

};

// Список событий. Enum - список именованных констант, используют, чтобы не опечататься.
export enum AppEvents {
  CardsSaved = 'cards:saved',
  CardSaved = 'card:saved',
  ProductBuyClick = 'product:bought',
  PaymentSaved = 'payment: saved',
  AddressSaved = 'address: saved',
  EmailSaved = 'email:saved',
  PhoneSaved = 'phone:saved',
  BuyerDataCleared = 'buyerData: deleted',
  ModalOpen = 'modal:open',
  ModalClose = 'modal:close',
  ProductOpen = 'product:open',
  BasketOpen = 'basket:open',
  BasketItemDelete = 'basket:deleteItem',
  BasketSubmit = 'basket:submit',
  BasketChanged = 'basket:changed',
  OrderFormSubmit = 'formOrder:submit',
  ContactsFormEmailInput = 'formContactsEmail:input',
  ContactsFormPhoneInput = 'formContactsPhone:input',
  OrderFormPaymentChanged = 'formOrder:paymentChanged',
  OrderFormInput = 'formOrder:input',
  ContactsFormSubmit = 'formContacts:submit',
  OrderSuccessMessageSuccessConfirm = 'orderSuccessMessage:successConfirm'
}


