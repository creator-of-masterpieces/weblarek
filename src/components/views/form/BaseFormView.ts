import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from "../../../utils/utils.ts";

export interface IBaseFormView {
    error: string;
    enableSubmit: boolean;
}

export abstract class BaseFormView<T extends IBaseFormView> extends Component<T> {
    protected events: IEvents;
    protected declare container: HTMLFormElement;
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    protected constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        this.errorsElement = ensureElement('.form__errors', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    }

    protected set error(text: string) {
        this.errorsElement.textContent = text;
    }

    protected set enableSubmit(value: boolean) {
        this.submitButton.disabled = !value;
    }
}