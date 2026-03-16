import { BaseCardView } from "./BaseCardView";
import { IEvents } from '../../base/Events';
import {IBaseCardView, TCardClickHandler} from "../../../types";
import {ensureElement} from "../../../utils/utils.ts";

// Интерфейс выбранной карточки товара
export interface IPreviewCardView extends IBaseCardView {
    set description (text: string);
    set image (image: Record<string, string>);
    set buttonText (text: 'Удалить из корзины' | 'Купить' | 'Недоступно');
    set buttonDisable(value: boolean);
}

export class PreviewCardView extends BaseCardView<IPreviewCardView> implements IPreviewCardView {
    protected cardDescriptionElement: HTMLElement;
    protected buyButton: HTMLButtonElement;
    protected cardImageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents, onClick: TCardClickHandler) {
        super(container, events);
        this.cardDescriptionElement = ensureElement('.card__text', container);
        this.buyButton = ensureElement<HTMLButtonElement>('.card__button', container);
        this.cardImageElement = ensureElement<HTMLImageElement>('.card__image', container);

        // Слушатель клика по кнопке купить
        this.buyButton.addEventListener('click', () => onClick({id: this.cardId}))
    }

    set description(text: string) {
        this.cardDescriptionElement.textContent = text;
    }

    set image (image: Record<string, string>) {
        this.setImage(this.cardImageElement, image.src, image.alt);
    }

    set buttonText (text: 'Удалить из корзины' | 'Купить' | 'Недоступно') {
        this.buyButton.textContent = text;
    }

    set buttonDisable(value: boolean) {
        this.buyButton.disabled = value;
    }
}