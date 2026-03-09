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
    validateUserData(): Record<string, string>;
    isOrderDataValid(): boolean;
    isContactsDataValid(): boolean;
}

export class BuyerData implements IBuyerData {
    protected events: IEvents;
    protected payment: TPayment | null;
    protected address: string;
    protected email: string;
    protected phone: string;

    constructor(events: IEvents) {
        this.events = events;
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
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
        this.events.emit(AppEvents.PaymentSaved, { payment: this.payment });
    }

    // Сохраняет номер адрес
    setAddress(address: string): void {
        this.address = address;
        this.events.emit(AppEvents.AddressSaved);
    }

    // Сохраняет номер email
    setEmail(email: string): void {
        this.email = email;
        this.events.emit(AppEvents.EmailSaved);
    }

    // Сохраняет номер телефона
    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit(AppEvents.PhoneSaved);
    }

    // Очищает данные пользователя
    clearData(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    // Проверяет валидность всех полей. Возвращает объект с ошибками.
    validateUserData(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (this.payment === null) {
            errors.payment = 'Необходимо выбрать вид оплаты';
        }

        if (!this.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.phone) {
            errors.phone = 'Необходимо указать номер телефона';
        }
        return errors;
    }

    // Проверяет валидность данных заказа
    isOrderDataValid(): boolean {
        const errors = this.validateUserData();
        return !errors.payment && !errors.address;
    }

    // Проверяет валидность контактных данных
    isContactsDataValid(): boolean {
        const errors = this.validateUserData();
        return !errors.email && !errors.phone;
    }
}