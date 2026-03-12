import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { AppEvents } from '../../../utils/constants';
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

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.submitButtonElement = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.totalPriceCounter = ensureElement('.basket__price', container);
        this.basketContent = ensureElement('.basket__list', container);

        this.submitButtonElement.addEventListener('click', ()=> {
            this.events.emit(AppEvents.BasketOrder);
        })
    }

    set totalPrice(totalPrice: number) {
        this.totalPriceCounter.textContent = `${totalPrice} синапсов`;
    }

    set content(cards:HTMLElement[]) {
        this.basketContent.replaceChildren(...cards);
    }

    set submitButtonDisable(isEmpty: boolean) {
        if(isEmpty) {
            this.submitButtonElement.disabled = true;
        }
        else {
            this.submitButtonElement.disabled = false;
        }
    }
}