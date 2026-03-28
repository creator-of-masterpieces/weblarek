import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import {ensureElement} from "../../../utils/utils.ts";
import {IBaseCardView} from "../../../types";


// Класс содержит базовые свойства для всех классов карточек товаров
export abstract class BaseCardView<T extends IBaseCardView> extends Component<T> {
    protected cardTitleElement: HTMLElement;
    protected cardPriceElement: HTMLElement;
    protected events: IEvents;

    protected constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.cardTitleElement = ensureElement('.card__title', container);
        this.cardPriceElement = ensureElement('.card__price', container);
    }

    protected set title (text: string) {
        this.cardTitleElement.textContent = text;
    };

    protected set price (price: number) {
        if(price) {
            this.cardPriceElement.textContent = `${price} синапсов`;
        }
        else {
            this.cardPriceElement.textContent = 'Бесценно';
        }
    };
}