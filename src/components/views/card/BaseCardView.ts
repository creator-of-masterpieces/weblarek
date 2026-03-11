import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import {ensureElement} from "../../../utils/utils.ts";
import {IBaseCardView} from "../../../types";



// Класс содержит базовые свойства для всех классов карточек
export abstract class BaseCardView<T extends IBaseCardView> extends Component<T> implements IBaseCardView {
    protected cardTitleElement: HTMLElement;
    protected cardPriceElement: HTMLElement;
    protected cardId: string;
    protected events: IEvents;

    protected constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.cardId = '';
        this.cardTitleElement = ensureElement('.card__title', container);
        this.cardPriceElement = ensureElement('.card__price', container);
    }

    set title (text: string) {
        this.cardTitleElement.textContent = text;
    };

    set price (price: number) {
        if(price){
            this.cardPriceElement.textContent = `${price} синапсов`;
        }
        else {
            this.cardPriceElement.textContent = 'Бесценно';
        }
    };

    set id (id: string) {
        this.cardId = id;
    }
}