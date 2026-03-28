import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import {ensureElement} from "../../../utils/utils.ts";
import {AppEvents} from "../../../utils/constants.ts";

export interface IBasketProps {
    totalPrice: number,
    content: HTMLElement[],
    submitButtonDisable: boolean
}

export class BasketView extends Component<IBasketProps>{
    protected events: IEvents;
    protected submitButtonElement: HTMLButtonElement;
    protected totalPriceCounter: HTMLElement;
    protected basketContent: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.submitButtonElement = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.totalPriceCounter = ensureElement('.basket__price', container);
        this.basketContent = ensureElement('.basket__list', container);

        this.submitButtonElement.addEventListener('click', () => this.events.emit(AppEvents.BasketSubmit));
    }

    protected set totalPrice(totalPrice: number) {
        this.totalPriceCounter.textContent = `${totalPrice} синапсов`;
    }

    protected set content(cards:HTMLElement[]) {
        this.basketContent.replaceChildren(...cards);
    }

    protected set submitButtonDisable(isEmpty: boolean) {
        this.submitButtonElement.disabled = isEmpty;
    }
}