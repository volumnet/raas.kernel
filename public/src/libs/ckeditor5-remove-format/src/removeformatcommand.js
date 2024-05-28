/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { Command } from 'ckeditor5/src/core.js';
import { first } from 'ckeditor5/src/utils.js';

/**
 * Разрешенные HTML-атрибуты
 * @type {Object} <pre><code>object<
 *     string[] Название CKEditor-атрибута, либо пустая строка, если HTML-атрибуты разрешены для всех CKEditor-атрибутов
 *     :
 *     string[] Список разрешенных HTML-атрибутов в нижнем регистре
 * ></code></pre>
 */
const allowedHtmlAttrs = {
    '': [],
};

/**
 * The remove format command.
 *
 * It is used by the {@link module:remove-format/removeformat~RemoveFormat remove format feature}
 * to clear the formatting in the selection.
 *
 * ```ts
 * editor.execute( 'removeFormat' );
 * ```
 */
export default class RemoveFormatCommand extends Command {
    /**
     * @inheritDoc
     */
    refresh() {
        const model = this.editor.model;
        this.isEnabled = !!first(this._getFormattingItems(model.document.selection, model.schema));
    }
    /**
     * @inheritDoc
     */
    execute() {
        const model = this.editor.model;
        const schema = model.schema;
        model.change(writer => {
            for (const item of this._getFormattingItems(model.document.selection, schema)) {
                this.clearFormattingAttributes(item, schema, writer);
            }
        });
    }

    /**
     * Очищает атрибуты форматирования
     * @param {Object} item Элемент для очистки
     * @param {Schema} schema Схема редактора
     * @param {Writer} writer Писатель редактора
     */
    clearFormattingAttributes(item, schema, writer)
    {
        let itemRange = null;
        if (!item.is('selection')) {
            itemRange = writer.createRangeOn(item);
        }
        for (const attributeData of this._getFormattingAttributes(item, schema)) {
            // console.log(attributeData);
            // Очистку через writer делаем всегда, чтобы обновить значение
            if (item.is('selection')) {
                writer.removeSelectionAttribute(attributeData.ckAttributeName);
            } else {
                writer.removeAttribute(attributeData.ckAttributeName, itemRange);
            }
            if (attributeData.htmlAttributesNames && attributeData.htmlAttributesNames.length) {
                for (let htmlAttributeName of attributeData.htmlAttributesNames) {
                    delete attributeData.ckAttributeValue.attributes[htmlAttributeName];
                }
            }
            if (attributeData.ckAttributeValue.styles) {
                delete attributeData.ckAttributeValue.styles;
            }
            if (attributeData.ckAttributeValue.classes) {
                delete attributeData.ckAttributeValue.classes;
            }
        }
    }

    /**
     * Returns an iterable of items in a selection (including the selection itself) that have formatting model
     * attributes to be removed by the feature.
     *
     * @param schema The schema describing the item.
     */
    *_getFormattingItems(selection, schema) {
        const itemHasRemovableFormatting = (item) => {
            return !!first(this._getFormattingAttributes(item, schema));
        };
        // Check formatting on selected items that are not blocks.
        for (const curRange of selection.getRanges()) {
            for (const item of curRange.getItems()) {
                if (!schema.isBlock(item) && itemHasRemovableFormatting(item)) {
                    yield item;
                }
            }
        }
        // Check formatting from selected blocks.
        for (const block of selection.getSelectedBlocks()) {
            if (itemHasRemovableFormatting(block)) {
                yield block;
            }
        }
        // Finally the selection might be formatted as well, so make sure to check it.
        if (itemHasRemovableFormatting(selection)) {
            yield selection;
        }
    }
    /**
     * Returns an iterable of formatting attributes of a given model item.
     *
     * **Note:** Formatting items have the `isFormatting` property set to `true`.
     *
     * @param schema The schema describing the item.
     * //@returns The names of formatting attributes found in a given item.
     * @return {object} <pre><code>{
     *     ckAttributeName: string Наименование CKEditor-атрибута
     *     ckAttributeValue: object Объект CKEditor-атрибута
     *     isCKFormatting: bool Нужно ли очищать CKEditor-атрибут 
     *         через writer.removeSelectionAttribute/writer.removeAttribute
     *     htmlAttributesNames:? string[] Список названий HTML-атрибутов для очистки
     * }</code></pre>
     */
    *_getFormattingAttributes(item, schema) {
        // console.log(item, item.getAttributes());
        for (const [attributeName, attributeValue] of item.getAttributes()) {
            let dispatch = false;
            const result = {
                ckAttributeName: attributeName,
                ckAttributeValue: attributeValue,
                isCKFormatting: false,
            };
            const attributeProperties = schema.getAttributeProperties(attributeName);
            // console.log(item, attributeName, attributeValue, attributeProperties, attributeProperties.isFormatting);
            if (attributeProperties && attributeProperties.isFormatting) {
                result.isCKFormatting = true;
                dispatch = true;
                // yield attributeName;
            }
            const htmlAttributesToClear = this.getHtmlAttributesToClear(attributeName, attributeValue);
            if (htmlAttributesToClear.length || attributeValue.classes || attributeValue.styles) {
                result.htmlAttributesObject = attributeValue.attributes;
                dispatch = true;
                if (htmlAttributesToClear.length) {
                    result.htmlAttributesNames = htmlAttributesToClear;
                }
            }
            if (dispatch) {
                yield result;
            }
        }
    }


    /**
     * Получает список HTML-атрибутов для очистки
     * @param {string} ckAttributeName Название CKEditor-атрибута для проверки
     * @param {object} ckAttributeValue Значение CKEditor-атрибута для проверки
     * @return {string[]}
     */
    getHtmlAttributesToClear(ckAttributeName, ckAttributeValue) {
        const result = [];
        for (const htmlAttributeName in ckAttributeValue.attributes) {
            if (allowedHtmlAttrs[''] && allowedHtmlAttrs[''].indexOf(htmlAttributeName.toLowerCase()) != -1) {
                continue; // HTML-атрибут разрешен для всех элементов (CKEditor-атрибутов)
            }
            if (allowedHtmlAttrs[ckAttributeName] && 
                (allowedHtmlAttrs[ckAttributeName].indexOf(htmlAttributeName.toLowerCase()) != -1)
            ) {
                continue; // HTML-атрибут разрешен для конкретного элемента (CKEditor-атрибута)
            }
            result.push(htmlAttributeName);
        }
        return result;
    }
}
