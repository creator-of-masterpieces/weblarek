import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events.ts';
import { AppEvents } from '../../utils/constants';

// Интерфейс класса данных покупателя
export interface IBuyerData {
    getUserData(): Partial<IBuyer>; // Заполняется постепенно с помощью 2 форм
    validateUser(userData: IBuyer): boolean;
    setPayment(method: TPayment): void;
    setAddress(address: string): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    isOrderDataValid(): boolean;
}

export class BuyerData implements IBuyerData {
    protected events: IEvents;
    protected payment: TPayment;
    protected address: string;
    protected email: string;
    protected phone: string;
    protected user: IBuyer | null;
    protected error: string;

    constructor(events: IEvents) {
        this.events = events;
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.user = null;
        this.error = '';
    }

    getUserData() {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        }
    }

    validateUser(userData: IBuyer) {
        return true;
    }

    setPayment(method: TPayment) {
        this.payment = method;
        this.events.emit(AppEvents.PaymentSaved, { payment: this.payment });
    }

    setAddress(address: string) {
        this.address = address;
        this.events.emit(AppEvents.AddressSaved);
    }

    setEmail(email: string) {
        this.email = email;
        this.events.emit(AppEvents.EmailSaved);
    }

    setPhone(phone: string) {
        this.phone = phone;
        this.events.emit(AppEvents.PhoneSaved);
    }

    isOrderDataValid() {
        if (this.payment && this.address) {
            this.error = '';
            return true;
        } else {
            this.error = 'Необходимо указать адрес';
            return false;
        }
    }

    isContactsDataValid() {
        if (this.email && this.phone) {
            this.error = '';
            return true;
        } else {
            return false;
        }
    }

    getError() {
        return this.error;
    }

    clearData() {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }
}