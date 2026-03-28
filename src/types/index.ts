
// Интерфейс HTTP клиента
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип ответа сервера на запрос товаров
export type ApiListResponse = {
    total: number,
    items: ICard[],
};

// Интерфейс данных товара
export interface ICard {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
}

// Интерфейс данных покупателя
export interface IBuyer {
    payment: TPayment | null;
    address: string;
    email: string;
    phone: string;
}

// Интерфейс данных заказа
export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

// Интерфейс базового класса вью карточки
export interface IBaseCardView{
    set title(title: string);
    set price(price: number | null);
    set id(id: string);
}

// Интерфейс данных для класса вью карточки в каталоге
export interface IMediaCardData {
        image: {
            src: string;
            alt: string;
        };
        id: string;
        title: string;
        category: string;
        price: number | null;
        description: string;
}

// Тип обработчика клика по карточке
export type TCardClickHandler = (data: {id: string}) => void;

// Ответ сервера на успешную отправку заказа
export interface IApiOrderResponse {
    id: string;
    total: number;
}

// Методы запросов к серверу
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Способы оплаты заказа
export type TPayment = 'online' | 'cash';