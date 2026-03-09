import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events.ts';
import { AppEvents } from '../../utils/constants';

// Интерфейс класса данных покупателя
export interface IBuyerData {
    getUserData(): IBuyer;
    setPayment(method: TPayment): void;
    setAddress(address: string): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    clearData(): void;
    isFieldValid(data: string): boolean;
    validateUserData(): Record<string, string>;
    isOrderDataValid(): boolean;
    isContactsDataValid(): boolean;
    getErrors(): Record<string, string> | {};
}

export class BuyerData implements IBuyerData {
    protected events: IEvents;
    protected payment: TPayment;
    protected address: string;
    protected email: string;
    protected phone: string;
    protected errors: Record<string, string>;

    constructor(events: IEvents) {
        this.events = events;
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.errors = {};
    }

    // Возвращает данные пользователя
    getUserData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        }
    }

    // Сохраняет способ оплаты
    setPayment(method: TPayment): void {
        this.payment = method;
        this.validateUserData();
        this.events.emit(AppEvents.PaymentSaved, { payment: this.payment });
    }

    // Сохраняет номер адрес
    setAddress(address: string): void {
        this.address = address;
        this.validateUserData();
        this.events.emit(AppEvents.AddressSaved);
    }

    // Сохраняет номер email
    setEmail(email: string): void {
        this.email = email;
        this.validateUserData();
        this.events.emit(AppEvents.EmailSaved);
    }

    // Сохраняет номер телефона
    setPhone(phone: string): void {
        this.phone = phone;
        this.validateUserData();
        this.events.emit(AppEvents.PhoneSaved);
    }

    // Очищает данные пользователя
    clearData(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.validateUserData();
    }

    // Проверяет валидность поля
    isFieldValid(data: string): boolean {
        if (data && data!== '') {
            return true;
        }
        else return false;
    }

    // Проверяет валидность всех полей. Возвращает объект с ошибками.
    validateUserData(): Record<string, string> | {} {
        this.errors = {};

        if (!this.isFieldValid(this.payment)) {
            this.errors.payment = 'Необходимо выбрать вид оплаты';
        }

        if (!this.isFieldValid(this.address)) {
            this.errors.address = 'Необходимо указать адрес доставки';
        }

        if (!this.isFieldValid(this.email)) {
            this.errors.email = 'Необходимо указать email';
        }

        if (!this.isFieldValid(this.phone)) {
            this.errors.phone = 'Необходимо указать номер телефона';
        }
        return this.errors;
    }

    // Проверяет валидность данных заказа
    isOrderDataValid(): boolean {
        this.validateUserData();
        return !this.errors.payment && !this.errors.address;
    }

    // Проверяет валидность контактных данных
    isContactsDataValid(): boolean {
        this.validateUserData();
        return !this.errors.email && !this.errors.phone;
    }

    // Возвращает объект с ошибками
    getErrors(): Record<string, string> | {} {
        return this.errors;
    }
}