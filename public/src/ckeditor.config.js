const lang = document.documentElement.lang;
if (
  lang == "ru" &&
  window.CKEDITOR_TRANSLATIONS &&
  window.CKEDITOR_TRANSLATIONS.ru &&
  window.CKEDITOR_TRANSLATIONS.ru.dictionary
) {
  window.CKEDITOR_TRANSLATIONS.ru.dictionary.Source = "Источник";
}

window.ckEditor5Config = {
  language: document.documentElement.lang,
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: [
      "sourceEditing",
      "|",
      "undo",
      "redo",
      "|",
      "findAndReplace",
      "selectAll",
      "|",
      "filemanagerimg",
      "filemanagerfile",
      "link",
      "insertTable",
      "horizontalLine",
      "specialCharacters",
      "pageBreak",
      "htmlEmbed",
      "mediaEmbed",
      "-",
      "heading",
      "showBlocks",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "subscript",
      "superscript",
      "removeFormat",
      "|",
      "numberedList",
      "bulletedList",
      "outdent",
      "indent",
      "blockQuote",
      "alignment",
      "|",
      "fontColor",
      "fontBackgroundColor",
      "-",
    ],
  },
  image: {
    toolbar: [
      "imageStyle:block",
      "imageStyle:inline",
      "imageStyle:alignLeft",
      "imageStyle:alignRight",
      "|",
      "toggleImageCaption",
      "imageTextAlternative",
      "|",
      "linkImage",
    ],
    insert: {
      type: "auto",
      integrations: ["upload", "assetManager", "url"],
    },
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
    ],
  },
  mediaEmbed: {
    previewsInData: true,
  },
  link: {
    decorators: {
      toggleDownloadable: {
        mode: "manual",
        label: "Downloadable",
        attributes: {
          download: "file",
        },
      },
      openInNewTab: {
        mode: "manual",
        label: "Open in a new tab",
        defaultValue: false,
        attributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      },
    },
  },
  fontColor: {
    colorPicker: {
      format: "hex",
    },
  },
  fontBackgroundColor: {
    colorPicker: {
      format: "hex",
    },
  },
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      { model: "div", view: "div", title: "<DIV>" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      { model: "pre", view: "pre", title: "<PRE>" },
    ],
  },
  htmlSupport: {
    allow: [
      {
        // name: /.*/,
        attributes: true,
        classes: true,
        styles: true,
      },
    ],
  },
};
