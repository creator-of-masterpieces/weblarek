
// Интерфейс HTTP клиента
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

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
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

// Интерфейс данных заказа
export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

// Ответ сервера на успешную отправку заказа
export interface IApiOrderResponse {
    id: string;
    total: number;
}

// Методы запросов к серверу
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Способы оплаты заказа
export type TPayment = 'online' | 'cash' | '';