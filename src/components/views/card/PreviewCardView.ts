import { BaseCardView } from "./BaseCardView";
import { IEvents } from '../../base/Events';
import {IBaseCardView} from "../../../types";
import {ensureElement} from "../../../utils/utils.ts";
import {AppEvents, CategoryKey, categoryMap} from "../../../utils/constants.ts";

// Интерфейс выбранной карточки товара
export interface IPreviewCardView extends IBaseCardView {
    description: string;
    image: Record<string, string>;
    category: string;
    buttonText: string;
    buttonDisable: boolean;
}

export class PreviewCardView extends BaseCardView<IPreviewCardView>{
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buyButton: HTMLButtonElement;
    protected cardImageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.categoryElement = ensureElement('.card__category', container);
        this.descriptionElement = ensureElement('.card__text', container);
        this.buyButton = ensureElement<HTMLButtonElement>('.card__button', container);
        this.cardImageElement = ensureElement<HTMLImageElement>('.card__image', container);

        // Слушатель клика по кнопке купить
        this.buyButton.addEventListener('click', () => this.events.emit(AppEvents.ProductBuyClick));
    }

    protected set description(text: string) {
        this.descriptionElement.textContent = text;
    }

    protected set image (image: Record<string, string>) {
        this.setImage(this.cardImageElement, image.src, image.alt);
    }
    protected set category(category: CategoryKey) {
        this.categoryElement.textContent = category;
        this.categoryElement.className = `card__category ${categoryMap[category]}`;
    }

    protected set buttonText (text: string) {
        this.buyButton.textContent = text;
    }

    protected set buttonDisable(value: boolean) {
        this.buyButton.disabled = value;
    }
}