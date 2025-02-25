/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module remove-format/removeformatediting
 */
import RemoveFormatCommand from './removeformatcommand.js';
import { Plugin, RemoveFormatEditing as RemoveFormatEditingOriginal } from 'ckeditor5';
/**
 * The remove format editing plugin.
 *
 * It registers the {@link module:remove-format/removeformatcommand~RemoveFormatCommand removeFormat} command.
 */
export default class RemoveFormatEditing extends RemoveFormatEditingOriginal {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        editor.commands.add('removeFormat', new RemoveFormatCommand(editor));
    }
}
