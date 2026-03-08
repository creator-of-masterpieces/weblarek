import { IApi, IApiOrderResponse, ICard, IOrder } from '../../types';
import { ApiListResponse } from './Api';

export class AppApi {
    private baseApi: IApi;
    private cdn: string;

    constructor(baseApi: IApi, cdn: string) {
        this.baseApi = baseApi;
        this.cdn = cdn;
    }

    getCards(): Promise<ICard[]> {
        return this.baseApi.get<ApiListResponse<ICard>>(`/product`)
            .then((response) =>
                response.items.map((item)=> ({
                    ...item,
                    image: this.cdn + item.image
                }))
            );
    }

    sendOrderData(orderData: IOrder):Promise<IApiOrderResponse> {
        return this.baseApi.post<IApiOrderResponse>(`/order`, orderData, `POST`)
            .then((response)=> response)
    }
}