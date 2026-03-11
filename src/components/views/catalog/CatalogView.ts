import { IEvents } from '../../base/Events';
import { Component } from '../../base/Component';

// Интерфейс каталога карточек на главной странице
export interface ICatalogView {
    set content (cards: HTMLElement[]);
}

export class CatalogView extends Component<ICatalogView> implements ICatalogView {
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
    }

    set content(cards: HTMLElement[]) {
        this.container.replaceChildren(...cards);
    }
}