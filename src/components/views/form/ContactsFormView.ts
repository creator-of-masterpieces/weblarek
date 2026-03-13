import { IEvents } from '../../base/Events';
import {BaseFormView, IBaseFormView} from './BaseFormView';
import { AppEvents } from '../../../utils/constants';
import {ensureElement} from "../../../utils/utils.ts";

// Интерфейс формы для сбора контактных данных
export interface IContactsFormView extends IBaseFormView {
    set email (email: string);
    set phone (text: string);
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

        // Слушатель ввода email
        this.emailInputElement.addEventListener('input', () => {
            events.emit(AppEvents.FormContactsInputEmail, { email: this.emailInputElement.value });
            console.log('Ввод в поле email');
        })

        // Слушатель ввода phone
        this.phoneInputElement.addEventListener('input', () => {
            events.emit(AppEvents.FormContactsInputPhone, { phone: this.emailInputElement.value });
            console.log('Ввод в поле email');
        })

        // Слушатель сабмита формы
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

    set submitButtonDisable(isValid: boolean) {
        if(isValid) {
            this.submitButton.disabled = false;
        }
        else {
            this.submitButton.disabled = true;
        }
    }

}