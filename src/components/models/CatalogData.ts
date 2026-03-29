import { ICard } from '../../types';
import { IEvents } from '../base/Events.ts';

interface ICatalogData {
    setCards (cards: ICard[]): void;
    setPreviewCard (card: ICard): void;
    getCards(): ICard[];
    getPreviewCard(): void;
    getCard(id: string): ICard | undefined;
}

export class CatalogData implements ICatalogData {
    protected events: IEvents;
    protected cards: ICard[] = [];
    protected preview: ICard | null = null;

    constructor(events: IEvents) {
        this.events = events;
    }

    // Сохраняет карточки товаров
    setCards(cards:ICard[]):void {
        this.cards = cards
    }

    // Сохраняет выбранную карточку
    setPreviewCard(card: ICard):void {
        this.preview = card;
    }

    // Возвращает карточки товаров
    getCards():ICard[] {
        return this.cards;
    }

    // Возвращает выбранную карточку
    getPreviewCard():ICard | null {
        return this.preview;
    }

    // Возвращает карточку по id
    getCard(id: string):ICard | undefined {
        return this.cards.find((card) => card.id === id);
    }
}