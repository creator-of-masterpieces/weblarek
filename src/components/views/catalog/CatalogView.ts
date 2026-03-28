import { IEvents } from '../../base/Events';
import { Component } from '../../base/Component';

// Интерфейс каталога карточек на главной странице
export interface ICatalogView {
   content: HTMLElement[];
}

export class CatalogView extends Component<ICatalogView> {
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
    }

    protected set content(cards: HTMLElement[]) {
        this.container.replaceChildren(...cards);
    }
}