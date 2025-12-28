<style lang="scss">
.ck-editor__editable,
.ck-source-editing-area,
.ck-source-editing-area textarea {
  max-height: 320px;
}
.ck-source-editing-area textarea {
  overflow: auto !important;
}
.ck.ck-sticky-panel .ck-sticky-panel__content_sticky {
  position: relative !important;
  z-index: 1 !important;
}
</style>

<template>
  <div>
    <ckeditor
      :editor="editor"
      :model-value="pValue"
      :config="ckEditorConfig"
      @ready="onMounted($event)"
      @update:model-value="$emit('update:modelValue', (pValue = $event))"
    />
    <input
      type="hidden"
      :name="name"
      :value="beautifiedHTML"
      :disabled="!!$attrs.disabled"
    />
  </div>
</template>

<script>
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  SourceEditing,
  FindAndReplace,
  SelectAll,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageInsert,
  Link,
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
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

import { RemoveFormat } from "app/libs/ckeditor5-remove-format";
import FileManager from "app/libs/filemanager-ckeditor5/filemanager";
import { html as htmlBeautifier } from "js-beautify";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import RAASFieldHTMLArea from "cms/application/fields/raas-field-htmlarea.vue.js";

export default {
  mixins: [RAASFieldHTMLArea],
  components: {
    ckeditor: Ckeditor,
  },
  props: {
    name: {
      type: String,
    },
  },
  data() {
    return {
      instance: null,
    };
  },
  methods: {
    checkCKEditor() {
      // Пустое (должно переопределять стандартное)
    },
    /**
     * Обработчик готовности CKEditor'а
     * Костыль для сохранения данных из режима источника
     * @param  {ClassicEditor} $event Экземпляр CKEditor'а
     */
    onMounted($event) {
      this.instance = $event;
      const sourceEditing = $event.plugins.get("SourceEditing");
      sourceEditing.on(
        "change:isSourceEditingMode",
        (_eventInfo, _name, value, _oldValue) => {
          const sourceEditingTextarea =
            $event.editing.view.getDomRoot()?.nextSibling?.firstChild;
          if (!sourceEditingTextarea) {
            return; // Находимся не в режиме источника
          }
          sourceEditingTextarea.addEventListener("input", () => {
            sourceEditing.updateEditorData();
          });
        }
      );
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
      return Object.assign(
        {
          licenseKey: "GPL",
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
            function (editor) {
              // Extend the editor schema and mark the "linkHref" model attribute as formatting.
              editor.model.schema.setAttributeProperties("linkHref", {
                isFormatting: true,
              });
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
            FileManager,
          ],
        },
        window.ckEditor5Config || {}
      );
    },
  },
};
</script>
