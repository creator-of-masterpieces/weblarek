import { IEvents } from '../../base/Events';
import {BaseFormView, IBaseFormView} from './BaseFormView';
import { AppEvents } from '../../../utils/constants';
import {ensureElement} from "../../../utils/utils.ts";

// Интерфейс формы для сбора контактных данных
export interface IContactsFormView extends IBaseFormView {
    email: string;
    phone: string;
}

export class ContactsFormView extends BaseFormView<IContactsFormView> {
    protected events: IEvents
    protected emailInputElement: HTMLInputElement;
    protected phoneInputElement: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.events	= events;
        this.emailInputElement = ensureElement<HTMLInputElement>('input[name=email]', container);
        this.phoneInputElement = ensureElement<HTMLInputElement>('input[name=phone]', container);

        // Слушатель ввода email
        this.emailInputElement.addEventListener('input', () => {
            events.emit(AppEvents.ContactsFormEmailInput, { email: this.emailInputElement.value });
        })

        // Слушатель ввода номера телефона
        this.phoneInputElement.addEventListener('input', () => {
            events.emit(AppEvents.ContactsFormPhoneInput, { phone: this.phoneInputElement.value });
        })

        // Слушатель клика по кнопке отправки формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit(AppEvents.ContactsFormSubmit);
        })
    }

    protected set email (email: string) {
        this.emailInputElement.value = email;
    }

    protected set phone (phone: string) {
        this.phoneInputElement.value = phone;
    }
}