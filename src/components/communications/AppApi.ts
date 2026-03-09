import { IApi, IApiOrderResponse, ICard, IOrder } from '../../types';

// Тип ответа сервера на запрос товаров
export type ApiListResponse<T> = {
    total: number,
    items: T[],
};

export class AppApi {
    private baseApi: IApi;

    constructor(baseApi: IApi) {
        this.baseApi = baseApi;
    };

    getCards(): Promise<ApiListResponse<ICard>> {
        return this.baseApi.get<ApiListResponse<ICard>>(`/product`)
            .then((response)=> response);
    };

    sendOrderData(orderData: IOrder):Promise<IApiOrderResponse> {
        return this.baseApi.post<IApiOrderResponse>(`/order`, orderData, `POST`)
            .then((response)=> response);
    };
}