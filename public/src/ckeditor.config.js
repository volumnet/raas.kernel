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

CKEDITOR.on('instanceReady', function( ev ) {
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
