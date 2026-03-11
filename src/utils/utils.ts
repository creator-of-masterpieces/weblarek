export function pascalToKebab(value: string): string {
    return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function isSelector(x: any): x is string {
    return (typeof x === "string") && x.length > 1;
}

export function isEmpty(value: any): boolean {
    return value === null || value === undefined;
}

export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

export function ensureAllElements<T extends HTMLElement>(selectorElement: SelectorCollection<T>, context: HTMLElement = document as unknown as HTMLElement): T[] {
    if (isSelector(selectorElement)) {
        return Array.from(context.querySelectorAll(selectorElement)) as T[];
    }
    if (selectorElement instanceof NodeList) {
        return Array.from(selectorElement) as T[];
    }
    if (Array.isArray(selectorElement)) {
        return selectorElement;
    }
    throw new Error(`Unknown selector element`);
}

export type SelectorElement<T> = T | string;

/**
 * Гарантирует получение одного HTML‑элемента на основе селектора или готового элемента.
 *
 * @template T - Тип HTML‑элемента, который должен быть подтипом HTMLElement.
 * Позволяет сохранить конкретный тип элемента (например, HTMLButtonElement).
 *
 * @param {SelectorElement<T>} selectorElement - Селектор (строка) для поиска элемента
 * в DOM либо готовый HTML‑элемент типа T.
 *   - Если передана строка, функция выполнит поиск элементов по этому селектору.
 *   - Если передан готовый элемент, он будет возвращён как есть (с приведением типа).
 *
 * @param {HTMLElement} [context] - Необязательный контекст поиска — элемент,
 * внутри которого выполняется поиск. Если не указан, поиск идёт по всему документу.
 *
 * @returns {T} Найденный или переданный HTML‑элемент строго типизированным (типа T).
 *
 * @throws {Error} Если селектор не нашёл ни одного элемента в DOM
 * (сообщение: `selector ${selectorElement} return nothing`).
 *
 * @throws {Error} Если входной параметр не является ни селектором (строкой),
 * ни HTML‑элементом (сообщение: 'Unknown selector element').
 *
 * @example
 * // Пример 1: передача селектора, который находит один элемент
 * const button = ensureElement<HTMLButtonElement>('#submit-btn');
 * // Результат: HTMLButtonElement (если элемент существует)
 *
 * @example
 * // Пример 2: передача готового HTML‑элемента
 * const existingElement = document.querySelector('div');
 * const result = ensureElement<HTMLDivElement>(existingElement);
 * // Результат: тот же элемент, что и existingElement, но строго типизированный как HTMLDivElement
 *
 * @example
 * // Пример 3: передача селектора с контекстом поиска
 * const container = document.getElementById('my-container');
 * const item = ensureElement<HTMLElement>('.item', container);
 * // Поиск элемента с классом .item внутри элемента #my-container
 *
 * @example
 * // Пример 4: передача селектора, который ничего не находит
 * ensureElement<HTMLElement>('.non-existent-class');
 * // Бросает ошибку: "selector .non-existent-class return nothing"
 *
 * @example
 * // Пример 5: передача некорректного значения
 * ensureElement<HTMLElement>(123);
 * // Бросает ошибку: "Unknown selector element"
 *
 * @example
 * // Пример 6: поиск внутри конкретного родительского элемента
 * // Допустим, у нас есть структура:
 * // <div id="sidebar">
 * //   <button class="action-btn">Действие 1</button>
 * //   <button class="action-btn">Действие 2</button>
 * // </div>
 * // <div id="main-content">
 * //   <button class="action-btn">Главное действие</button>
 * // </div>
 *
 * // Находим кнопку внутри сайдбара
 * const sidebar = document.getElementById('sidebar');
 * const sidebarButton = ensureElement<HTMLButtonElement>('.action-btn', sidebar);
 * // Будет найдена первая кнопка внутри #sidebar (если есть),
 * // даже если есть другие кнопки с таким же классом в других частях страницы.
 * // Если в сайдбаре несколько кнопок .action-btn, будет выдано предупреждение,
 * // и вернётся последняя из них.
 *
 * @remarks
 * - При нахождении нескольких элементов по селектору выводится предупреждение в консоль
 *   (console.warn), а возвращается **последний** найденный элемент (через pop()).
 * - Для корректной работы функция зависит от вспомогательных функций:
 *   isSelector (определяет, является ли параметр селектором) и
 *   ensureAllElements (выполняет поиск всех элементов по селектору).
 * - Использование дженерика T предполагает, что вызывающий гарантирует соответствие типа.
 *   При неверном указании T возможны ошибки во время выполнения.
 */
export function ensureElement<T extends HTMLElement>(
    selectorElement: SelectorElement<T>,
    context?: HTMLElement
): T {
    if (isSelector(selectorElement)) {
        const elements = ensureAllElements<T>(selectorElement, context);
        if (elements.length > 1) {
            console.warn(`selector ${selectorElement} return more then one element`);
        }
        if (elements.length === 0) {
            throw new Error(`selector ${selectorElement} return nothing`);
        }
        return elements.pop() as T;
    }
    if (selectorElement instanceof HTMLElement) {
        return selectorElement as T;
    }
    throw new Error('Unknown selector element');
}

export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
    const template = ensureElement(query) as HTMLTemplateElement;
    if (!template.content.firstElementChild) {
        throw new Error(`Template ${query} has no content`);
    }
    return template.content.firstElementChild.cloneNode(true) as T;
}

