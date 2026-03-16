import { IEvents } from '../../base/Events';
import { AppEvents } from '../../../utils/constants';
import {BaseFormView, IBaseFormView} from './BaseFormView';
import { ensureElement } from "../../../utils/utils.ts";
import {TPayment} from "../../../types";

// Интерфейс формы сбора информации об оплате и адресе
export interface IOrderFormView extends IBaseFormView {
    set address (text: string);
    set enableSubmit(value: boolean);
    set error(text: string);
    set submitButtonDisable(isValid: boolean);
}

export class OrderFormView extends BaseFormView implements IOrderFormView {
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
            this.events.emit(AppEvents.FormOrderPaymentChanged, {payment: 'online'});
            console.log('Клик по кнопке оплаты онлайн');
        })

        // Слушатель выбора метода оплаты наличными
        this.cashPaymentButton.addEventListener('click', () => {
            this.events.emit(AppEvents.FormOrderPaymentChanged, {payment: 'cash'});
            console.log('Клик по кнопке оплаты наличными');
        })

        // Слушатель ввода адреса
        this.addressInputElement.addEventListener('input', () => {
            events.emit(AppEvents.FormOrderInput, { address: this.addressInputElement.value });
            console.log('Ввод в поле адрес');
        })

        // Слушатель сабмита формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit(AppEvents.FormOrderSubmit);
        })
    }

    set enableSubmit(value: boolean) {
        if (value) {
            this.submitButton.disabled = false;
        }
        else {
            this.submitButton.disabled = true;
        }
    }

    set address(text: string) {
        this.addressInputElement.value = text;
    }

    set activePaymentButton(method: TPayment) {
        if(method === 'online') {
            this.cardPaymentButton.classList.add('button_alt-active');
            this.cashPaymentButton.classList.remove('button_alt-active');
        }
        else {
            this.cashPaymentButton.classList.add('button_alt-active');
            this.cardPaymentButton.classList.remove('button_alt-active');
        }
    }

    set error(text: string) {
        this.errorsElement.textContent = text;
    }

    set submitButtonDisable(isNoValid: boolean) {
        this.submitButton.disabled = isNoValid;
    }

    clearButtonState() {
        this.cardPaymentButton.classList.remove('button_alt-active');
        this.cashPaymentButton.classList.remove('button_alt-active');
    }
}
