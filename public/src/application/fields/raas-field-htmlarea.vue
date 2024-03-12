<style lang="scss">
.ck-editor__editable {
    max-height: 320px;
}
.ck.ck-sticky-panel .ck-sticky-panel__content_sticky {
    position: relative !important;
    z-index: 1 !important;
}
</style>

<template>
  <div>
    <ckeditor :editor="editor" :value="pValue" @input="pValue = $event; $emit('input', $event)" :config="ckEditorConfig"></ckeditor>
    <input type="hidden" :name="name" :value="beautifiedHTML">
  </div>
</template>

<script>
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Bold, Italic, Underline, Strikethrough, Subscript, Superscript, } from '@ckeditor/ckeditor5-basic-styles';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { SelectAll } from '@ckeditor/ckeditor5-select-all';
import { Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, ImageInsert } from '@ckeditor/ckeditor5-image';
import { Link, LinkImage } from '@ckeditor/ckeditor5-link';
import { Table, TableCellProperties, TableProperties, TableToolbar } from '@ckeditor/ckeditor5-table';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { SpecialCharacters, SpecialCharactersEssentials } from '@ckeditor/ckeditor5-special-characters';
import { PageBreak } from '@ckeditor/ckeditor5-page-break';
import { HtmlComment } from '@ckeditor/ckeditor5-html-support';
import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { List } from '@ckeditor/ckeditor5-list';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Font } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import { ShowBlocks } from '@ckeditor/ckeditor5-show-blocks';
import { Clipboard } from '@ckeditor/ckeditor5-clipboard';
import Flmngr from "app/libs/flmngr-ckeditor5/src/flmngr";
import { html as htmlBeautifier } from 'js-beautify';

import RAASFieldHTMLArea from 'cms/application/fields/raas-field-htmlarea.vue.js';


export default {
    mixins: [RAASFieldHTMLArea],
    props: {
        name: {
            type: String,
        },
    },
    methods: {
        checkCKEditor() {
            // Пустое (должно переопределять стандартное)
        },
    },
    computed: {
        beautifiedHTML() {
            return htmlBeautifier(this.pValue);
        },
        editor() {
            return ClassicEditor;
        },
        ckEditorConfig() {
            return Object.assign({
                plugins: [ 
                    SourceEditing, 
                    Essentials, 
                    Paragraph, 
                    FindAndReplace, 
                    SelectAll, 
                    Image, 
                    ImageToolbar, 
                    ImageCaption, 
                    ImageStyle, 
                    ImageResize, 
                    ImageInsert,
                    LinkImage, 
                    Table, 
                    TableCellProperties, 
                    TableProperties, 
                    TableToolbar,
                    HorizontalLine,
                    SpecialCharacters, 
                    SpecialCharactersEssentials,
                    PageBreak,
                    HtmlComment,
                    HtmlEmbed,
                    MediaEmbed,
                    Link,
                    Bold, 
                    Italic, 
                    Underline, 
                    Strikethrough, 
                    Subscript, 
                    Superscript,
                    RemoveFormat, 
                    function(editor) {
                        // Extend the editor schema and mark the "linkHref" model attribute as formatting.
                        editor.model.schema.setAttributeProperties( 'linkHref', {
                            isFormatting: true
                        } );
                    },
                    List,
                    Indent, 
                    IndentBlock, 
                    BlockQuote,
                    Alignment,
                    Font,
                    Heading,
                    GeneralHtmlSupport,
                    ShowBlocks,
                    Clipboard,
                    Flmngr,
                ],
            }, (window.ckEditor5Config || {}));
        },
    },
}
</script>