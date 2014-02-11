/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.editorConfig = function( config )
{
    // Define changes to default configuration here. For example:
    // config.uiColor = '#AADC6E';
    config.autoParagraph = false;
    config.language = 'ru';
    config.height = 320;
    config.contentsCss = ['/css/ckeditor.css'];

    config.filebrowserBrowseUrl = CKEDITOR.basePath + 'filemanager/browse.php?type=file';
    config.filebrowserImageBrowseUrl = CKEDITOR.basePath + 'filemanager/browse.php?type=image';
    config.filebrowserFlashBrowseUrl = CKEDITOR.basePath + 'filemanager/browse.php?type=file';
    config.filebrowserUploadUrl = CKEDITOR.basePath + 'filemanager/upload.php?type=file';
    config.filebrowserImageUploadUrl = CKEDITOR.basePath + 'filemanager/upload.php?type=image';
    config.filebrowserFlashUploadUrl = CKEDITOR.basePath + 'filemanager/upload.php?type=file';
    
    config.toolbar = 'RAASUser';
    config.allowedContent = true;

  /*config.toolbar_RAASUser =
  [
      ['Cut','Copy','Paste','PasteText','PasteFromWord'],
      ['Undo','Redo','-','RemoveFormat'],
      ['FontSize','Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
      ['NumberedList','BulletedList']
  ];*/
  
  config.toolbar_RAASUser = [
      { name: 'document', items : [ 'Source'/*, 'Save'*/ ] },
    	{ name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','-','Undo','Redo' ] },
    	{ name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
    	{ name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','SpecialChar','PageBreak','Iframe' ] },
      { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
    	
      '/', 
      { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
    	{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
    	'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
      { name: 'colors', items : [ 'TextColor','BGColor' ] },
    	'/',
      { name: 'styles', items : [ 'Format' ] },
    	{ name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
  ];

};
CKEDITOR.on( 'instanceReady', function( ev ) {
    ev.editor.dataProcessor.writer.setRules('p', {indent : false, breakBeforeOpen : true, breakAfterOpen : false, breakBeforeClose : false, breakAfterClose : true});
    ev.editor.dataProcessor.writer.setRules('h1', {indent : false, breakBeforeOpen : true, breakAfterOpen : false, breakBeforeClose : false, breakAfterClose : true});
    ev.editor.dataProcessor.writer.setRules('h2', {indent : false, breakBeforeOpen : true, breakAfterOpen : false, breakBeforeClose : false, breakAfterClose : true});
    ev.editor.dataProcessor.writer.setRules('h3', {indent : false, breakBeforeOpen : true, breakAfterOpen : false, breakBeforeClose : false, breakAfterClose : true});
    ev.editor.dataProcessor.writer.setRules('h4', {indent : false, breakBeforeOpen : true, breakAfterOpen : false, breakBeforeClose : false, breakAfterClose : true});
    ev.editor.dataProcessor.writer.setRules('h5', {indent : false, breakBeforeOpen : true, breakAfterOpen : false, breakBeforeClose : false, breakAfterClose : true});
    ev.editor.dataProcessor.writer.setRules('h6', {indent : false, breakBeforeOpen : true, breakAfterOpen : false, breakBeforeClose : false, breakAfterClose : true});
});
