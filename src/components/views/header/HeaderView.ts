import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import {ensureElement} from "../../../utils/utils.ts";


export interface IHeaderView {
    set counter (cardsCount: number);
}

// Класс для управления отображением шапки приложения
export class HeaderView extends Component<IHeaderView> implements IHeaderView {
    protected events: IEvents;
    protected basketButton: HTMLButtonElement;
    protected basketCounterElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, onClick: () => void) {
        super(container);
        this.events = events;
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.basketCounterElement = ensureElement<HTMLSpanElement>('.header__basket-counter', container);
        this.basketButton.addEventListener('click', onClick);
    }

    set counter (cardsCount: number) {
        this.basketCounterElement.textContent = cardsCount.toString();
    }
}