export function bem(block: string, element?: string, modifier?: string): { name: string, class: string } {
    let name = block;
    if (element) name += `__${element}`;
    if (modifier) name += `_${modifier}`;
    return {
        name,
        class: `.${name}`
    };
}

export function getObjectProperties(obj: object, filter?: (name: string, prop: PropertyDescriptor) => boolean): string[] {
    return Object.entries(
        Object.getOwnPropertyDescriptors(
            Object.getPrototypeOf(obj)
        )
    )
        .filter(([name, prop]: [string, PropertyDescriptor]) => filter ? filter(name, prop) : (name !== 'constructor'))
        .map(([name,]) => name);
}

/**
 * Устанавливает dataset атрибуты элемента
 */
export function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement, data: T) {
    for (const key in data) {
        el.dataset[key] = String(data[key]);
    }
}

/**
 * Получает типизированные данные из dataset атрибутов элемента
 */
export function getElementData<T extends Record<string, unknown>>(el: HTMLElement, scheme: Record<string, Function>): T {
    const data: Partial<T> = {};
    for (const key in el.dataset) {
        data[key as keyof T] = scheme[key](el.dataset[key]);
    }
    return data as T;
}

/**
 * Проверка на простой объект
 */
export function isPlainObject(obj: unknown): obj is object {
    const prototype = Object.getPrototypeOf(obj);
    return prototype === Object.getPrototypeOf({}) ||
        prototype === null;
}

export function isBoolean(v: unknown): v is boolean {
    return typeof v === 'boolean';
}

/**
 * Фабрика DOM-элементов в простейшей реализации
 * здесь не учтено много факторов
 * в интернет можно найти более полные реализации
 */
export function createElement<
    T extends HTMLElement
>(
    tagName: keyof HTMLElementTagNameMap,
    props?: Partial<Record<keyof T, string | boolean | object>>,
    children?: HTMLElement | HTMLElement []
): T {
    const element = document.createElement(tagName) as T;
    if (props) {
        for (const key in props) {
            const value = props[key];
            if (isPlainObject(value) && key === 'dataset') {
                setElementData(element, value);
            } else {
                // @ts-expect-error fix indexing later
                element[key] = isBoolean(value) ? value : String(value);
            }
        }
    }
    if (children) {
        for (const child of Array.isArray(children) ? children : [children]) {
            element.append(child);
        }
    }
    return element;
}
