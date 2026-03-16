import { IEvents } from '../../base/Events';
import {IBaseCardView, TCardClickHandler} from "../../../types";
import {BaseCardView} from "./BaseCardView.ts";
import {ensureElement} from "../../../utils/utils.ts";

export interface IBasketCardView extends IBaseCardView {
    set index(index: number);
}

export class BasketCardView extends BaseCardView<IBasketCardView> implements IBasketCardView {
    protected deleteButton: HTMLButtonElement;
    protected indexElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, onClick: TCardClickHandler) {
        super(container, events);
        this.indexElement = ensureElement('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this.deleteButton.addEventListener('click', () => onClick({id: this.cardId}));
    }

    set index(index: number) {
        this.indexElement.textContent = String(index + 1);
    }
}