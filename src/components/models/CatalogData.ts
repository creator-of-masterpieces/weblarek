import { ICard } from '../../types';
import { IEvents } from '../base/Events.ts';
import { AppEvents } from '../../utils/constants';

interface ICatalogData {
    setCards (cards: ICard[]): void;
    setPreviewCard (card: HTMLElement): void;
    getCards(): ICard[];
    getPreviewCard(): void;
    getCard(id: string): ICard | undefined;
}

export class CatalogData implements ICatalogData {
    protected events: IEvents;
    protected cards: ICard[] = [];
    protected preview: HTMLElement | null = null;

    constructor(events: IEvents) {
        this.events = events;
    }

    // Сохраняет карточки товаров
    setCards(cards:ICard[]):void {
        this.cards = cards;
        this.events.emit(AppEvents.CardsSaved);
        console.log('Товары сохранены в модель:', this.cards);
    }

    // Сохраняет выбранную карточку
    setPreviewCard(card: HTMLElement):void {
        this.preview = card;
        this.events.emit(AppEvents.CardSaved);
    }

    // Возвращает карточки товаров
    getCards():ICard[] {
        return this.cards;
    }

    // Возвращает выбранную карточку
    getPreviewCard(): HTMLElement | null {
        return this.preview;
    }

    // Возвращает карточку по id
    getCard(id: string):ICard | undefined {
        return this.cards.find((card) => card.id === id);
    }
}