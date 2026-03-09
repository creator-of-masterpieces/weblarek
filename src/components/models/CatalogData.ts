import { ICard } from '../../types';
import { IEvents } from '../base/Events.ts';
import { AppEvents } from '../../utils/constants';
import {ApiListResponse} from "../communications/AppApi.ts";

interface ICatalogData {
    setCards (cards: ApiListResponse<ICard>): void;
    setPreviewCard (card: ICard): void;
    getCards(): ICard[];
    getPreviewCard(): void;
    getCard(id: string): ICard | undefined;
}

export class CatalogData implements ICatalogData {
    protected events: IEvents;
    protected cards: ICard[] = [];
    protected preview: ICard | null = null;
    protected cdn: string;

    constructor(events: IEvents, cdn: string) {
        this.events = events;
        this.cdn = cdn;
    }

    // Сохраняет карточки товаров
    setCards(cards: ApiListResponse<ICard>):void {
        this.cards = cards.items.map((item)=> ({
            ...item,
            image: this.cdn + item.image
        }))
        this.events.emit(AppEvents.CardsSaved);
    }

    // Сохраняет выбранную карточку
    setPreviewCard(card: ICard):void {
        this.preview = card;
        this.events.emit(AppEvents.CardSaved);
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