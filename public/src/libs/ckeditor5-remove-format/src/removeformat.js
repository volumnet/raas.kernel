/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module remove-format/removeformat
 */
import RemoveFormatEditing from './removeformatediting.js';
import { Plugin, RemoveFormatUI, RemoveFormat as RemoveFormatOriginal } from 'ckeditor5';
/**
 * The remove format plugin.
 *
 * This is a "glue" plugin which loads the {@link module:remove-format/removeformatediting~RemoveFormatEditing}
 * and {@link module:remove-format/removeformatui~RemoveFormatUI} plugins.
 *
 * For a detailed overview, check out the {@glink features/remove-format remove format} feature documentation.
 */
export default class RemoveFormat extends RemoveFormatOriginal {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [RemoveFormatEditing, RemoveFormatUI];
    }
}
