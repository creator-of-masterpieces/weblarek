import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from "../../../utils/utils.ts";

export interface IBaseFormView {

}

export abstract class BaseFormView extends Component<IBaseFormView> implements IBaseFormView {
    protected events: IEvents;
    protected container: HTMLFormElement;
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    protected constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        this.container = container;
        this.errorsElement = ensureElement('.form__errors', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    }

    resetForm() {
        this.container.reset();
    }
}