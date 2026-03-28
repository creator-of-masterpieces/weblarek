import {IEvents} from '../../base/Events';
import {AppEvents} from '../../../utils/constants';
import {BaseFormView, IBaseFormView} from './BaseFormView';
import {ensureElement} from "../../../utils/utils.ts";
import {TPayment} from "../../../types";

// Интерфейс формы сбора информации об оплате и адресе
export interface IOrderFormView extends IBaseFormView {
    address: string;
    activePaymentButton: TPayment | null;
}

export class OrderFormView extends BaseFormView<IOrderFormView> {
    protected events: IEvents;
    protected cardPaymentButton: HTMLButtonElement;
    protected cashPaymentButton: HTMLButtonElement;
    protected addressInputElement: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.events = events;
        this.cardPaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', container);

        // Слушатель выбора метода оплаты онлайн
        this.cardPaymentButton.addEventListener('click', () => {
            this.events.emit(AppEvents.OrderFormPaymentChanged, {payment: 'online'});
        })

        // Слушатель выбора метода оплаты наличными
        this.cashPaymentButton.addEventListener('click', () => {
            this.events.emit(AppEvents.OrderFormPaymentChanged, {payment: 'cash'});
        })

        // Слушатель ввода адреса
        this.addressInputElement.addEventListener('input', () => {
            events.emit(AppEvents.OrderFormInput, {address: this.addressInputElement.value});
        })

        // Слушатель сабмита формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit(AppEvents.OrderFormSubmit);
        })
    }

    protected set address(text: string) {
        this.addressInputElement.value = text;
    }

    protected set activePaymentButton(method: TPayment) {
        this.cardPaymentButton.classList.toggle('button_alt-active', method === 'online');
        this.cashPaymentButton.classList.toggle('button_alt-active', method === 'cash');
    }

    clearButtonState() {
        this.cardPaymentButton.classList.remove('button_alt-active');
        this.cashPaymentButton.classList.remove('button_alt-active');
    }
}
