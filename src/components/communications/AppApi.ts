import {ApiListResponse, IApi, IApiOrderResponse, IOrder} from '../../types';


export class AppApi {
    private baseApi: IApi;

    constructor(baseApi: IApi) {
        this.baseApi = baseApi;
    };

    getCards(): Promise<ApiListResponse> {
        return this.baseApi.get<ApiListResponse>(`/product`)
            .then((response)=> {
                console.log('Товары загружены с сервера:', response);
                return response;
            } );
    };

    sendOrderData(orderData: IOrder):Promise<IApiOrderResponse> {
        return this.baseApi.post<IApiOrderResponse>(`/order`, orderData, `POST`)
            .then((response)=> response);
    };
}