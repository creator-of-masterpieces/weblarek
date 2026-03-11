import { IEvents } from '../../base/Events';
import { Component } from '../../base/Component';
import { AppEvents } from '../../../utils/constants';
import {ensureElement} from "../../../utils/utils.ts";

// Интерфейс модального окна
export interface IModalView {
    openModal(): void;
    closeModal(): void;
    set content (element: HTMLElement);
}

export class ModalView extends Component<IModalView> implements IModalView {
    protected events: IEvents;
    protected closeButton: HTMLButtonElement;
    protected modalContent: HTMLElement;


    constructor(protected modalElement: HTMLElement, events: IEvents) {
        super(modalElement);
        this.events = events;
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', modalElement);
        this.modalContent = ensureElement<HTMLButtonElement>('.modal__content', modalElement);
        this.closeButton.addEventListener('click', () => {
            this.closeModal();
        })
        this.modalElement.addEventListener('click', (evt) => {
            if(evt.target === evt.currentTarget) {
                this.closeModal();
            }
        })
        this.handleEsc = this.handleEsc.bind(this);
    }

    set content(element: HTMLElement) {
        this.modalContent.replaceChildren(element);
    }

    openModal() {
        this.modalElement.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEsc);
        this.events.emit(AppEvents.ModalOpen);
    }

    closeModal() {
        this.modalElement.classList.remove('modal_active');
        document.removeEventListener('keyup', this.handleEsc);
        this.events.emit(AppEvents.ModalClose);
    }

    handleEsc (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
            this.closeModal();
        }
    };

}