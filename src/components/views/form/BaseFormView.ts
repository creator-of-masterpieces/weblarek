import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import {ensureAllElements, ensureElement} from "../../../utils/utils.ts";

interface IBaseForm {
    submitButtonDisable: boolean;
    enableSubmit: boolean;
}

export abstract class BaseFormView extends Component<IBaseForm> implements IBaseForm {
    protected events: IEvents;
    protected container: HTMLFormElement;
    protected inputsElement: HTMLInputElement[];
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    protected constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        this.container = container;
        this.inputsElement = ensureAllElements<HTMLInputElement>('.form__input', container);
        this.errorsElement = ensureElement('.form__errors', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[name=form__errors]', container);
    }

    resetForm() {
        this.container.reset();
    }
}