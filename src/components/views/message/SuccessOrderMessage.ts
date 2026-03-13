import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { AppEvents } from '../../../utils/constants';
import {ensureElement} from "../../../utils/utils.ts";

interface ISuccessOrderMessage {
    totalPrice: number;
}

export class SuccessOrderMessage extends Component<ISuccessOrderMessage>{
    protected events: IEvents;
    protected totalPriceElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.totalPriceElement = ensureElement('.order-success__description', container);
        this.submitButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.submitButton.addEventListener('click', ()=> {
            events.emit(AppEvents.OrderSuccessMessageSuccessConfirm);
        })
    }

    set totalPrice(totalPrice: number) {
        this.totalPriceElement.textContent = `Списано ${totalPrice} синапсов`;
    }
}