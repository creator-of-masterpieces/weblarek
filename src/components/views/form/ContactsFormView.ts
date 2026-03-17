import { IEvents } from '../../base/Events';
import {BaseFormView, IBaseFormView} from './BaseFormView';
import { AppEvents } from '../../../utils/constants';
import {ensureElement} from "../../../utils/utils.ts";

// Интерфейс формы для сбора контактных данных
export interface IContactsFormView extends IBaseFormView {
    set email (email: string);
    set phone (text: string);
    set error(text: string);
    set submitButtonDisable(isValid: boolean);
}

export class ContactsFormView extends BaseFormView implements IContactsFormView {
    protected events: IEvents
    protected emailInputElement: HTMLInputElement;
    protected phoneInputElement: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.events	= events;
        this.emailInputElement = ensureElement<HTMLInputElement>('input[name=email]', container);
        this.phoneInputElement = ensureElement<HTMLInputElement>('input[name=phone]', container);

        // Слушатель ввода в поле с email
        this.emailInputElement.addEventListener('input', () => {
            events.emit(AppEvents.FormContactsInputEmail, { email: this.emailInputElement.value });
        })

        // Слушатель ввода в поле с номером телефона
        this.phoneInputElement.addEventListener('input', () => {
            events.emit(AppEvents.FormContactsInputPhone, { phone: this.emailInputElement.value });
        })

        // Слушатель клика по кнопке отправки формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit(AppEvents.FormContactsSubmit);
        })
    }

    set email (email: string) {
        this.emailInputElement.textContent = email;
    }

    set phone (phone: string) {
        this.phoneInputElement.textContent = phone;
    }

    set error(text: string) {
        this.errorsElement.textContent = text;
    }

    set submitButtonDisable(isNoValid: boolean) {
        this.submitButton.disabled = isNoValid;
    }
}