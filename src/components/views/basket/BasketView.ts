import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import {ensureElement} from "../../../utils/utils.ts";

export interface IBasketProps {
    totalPrice: number,
    content: HTMLElement[],
    submitButtonDisable: boolean
}

export class BasketView extends Component<IBasketProps> implements IBasketProps {
    protected events: IEvents;
    protected submitButtonElement: HTMLButtonElement;
    protected totalPriceCounter: HTMLElement;
    protected basketContent: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, onSubmit: () => void) {
        super(container);
        this.events = events;
        this.submitButtonElement = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.totalPriceCounter = ensureElement('.basket__price', container);
        this.basketContent = ensureElement('.basket__list', container);

        this.submitButtonElement.addEventListener('click', () => onSubmit());
    }

    set totalPrice(totalPrice: number) {
        this.totalPriceCounter.textContent = `${totalPrice} синапсов`;
    }

    set content(cards:HTMLElement[]) {
        this.basketContent.replaceChildren(...cards);
    }

    set submitButtonDisable(isEmpty: boolean) {
        this.submitButtonElement.disabled = isEmpty;
    }
}