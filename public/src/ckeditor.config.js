

const lang = document.documentElement.lang;
if ((lang == 'ru') && 
    window.CKEDITOR_TRANSLATIONS && 
    window.CKEDITOR_TRANSLATIONS.ru && 
    window.CKEDITOR_TRANSLATIONS.ru.dictionary
) {
    window.CKEDITOR_TRANSLATIONS.ru.dictionary.Source = 'Источник';
}

window.ckEditorConfig = {
    extraPlugins: [
        'find', 
        'selectall', 
        'pagebreak', 
        'iframe', 
        'div', 
        'justify', 
        'bidi', 
        'colorbutton', 
        'showblocks'
    ],
    autoParagraph: false,
    language: 'ru',
    height: 320,
    contentsCss: ['/css/ckeditor.css'],
    skin: 'moono',

    filebrowserUploadMethod: 'form',
    filebrowserBrowseUrl: '/vendor/sunhater/kcfinder/browse.php?type=file',
    filebrowserImageBrowseUrl: '/vendor/sunhater/kcfinder/browse.php?type=image',
    filebrowserFlashBrowseUrl: '/vendor/sunhater/kcfinder/browse.php?type=file',
    filebrowserUploadUrl: '/vendor/sunhater/kcfinder/upload.php?type=file',
    filebrowserImageUploadUrl: '/vendor/sunhater/kcfinder/upload.php?type=image',
    filebrowserFlashUploadUrl: '/vendor/sunhater/kcfinder/upload.php?type=file',


    iframe_attributes: {},
    
    toolbar: [
        { 
            name: 'document', 
            items : [
                'Source',
            ],
        },
        { 
            name: 'clipboard', 
            items: [
                'Cut', 
                'Copy', 
                'Paste', 
                'PasteText', 
                '-', 
                'Undo', 
                'Redo',
            ],
        },
        { 
            name: 'editing', 
            items: [
                'Find', 
                'Replace', 
                '-', 
                'SelectAll', 
                '-', 
                'Scayt',
            ],
        },
        { 
            name: 'insert', 
            items: [
                'Image', 
                'Table', 
                'HorizontalRule', 
                'SpecialChar', 
                'PageBreak', 
                'Iframe',
            ],
        },
        { 
            name: 'links', 
            items: [
                'Link', 
                'Unlink', 
                'Anchor',
            ],
        },
        '/', 
        { 
            name: 'basicstyles', 
            items: [
                'Bold', 
                'Italic', 
                'Underline', 
                'Strike', 
                'Subscript', 
                'Superscript', 
                '-', 
                'RemoveFormat',
            ],
        },
        { 
            name: 'paragraph', 
            items: [
                'NumberedList', 
                'BulletedList', 
                '-', 
                'Outdent', 
                'Indent', 
                '-', 
                'Blockquote', 
                'CreateDiv',
                '-', 
                'JustifyLeft', 
                'JustifyCenter', 
                'JustifyRight', 
                'JustifyBlock', 
                '-', 
                'BidiLtr', 
                'BidiRtl',
            ],
        },
        { 
            name: 'colors', 
            items: [
                'TextColor', 
                'BGColor',
            ],
        },
        '/',
        { 
            name: 'styles', 
            items: [
                'Format',
            ],
        },
        { 
            name: 'tools', 
            items: [
                'Maximize', 
                'ShowBlocks', 
                '-', 
                'About',
            ],
        }
    ],
    removeButtons: '',
    allowedContent: true,
};

if (window.CKEDITOR) {
    window.CKEDITOR.on('instanceReady', function( ev ) {
        ev.editor.dataProcessor.writer.setRules('p', {
            indent : false, 
            breakBeforeOpen : true, 
            breakAfterOpen : false, 
            breakBeforeClose : false, 
            breakAfterClose : true
        });
        ev.editor.dataProcessor.writer.setRules('h1', {
            indent : false, 
            breakBeforeOpen : true, 
            breakAfterOpen : false, 
            breakBeforeClose : false, 
            breakAfterClose : true
        });
        ev.editor.dataProcessor.writer.setRules('h2', {
            indent : false, 
            breakBeforeOpen : true, 
            breakAfterOpen : false, 
            breakBeforeClose : false, 
            breakAfterClose : true
        });
        ev.editor.dataProcessor.writer.setRules('h3', {
            indent : false, 
            breakBeforeOpen : true, 
            breakAfterOpen : false, 
            breakBeforeClose : false, 
            breakAfterClose : true
        });
        ev.editor.dataProcessor.writer.setRules('h4', {
            indent : false, 
            breakBeforeOpen : true, 
            breakAfterOpen : false, 
            breakBeforeClose : false, 
            breakAfterClose : true
        });
        ev.editor.dataProcessor.writer.setRules('h5', {
            indent : false, 
            breakBeforeOpen : true, 
            breakAfterOpen : false, 
            breakBeforeClose : false, 
            breakAfterClose : true
        });
        ev.editor.dataProcessor.writer.setRules('h6', {
            indent : false, 
            breakBeforeOpen : true, 
            breakAfterOpen : false, 
            breakBeforeClose : false, 
            breakAfterClose : true
        });
    });
}


window.ckEditor5Config = {
    language: document.documentElement.lang,
    toolbar:{
        shouldNotGroupWhenFull: true,
        items: [ 
            'sourceEditing', '|', 
            'undo', 'redo', '|', 
            'findAndReplace', 'selectAll', '|', 
            'flmngrimg', 'flmngrfile', 'link', 'insertTable', 'horizontalLine', 'specialCharacters', 'pageBreak', 'htmlEmbed', 'mediaEmbed', '-', 
            'heading', 'showBlocks', '|', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'removeFormat', '|',
            'numberedList', 'bulletedList', 'outdent', 'indent', 'blockQuote', 'alignment', '|',
            'fontColor', 'fontBackgroundColor', '-',
        ],
    },
    image: {
        toolbar: [
            'imageStyle:block', 'imageStyle:inline', 'imageStyle:alignLeft', 'imageStyle:alignRight', '|',
            'toggleImageCaption', 'imageTextAlternative', '|',
            'linkImage',
        ],
        insert: {
            type: 'auto',
            integrations: [ /*'upload', 'assetManager', */'url' ]
        },
    },
    table: {
        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties' ],
    },
    mediaEmbed: {
        previewsInData: true,
    },
    link: {
        decorators: {
            toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                    download: 'file'
                }
            },
            openInNewTab: {
                mode: 'manual',
                label: 'Open in a new tab',
                defaultValue: false,
                attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }
            }
        }
    },
    fontColor: {
        colorPicker: {
            format: 'hex'
        },
    },
    fontBackgroundColor: {
        colorPicker: {
            format: 'hex',
        },
    },
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'div', view: 'div', title: '<DIV>' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'pre', view: 'pre', title: '<PRE>' },
        ]
    },
    htmlSupport: {
        allow: [
            {
                // name: /.*/,
                attributes: true,
                classes: true,
                styles: true,
            }
        ]
    },
    Flmngr: {
        apiKey: "FLMNFLMN", // or your own API key
    },
};

