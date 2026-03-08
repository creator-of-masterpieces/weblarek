import { ICard } from '../../types';
import { IEvents } from '../base/Events.ts';
import { AppEvents } from '../../utils/constants';

// Интерфейс класса данных корзины
export interface IBasketData {
    addCard (card: ICard): void;
    removeCard (id: string): void;
    getTotalPrice(cards: ICard[]): number;
    getCards (): ICard[];
    isInBasket (id: string): boolean;
    getCardsCount(): number;
    cleanBasket(): void;
}

export class BasketData implements IBasketData {
    protected events: IEvents;
    protected cardsInBasket: ICard[];

    constructor(events: IEvents) {
        this.events = events;
        this.cardsInBasket = [];
    }

    // Добавляет переданный товар в корзину
    addCard(card: ICard) {
        if (!this.isInBasket(card.id)) {
            this.cardsInBasket.push(card);
            this.events.emit(AppEvents.BasketChanged);
        }
        else {
            console.log(`${card.title} уже есть в корзине`)
        }
    }

    // Удаляет товар с переданным id из корзины
    removeCard(id: string) {
        this.cardsInBasket = this.cardsInBasket.filter(item => item.id !== id);
        this.events.emit(AppEvents.BasketChanged);
    }

    // Возвращает сумму товаров, добавленных в корзину
    getTotalPrice(): number {
        return this.cardsInBasket.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    // Возвращает все товары, добавленные в корзину
    getCards(): ICard[] {
        return this.cardsInBasket;
    }

    // Проверяет наличие товара в переданным id в корзине
    isInBasket(id: string): boolean {
        return this.cardsInBasket.some(item => item.id === id);
    }

    // Возвращает количество товаров в корзине
    getCardsCount() {
        return this.cardsInBasket.length;
    }

    // Очищает корзину
    cleanBasket() {
        this.cardsInBasket = [];
        this.events.emit(AppEvents.BasketChanged);
    }
}