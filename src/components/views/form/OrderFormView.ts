import { IEvents } from '../../base/Events';
import { AppEvents } from '../../../utils/constants';
import {BaseFormView, IBaseFormView} from './BaseFormView';
import { ensureElement } from "../../../utils/utils.ts";

// Интерфейс формы сбора информации об оплате и адресе
export interface IOrderFormView extends IBaseFormView {
    set address (text: string);
    set enableSubmit(value: boolean);
    set submitButtonDisable(isValid: boolean);
}

export class OrderFormView extends BaseFormView implements IOrderFormView {
    protected events: IEvents;
    protected cardPaymentButton: HTMLButtonElement;
    protected cashPaymentButton: HTMLButtonElement;
    protected addressInputElement: HTMLInputElement;
    protected submitButtonElement: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.events = events;
        this.cardPaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', container);

        // Слушатель выбора метода оплаты онлайн
        this.cardPaymentButton.addEventListener('click', () => {
            this.events.emit(AppEvents.FormOrderOnline, {payment: 'card'});
            console.log('Клик по кнопке оплаты онлайн')
        })

        // Слушатель выбора метода оплаты наличными
        this.cashPaymentButton.addEventListener('click', () => {
            this.events.emit(AppEvents.FormOrderCash, {payment: 'cash'});
            console.log('Клик по кнопке оплаты наличными')
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
            this.submitButtonElement.disabled = false;
        }
        else {
            this.submitButtonElement.disabled = true;
        }
    }

    set address(text: string) {
        this.addressInputElement.value = text;
    }

    set activePaymentButton(isCard: boolean) {
        if(isCard) {
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

    set submitButtonDisable(isValid: boolean) {
        if(isValid) {
            this.submitButtonElement.disabled = false;
        }
        else {
            this.submitButtonElement.disabled = true;
        }
    }

    clearButtonState() {
        this.cardPaymentButton.classList.remove('button_alt-active');
        this.cashPaymentButton.classList.remove('button_alt-active');
    }
}
