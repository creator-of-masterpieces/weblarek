import { BaseCardView } from "./BaseCardView";
import { IEvents } from '../../base/Events';
import {CategoryKey, categoryMap} from '../../../utils/constants';
import {IBaseCardView, TCatalogCardClickHandler} from "../../../types";
import {ensureElement} from "../../../utils/utils.ts";


interface ICatalogCardView extends IBaseCardView {
    set category (text: string);
    set image (image: Record<string, string>);
}

// Класс содержит базовые свойства для классов карточек в галерее и превью
export class CatalogCardView extends BaseCardView<ICatalogCardView> implements ICatalogCardView {
    protected cardCategoryElement: HTMLElement;
    protected cardImageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents, onCardClick: TCatalogCardClickHandler) {
        super(container, events);
        this.cardCategoryElement = ensureElement('.card__category', container);
        this.cardImageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.container.addEventListener('click', ()=> {
            console.log(`Клик по карточке с id: ${this.cardId}`)
            onCardClick({id: this.cardId});

        })
    }

    set category (text: CategoryKey) {
        this.cardCategoryElement.textContent = text;
        this.cardCategoryElement.className = `card__category ${categoryMap[text] ?? ''}`
    };

    set image (image: Record<string, string>) {
        this.setImage(this.cardImageElement, image.src, image.alt);
    }
}