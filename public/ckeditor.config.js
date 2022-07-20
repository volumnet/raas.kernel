/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/vendor/volumnet/raas.kernel/public/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/src/ckeditor.config.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/src/ckeditor.config.js":
/*!***************************************!*\
  !*** ./public/src/ckeditor.config.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

window.ckEditorConfig = {
  extraPlugins: ['find', 'selectall', 'pagebreak', 'iframe', 'div', 'justify', 'bidi', 'colorbutton', 'showblocks'],
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
  toolbar: [{
    name: 'document',
    items: ['Source']
  }, {
    name: 'clipboard',
    items: ['Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo']
  }, {
    name: 'editing',
    items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt']
  }, {
    name: 'insert',
    items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak', 'Iframe']
  }, {
    name: 'links',
    items: ['Link', 'Unlink', 'Anchor']
  }, '/', {
    name: 'basicstyles',
    items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
  }, {
    name: 'paragraph',
    items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
  }, {
    name: 'colors',
    items: ['TextColor', 'BGColor']
  }, '/', {
    name: 'styles',
    items: ['Format']
  }, {
    name: 'tools',
    items: ['Maximize', 'ShowBlocks', '-', 'About']
  }],
  removeButtons: '',
  allowedContent: true
};
CKEDITOR.on('instanceReady', function (ev) {
  ev.editor.dataProcessor.writer.setRules('p', {
    indent: false,
    breakBeforeOpen: true,
    breakAfterOpen: false,
    breakBeforeClose: false,
    breakAfterClose: true
  });
  ev.editor.dataProcessor.writer.setRules('h1', {
    indent: false,
    breakBeforeOpen: true,
    breakAfterOpen: false,
    breakBeforeClose: false,
    breakAfterClose: true
  });
  ev.editor.dataProcessor.writer.setRules('h2', {
    indent: false,
    breakBeforeOpen: true,
    breakAfterOpen: false,
    breakBeforeClose: false,
    breakAfterClose: true
  });
  ev.editor.dataProcessor.writer.setRules('h3', {
    indent: false,
    breakBeforeOpen: true,
    breakAfterOpen: false,
    breakBeforeClose: false,
    breakAfterClose: true
  });
  ev.editor.dataProcessor.writer.setRules('h4', {
    indent: false,
    breakBeforeOpen: true,
    breakAfterOpen: false,
    breakBeforeClose: false,
    breakAfterClose: true
  });
  ev.editor.dataProcessor.writer.setRules('h5', {
    indent: false,
    breakBeforeOpen: true,
    breakAfterOpen: false,
    breakBeforeClose: false,
    breakAfterClose: true
  });
  ev.editor.dataProcessor.writer.setRules('h6', {
    indent: false,
    breakBeforeOpen: true,
    breakAfterOpen: false,
    breakBeforeClose: false,
    breakAfterClose: true
  });
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9ja2VkaXRvci5jb25maWcuanMiXSwibmFtZXMiOlsid2luZG93IiwiY2tFZGl0b3JDb25maWciLCJleHRyYVBsdWdpbnMiLCJhdXRvUGFyYWdyYXBoIiwibGFuZ3VhZ2UiLCJoZWlnaHQiLCJjb250ZW50c0NzcyIsInNraW4iLCJmaWxlYnJvd3NlclVwbG9hZE1ldGhvZCIsImZpbGVicm93c2VyQnJvd3NlVXJsIiwiZmlsZWJyb3dzZXJJbWFnZUJyb3dzZVVybCIsImZpbGVicm93c2VyRmxhc2hCcm93c2VVcmwiLCJmaWxlYnJvd3NlclVwbG9hZFVybCIsImZpbGVicm93c2VySW1hZ2VVcGxvYWRVcmwiLCJmaWxlYnJvd3NlckZsYXNoVXBsb2FkVXJsIiwidG9vbGJhciIsIm5hbWUiLCJpdGVtcyIsInJlbW92ZUJ1dHRvbnMiLCJhbGxvd2VkQ29udGVudCIsIkNLRURJVE9SIiwib24iLCJldiIsImVkaXRvciIsImRhdGFQcm9jZXNzb3IiLCJ3cml0ZXIiLCJzZXRSdWxlcyIsImluZGVudCIsImJyZWFrQmVmb3JlT3BlbiIsImJyZWFrQWZ0ZXJPcGVuIiwiYnJlYWtCZWZvcmVDbG9zZSIsImJyZWFrQWZ0ZXJDbG9zZSJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7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O0FBT0FULElBQUUsQ0FBQ0MsTUFBSCxDQUFVQyxhQUFWLENBQXdCQyxNQUF4QixDQUErQkMsUUFBL0IsQ0FBd0MsSUFBeEMsRUFBOEM7QUFDMUNDLFVBQU0sRUFBRyxLQURpQztBQUUxQ0MsbUJBQWUsRUFBRyxJQUZ3QjtBQUcxQ0Msa0JBQWMsRUFBRyxLQUh5QjtBQUkxQ0Msb0JBQWdCLEVBQUcsS0FKdUI7QUFLMUNDLG1CQUFlLEVBQUc7QUFMd0IsR0FBOUM7QUFPQVQsSUFBRSxDQUFDQyxNQUFILENBQVVDLGFBQVYsQ0FBd0JDLE1BQXhCLENBQStCQyxRQUEvQixDQUF3QyxJQUF4QyxFQUE4QztBQUMxQ0MsVUFBTSxFQUFHLEtBRGlDO0FBRTFDQyxtQkFBZSxFQUFHLElBRndCO0FBRzFDQyxrQkFBYyxFQUFHLEtBSHlCO0FBSTFDQyxvQkFBZ0IsRUFBRyxLQUp1QjtBQUsxQ0MsbUJBQWUsRUFBRztBQUx3QixHQUE5QztBQU9BVCxJQUFFLENBQUNDLE1BQUgsQ0FBVUMsYUFBVixDQUF3QkMsTUFBeEIsQ0FBK0JDLFFBQS9CLENBQXdDLElBQXhDLEVBQThDO0FBQzFDQyxVQUFNLEVBQUcsS0FEaUM7QUFFMUNDLG1CQUFlLEVBQUcsSUFGd0I7QUFHMUNDLGtCQUFjLEVBQUcsS0FIeUI7QUFJMUNDLG9CQUFnQixFQUFHLEtBSnVCO0FBSzFDQyxtQkFBZSxFQUFHO0FBTHdCLEdBQTlDO0FBT0gsQ0FsREQsRSIsImZpbGUiOiJja2VkaXRvci5jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi92ZW5kb3Ivdm9sdW1uZXQvcmFhcy5rZXJuZWwvcHVibGljL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3B1YmxpYy9zcmMvY2tlZGl0b3IuY29uZmlnLmpzXCIpO1xuIiwid2luZG93LmNrRWRpdG9yQ29uZmlnID0ge1xuICAgIGV4dHJhUGx1Z2luczogW1xuICAgICAgICAnZmluZCcsIFxuICAgICAgICAnc2VsZWN0YWxsJywgXG4gICAgICAgICdwYWdlYnJlYWsnLCBcbiAgICAgICAgJ2lmcmFtZScsIFxuICAgICAgICAnZGl2JywgXG4gICAgICAgICdqdXN0aWZ5JywgXG4gICAgICAgICdiaWRpJywgXG4gICAgICAgICdjb2xvcmJ1dHRvbicsIFxuICAgICAgICAnc2hvd2Jsb2NrcydcbiAgICBdLFxuICAgIGF1dG9QYXJhZ3JhcGg6IGZhbHNlLFxuICAgIGxhbmd1YWdlOiAncnUnLFxuICAgIGhlaWdodDogMzIwLFxuICAgIGNvbnRlbnRzQ3NzOiBbJy9jc3MvY2tlZGl0b3IuY3NzJ10sXG4gICAgc2tpbjogJ21vb25vJyxcblxuICAgIGZpbGVicm93c2VyVXBsb2FkTWV0aG9kOiAnZm9ybScsXG4gICAgZmlsZWJyb3dzZXJCcm93c2VVcmw6ICcvdmVuZG9yL3N1bmhhdGVyL2tjZmluZGVyL2Jyb3dzZS5waHA/dHlwZT1maWxlJyxcbiAgICBmaWxlYnJvd3NlckltYWdlQnJvd3NlVXJsOiAnL3ZlbmRvci9zdW5oYXRlci9rY2ZpbmRlci9icm93c2UucGhwP3R5cGU9aW1hZ2UnLFxuICAgIGZpbGVicm93c2VyRmxhc2hCcm93c2VVcmw6ICcvdmVuZG9yL3N1bmhhdGVyL2tjZmluZGVyL2Jyb3dzZS5waHA/dHlwZT1maWxlJyxcbiAgICBmaWxlYnJvd3NlclVwbG9hZFVybDogJy92ZW5kb3Ivc3VuaGF0ZXIva2NmaW5kZXIvdXBsb2FkLnBocD90eXBlPWZpbGUnLFxuICAgIGZpbGVicm93c2VySW1hZ2VVcGxvYWRVcmw6ICcvdmVuZG9yL3N1bmhhdGVyL2tjZmluZGVyL3VwbG9hZC5waHA/dHlwZT1pbWFnZScsXG4gICAgZmlsZWJyb3dzZXJGbGFzaFVwbG9hZFVybDogJy92ZW5kb3Ivc3VuaGF0ZXIva2NmaW5kZXIvdXBsb2FkLnBocD90eXBlPWZpbGUnLFxuICAgIFxuICAgIHRvb2xiYXI6IFtcbiAgICAgICAgeyBcbiAgICAgICAgICAgIG5hbWU6ICdkb2N1bWVudCcsIFxuICAgICAgICAgICAgaXRlbXMgOiBbXG4gICAgICAgICAgICAgICAgJ1NvdXJjZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7IFxuICAgICAgICAgICAgbmFtZTogJ2NsaXBib2FyZCcsIFxuICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAnQ3V0JywgXG4gICAgICAgICAgICAgICAgJ0NvcHknLCBcbiAgICAgICAgICAgICAgICAnUGFzdGUnLCBcbiAgICAgICAgICAgICAgICAnUGFzdGVUZXh0JywgXG4gICAgICAgICAgICAgICAgJy0nLCBcbiAgICAgICAgICAgICAgICAnVW5kbycsIFxuICAgICAgICAgICAgICAgICdSZWRvJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHsgXG4gICAgICAgICAgICBuYW1lOiAnZWRpdGluZycsIFxuICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAnRmluZCcsIFxuICAgICAgICAgICAgICAgICdSZXBsYWNlJywgXG4gICAgICAgICAgICAgICAgJy0nLCBcbiAgICAgICAgICAgICAgICAnU2VsZWN0QWxsJywgXG4gICAgICAgICAgICAgICAgJy0nLCBcbiAgICAgICAgICAgICAgICAnU2NheXQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgeyBcbiAgICAgICAgICAgIG5hbWU6ICdpbnNlcnQnLCBcbiAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgJ0ltYWdlJywgXG4gICAgICAgICAgICAgICAgJ1RhYmxlJywgXG4gICAgICAgICAgICAgICAgJ0hvcml6b250YWxSdWxlJywgXG4gICAgICAgICAgICAgICAgJ1NwZWNpYWxDaGFyJywgXG4gICAgICAgICAgICAgICAgJ1BhZ2VCcmVhaycsIFxuICAgICAgICAgICAgICAgICdJZnJhbWUnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgeyBcbiAgICAgICAgICAgIG5hbWU6ICdsaW5rcycsIFxuICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAnTGluaycsIFxuICAgICAgICAgICAgICAgICdVbmxpbmsnLCBcbiAgICAgICAgICAgICAgICAnQW5jaG9yJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICcvJywgXG4gICAgICAgIHsgXG4gICAgICAgICAgICBuYW1lOiAnYmFzaWNzdHlsZXMnLCBcbiAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgJ0JvbGQnLCBcbiAgICAgICAgICAgICAgICAnSXRhbGljJywgXG4gICAgICAgICAgICAgICAgJ1VuZGVybGluZScsIFxuICAgICAgICAgICAgICAgICdTdHJpa2UnLCBcbiAgICAgICAgICAgICAgICAnU3Vic2NyaXB0JywgXG4gICAgICAgICAgICAgICAgJ1N1cGVyc2NyaXB0JywgXG4gICAgICAgICAgICAgICAgJy0nLCBcbiAgICAgICAgICAgICAgICAnUmVtb3ZlRm9ybWF0JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHsgXG4gICAgICAgICAgICBuYW1lOiAncGFyYWdyYXBoJywgXG4gICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICdOdW1iZXJlZExpc3QnLCBcbiAgICAgICAgICAgICAgICAnQnVsbGV0ZWRMaXN0JywgXG4gICAgICAgICAgICAgICAgJy0nLCBcbiAgICAgICAgICAgICAgICAnT3V0ZGVudCcsIFxuICAgICAgICAgICAgICAgICdJbmRlbnQnLCBcbiAgICAgICAgICAgICAgICAnLScsIFxuICAgICAgICAgICAgICAgICdCbG9ja3F1b3RlJywgXG4gICAgICAgICAgICAgICAgJ0NyZWF0ZURpdicsXG4gICAgICAgICAgICAgICAgJy0nLCBcbiAgICAgICAgICAgICAgICAnSnVzdGlmeUxlZnQnLCBcbiAgICAgICAgICAgICAgICAnSnVzdGlmeUNlbnRlcicsIFxuICAgICAgICAgICAgICAgICdKdXN0aWZ5UmlnaHQnLCBcbiAgICAgICAgICAgICAgICAnSnVzdGlmeUJsb2NrJywgXG4gICAgICAgICAgICAgICAgJy0nLCBcbiAgICAgICAgICAgICAgICAnQmlkaUx0cicsIFxuICAgICAgICAgICAgICAgICdCaWRpUnRsJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHsgXG4gICAgICAgICAgICBuYW1lOiAnY29sb3JzJywgXG4gICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICdUZXh0Q29sb3InLCBcbiAgICAgICAgICAgICAgICAnQkdDb2xvcicsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAnLycsXG4gICAgICAgIHsgXG4gICAgICAgICAgICBuYW1lOiAnc3R5bGVzJywgXG4gICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICdGb3JtYXQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgeyBcbiAgICAgICAgICAgIG5hbWU6ICd0b29scycsIFxuICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAnTWF4aW1pemUnLCBcbiAgICAgICAgICAgICAgICAnU2hvd0Jsb2NrcycsIFxuICAgICAgICAgICAgICAgICctJywgXG4gICAgICAgICAgICAgICAgJ0Fib3V0JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH1cbiAgICBdLFxuICAgIHJlbW92ZUJ1dHRvbnM6ICcnLFxuICAgIGFsbG93ZWRDb250ZW50OiB0cnVlLFxufTtcblxuQ0tFRElUT1Iub24oJ2luc3RhbmNlUmVhZHknLCBmdW5jdGlvbiggZXYgKSB7XG4gICAgZXYuZWRpdG9yLmRhdGFQcm9jZXNzb3Iud3JpdGVyLnNldFJ1bGVzKCdwJywge1xuICAgICAgICBpbmRlbnQgOiBmYWxzZSwgXG4gICAgICAgIGJyZWFrQmVmb3JlT3BlbiA6IHRydWUsIFxuICAgICAgICBicmVha0FmdGVyT3BlbiA6IGZhbHNlLCBcbiAgICAgICAgYnJlYWtCZWZvcmVDbG9zZSA6IGZhbHNlLCBcbiAgICAgICAgYnJlYWtBZnRlckNsb3NlIDogdHJ1ZVxuICAgIH0pO1xuICAgIGV2LmVkaXRvci5kYXRhUHJvY2Vzc29yLndyaXRlci5zZXRSdWxlcygnaDEnLCB7XG4gICAgICAgIGluZGVudCA6IGZhbHNlLCBcbiAgICAgICAgYnJlYWtCZWZvcmVPcGVuIDogdHJ1ZSwgXG4gICAgICAgIGJyZWFrQWZ0ZXJPcGVuIDogZmFsc2UsIFxuICAgICAgICBicmVha0JlZm9yZUNsb3NlIDogZmFsc2UsIFxuICAgICAgICBicmVha0FmdGVyQ2xvc2UgOiB0cnVlXG4gICAgfSk7XG4gICAgZXYuZWRpdG9yLmRhdGFQcm9jZXNzb3Iud3JpdGVyLnNldFJ1bGVzKCdoMicsIHtcbiAgICAgICAgaW5kZW50IDogZmFsc2UsIFxuICAgICAgICBicmVha0JlZm9yZU9wZW4gOiB0cnVlLCBcbiAgICAgICAgYnJlYWtBZnRlck9wZW4gOiBmYWxzZSwgXG4gICAgICAgIGJyZWFrQmVmb3JlQ2xvc2UgOiBmYWxzZSwgXG4gICAgICAgIGJyZWFrQWZ0ZXJDbG9zZSA6IHRydWVcbiAgICB9KTtcbiAgICBldi5lZGl0b3IuZGF0YVByb2Nlc3Nvci53cml0ZXIuc2V0UnVsZXMoJ2gzJywge1xuICAgICAgICBpbmRlbnQgOiBmYWxzZSwgXG4gICAgICAgIGJyZWFrQmVmb3JlT3BlbiA6IHRydWUsIFxuICAgICAgICBicmVha0FmdGVyT3BlbiA6IGZhbHNlLCBcbiAgICAgICAgYnJlYWtCZWZvcmVDbG9zZSA6IGZhbHNlLCBcbiAgICAgICAgYnJlYWtBZnRlckNsb3NlIDogdHJ1ZVxuICAgIH0pO1xuICAgIGV2LmVkaXRvci5kYXRhUHJvY2Vzc29yLndyaXRlci5zZXRSdWxlcygnaDQnLCB7XG4gICAgICAgIGluZGVudCA6IGZhbHNlLCBcbiAgICAgICAgYnJlYWtCZWZvcmVPcGVuIDogdHJ1ZSwgXG4gICAgICAgIGJyZWFrQWZ0ZXJPcGVuIDogZmFsc2UsIFxuICAgICAgICBicmVha0JlZm9yZUNsb3NlIDogZmFsc2UsIFxuICAgICAgICBicmVha0FmdGVyQ2xvc2UgOiB0cnVlXG4gICAgfSk7XG4gICAgZXYuZWRpdG9yLmRhdGFQcm9jZXNzb3Iud3JpdGVyLnNldFJ1bGVzKCdoNScsIHtcbiAgICAgICAgaW5kZW50IDogZmFsc2UsIFxuICAgICAgICBicmVha0JlZm9yZU9wZW4gOiB0cnVlLCBcbiAgICAgICAgYnJlYWtBZnRlck9wZW4gOiBmYWxzZSwgXG4gICAgICAgIGJyZWFrQmVmb3JlQ2xvc2UgOiBmYWxzZSwgXG4gICAgICAgIGJyZWFrQWZ0ZXJDbG9zZSA6IHRydWVcbiAgICB9KTtcbiAgICBldi5lZGl0b3IuZGF0YVByb2Nlc3Nvci53cml0ZXIuc2V0UnVsZXMoJ2g2Jywge1xuICAgICAgICBpbmRlbnQgOiBmYWxzZSwgXG4gICAgICAgIGJyZWFrQmVmb3JlT3BlbiA6IHRydWUsIFxuICAgICAgICBicmVha0FmdGVyT3BlbiA6IGZhbHNlLCBcbiAgICAgICAgYnJlYWtCZWZvcmVDbG9zZSA6IGZhbHNlLCBcbiAgICAgICAgYnJlYWtBZnRlckNsb3NlIDogdHJ1ZVxuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9