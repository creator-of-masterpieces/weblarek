import { ICard } from '../../types';
import { IEvents } from '../base/Events.ts';
import { AppEvents } from '../../utils/constants';

interface ICatalogData {
    setCards (cards: ICard[]): void;
    setPreviewCard (card: ICard): void;
    getCards(): ICard[];
    getPreviewCard(): void;
    getCard(id: string): ICard | undefined;
}

export class CardsData implements ICatalogData {
    protected events: IEvents;
    protected cards: ICard[] = [];
    protected preview: ICard | null = null;

    constructor(events: IEvents) {
        this.events = events;
    }

    // Сохраняет карточки товаров
    setCards(cards: ICard[]) {
        this.cards = cards;
        this.events.emit(AppEvents.CardsSaved);
    }

    // Сохраняет выбранную карточку
    setPreviewCard(card: ICard) {
        this.preview = card;
        this.events.emit(AppEvents.CardSaved);
    }

    // Возвращает карточки товаров
    getCards() {
        return this.cards;
    }

    // Возвращает выбранную карточку
    getPreviewCard() {
        return this.preview;
    }

    // Возвращает карточку по id
    getCard(id: string) {
        return this.cards.find((card) => card.id === id);
    }
}