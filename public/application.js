/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../raas.cms/resources/js.vue3/application/app.vue.js":
/*!************************************************************!*\
  !*** ../raas.cms/resources/js.vue3/application/app.vue.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Каркас приложения
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      /**
       * Ширина экрана
       * @type {Number}
       */
      windowWidth: 0,
      /**
       * Ширина body
       * @type {Number}
       */
      bodyWidth: 0,
      /**
       * Высота экрана
       * @type {Number}
       */
      windowHeight: 0,
      /**
       * Смещение по вертикали
       * @type {Number}
       */
      scrollTop: 0,
      /**
       * Старое смещение по вертикали
       * @type {Number}
       */
      oldScrollTop: 0,
      /**
       * Происходит ли сейчас скроллинг
       * @type {Boolean}
       */
      isScrollingNow: false,
      /**
       * Происходит ли сейчас скроллинг (ID# таймаута)
       * @type {Number}
       */
      isScrollingNowTimeoutId: false,
      /**
       * Ожидание окончания скроллинга, мс
       * @type {Number}
       */
      isScrollingNowDelay: 250,
      /**
       * Погрешность скроллинга
       * @type {Number}
       */
      scrollingInaccuracy: 5,
      /**
       * Селектор ссылок для scrollTo
       */
      scrollToSelector: 'a[href*="modal"][href*="#"], ' + 'a.scrollTo[href*="#"], ' + 'a[href^="#"]:not([href="#"]):not([data-toggle]):not([data-bs-toggle]), ' + '.menu-top__link[href*="#"], ' + '.menu-main__link[href*="#"], ' + '.menu-bottom__link[href*="#"], ' + '.menu-mobile__link[href*="#"]',
      /**
       * Медиа-типы (ширина в px)
       * @type {Object}
       */
      mediaTypes: {
        xxl: 1400,
        xl: 1200,
        lg: 992,
        md: 768,
        sm: 576,
        xs: 0
      }
    };
  },
  mounted() {
    let self = this;
    this.lightBoxInit();
    this.windowWidth = $(window).innerWidth();
    this.windowHeight = $(window).outerHeight();
    this.bodyWidth = $('body').outerWidth();
    this.fixHtml();
    $(window).on('resize', self.fixHtml).on('resize', () => {
      this.windowWidth = $(window).outerWidth();
      this.windowHeight = $(window).outerHeight();
      this.bodyWidth = $('body').outerWidth();
    }).on('scroll', () => {
      let oldScrollTop = this.scrollTop;
      this.scrollTop = $(window).scrollTop();
      if (this.isScrollingNowTimeoutId) {
        window.clearTimeout(this.isScrollingNowTimeoutId);
      }
      if (!this.isScrollingNow) {
        this.isScrollingNow = true;
      }
      this.isScrollingNowTimeoutId = window.setTimeout(() => {
        this.oldScrollTop = oldScrollTop;
        this.scrollTop = $(window).scrollTop();
        this.isScrollingNowTimeoutId = 0;
        this.isScrollingNow = false;
      }, this.isScrollingNowDelay);
    });
    $(document).on('click', this.scrollToSelector, function () {
      let currentUrl = window.location.pathname + window.location.search;
      let url = $(this).attr('href').split('#')[0];
      // if (url) {
      //     url = '#' + url;
      // }
      if (!url || url == currentUrl) {
        self.processHashLink(this.hash);
        return false;
      }
    });
    $(document).on('show.bs.tab', 'a', function () {
      window.history.pushState({}, document.title, $(this).attr('href'));
    });
    $(window).on('load', () => {
      if (window.location.hash) {
        this.processHashLink(window.location.hash);
      }
    });
    this.scrollTop = this.oldScrollTop = $(window).scrollTop();

    // $('.menu-trigger').appendTo('.body__menu-mobile');

    // this.confirm = this.refs.confirm;
  },
  methods: {
    /**
     * Отправляет запрос к API
     * 
     * @param  {String} url URL для отправки
     * @param  {mixed} postData POST-данные для отправки (если null, то GET-запрос)
     * @param  {Number} blockId ID# блока для добавления AJAX={blockId} и заголовка X-RAAS-Block-Id
     * @param  {String} responseType MIME-тип получаемого ответа (если присутствует слэш /, то отправляется также заголовок Accept)
     * @param  {String} requestType MIME-тип запроса (если присутствует слэш /, то отправляется также заголовок Content-Type)
     * @param  {Object} additionalHeaders Дополнительные заголовки
     * @param {AbortController|null} abortController Контроллер прерывания
     * @return {mixed} Результат запроса
     */
    async api(url, postData = null, blockId = null, responseType = 'application/json', requestType = 'application/x-www-form-urlencoded', additionalHeaders = {}, abortController = null) {
      // 2023-11-09, AVS: добавил деление по #, т.к. хэштеги для сервера смысла не имеют
      let realUrl = url.split('#')[0];
      if (!/\/\//gi.test(realUrl)) {
        if (realUrl[0] != '/') {
          realUrl = '//' + window.location.host + window.location.pathname + realUrl;
        } else {
          realUrl = '//' + window.location.host + realUrl;
        }
      }
      const headers = {
        ...additionalHeaders
      };
      let rx;
      if (blockId) {
        if (!/(\?|&)AJAX=/gi.test(realUrl)) {
          realUrl += (/\?/gi.test(realUrl) ? '&' : '?') + 'AJAX=' + blockId;
        }
        headers['X-RAAS-Block-Id'] = blockId;
      }
      if (/\//gi.test(responseType)) {
        headers['Accept'] = responseType;
      }
      if (/\//gi.test(requestType) && !!postData) {
        headers['Content-Type'] = requestType;
      }
      const fetchOptions = {
        headers
      };
      if (abortController) {
        fetchOptions.signal = abortController.signal;
      }
      if (!!postData) {
        fetchOptions.method = 'POST';
        if (/form/gi.test(requestType)) {
          if (/multipart/gi.test(requestType)) {
            let formData = new FormData();
            if (postData instanceof FormData) {
              formData = postData;
            } else {
              formData = new FormData();
              for (const name in postData) {
                formData.append(name, postData[name]);
              }
            }
            fetchOptions.body = formData;
            delete headers['Content-Type']; // Там автоматически boundary ставится, без него фигня получается
          } else {
            fetchOptions.body = window.queryString.stringify(postData, {
              arrayFormat: 'bracket'
            });
          }
        } else if (typeof postData == 'object') {
          fetchOptions.body = JSON.stringify(postData);
        } else {
          fetchOptions.body = postData;
        }
      } else {
        fetchOptions.method = 'GET';
      }
      // console.log(fetchOptions);
      const response = await fetch(realUrl, fetchOptions);
      let result;
      if (/json/gi.test(responseType)) {
        result = await response.json();
      } else {
        result = await response.text();
      }
      return result;
    },
    /**
     * Получает смещение по вертикали для scrollTo 
     * (для случая фиксированной шапки)
     * @param {Number} destY Точка назначения
     * @return {Number}
     */
    getScrollOffset(destY = null) {
      return 0;
    },
    /**
     * Получение объекта по хэш-тегу
     * @param {String} hash хэш-тег (первый символ #)
     * @return {jQuery|null} null, если не найден
     */
    getObjFromHash(hash) {
      if (hash[0] != '#') {
        hash = '#' + hash;
      }
      let $obj = $(hash);
      if ($obj.length) {
        return $obj;
      }
      $obj = $('[name="' + hash.replace('#', '') + '"]');
      if ($obj.length) {
        return $obj;
      }
      return null;
    },
    /**
     * Обрабатывает хэш-ссылку
     * @param {String} hash хэш-тег (первый символ #)
     */
    processHashLink(hash) {
      this.jqEmit('processHashLink', hash);
      let $obj = this.getObjFromHash(hash);
      if ($obj && $obj.length) {
        if ($obj.hasClass('modal')) {
          $obj.modal('show');
        } else if ($obj.hasClass('tab-pane')) {
          let $hashLink = $('a[href="' + hash + '"], ' + 'a[href="' + window.location.pathname + window.location.search + hash + '"], ' + 'a[href="' + window.location.href + '"]');
          if ($hashLink.length) {
            $hashLink[0].click();
          }
        } else {
          this.scrollTo($obj);
        }
      }
    },
    /**
     * Инициализация lightBox'а
     * (по умолчанию используется lightCase)
     */
    lightBoxInit(options = {}) {
      let defaults = {
        processAllImageLinks: true,
        swipe: true,
        transition: 'scrollHorizontal',
        typeMapping: {
          'image': 'jpg,jpeg,gif,png,bmp,webp,svg'
        }
      };
      let params = Object.assign({}, defaults, options);
      let rx = /\.(jpg|jpeg|pjpeg|png|gif|webp|svg)$/i;
      $('a:not([data-rel^=lightcase]):not([data-no-lightbox])').each(function () {
        if (params.processAllImageLinks) {
          if (rx.test($(this).attr('href'))) {
            $(this).attr('data-lightbox', 'true');
          }
        }
        let g = $(this).attr('data-lightbox-gallery');
        if (g || $(this).attr('data-lightbox')) {
          $(this).attr('data-rel', 'lightcase' + (g ? ':' + g : ''));
          $(this).removeAttr('data-lightbox-gallery');
          $(this).removeAttr('data-lightbox');
        }
      });
      $('a[data-rel^=lightcase]').lightcase(params);
      $('body').on('click.lightcase', 'a', function (e, data) {
        if (/youtu/gi.test($(this).attr('href'))) {
          // Костыль, чтобы не дожидаться полной загрузки Youtube
          // 2023-09-13, AVS: добавили параметр raas-lightcase-loaded чтобы обрабатывать галерею видео
          let interval = window.setInterval(() => {
            if ($('#lightcase-case iframe:not([raas-lightcase-loaded])').length) {
              $('#lightcase-case iframe:not([raas-lightcase-loaded])').attr('raas-lightcase-loaded', '1').trigger('load');
              window.clearInterval(interval);
            }
          }, 100);
        }
      });
    },
    /**
     * Фиксация HTML (хелпер для модификации верстки)
     * (абстрактный, для переопределения)
     */
    fixHtml() {
      // ...
    },
    /**
     * Обработчик отображения окна подтверждения
     * @param  {String} text       Текст запроса
     * @param  {String} okText     Текст кнопки "ОК"
     * @param  {String} cancelText Текст кнопки "Отмена"
     * @return {jQuery.Promise}
     */
    confirm(text, okText, cancelText) {
      return this.$refs.confirm.confirm(text, okText, cancelText);
    },
    /**
     * Форматирование цены
     * @param  {Number} x Цена
     * @return {String}
     */
    formatPrice(price) {
      return window.formatPrice(price);
    },
    /**
     * Форматирование числительных
     * @param  {Number} x Число
     * @param  {Array} forms <pre><code>[
     *     'товаров', 
     *     'товар', 
     *     'товара'
     * ]</code></pre> Словоформы
     * @return {String}
     */
    numTxt(x, forms) {
      return window.numTxt(x, forms);
    },
    /**
     * Генерирует jQuery-событие уровня документа
     * @param {String} eventName Наименование события
     * @param {mixed} data Данные для передачи
     */
    jqEmit(eventName, data = null, originalEvent = null) {
      window.setTimeout(function () {
        let result = $(document).trigger(eventName, data);
      }, 10);
    },
    /**
     * Скроллит по вертикали к заданному объекту/позиции
     * @param  {Number|HTMLElement|jQuery} destination Назначение (точек по Y, либо элемент)
     * @param {Boolean} instant Немедленный скролл (плавный, если false)
     */
    scrollTo(destination, instant = false) {
      let destY = null;
      if (typeof destination == 'number') {
        destY = destination;
      } else if (typeof destination == 'string') {
        destination = $(destination);
        destY = destination.offset().top;
      } else if (destination instanceof HTMLElement) {
        destY = $(destination).offset().top;
      } else if (destination instanceof jQuery) {
        destY = destination.offset().top;
      }
      if (destY !== null) {
        // console.log(destY)
        let top = Math.max(0, Math.round(destY + this.getScrollOffset(destY)));
        top = Math.min(top, $('.body').outerHeight() - this.windowHeight - 1); // 2024-01-15, AVS: Поправка на нижний край документа
        let scrollToData = {
          left: 0,
          top,
          behavior: instant ? 'instant' : 'smooth'
        };
        // console.log(scrollToData);
        window.scrollTo(scrollToData);
        // 2023-09-19, AVS: сделаем защиту скроллинга
        if (!instant) {
          let protectScrolling = window.setInterval(() => {
            const bodyOuterHeight = parseInt($('.body').outerHeight());
            if (Math.abs(Math.round(this.scrollTop) - Math.round(scrollToData.top)) < this.scrollingInaccuracy || scrollToData.top > this.scrollTop && this.scrollTop + this.windowHeight >= bodyOuterHeight - this.scrollingInaccuracy ||
            // Останавливаем, если движемся вниз, но достигли низа страницы

            scrollToData.top < this.scrollTop && this.scrollTop <= this.scrollingInaccuracy // Останавливаем, если движемся вверх, но достигли верха страницы
            ) {
              console.log('stop scrolling to ' + scrollToData.top + ' on ' + this.scrollTop);
              window.clearInterval(protectScrolling);
              protectScrolling = null;
            } else if (!this.isScrollingNow) {
              window.scrollTo(scrollToData);
              console.log('continue scrolling from ' + this.scrollTop + ' to ' + scrollToData.top);
            }
          }, this.isScrollingNowDelay);
        }
        // $.scrollTo(scrollToData.top, instant ? this.isScrollingNowDelay : 0);
      }
    }
  },
  computed: {
    /**
     * Координаты нижней границы окна
     * @return {[type]} [description]
     */
    windowBottomPosition() {
      return this.scrollTop + this.windowHeight;
    },
    /**
     * Последнее смещение по скроллингу
     * @return {Number}
     */
    scrollDelta() {
      return this.scrollTop - this.oldScrollTop;
    }
  }
});

/***/ }),

/***/ "../raas.cms/resources/js.vue3/application/mixins/fixed-header.vue.js":
/*!****************************************************************************!*\
  !*** ../raas.cms/resources/js.vue3/application/mixins/fixed-header.vue.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Фиксированное меню
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      fixedHeaderActive: false
    };
  },
  computed: {
    /**
     * Фиксированная ли шапка
     * @return {Boolean}
     */
    fixedHeader() {
      return this.scrollTop > Math.max($('.body__header-outer').outerHeight(), $('.body__header').outerHeight());
    }
  },
  watch: {
    scrollTop() {
      if (this.fixedHeader) {
        if (this.scrollDelta > 100) {
          this.fixedHeaderActive = false;
        } else if (this.scrollDelta < -60) {
          this.fixedHeaderActive = true;
        }
      } else {
        this.fixedHeaderActive = false;
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[15].use[0]!./public/src/application/app.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[15].use[0]!./public/src/application/app.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var cms_application_app_vue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cms/application/app.vue.js */ "../raas.cms/resources/js.vue3/application/app.vue.js");
/* harmony import */ var cms_application_mixins_fixed_header_vue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cms/application/mixins/fixed-header.vue.js */ "../raas.cms/resources/js.vue3/application/mixins/fixed-header.vue.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [cms_application_app_vue_js__WEBPACK_IMPORTED_MODULE_0__["default"], cms_application_mixins_fixed_header_vue_js__WEBPACK_IMPORTED_MODULE_1__["default"]],
  el: "#raas-app",
  data: function data() {
    var result = {
      fixedHeaderActive: false,
      lastScrollTop: 0,
      config: window.raasConfig
    };
    if (window.raasApplicationData) {
      Object.assign(result, window.raasApplicationData);
    }
    return result;
  },
  mounted: function mounted() {
    // this.openFileManager("image");
  },
  methods: {
    lightBoxInit: function lightBoxInit() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    },
    /**
     * Открывает файловый менеджер
     * @param {'file'|'image'} rootFolder Корневая папка
     * @param {boolean} withFileSelection Выбрать файл
     * @return {Promise<string>} Выбранный файл
     */
    openFileManager: function openFileManager(rootFolder, withFileSelection) {
      return this.$refs.raasApp.$refs.filemanager.open(rootFolder, withFileSelection);
    },
    /**
     * Для отладки
     */
    alert: function (_alert) {
      function alert(_x) {
        return _alert.apply(this, arguments);
      }
      alert.toString = function () {
        return _alert.toString();
      };
      return alert;
    }(function (x) {
      alert(JSON.stringify(x));
    })
  }
});

/***/ }),

/***/ "./node_modules/decode-uri-component/index.js":
/*!****************************************************!*\
  !*** ./node_modules/decode-uri-component/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ decodeUriComponent)
/* harmony export */ });
const token = '%[a-f0-9]{2}';
const singleMatcher = new RegExp('(' + token + ')|([^%]+?)', 'gi');
const multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return [decodeURIComponent(components.join(''))];
	} catch {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	const left = components.slice(0, split);
	const right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch {
		let tokens = input.match(singleMatcher) || [];

		for (let i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher) || [];
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	const replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD',
	};

	let match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch {
			const result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	const entries = Object.keys(replaceMap);

	for (const key of entries) {
		// Replace all decoded components
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

function decodeUriComponent(encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
}


/***/ }),

/***/ "./node_modules/filter-obj/index.js":
/*!******************************************!*\
  !*** ./node_modules/filter-obj/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   excludeKeys: () => (/* binding */ excludeKeys),
/* harmony export */   includeKeys: () => (/* binding */ includeKeys)
/* harmony export */ });
function includeKeys(object, predicate) {
	const result = {};

	if (Array.isArray(predicate)) {
		for (const key of predicate) {
			const descriptor = Object.getOwnPropertyDescriptor(object, key);
			if (descriptor?.enumerable) {
				Object.defineProperty(result, key, descriptor);
			}
		}
	} else {
		// `Reflect.ownKeys()` is required to retrieve symbol properties
		for (const key of Reflect.ownKeys(object)) {
			const descriptor = Object.getOwnPropertyDescriptor(object, key);
			if (descriptor.enumerable) {
				const value = object[key];
				if (predicate(key, value, object)) {
					Object.defineProperty(result, key, descriptor);
				}
			}
		}
	}

	return result;
}

function excludeKeys(object, predicate) {
	if (Array.isArray(predicate)) {
		const set = new Set(predicate);
		return includeKeys(object, key => !set.has(key));
	}

	return includeKeys(object, (key, value, object) => !predicate(key, value, object));
}


/***/ }),

/***/ "./node_modules/jquery.scrollto/jquery.scrollTo.js":
/*!*********************************************************!*\
  !*** ./node_modules/jquery.scrollto/jquery.scrollTo.js ***!
  \*********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery.scrollTo
 * Copyright (c) 2007 Ariel Flesler - aflesler ○ gmail • com | https://github.com/flesler
 * Licensed under MIT
 * https://github.com/flesler/jquery.scrollTo
 * @projectDescription Lightweight, cross-browser and highly customizable animated scrolling with jQuery
 * @author Ariel Flesler
 * @version 2.1.3
 */
;(function(factory) {
	'use strict';
	if (true) {
		// AMD
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})(function($) {
	'use strict';

	var $scrollTo = $.scrollTo = function(target, duration, settings) {
		return $(window).scrollTo(target, duration, settings);
	};

	$scrollTo.defaults = {
		axis:'xy',
		duration: 0,
		limit:true
	};

	function isWin(elem) {
		return !elem.nodeName ||
			$.inArray(elem.nodeName.toLowerCase(), ['iframe','#document','html','body']) !== -1;
	}

	function isFunction(obj) {
		// Brought from jQuery since it's deprecated
		return typeof obj === 'function'
	}

	$.fn.scrollTo = function(target, duration, settings) {
		if (typeof duration === 'object') {
			settings = duration;
			duration = 0;
		}
		if (typeof settings === 'function') {
			settings = { onAfter:settings };
		}
		if (target === 'max') {
			target = 9e9;
		}

		settings = $.extend({}, $scrollTo.defaults, settings);
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.duration;
		// Make sure the settings are given right
		var queue = settings.queue && settings.axis.length > 1;
		if (queue) {
			// Let's keep the overall duration
			duration /= 2;
		}
		settings.offset = both(settings.offset);
		settings.over = both(settings.over);

		return this.each(function() {
			// Null target yields nothing, just like jQuery does
			if (target === null) return;

			var win = isWin(this),
				elem = win ? this.contentWindow || window : this,
				$elem = $(elem),
				targ = target,
				attr = {},
				toff;

			switch (typeof targ) {
				// A number will pass the regex
				case 'number':
				case 'string':
					if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
						targ = both(targ);
						// We are done
						break;
					}
					// Relative/Absolute selector
					targ = win ? $(targ) : $(targ, elem);
					/* falls through */
				case 'object':
					if (targ.length === 0) return;
					// DOMElement / jQuery
					if (targ.is || targ.style) {
						// Get the real position of the target
						toff = (targ = $(targ)).offset();
					}
			}

			var offset = isFunction(settings.offset) && settings.offset(elem, targ) || settings.offset;

			$.each(settings.axis.split(''), function(i, axis) {
				var Pos	= axis === 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					prev = $elem[key](),
					max = $scrollTo.max(elem, axis);

				if (toff) {// jQuery / DOMElement
					attr[key] = toff[pos] + (win ? 0 : prev - $elem.offset()[pos]);

					// If it's a dom element, reduce the margin
					if (settings.margin) {
						attr[key] -= parseInt(targ.css('margin'+Pos), 10) || 0;
						attr[key] -= parseInt(targ.css('border'+Pos+'Width'), 10) || 0;
					}

					attr[key] += offset[pos] || 0;

					if (settings.over[pos]) {
						// Scroll to a fraction of its width/height
						attr[key] += targ[axis === 'x'?'width':'height']() * settings.over[pos];
					}
				} else {
					var val = targ[pos];
					// Handle percentage values
					attr[key] = val.slice && val.slice(-1) === '%' ?
						parseFloat(val) / 100 * max
						: val;
				}

				// Number or 'number'
				if (settings.limit && /^\d+$/.test(attr[key])) {
					// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
				}

				// Don't waste time animating, if there's no need.
				if (!i && settings.axis.length > 1) {
					if (prev === attr[key]) {
						// No animation needed
						attr = {};
					} else if (queue) {
						// Intermediate animation
						animate(settings.onAfterFirst);
						// Don't animate this axis again in the next iteration.
						attr = {};
					}
				}
			});

			animate(settings.onAfter);

			function animate(callback) {
				var opts = $.extend({}, settings, {
					// The queue setting conflicts with animate()
					// Force it to always be true
					queue: true,
					duration: duration,
					complete: callback && function() {
						callback.call(elem, targ, settings);
					}
				});
				$elem.animate(attr, opts);
			}
		});
	};

	// Max scrolling position, works on quirks mode
	// It only fails (not too badly) on IE, quirks mode.
	$scrollTo.max = function(elem, axis) {
		var Dim = axis === 'x' ? 'Width' : 'Height',
			scroll = 'scroll'+Dim;

		if (!isWin(elem))
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();

		var size = 'client' + Dim,
			doc = elem.ownerDocument || elem.document,
			html = doc.documentElement,
			body = doc.body;

		return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size]);
	};

	function both(val) {
		return isFunction(val) || $.isPlainObject(val) ? val : { top:val, left:val };
	}

	// Add special hooks so that window scroll properties can be animated
	$.Tween.propHooks.scrollLeft =
	$.Tween.propHooks.scrollTop = {
		get: function(t) {
			return $(t.elem)[t.prop]();
		},
		set: function(t) {
			var curr = this.get(t);
			// If interrupt is true and user scrolled, stop animating
			if (t.options.interrupt && t._last && t._last !== curr) {
				return $(t.elem).stop();
			}
			var next = Math.round(t.now);
			// Don't waste CPU
			// Browsers don't render floating point scroll
			if (curr !== next) {
				$(t.elem)[t.prop](next);
				t._last = this.get(t);
			}
		}
	};

	// AMD requirement
	return $scrollTo;
});


/***/ }),

/***/ "./node_modules/query-string/base.js":
/*!*******************************************!*\
  !*** ./node_modules/query-string/base.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exclude: () => (/* binding */ exclude),
/* harmony export */   extract: () => (/* binding */ extract),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   parseUrl: () => (/* binding */ parseUrl),
/* harmony export */   pick: () => (/* binding */ pick),
/* harmony export */   stringify: () => (/* binding */ stringify),
/* harmony export */   stringifyUrl: () => (/* binding */ stringifyUrl)
/* harmony export */ });
/* harmony import */ var decode_uri_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! decode-uri-component */ "./node_modules/decode-uri-component/index.js");
/* harmony import */ var filter_obj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! filter-obj */ "./node_modules/filter-obj/index.js");
/* harmony import */ var split_on_first__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! split-on-first */ "./node_modules/split-on-first/index.js");




const isNullOrUndefined = value => value === null || value === undefined;

// eslint-disable-next-line unicorn/prefer-code-point
const strictUriEncode = string => encodeURIComponent(string).replaceAll(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index': {
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result, [encode(key, options), '[', index, ']'].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join(''),
				];
			};
		}

		case 'bracket': {
			return key => (result, value) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						[encode(key, options), '[]'].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), '[]=', encode(value, options)].join(''),
				];
			};
		}

		case 'colon-list-separator': {
			return key => (result, value) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						[encode(key, options), ':list='].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), ':list=', encode(value, options)].join(''),
				];
			};
		}

		case 'comma':
		case 'separator':
		case 'bracket-separator': {
			const keyValueSeparator = options.arrayFormat === 'bracket-separator'
				? '[]='
				: '=';

			return key => (result, value) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				// Translate null to an empty string so that it doesn't serialize as 'null'
				value = value === null ? '' : value;

				if (result.length === 0) {
					return [[encode(key, options), keyValueSeparator, encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};
		}

		default: {
			return key => (result, value) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						encode(key, options),
					];
				}

				return [
					...result,
					[encode(key, options), '=', encode(value, options)].join(''),
				];
			};
		}
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index': {
			return (key, value, accumulator) => {
				result = /\[(\d*)]$/.exec(key);

				key = key.replace(/\[\d*]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};
		}

		case 'bracket': {
			return (key, value, accumulator) => {
				result = /(\[])$/.exec(key);
				key = key.replace(/\[]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [...accumulator[key], value];
			};
		}

		case 'colon-list-separator': {
			return (key, value, accumulator) => {
				result = /(:list)$/.exec(key);
				key = key.replace(/:list$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [...accumulator[key], value];
			};
		}

		case 'comma':
		case 'separator': {
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
				value = isEncodedArray ? decode(value, options) : value;
				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : (value === null ? value : decode(value, options));
				accumulator[key] = newValue;
			};
		}

		case 'bracket-separator': {
			return (key, value, accumulator) => {
				const isArray = /(\[])$/.test(key);
				key = key.replace(/\[]$/, '');

				if (!isArray) {
					accumulator[key] = value ? decode(value, options) : value;
					return;
				}

				const arrayValue = value === null
					? []
					: decode(value, options).split(options.arrayFormatSeparator);

				if (accumulator[key] === undefined) {
					accumulator[key] = arrayValue;
					return;
				}

				accumulator[key] = [...accumulator[key], ...arrayValue];
			};
		}

		default: {
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [...[accumulator[key]].flat(), value];
			};
		}
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return (0,decode_uri_component__WEBPACK_IMPORTED_MODULE_0__["default"])(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function parseValue(value, options, type) {
	if (type === 'string' && typeof value === 'string') {
		return value;
	}

	if (typeof type === 'function' && typeof value === 'string') {
		return type(value);
	}

	if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		return value.toLowerCase() === 'true';
	}

	if (type === 'number' && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		return Number(value);
	}

	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		return Number(value);
	}

	return value;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parse(query, options) {
	options = {
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false,
		types: Object.create(null),
		...options,
	};

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const returnValue = Object.create(null);

	if (typeof query !== 'string') {
		return returnValue;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return returnValue;
	}

	for (const parameter of query.split('&')) {
		if (parameter === '') {
			continue;
		}

		const parameter_ = options.decode ? parameter.replaceAll('+', ' ') : parameter;

		let [key, value] = (0,split_on_first__WEBPACK_IMPORTED_MODULE_2__["default"])(parameter_, '=');

		if (key === undefined) {
			key = parameter_;
		}

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : (['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options));
		formatter(decode(key, options), value, returnValue);
	}

	for (const [key, value] of Object.entries(returnValue)) {
		if (typeof value === 'object' && value !== null && options.types[key] !== 'string') {
			for (const [key2, value2] of Object.entries(value)) {
				const type = options.types[key] ? options.types[key].replace('[]', '') : undefined;
				value[key2] = parseValue(value2, options, type);
			}
		} else if (typeof value === 'object' && value !== null && options.types[key] === 'string') {
			returnValue[key] = Object.values(value).join(options.arrayFormatSeparator);
		} else {
			returnValue[key] = parseValue(value, options, options.types[key]);
		}
	}

	if (options.sort === false) {
		return returnValue;
	}

	// TODO: Remove the use of `reduce`.
	// eslint-disable-next-line unicorn/no-array-reduce
	return (options.sort === true ? Object.keys(returnValue).sort() : Object.keys(returnValue).sort(options.sort)).reduce((result, key) => {
		const value = returnValue[key];
		result[key] = Boolean(value) && typeof value === 'object' && !Array.isArray(value) ? keysSorter(value) : value;
		return result;
	}, Object.create(null));
}

function stringify(object, options) {
	if (!object) {
		return '';
	}

	options = {
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		...options,
	};

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key]))
		|| (options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const [key, value] of Object.entries(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = value;
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
				return encode(key, options) + '[]';
			}

			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
}

function parseUrl(url, options) {
	options = {
		decode: true,
		...options,
	};

	let [url_, hash] = (0,split_on_first__WEBPACK_IMPORTED_MODULE_2__["default"])(url, '#');

	if (url_ === undefined) {
		url_ = url;
	}

	return {
		url: url_?.split('?')?.[0] ?? '',
		query: parse(extract(url), options),
		...(options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}),
	};
}

function stringifyUrl(object, options) {
	options = {
		encode: true,
		strict: true,
		[encodeFragmentIdentifier]: true,
		...options,
	};

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = extract(object.url);

	const query = {
		...parse(queryFromUrl, {sort: false}),
		...object.query,
	};

	let queryString = stringify(query, options);
	queryString &&= `?${queryString}`;

	let hash = getHash(object.url);
	if (typeof object.fragmentIdentifier === 'string') {
		const urlObjectForFragmentEncode = new URL(url);
		urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
		hash = options[encodeFragmentIdentifier] ? urlObjectForFragmentEncode.hash : `#${object.fragmentIdentifier}`;
	}

	return `${url}${queryString}${hash}`;
}

function pick(input, filter, options) {
	options = {
		parseFragmentIdentifier: true,
		[encodeFragmentIdentifier]: false,
		...options,
	};

	const {url, query, fragmentIdentifier} = parseUrl(input, options);

	return stringifyUrl({
		url,
		query: (0,filter_obj__WEBPACK_IMPORTED_MODULE_1__.includeKeys)(query, filter),
		fragmentIdentifier,
	}, options);
}

function exclude(input, filter, options) {
	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

	return pick(input, exclusionFilter, options);
}


/***/ }),

/***/ "./node_modules/query-string/index.js":
/*!********************************************!*\
  !*** ./node_modules/query-string/index.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/query-string/base.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_base_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./node_modules/split-on-first/index.js":
/*!**********************************************!*\
  !*** ./node_modules/split-on-first/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ splitOnFirst)
/* harmony export */ });
function splitOnFirst(string, separator) {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (string === '' || separator === '') {
		return [];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
}


/***/ }),

/***/ "./node_modules/vue-loader/dist/exportHelper.js":
/*!******************************************************!*\
  !*** ./node_modules/vue-loader/dist/exportHelper.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// runtime helper for setting properties on components
// in a tree-shakable way
exports["default"] = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
};


/***/ }),

/***/ "./public/src/application/app.vue":
/*!****************************************!*\
  !*** ./public/src/application/app.vue ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _app_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.vue?vue&type=script&lang=js */ "./public/src/application/app.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");



;
const __exports__ = /*#__PURE__*/(0,_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_app_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"], [['__file',"public/src/application/app.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./public/src/application/app.vue?vue&type=script&lang=js":
/*!****************************************************************!*\
  !*** ./public/src/application/app.vue?vue&type=script&lang=js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_15_use_0_app_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_15_use_0_app_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[15].use[0]!./app.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[15].use[0]!./public/src/application/app.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./public/src/libs/multitable.js":
/*!***************************************!*\
  !*** ./public/src/libs/multitable.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Множественная таблица
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var thisObj = this;
  var $thisObj = $(this);
  var idN = $thisObj.attr('data-idn') || 'id';
  var check = function check() {
    var $checkbox = $('[data-role="checkbox-row"]', thisObj);
    var $all = $('[data-role="checkbox-all"]', thisObj);
    var $menu = $('tfoot .btn-group, tfoot .all-context-menu', thisObj);
    var $menuItems = $('.dropdown-menu li a, .menu-dropdown__link', $menu);
    if ($all.is(':checked')) {
      $checkbox.each(function () {
        if (!$(this).is(':checked')) {
          $all.prop('checked', false);
          return false;
        }
      });
    }
    var ids = '';
    if ($all.is(':checked') && $all.val() && $all.val() != 'ids') {
      ids += '&' + idN + '=' + $all.val();
    } else {
      $checkbox.filter(':checked').each(function () {
        ids += '&' + idN + '[]=' + $(this).val();
      });
    }
    $menuItems.each(function () {
      $(this).attr('href', $(this).attr('data-href') + ids);
    });
    if (ids) {
      $menu.show();
    } else {
      $menu.hide();
    }
  };
  var init = function init() {
    var $menu = $('tfoot .btn-group, tfoot .all-context-menu', thisObj);
    var $menuItems = $('.dropdown-menu li a, .menu-dropdown__link', $menu);
    $menuItems.each(function () {
      $(this).attr('data-href', $(this).attr('href'));
    });
  };
  var checkAccurate = function checkAccurate(e) {
    if ($(this).is(':checked')) {
      $(this).prop('checked', false);
    } else {
      $(this).prop('checked', true);
    }
    e.stopPropagation();
    e.preventDefault();
    check();
    return false;
  };
  $(this).on('click', '[data-role="checkbox-all"]', function () {
    var $checkbox = $('[data-role="checkbox-row"]', thisObj);
    if ($(this).is(':checked')) {
      $checkbox.prop('checked', true);
    } else {
      $checkbox.prop('checked', false);
    }
    check();
  });
  $(this).on('click', '[data-role="checkbox-row"]', check);
  $(this).on('contextmenu', '[data-role="checkbox-row"]', checkAccurate);
  $(this).on('contextmenu', '[data-role="checkbox-all"]', checkAccurate);
  init();
  check();
}
;

/***/ }),

/***/ "./public/src/libs/raas.autocompleter.js":
/*!***********************************************!*\
  !*** ./public/src/libs/raas.autocompleter.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(method) {
  var $thisObj;
  var $autotext;
  var defaultParams = {
    showInterval: 1000
  };
  var params;
  var timeout_id = 0;
  var methods = {
    getCompletion: function getCompletion(data) {
      var Set = data.Set;
      var i;
      $autotext.empty();
      if (Set && Set.length > 0) {
        for (i = 0; i < Set.length; i++) {
          var text = '<li>';
          text += '  <a href="#" data-id="' + Set[i].id + '"';
          for (var key in Set[i]) {
            if ($.inArray(key, ['id', 'name', 'description', 'img']) == -1) {
              text += ' data-' + key + '="' + Set[i][key].toString() + '"';
            }
          }
          text += '>';
          if (Set[i].img) {
            text += '   <img src="' + Set[i].img + '" />';
          }
          text += '    <span class="raas-autotext__name">' + Set[i].name + '</span>';
          text += '    <span class="raas-autotext__description">' + Set[i].description + '</span>';
          text += '  </a>';
          text += '</li>';
          $autotext.append(text);
        }
        $autotext.show();
      } else {
        $autotext.hide();
      }
    },
    textOnChange: function textOnChange() {
      $autotext.trigger('RAAS_autocompleter.change');
      var text = $thisObj.val();
      var url = params.url;
      if (/\*/.test(url)) {
        var url = url.replace(/\*/, text);
      } else {
        var url = url + text;
      }
      window.clearTimeout(timeout_id);
      timeout_id = window.setTimeout(function () {
        $.getJSON(url, methods.getCompletion);
      }, params.showInterval);
    },
    onClick: function onClick(e) {
      $autotext.trigger('RAAS_autocompleter.click');
      if (params.callback) {
        params.callback.apply(this, e);
      }
      $autotext.hide();
      return false;
    },
    init: function init(options) {
      $autotext.params = params = $.extend(defaultParams, options);
      $thisObj.on('keyup', methods.textOnChange);
      // 2015-05-04, AVS: заменил $autotext.hide на function() { $autotext.hide() }, ибо глючит
      $('body').on('click', function () {
        $autotext.hide();
      });
      $autotext.on('click', 'a', methods.onClick);
    }
  };
  $thisObj = $(this);
  $autotext = $thisObj.next('[data-role="raas-autotext"]');
  if (!$autotext.length) {
    $autotext = $('<ul class="raas-autotext" style="display: none" data-role="raas-autotext"></ul>');
    $thisObj.after($autotext);
  }
  if ($autotext.params) {
    $params = $autotext.params;
  }

  // логика вызова метода
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (_typeof(method) === 'object' || !method) {
    return methods.init.apply(this, arguments);
  }
}
;

/***/ }),

/***/ "./public/src/libs/raas.fill-select.js":
/*!*********************************************!*\
  !*** ./public/src/libs/raas.fill-select.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(fill) {
  var text = '';
  $(this).empty();
  var source = [];
  var pValue = undefined;
  for (var i in fill) {
    var sourceEntry = {
      value: fill[i].value || fill[i].val,
      caption: fill[i].caption || fill[i].text
    };
    if (fill[i].sel) {
      sourceEntry.sel, _readOnlyError("pValue");
    }
    text = '<option value="' + fill[i].val + '"' + (fill[i].sel ? ' selected="selected"' : '');
    for (var key in fill[i]) {
      if ($.inArray(key, ['val', 'sel', 'text']) == -1) {
        text += ' data-' + key + '="' + fill[i][key] + '"';
        sourceEntry['data-' + key] = fill[i][key];
      }
    }
    text += '>' + fill[i].text + '</option>';
    $(this).append($(text));
    source.push(sourceEntry);
  }
  // console.log(fill)
  $(this).trigger('raas.fill-select', {
    source: source,
    value: pValue
  });
}
;

/***/ }),

/***/ "./public/src/libs/raas.get-select.js":
/*!********************************************!*\
  !*** ./public/src/libs/raas.get-select.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(url, params) {
  var defaultParams = {
    'before': function before(data) {
      return data;
    },
    'after': function after(data) {}
  };
  params = $.extend(defaultParams, params);
  var thisObj = this;
  $.getJSON(url, function (data) {
    var fill = params.before.call(thisObj, data);
    $(thisObj).RAAS_fillSelect(fill);
    params.after.call(thisObj, data);
  });
}
;

/***/ }),

/***/ "./public/src/libs/raas.init-inputs.js":
/*!*********************************************!*\
  !*** ./public/src/libs/raas.init-inputs.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var thisObj = this;
  $('input[data-hint], textarea[data-hint], select[data-hint]', thisObj).each(function () {
    var text = '<button type="button" class="btn" rel="popover" data-content="' + $(this).attr('data-hint') + '"><span class="raas-icon fa-solid fa-circle-question"></span></button>';
    if (!$(this).closest('.control-group').find('a[rel="popover"]').length) {
      $(this).closest('.control-group').find('.controls').append(text);
    }
  });
}

/***/ }),

/***/ "./public/src/libs/raas.menu-tree.js":
/*!*******************************************!*\
  !*** ./public/src/libs/raas.menu-tree.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * @deprecated Дерево меню реализовано в RAAS - до 2026-01-01
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(method) {
  var $thisObj;
  var defaultParams = {
    shownLevel: 2
  };
  var params = {};
  var methods = {
    hideUL: function hideUL($obj) {
      $('ul', $obj).hide();
    },
    addPluses: function addPluses($obj) {
      $('li:has(ul)', $obj).prepend('<a href="#" class="jsTreePlus" data-role="fold-subtree"></a>');
    },
    unfold: function unfold($obj, slowly) {
      $obj.children('[data-role="fold-subtree"]').removeClass('jsTreePlus').addClass('jsTreeMinus');
      if (slowly) {
        $obj.find('> ul').slideDown();
      } else {
        $obj.find('> ul').show();
      }
    },
    fold: function fold($obj, slowly) {
      $obj.children('[data-role="fold-subtree"]').removeClass('jsTreeMinus').addClass('jsTreePlus');
      if (slowly) {
        $obj.find('> ul').slideUp();
      } else {
        $obj.find('> ul').hide();
      }
    },
    clickPlus: function clickPlus() {
      methods.unfold($(this).closest('li'), true);
      return false;
    },
    clickMinus: function clickMinus() {
      methods.fold($(this).closest('li'), true);
      return false;
    },
    init: function init(options) {
      params = $.extend(defaultParams, options);
      if (params.shownLevel) {
        var sel = '';
        for (var i = 0; i < params.shownLevel; i++) {
          sel += 'ul ';
        }
        $thisObj = $(sel, this);
      } else {
        $thisObj = $(this);
      }
      if ($thisObj.length) {
        alert('Функция jQuery.menuTree устарела и будет отключена 01.01.2026. Пожалуйста, обратитесь к разработчику для обновления системы!');
      }
      methods.hideUL($thisObj);
      methods.addPluses($thisObj);
      methods.unfold($('li.active', $thisObj), false);
      $thisObj.on('click', '.jsTreePlus[data-role="fold-subtree"]', methods.clickPlus);
      $thisObj.on('click', '.jsTreeMinus[data-role="fold-subtree"]', methods.clickMinus);
    }
  };

  // логика вызова метода
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (_typeof(method) === 'object' || !method) {
    return methods.init.apply(this, arguments);
  }
}
;

/***/ }),

/***/ "./public/src/libs/raas.query-string.js":
/*!**********************************************!*\
  !*** ./public/src/libs/raas.query-string.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(change_query, include_dirs, initial_path) {
  if (!initial_path) {
    initial_path = document.location.href;
  }
  if (change_query.substr(0, 1) == '?') {
    change_query = change_query.substr(1);
  }
  var query_dir = initial_path.split('?').slice(0, 1).toString();
  var query_str = initial_path.split('?').slice(1).toString();
  var old_query = query_str.split('&');
  var change = change_query.split('&');
  var query = {};
  var temp = [];
  var new_query = [];
  for (var i = 0; i < old_query.length; i++) {
    temp = old_query[i].split('=');
    if (temp[0].length > 0) {
      query[temp[0]] = temp[1];
    }
  }
  for (var i = 0; i < change.length; i++) {
    temp = change[i].split('=');
    if (temp[0].length > 0) {
      query[temp[0]] = temp[1];
    }
  }
  temp = [];
  for (var key in query) {
    if (query[key] && query[key].length > 0) {
      temp[temp.length] = key + '=' + query[key];
    }
  }
  query = temp.join('&');
  return query;
}
;

/***/ }),

/***/ "./public/src/libs/raas.repo.js":
/*!**************************************!*\
  !*** ./public/src/libs/raas.repo.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @deprecated Репозиторий реализован в RAAS (raas-repo, raas-repo-table) - до 18.03.2026
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(params) {
  var defaultParams = {
    'repoContainer': '[data-role="raas-repo-container"]',
    'repoElement': '[data-role="raas-repo-element"]',
    'repoElementChanges': {
      'data-role': 'raas-repo-element'
    },
    'repoAdd': '[data-role="raas-repo-add"]',
    'repoMove': '[data-role="raas-repo-move"]',
    'repoDelete': '[data-role="raas-repo-del"]',
    'repo': '[data-role="raas-repo"]',
    'onBeforeAdd': function onBeforeAdd() {},
    'onAfterAdd': function onAfterAdd() {
      $(this).find('select:disabled, input:disabled, textarea:disabled').removeAttr('disabled');
    },
    'onBeforeDelete': function onBeforeDelete() {},
    'onAfterDelete': function onAfterDelete() {}
  };
  params = $.extend(defaultParams, params);
  var $repoBlock = $(this);
  if ($(this).length) {
    alert('Функция RAAS_repo устарела и будет отключена 18.03.2026. Пожалуйста, обратитесь к разработчику для обновления системы!');
  }
  var $repoContainer;
  if ($(this).attr('data-raas-repo-container')) {
    $repoContainer = $($(this).attr('data-raas-repo-container'));
  } else if ($repoBlock.find(params.repoContainer).length > 0) {
    $repoContainer = $repoBlock.find(params.repoContainer);
  } else {
    $repoContainer = $(params.repoContainer);
  }
  var $repo;
  if ($(this).attr('data-raas-repo')) {
    $repo = $($(this).attr('data-raas-repo'));
  } else if ($repoBlock.find(params.repo).length > 0) {
    $repo = $repoBlock.find(params.repo);
  } else {
    $repo = $(params.repo);
  }
  var checkRequired = function checkRequired() {
    var $repoElement;
    if ($repoBlock.find(params.repoElement).length > 0) {
      $repoElement = $repoBlock.find(params.repoElement + ':has(*[data-required])');
    } else {
      $repoElement = $(params.repoElement + ':has(*[data-required])');
    }
    if ($repoElement.length > 1) {
      $repoElement.find(params.repoDelete).show();
    } else {
      $repoElement.find(params.repoDelete).hide();
    }
    if ($repoBlock.find(params.repoElement).length > 0) {
      $repoElement = $repoBlock.find(params.repoElement);
    } else {
      $repoElement = $(params.repoElement);
    }
    if ($repoElement.length > 1) {
      $repoElement.find(params.repoMove).show();
    } else {
      $repoElement.find(params.repoMove).hide();
    }
  };
  $repoBlock.on('click', params.repoAdd, function () {
    params.onBeforeAdd.call($repoElement);
    var $repoElement = $repo.clone(true);
    $repoElement.attr(params.repoElementChanges);
    $repoContainer.append($repoElement);
    $repoElement.trigger('RAAS_repo.add');
    params.onAfterAdd.call($repoElement);
    checkRequired();
    $repoElement.RAASInitInputs();
    return false;
  });
  $repoBlock.on('click', params.repoDelete, function () {
    var $repoElement;
    if ($(this).closest(params.repoElement).length > 0) {
      $repoElement = $(this).closest(params.repoElement);
    } else if ($(this).attr('data-raas-repo-element')) {
      $repoElement = $($(this).attr('data-raas-repo-element'));
    } else if ($repoBlock.find(params.repoElement).length > 0) {
      $repoElement = $repoBlock.find(params.repoElement);
    } else {
      $repoElement = $(params.repoElement);
    }
    params.onBeforeDelete.call($repoElement);
    $repoElement.trigger('RAAS_repo.delete');
    $repoElement.remove();
    params.onAfterDelete.call($repoElement);
    checkRequired();
    return false;
  });
  var axis = $repoContainer.attr('data-axis');
  $repoContainer.sortable({
    axis: axis ? axis == 'both' ? '' : axis : 'y',
    'handle': params.repoMove,
    containment: $(this)
  });
  checkRequired();
}

/***/ }),

/***/ "./public/src/libs/raas.tree.js":
/*!**************************************!*\
  !*** ./public/src/libs/raas.tree.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * @deprecated Дерево реализовано в RAAS (checkbox-tree) - до 01.01.2026
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(method) {
  var $thisObj;
  var methods = {
    hideUL: function hideUL($obj) {
      $('ul', $obj).hide();
    },
    addPluses: function addPluses($obj) {
      $('li:has(ul)', $obj).prepend('<a href="#" class="jsTreePlus" data-role="fold-subtree"></a>');
    },
    unfold: function unfold($obj, slowly) {
      $obj.children('[data-role="fold-subtree"]').removeClass('jsTreePlus').addClass('jsTreeMinus');
      if (slowly) {
        $obj.find('> ul').slideDown();
      } else {
        $obj.find('> ul').show();
      }
    },
    fold: function fold($obj, slowly) {
      $obj.children('[data-role="fold-subtree"]').removeClass('jsTreeMinus').addClass('jsTreePlus');
      if (slowly) {
        $obj.find('> ul').slideUp();
      } else {
        $obj.find('> ul').hide();
      }
    },
    clickPlus: function clickPlus() {
      methods.unfold($(this).closest('li'), true);
      return false;
    },
    clickMinus: function clickMinus() {
      methods.fold($(this).closest('li'), true);
      return false;
    },
    clickCheckbox: function clickCheckbox() {
      var group;
      var $li = $(this).closest('li');
      var $obj = $li.find('ul input:checkbox');
      if (group = $obj.attr('data-group')) {
        $obj = $obj.filter(function (index) {
          return $(this).attr('data-group') == group;
        });
      }
      if ($(this).is(':checked')) {
        $obj.prop('checked', true);
      } else {
        $obj.prop('checked', false);
      }
      if ($('input:checkbox:checked', $li).length > 0) {
        methods.unfold($li, true);
      } else {
        methods.fold($li, true);
      }
    },
    clickCheckboxAccurate: function clickCheckboxAccurate(e) {
      if ($(this).is(':checked')) {
        $(this).prop('checked', false);
      } else {
        $(this).prop('checked', true);
      }
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    clickCheckboxAccurateLabel: function clickCheckboxAccurateLabel(e) {
      methods.clickCheckboxAccurate.call($(this).find('> input:checkbox')[0], e);
      return false;
    },
    init: function init(options) {
      console.log(this);
      $thisObj = $(this);
      if ($thisObj.length) {
        alert('Функция jQuery.tree устарела и будет отключена 01.01.2026. Пожалуйста, обратитесь к разработчику для обновления системы!');
      }
      methods.hideUL($thisObj);
      methods.addPluses($thisObj);
      methods.unfold($('li:has(input:checked)', $thisObj), false);
      $thisObj.on('click', '.jsTreePlus[data-role="fold-subtree"]', methods.clickPlus);
      $thisObj.on('click', '.jsTreeMinus[data-role="fold-subtree"]', methods.clickMinus);
      $('input:checkbox', $thisObj).on('click', methods.clickCheckbox);
      $('input:checkbox', $thisObj).on('contextmenu', methods.clickCheckboxAccurate);
      $('label:has(>input[type="checkbox"])', $thisObj).on('contextmenu', methods.clickCheckboxAccurateLabel);
    }
  };

  // логика вызова метода
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (_typeof(method) === 'object' || !method) {
    return methods.init.apply(this, arguments);
  }
}
;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!***********************************!*\
  !*** ./public/src/application.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _application_app_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./application/app.vue */ "./public/src/application/app.vue");
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! query-string */ "./node_modules/query-string/index.js");
/* harmony import */ var jquery_scrollto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery.scrollto */ "./node_modules/jquery.scrollto/jquery.scrollTo.js");
/* harmony import */ var jquery_scrollto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery_scrollto__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _libs_raas_tree_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./libs/raas.tree.js */ "./public/src/libs/raas.tree.js");
/* harmony import */ var _libs_raas_autocompleter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./libs/raas.autocompleter.js */ "./public/src/libs/raas.autocompleter.js");
/* harmony import */ var _libs_raas_menu_tree_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./libs/raas.menu-tree.js */ "./public/src/libs/raas.menu-tree.js");
/* harmony import */ var _libs_raas_fill_select_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./libs/raas.fill-select.js */ "./public/src/libs/raas.fill-select.js");
/* harmony import */ var _libs_raas_get_select_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./libs/raas.get-select.js */ "./public/src/libs/raas.get-select.js");
/* harmony import */ var _libs_raas_repo_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./libs/raas.repo.js */ "./public/src/libs/raas.repo.js");
/* harmony import */ var _libs_raas_init_inputs_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./libs/raas.init-inputs.js */ "./public/src/libs/raas.init-inputs.js");
/* harmony import */ var _libs_raas_query_string_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./libs/raas.query-string.js */ "./public/src/libs/raas.query-string.js");
/* harmony import */ var _libs_multitable_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./libs/multitable.js */ "./public/src/libs/multitable.js");












window.queryString = query_string__WEBPACK_IMPORTED_MODULE_11__["default"];

// Vue.use(YmapPlugin, window.ymapSettings);

jQuery(function ($) {
  $.fn.extend({
    RAAS_tree: _libs_raas_tree_js__WEBPACK_IMPORTED_MODULE_2__["default"],
    RAAS_autocompleter: _libs_raas_autocompleter_js__WEBPACK_IMPORTED_MODULE_3__["default"],
    RAAS_menuTree: _libs_raas_menu_tree_js__WEBPACK_IMPORTED_MODULE_4__["default"],
    RAAS_fillSelect: _libs_raas_fill_select_js__WEBPACK_IMPORTED_MODULE_5__["default"],
    RAAS_getSelect: _libs_raas_get_select_js__WEBPACK_IMPORTED_MODULE_6__["default"],
    RAAS_repo: _libs_raas_repo_js__WEBPACK_IMPORTED_MODULE_7__["default"],
    RAASInitInputs: _libs_raas_init_inputs_js__WEBPACK_IMPORTED_MODULE_8__["default"],
    RAAS_MultiTable: _libs_multitable_js__WEBPACK_IMPORTED_MODULE_10__["default"]
  });
  $.extend({
    RAAS_queryString: _libs_raas_query_string_js__WEBPACK_IMPORTED_MODULE_9__["default"]
  });
});
var app, vueRoot;
vueRoot = app = Vue.createApp(_application_app_vue__WEBPACK_IMPORTED_MODULE_0__["default"]);
window.registeredRAASComponents = {};
Object.keys(window.raasComponents).forEach(function (componentURN) {
  window.registeredRAASComponents[componentURN] = vueRoot.component(componentURN, raasComponents[componentURN]);
});
jQuery(document).ready(function ($) {
  window.app = app.mount('#raas-app');
  var hash = document.location.hash;
  if (hash) {
    if ($('.tabbable ul.nav-tabs a[href="' + hash + '"]').length > 0) {
      $('.tabbable ul.nav-tabs a[href="' + hash + '"]').tab('show');
      $.scrollTo(0, 0);
    } else if ($('.accordion a.accordion-toggle[href="' + hash + '"]').length > 0) {
      $('.accordion a.accordion-toggle[href="' + hash + '"]').closest('.accordion').find('.collapse').removeClass('in');
      $('.accordion a.accordion-toggle[href="' + hash + '"]').closest('.accordion-group').find('.collapse').collapse('show');
      $.scrollTo($('.accordion a.accordion-toggle[href="' + hash + '"]')[0]);
    }
  }
  $('*').focus(function () {
    if ($(this).closest('.tabbable .tab-pane').length > 0) {
      var hash = '#' + $(this).closest('.tabbable .tab-pane').attr('id');
      $(this).closest('.tabbable ul.nav-tabs a[href="' + hash + '"]').tab('show');
    }
    if ($(this).closest('.accordion .accordion-body:not(.in)').length > 0) {
      var hash = '#' + $(this).closest('.accordion .accordion-body').attr('id');
      //$(this).closest('.accordion').find('.collapse.in').collapse('hide');
      $(this).closest('.accordion').find('a.accordion-toggle[href="' + hash + '"]').closest('.accordion-group').find('.collapse').collapse('show');
    }
  });
  $('a[data-toggle="tab"]').on('shown', function () {
    var url = $(this).attr('href');
    window.history.pushState({}, document.title, url);
  });

  // $.datepicker.setDefaults({ dateFormat: 'yy-mm-dd' });
  // $.timepicker.setDefaults({ dateFormat: 'yy-mm-dd', timeFormat: 'hh:mm', separator: ' ' });

  $('body').RAASInitInputs();
  $(':reset').click(function () {
    document.location.reload();
    return false;
  });
  $('*[rel*="popover"]').popover().click(function () {
    return false;
  });
  $('*[data-raas-role*="tree"]').RAAS_tree();
  $('*[data-role="raas-repo-block"]:not(:has([data-role="raas-repo-add"]))').find('[data-role="raas-repo-container"]').after('<a href="#" data-role="raas-repo-add"><i class="icon icon-plus"></i></a>');
  $('*[data-role="raas-repo-element"]:not(:has([data-role="raas-repo-del"])), *[data-role="raas-repo"]:not(:has([data-role="raas-repo-del"]))').append('<a href="#" data-role="raas-repo-del"><i class="icon icon-remove"></i></a>');
  $('*[data-role="raas-repo-element"]:not(:has([data-role="raas-repo-move"])), *[data-role="raas-repo"]:not(:has([data-role="raas-repo-move"]))').append('<a href="#" data-role="raas-repo-move"><i class="icon icon-resize-vertical"></i></a>');
  $('*[data-role="raas-repo-block"]').each(function () {
    $(this).RAAS_repo();
  });
  $('[data-role="multitable"]').each(function () {
    $(this).RAAS_MultiTable();
  });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0TmtEO0FBQ1o7QUFDRzs7QUFFMUM7O0FBRUE7QUFDQSw2RkFBNkYsMkNBQTJDOztBQUV4STs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsZ0VBQWU7QUFDeEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFCQUFxQiwwREFBWTs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FB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Z0NBQWdDLENBQUMsQ0FBQzBFLElBQUksQ0FBQyxZQUFXO0lBQUUxRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNnUSxTQUFTLENBQUMsQ0FBQztFQUFDLENBQUMsQ0FBQztFQUU1RWhRLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDMEUsSUFBSSxDQUFDLFlBQVc7SUFDMUMxRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNrUSxlQUFlLENBQUMsQ0FBQztFQUM3QixDQUFDLENBQUM7QUFDTixDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uLi9yYWFzLmNtcy9yZXNvdXJjZXMvanMudnVlMy9hcHBsaWNhdGlvbi9hcHAudnVlLmpzIiwid2VicGFjazovLy8uLi9yYWFzLmNtcy9yZXNvdXJjZXMvanMudnVlMy9hcHBsaWNhdGlvbi9taXhpbnMvZml4ZWQtaGVhZGVyLnZ1ZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uL2FwcC52dWUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2RlY29kZS11cmktY29tcG9uZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWx0ZXItb2JqL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcXVlcnkuc2Nyb2xsdG8vanF1ZXJ5LnNjcm9sbFRvLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9xdWVyeS1zdHJpbmcvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcXVlcnktc3RyaW5nL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zcGxpdC1vbi1maXJzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2V4cG9ydEhlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uL2FwcC52dWU/OGJmNiIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uL2FwcC52dWU/YmRiMiIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvbXVsdGl0YWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5hdXRvY29tcGxldGVyLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLmZpbGwtc2VsZWN0LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLmdldC1zZWxlY3QuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMuaW5pdC1pbnB1dHMuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMubWVudS10cmVlLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLnF1ZXJ5LXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5yZXBvLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLnRyZWUuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHZhciBcImpRdWVyeVwiIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDQmtCw0YDQutCw0YEg0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCo0LjRgNC40L3QsCDRjdC60YDQsNC90LBcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoOiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCo0LjRgNC40L3QsCBib2R5XHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBib2R5V2lkdGg6IDAsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0JLRi9GB0L7RgtCwINGN0LrRgNCw0L3QsFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgd2luZG93SGVpZ2h0OiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCh0LzQtdGJ0LXQvdC40LUg0L/QviDQstC10YDRgtC40LrQsNC70LhcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjcm9sbFRvcDogMCxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQodGC0LDRgNC+0LUg0YHQvNC10YnQtdC90LjQtSDQv9C+INCy0LXRgNGC0LjQutCw0LvQuFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgb2xkU2Nyb2xsVG9wOiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCf0YDQvtC40YHRhdC+0LTQuNGCINC70Lgg0YHQtdC50YfQsNGBINGB0LrRgNC+0LvQu9C40L3Qs1xyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlzU2Nyb2xsaW5nTm93OiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQn9GA0L7QuNGB0YXQvtC00LjRgiDQu9C4INGB0LXQudGH0LDRgSDRgdC60YDQvtC70LvQuNC90LMgKElEIyDRgtCw0LnQvNCw0YPRgtCwKVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQ6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCe0LbQuNC00LDQvdC40LUg0L7QutC+0L3Rh9Cw0L3QuNGPINGB0LrRgNC+0LvQu9C40L3Qs9CwLCDQvNGBXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpc1Njcm9sbGluZ05vd0RlbGF5OiAyNTAsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0J/QvtCz0YDQtdGI0L3QvtGB0YLRjCDRgdC60YDQvtC70LvQuNC90LPQsFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2Nyb2xsaW5nSW5hY2N1cmFjeTogNSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQodC10LvQtdC60YLQvtGAINGB0YHRi9C70L7QuiDQtNC70Y8gc2Nyb2xsVG9cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjcm9sbFRvU2VsZWN0b3I6ICdhW2hyZWYqPVwibW9kYWxcIl1baHJlZio9XCIjXCJdLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnYS5zY3JvbGxUb1tocmVmKj1cIiNcIl0sICcgKyBcclxuICAgICAgICAgICAgICAgICdhW2hyZWZePVwiI1wiXTpub3QoW2hyZWY9XCIjXCJdKTpub3QoW2RhdGEtdG9nZ2xlXSk6bm90KFtkYXRhLWJzLXRvZ2dsZV0pLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnLm1lbnUtdG9wX19saW5rW2hyZWYqPVwiI1wiXSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJy5tZW51LW1haW5fX2xpbmtbaHJlZio9XCIjXCJdLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnLm1lbnUtYm90dG9tX19saW5rW2hyZWYqPVwiI1wiXSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJy5tZW51LW1vYmlsZV9fbGlua1tocmVmKj1cIiNcIl0nLFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0JzQtdC00LjQsC3RgtC40L/RiyAo0YjQuNGA0LjQvdCwINCyIHB4KVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWVkaWFUeXBlczoge1xyXG4gICAgICAgICAgICAgICAgeHhsOiAxNDAwLFxyXG4gICAgICAgICAgICAgICAgeGw6IDEyMDAsXHJcbiAgICAgICAgICAgICAgICBsZzogOTkyLFxyXG4gICAgICAgICAgICAgICAgbWQ6IDc2OCxcclxuICAgICAgICAgICAgICAgIHNtOiA1NzYsXHJcbiAgICAgICAgICAgICAgICB4czogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgbW91bnRlZCgpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5saWdodEJveEluaXQoKTtcclxuICAgICAgICB0aGlzLndpbmRvd1dpZHRoID0gJCh3aW5kb3cpLmlubmVyV2lkdGgoKTtcclxuICAgICAgICB0aGlzLndpbmRvd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgIHRoaXMuYm9keVdpZHRoID0gJCgnYm9keScpLm91dGVyV2lkdGgoKTtcclxuICAgICAgICB0aGlzLmZpeEh0bWwoKTtcclxuICAgICAgICAkKHdpbmRvdylcclxuICAgICAgICAgICAgLm9uKCdyZXNpemUnLCBzZWxmLmZpeEh0bWwpXHJcbiAgICAgICAgICAgIC5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dXaWR0aCA9ICQod2luZG93KS5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2R5V2lkdGggPSAkKCdib2R5Jykub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ3Njcm9sbCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBvbGRTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2Nyb2xsaW5nTm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1Njcm9sbGluZ05vdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2Nyb2xsaW5nTm93VGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2xkU2Nyb2xsVG9wID0gb2xkU2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmdOb3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuaXNTY3JvbGxpbmdOb3dEZWxheSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNjcm9sbFRvU2VsZWN0b3IsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJykuc3BsaXQoJyMnKVswXTtcclxuICAgICAgICAgICAgLy8gaWYgKHVybCkge1xyXG4gICAgICAgICAgICAvLyAgICAgdXJsID0gJyMnICsgdXJsO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmICghdXJsIHx8ICh1cmwgPT0gY3VycmVudFVybCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHJvY2Vzc0hhc2hMaW5rKHRoaXMuaGFzaCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignc2hvdy5icy50YWInLCAnYScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgJCh0aGlzKS5hdHRyKCdocmVmJykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIYXNoTGluayh3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjcm9sbFRvcCA9IHRoaXMub2xkU2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICAvLyAkKCcubWVudS10cmlnZ2VyJykuYXBwZW5kVG8oJy5ib2R5X19tZW51LW1vYmlsZScpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLmNvbmZpcm0gPSB0aGlzLnJlZnMuY29uZmlybTtcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7RgtC/0YDQsNCy0LvRj9C10YIg0LfQsNC/0YDQvtGBINC6IEFQSVxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIFVSTCDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuFxyXG4gICAgICAgICAqIEBwYXJhbSAge21peGVkfSBwb3N0RGF0YSBQT1NULdC00LDQvdC90YvQtSDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuCAo0LXRgdC70LggbnVsbCwg0YLQviBHRVQt0LfQsNC/0YDQvtGBKVxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcn0gYmxvY2tJZCBJRCMg0LHQu9C+0LrQsCDQtNC70Y8g0LTQvtCx0LDQstC70LXQvdC40Y8gQUpBWD17YmxvY2tJZH0g0Lgg0LfQsNCz0L7Qu9C+0LLQutCwIFgtUkFBUy1CbG9jay1JZFxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVzcG9uc2VUeXBlIE1JTUUt0YLQuNC/INC/0L7Qu9GD0YfQsNC10LzQvtCz0L4g0L7RgtCy0LXRgtCwICjQtdGB0LvQuCDQv9GA0LjRgdGD0YLRgdGC0LLRg9C10YIg0YHQu9GN0YggLywg0YLQviDQvtGC0L/RgNCw0LLQu9GP0LXRgtGB0Y8g0YLQsNC60LbQtSDQt9Cw0LPQvtC70L7QstC+0LogQWNjZXB0KVxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVxdWVzdFR5cGUgTUlNRS3RgtC40L8g0LfQsNC/0YDQvtGB0LAgKNC10YHQu9C4INC/0YDQuNGB0YPRgtGB0YLQstGD0LXRgiDRgdC70Y3RiCAvLCDRgtC+INC+0YLQv9GA0LDQstC70Y/QtdGC0YHRjyDRgtCw0LrQttC1INC30LDQs9C+0LvQvtCy0L7QuiBDb250ZW50LVR5cGUpXHJcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBhZGRpdGlvbmFsSGVhZGVycyDQlNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC30LDQs9C+0LvQvtCy0LrQuFxyXG4gICAgICAgICAqIEBwYXJhbSB7QWJvcnRDb250cm9sbGVyfG51bGx9IGFib3J0Q29udHJvbGxlciDQmtC+0L3RgtGA0L7Qu9C70LXRgCDQv9GA0LXRgNGL0LLQsNC90LjRj1xyXG4gICAgICAgICAqIEByZXR1cm4ge21peGVkfSDQoNC10LfRg9C70YzRgtCw0YIg0LfQsNC/0YDQvtGB0LBcclxuICAgICAgICAgKi9cclxuICAgICAgICBhc3luYyBhcGkoXHJcbiAgICAgICAgICAgIHVybCwgXHJcbiAgICAgICAgICAgIHBvc3REYXRhID0gbnVsbCwgXHJcbiAgICAgICAgICAgIGJsb2NrSWQgPSBudWxsLCBcclxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlID0gJ2FwcGxpY2F0aW9uL2pzb24nLCBcclxuICAgICAgICAgICAgcmVxdWVzdFR5cGUgPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcclxuICAgICAgICAgICAgYWRkaXRpb25hbEhlYWRlcnMgPSB7fSxcclxuICAgICAgICAgICAgYWJvcnRDb250cm9sbGVyID0gbnVsbCxcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8gMjAyMy0xMS0wOSwgQVZTOiDQtNC+0LHQsNCy0LjQuyDQtNC10LvQtdC90LjQtSDQv9C+ICMsINGCLtC6LiDRhdGN0YjRgtC10LPQuCDQtNC70Y8g0YHQtdGA0LLQtdGA0LAg0YHQvNGL0YHQu9CwINC90LUg0LjQvNC10Y7RglxyXG4gICAgICAgICAgICBsZXQgcmVhbFVybCA9IHVybC5zcGxpdCgnIycpWzBdO1xyXG4gICAgICAgICAgICBpZiAoIS9cXC9cXC8vZ2kudGVzdChyZWFsVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlYWxVcmxbMF0gIT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbFVybCA9ICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHJlYWxVcmw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxVcmwgPSAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyByZWFsVXJsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7Li4uYWRkaXRpb25hbEhlYWRlcnN9O1xyXG4gICAgICAgICAgICBsZXQgcng7XHJcbiAgICAgICAgICAgIGlmIChibG9ja0lkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIS8oXFw/fCYpQUpBWD0vZ2kudGVzdChyZWFsVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxVcmwgKz0gKC9cXD8vZ2kudGVzdChyZWFsVXJsKSA/ICcmJyA6ICc/JykgKyAnQUpBWD0nICsgYmxvY2tJZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ1gtUkFBUy1CbG9jay1JZCddID0gYmxvY2tJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoL1xcLy9naS50ZXN0KHJlc3BvbnNlVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gcmVzcG9uc2VUeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgvXFwvL2dpLnRlc3QocmVxdWVzdFR5cGUpICYmICEhcG9zdERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gcmVxdWVzdFR5cGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZmV0Y2hPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGFib3J0Q29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLnNpZ25hbCA9IGFib3J0Q29udHJvbGxlci5zaWduYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEhcG9zdERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5tZXRob2QgPSAnUE9TVCc7XHJcbiAgICAgICAgICAgICAgICBpZiAoL2Zvcm0vZ2kudGVzdChyZXF1ZXN0VHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoL211bHRpcGFydC9naS50ZXN0KHJlcXVlc3RUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm9ybURhdGEgID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3N0RGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YSA9IHBvc3REYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBwb3N0RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChuYW1lLCBwb3N0RGF0YVtuYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLmJvZHkgPSBmb3JtRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyDQotCw0Lwg0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60LggYm91bmRhcnkg0YHRgtCw0LLQuNGC0YHRjywg0LHQtdC3INC90LXQs9C+INGE0LjQs9C90Y8g0L/QvtC70YPRh9Cw0LXRgtGB0Y9cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMuYm9keSA9IHdpbmRvdy5xdWVyeVN0cmluZy5zdHJpbmdpZnkocG9zdERhdGEsIHsgYXJyYXlGb3JtYXQ6ICdicmFja2V0JyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgcG9zdERhdGEpID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5ib2R5ID0gcG9zdERhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZmV0Y2hPcHRpb25zKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZWFsVXJsLCBmZXRjaE9wdGlvbnMpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAoL2pzb24vZ2kudGVzdChyZXNwb25zZVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINGB0LzQtdGJ0LXQvdC40LUg0L/QviDQstC10YDRgtC40LrQsNC70Lgg0LTQu9GPIHNjcm9sbFRvIFxyXG4gICAgICAgICAqICjQtNC70Y8g0YHQu9GD0YfQsNGPINGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC5INGI0LDQv9C60LgpXHJcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlc3RZINCi0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y9cclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0U2Nyb2xsT2Zmc2V0KGRlc3RZID0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0L7QsdGK0LXQutGC0LAg0L/QviDRhdGN0Ygt0YLQtdCz0YNcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaGFzaCDRhdGN0Ygt0YLQtdCzICjQv9C10YDQstGL0Lkg0YHQuNC80LLQvtC7ICMpXHJcbiAgICAgICAgICogQHJldHVybiB7alF1ZXJ5fG51bGx9IG51bGwsINC10YHQu9C4INC90LUg0L3QsNC50LTQtdC9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0T2JqRnJvbUhhc2goaGFzaCkge1xyXG4gICAgICAgICAgICBpZiAoaGFzaFswXSAhPSAnIycpIHtcclxuICAgICAgICAgICAgICAgIGhhc2ggPSAnIycgKyBoYXNoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCAkb2JqID0gJChoYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRvYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG9iajtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgJG9iaiA9ICQoJ1tuYW1lPVwiJyArIGhhc2gucmVwbGFjZSgnIycsICcnKSArICdcIl0nKTtcclxuICAgICAgICAgICAgaWYgKCRvYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG9iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQntCx0YDQsNCx0LDRgtGL0LLQsNC10YIg0YXRjdGILdGB0YHRi9C70LrRg1xyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBoYXNoINGF0Y3RiC3RgtC10LMgKNC/0LXRgNCy0YvQuSDRgdC40LzQstC+0LsgIylcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm9jZXNzSGFzaExpbmsoaGFzaCkge1xyXG4gICAgICAgICAgICB0aGlzLmpxRW1pdCgncHJvY2Vzc0hhc2hMaW5rJywgaGFzaCk7XHJcbiAgICAgICAgICAgIGxldCAkb2JqID0gdGhpcy5nZXRPYmpGcm9tSGFzaChoYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRvYmogJiYgJG9iai5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkb2JqLmhhc0NsYXNzKCdtb2RhbCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG9iai5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkb2JqLmhhc0NsYXNzKCd0YWItcGFuZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0ICRoYXNoTGluayA9ICQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhW2hyZWY9XCInICsgaGFzaCArICdcIl0sICcgKyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FbaHJlZj1cIicgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoICsgaGFzaCArICdcIl0sICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYVtocmVmPVwiJyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgJ1wiXSdcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkaGFzaExpbmsubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRoYXNoTGlua1swXS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUbygkb2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPIGxpZ2h0Qm94J9CwXHJcbiAgICAgICAgICogKNC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyBsaWdodENhc2UpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGlnaHRCb3hJbml0KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgICAgICBsZXQgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzQWxsSW1hZ2VMaW5rczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN3aXBlOiB0cnVlLCBcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdzY3JvbGxIb3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAgIHR5cGVNYXBwaW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2ltYWdlJzogJ2pwZyxqcGVnLGdpZixwbmcsYm1wLHdlYnAsc3ZnJywgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIGxldCByeCA9IC9cXC4oanBnfGpwZWd8cGpwZWd8cG5nfGdpZnx3ZWJwfHN2ZykkL2k7XHJcbiAgICAgICAgICAgICQoJ2E6bm90KFtkYXRhLXJlbF49bGlnaHRjYXNlXSk6bm90KFtkYXRhLW5vLWxpZ2h0Ym94XSknKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMucHJvY2Vzc0FsbEltYWdlTGlua3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocngudGVzdCgkKHRoaXMpLmF0dHIoJ2hyZWYnKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdkYXRhLWxpZ2h0Ym94JywgJ3RydWUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgZyA9ICQodGhpcykuYXR0cignZGF0YS1saWdodGJveC1nYWxsZXJ5Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZyB8fCAkKHRoaXMpLmF0dHIoJ2RhdGEtbGlnaHRib3gnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignZGF0YS1yZWwnLCAnbGlnaHRjYXNlJyArIChnID8gJzonICsgZyA6ICcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdkYXRhLWxpZ2h0Ym94LWdhbGxlcnknKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoJ2RhdGEtbGlnaHRib3gnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJ2FbZGF0YS1yZWxePWxpZ2h0Y2FzZV0nKS5saWdodGNhc2UocGFyYW1zKTtcclxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljay5saWdodGNhc2UnLCAnYScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoL3lvdXR1L2dpLnRlc3QoJCh0aGlzKS5hdHRyKCdocmVmJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JrQvtGB0YLRi9C70YwsINGH0YLQvtCx0Ysg0L3QtSDQtNC+0LbQuNC00LDRgtGM0YHRjyDQv9C+0LvQvdC+0Lkg0LfQsNCz0YDRg9C30LrQuCBZb3V0dWJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMjAyMy0wOS0xMywgQVZTOiDQtNC+0LHQsNCy0LjQu9C4INC/0LDRgNCw0LzQtdGC0YAgcmFhcy1saWdodGNhc2UtbG9hZGVkINGH0YLQvtCx0Ysg0L7QsdGA0LDQsdCw0YLRi9Cy0LDRgtGMINCz0LDQu9C10YDQtdGOINCy0LjQtNC10L5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2xpZ2h0Y2FzZS1jYXNlIGlmcmFtZTpub3QoW3JhYXMtbGlnaHRjYXNlLWxvYWRlZF0pJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjbGlnaHRjYXNlLWNhc2UgaWZyYW1lOm5vdChbcmFhcy1saWdodGNhc2UtbG9hZGVkXSknKS5hdHRyKCdyYWFzLWxpZ2h0Y2FzZS1sb2FkZWQnLCAnMScpLnRyaWdnZXIoJ2xvYWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC40LrRgdCw0YbQuNGPIEhUTUwgKNGF0LXQu9C/0LXRgCDQtNC70Y8g0LzQvtC00LjRhNC40LrQsNGG0LjQuCDQstC10YDRgdGC0LrQuClcclxuICAgICAgICAgKiAo0LDQsdGB0YLRgNCw0LrRgtC90YvQuSwg0LTQu9GPINC/0LXRgNC10L7Qv9GA0LXQtNC10LvQtdC90LjRjylcclxuICAgICAgICAgKi9cclxuICAgICAgICBmaXhIdG1sKCkge1xyXG4gICAgICAgICAgICAvLyAuLi5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0L7RgtC+0LHRgNCw0LbQtdC90LjRjyDQvtC60L3QsCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRj1xyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGV4dCAgICAgICDQotC10LrRgdGCINC30LDQv9GA0L7RgdCwXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBva1RleHQgICAgINCi0LXQutGB0YIg0LrQvdC+0L/QutC4IFwi0J7QmlwiXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBjYW5jZWxUZXh0INCi0LXQutGB0YIg0LrQvdC+0L/QutC4IFwi0J7RgtC80LXQvdCwXCJcclxuICAgICAgICAgKiBAcmV0dXJuIHtqUXVlcnkuUHJvbWlzZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25maXJtKHRleHQsIG9rVGV4dCwgY2FuY2VsVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kcmVmcy5jb25maXJtLmNvbmZpcm0odGV4dCwgb2tUZXh0LCBjYW5jZWxUZXh0KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INGG0LXQvdGLXHJcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSB4INCm0LXQvdCwXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvcm1hdFByaWNlKHByaWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZm9ybWF0UHJpY2UocHJpY2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0YfQuNGB0LvQuNGC0LXQu9GM0L3Ri9GFXHJcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSB4INCn0LjRgdC70L5cclxuICAgICAgICAgKiBAcGFyYW0gIHtBcnJheX0gZm9ybXMgPHByZT48Y29kZT5bXHJcbiAgICAgICAgICogICAgICfRgtC+0LLQsNGA0L7QsicsIFxyXG4gICAgICAgICAqICAgICAn0YLQvtCy0LDRgCcsIFxyXG4gICAgICAgICAqICAgICAn0YLQvtCy0LDRgNCwJ1xyXG4gICAgICAgICAqIF08L2NvZGU+PC9wcmU+INCh0LvQvtCy0L7RhNC+0YDQvNGLXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG51bVR4dCh4LCBmb3Jtcykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm51bVR4dCh4LCBmb3Jtcyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JPQtdC90LXRgNC40YDRg9C10YIgalF1ZXJ5LdGB0L7QsdGL0YLQuNC1INGD0YDQvtCy0L3RjyDQtNC+0LrRg9C80LXQvdGC0LBcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgICAqIEBwYXJhbSB7bWl4ZWR9IGRhdGEg0JTQsNC90L3Ri9C1INC00LvRjyDQv9C10YDQtdC00LDRh9C4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAganFFbWl0KGV2ZW50TmFtZSwgZGF0YSA9IG51bGwsIG9yaWdpbmFsRXZlbnQgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSAkKGRvY3VtZW50KS50cmlnZ2VyKGV2ZW50TmFtZSwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0sIDEwKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQodC60YDQvtC70LvQuNGCINC/0L4g0LLQtdGA0YLQuNC60LDQu9C4INC6INC30LDQtNCw0L3QvdC+0LzRgyDQvtCx0YrQtdC60YLRgy/Qv9C+0LfQuNGG0LjQuFxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcnxIVE1MRWxlbWVudHxqUXVlcnl9IGRlc3RpbmF0aW9uINCd0LDQt9C90LDRh9C10L3QuNC1ICjRgtC+0YfQtdC6INC/0L4gWSwg0LvQuNCx0L4g0Y3Qu9C10LzQtdC90YIpXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpbnN0YW50INCd0LXQvNC10LTQu9C10L3QvdGL0Lkg0YHQutGA0L7Qu9C7ICjQv9C70LDQstC90YvQuSwg0LXRgdC70LggZmFsc2UpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2Nyb2xsVG8oZGVzdGluYXRpb24sIGluc3RhbnQgPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBsZXQgZGVzdFkgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mKGRlc3RpbmF0aW9uKSA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoZGVzdGluYXRpb24pID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICQoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSBkZXN0aW5hdGlvbi5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdGluYXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSAkKGRlc3RpbmF0aW9uKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdGluYXRpb24gaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RZID0gZGVzdGluYXRpb24ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkZXN0WSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGVzdFkpXHJcbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChkZXN0WSArIHRoaXMuZ2V0U2Nyb2xsT2Zmc2V0KGRlc3RZKSkpO1xyXG4gICAgICAgICAgICAgICAgdG9wID0gTWF0aC5taW4odG9wLCAkKCcuYm9keScpLm91dGVySGVpZ2h0KCkgLSB0aGlzLndpbmRvd0hlaWdodCAtIDEpOyAvLyAyMDI0LTAxLTE1LCBBVlM6INCf0L7Qv9GA0LDQstC60LAg0L3QsCDQvdC40LbQvdC40Lkg0LrRgNCw0Lkg0LTQvtC60YPQvNC10L3RgtCwXHJcbiAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsVG9EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcCxcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogaW5zdGFudCA/ICdpbnN0YW50JyA6ICdzbW9vdGgnLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbFRvRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oc2Nyb2xsVG9EYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vIDIwMjMtMDktMTksIEFWUzog0YHQtNC10LvQsNC10Lwg0LfQsNGJ0LjRgtGDINGB0LrRgNC+0LvQu9C40L3Qs9CwXHJcbiAgICAgICAgICAgICAgICBpZiAoIWluc3RhbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvdGVjdFNjcm9sbGluZyA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvZHlPdXRlckhlaWdodCA9IHBhcnNlSW50KCQoJy5ib2R5Jykub3V0ZXJIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLmFicyhNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsVG9wKSAtIE1hdGgucm91bmQoc2Nyb2xsVG9EYXRhLnRvcCkpIDwgdGhpcy5zY3JvbGxpbmdJbmFjY3VyYWN5KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzY3JvbGxUb0RhdGEudG9wID4gdGhpcy5zY3JvbGxUb3ApICYmIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLnNjcm9sbFRvcCArIHRoaXMud2luZG93SGVpZ2h0ID49IGJvZHlPdXRlckhlaWdodCAtIHRoaXMuc2Nyb2xsaW5nSW5hY2N1cmFjeSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgfHwgLy8g0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10LwsINC10YHQu9C4INC00LLQuNC20LXQvNGB0Y8g0LLQvdC40LcsINC90L4g0LTQvtGB0YLQuNCz0LvQuCDQvdC40LfQsCDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNjcm9sbFRvRGF0YS50b3AgPCB0aGlzLnNjcm9sbFRvcCkgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIDw9IHRoaXMuc2Nyb2xsaW5nSW5hY2N1cmFjeSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgLy8g0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10LwsINC10YHQu9C4INC00LLQuNC20LXQvNGB0Y8g0LLQstC10YDRhSwg0L3QviDQtNC+0YHRgtC40LPQu9C4INCy0LXRgNGF0LAg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdG9wIHNjcm9sbGluZyB0byAnICsgc2Nyb2xsVG9EYXRhLnRvcCArICcgb24gJyArIHRoaXMuc2Nyb2xsVG9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHByb3RlY3RTY3JvbGxpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdGVjdFNjcm9sbGluZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTY3JvbGxpbmdOb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxUb0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbnRpbnVlIHNjcm9sbGluZyBmcm9tICcgKyB0aGlzLnNjcm9sbFRvcCArICcgdG8gJyArIHNjcm9sbFRvRGF0YS50b3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcy5pc1Njcm9sbGluZ05vd0RlbGF5KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gJC5zY3JvbGxUbyhzY3JvbGxUb0RhdGEudG9wLCBpbnN0YW50ID8gdGhpcy5pc1Njcm9sbGluZ05vd0RlbGF5IDogMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JrQvtC+0YDQtNC40L3QsNGC0Ysg0L3QuNC20L3QtdC5INCz0YDQsNC90LjRhtGLINC+0LrQvdCwXHJcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd2luZG93Qm90dG9tUG9zaXRpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcm9sbFRvcCArIHRoaXMud2luZG93SGVpZ2h0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J/QvtGB0LvQtdC00L3QtdC1INGB0LzQtdGJ0LXQvdC40LUg0L/QviDRgdC60YDQvtC70LvQuNC90LPRg1xyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBzY3JvbGxEZWx0YSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9wIC0gdGhpcy5vbGRTY3JvbGxUb3A7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0iLCIvKipcclxuICog0KTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LUg0LzQtdC90Y5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZml4ZWRIZWFkZXJBY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC40LrRgdC40YDQvtCy0LDQvdC90LDRjyDQu9C4INGI0LDQv9C60LBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZpeGVkSGVhZGVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2Nyb2xsVG9wID4gTWF0aC5tYXgoJCgnLmJvZHlfX2hlYWRlci1vdXRlcicpLm91dGVySGVpZ2h0KCksICQoJy5ib2R5X19oZWFkZXInKS5vdXRlckhlaWdodCgpKSk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICAgIHNjcm9sbFRvcCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZml4ZWRIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbERlbHRhID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXhlZEhlYWRlckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNjcm9sbERlbHRhIDwgLTYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXhlZEhlYWRlckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpeGVkSGVhZGVyQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfVxyXG59IiwiPHNjcmlwdD5cclxuaW1wb3J0IEFwcCBmcm9tIFwiY21zL2FwcGxpY2F0aW9uL2FwcC52dWUuanNcIjtcclxuaW1wb3J0IEZpeGVkSGVhZGVyIGZyb20gXCJjbXMvYXBwbGljYXRpb24vbWl4aW5zL2ZpeGVkLWhlYWRlci52dWUuanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBtaXhpbnM6IFtBcHAsIEZpeGVkSGVhZGVyXSxcclxuICBlbDogXCIjcmFhcy1hcHBcIixcclxuICBkYXRhKCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IHtcclxuICAgICAgZml4ZWRIZWFkZXJBY3RpdmU6IGZhbHNlLFxyXG4gICAgICBsYXN0U2Nyb2xsVG9wOiAwLFxyXG4gICAgICBjb25maWc6IHdpbmRvdy5yYWFzQ29uZmlnLFxyXG4gICAgfTtcclxuICAgIGlmICh3aW5kb3cucmFhc0FwcGxpY2F0aW9uRGF0YSkge1xyXG4gICAgICBPYmplY3QuYXNzaWduKHJlc3VsdCwgd2luZG93LnJhYXNBcHBsaWNhdGlvbkRhdGEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG4gIG1vdW50ZWQoKSB7XHJcbiAgICAvLyB0aGlzLm9wZW5GaWxlTWFuYWdlcihcImltYWdlXCIpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgbGlnaHRCb3hJbml0KG9wdGlvbnMgPSB7fSkge30sXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQutGA0YvQstCw0LXRgiDRhNCw0LnQu9C+0LLRi9C5INC80LXQvdC10LTQttC10YBcclxuICAgICAqIEBwYXJhbSB7J2ZpbGUnfCdpbWFnZSd9IHJvb3RGb2xkZXIg0JrQvtGA0L3QtdCy0LDRjyDQv9Cw0L/QutCwXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHdpdGhGaWxlU2VsZWN0aW9uINCS0YvQsdGA0LDRgtGMINGE0LDQudC7XHJcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz59INCS0YvQsdGA0LDQvdC90YvQuSDRhNCw0LnQu1xyXG4gICAgICovXHJcbiAgICBvcGVuRmlsZU1hbmFnZXIocm9vdEZvbGRlciwgd2l0aEZpbGVTZWxlY3Rpb24pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJHJlZnMucmFhc0FwcC4kcmVmcy5maWxlbWFuYWdlci5vcGVuKFxyXG4gICAgICAgIHJvb3RGb2xkZXIsXHJcbiAgICAgICAgd2l0aEZpbGVTZWxlY3Rpb25cclxuICAgICAgKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqINCU0LvRjyDQvtGC0LvQsNC00LrQuFxyXG4gICAgICovXHJcbiAgICBhbGVydCh4KSB7XHJcbiAgICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KHgpKTtcclxuICAgIH0sXHJcbiAgfSxcclxufTtcclxuPC9zY3JpcHQ+XHJcbiIsImNvbnN0IHRva2VuID0gJyVbYS1mMC05XXsyfSc7XG5jb25zdCBzaW5nbGVNYXRjaGVyID0gbmV3IFJlZ0V4cCgnKCcgKyB0b2tlbiArICcpfChbXiVdKz8pJywgJ2dpJyk7XG5jb25zdCBtdWx0aU1hdGNoZXIgPSBuZXcgUmVnRXhwKCcoJyArIHRva2VuICsgJykrJywgJ2dpJyk7XG5cbmZ1bmN0aW9uIGRlY29kZUNvbXBvbmVudHMoY29tcG9uZW50cywgc3BsaXQpIHtcblx0dHJ5IHtcblx0XHQvLyBUcnkgdG8gZGVjb2RlIHRoZSBlbnRpcmUgc3RyaW5nIGZpcnN0XG5cdFx0cmV0dXJuIFtkZWNvZGVVUklDb21wb25lbnQoY29tcG9uZW50cy5qb2luKCcnKSldO1xuXHR9IGNhdGNoIHtcblx0XHQvLyBEbyBub3RoaW5nXG5cdH1cblxuXHRpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0fVxuXG5cdHNwbGl0ID0gc3BsaXQgfHwgMTtcblxuXHQvLyBTcGxpdCB0aGUgYXJyYXkgaW4gMiBwYXJ0c1xuXHRjb25zdCBsZWZ0ID0gY29tcG9uZW50cy5zbGljZSgwLCBzcGxpdCk7XG5cdGNvbnN0IHJpZ2h0ID0gY29tcG9uZW50cy5zbGljZShzcGxpdCk7XG5cblx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuY2FsbChbXSwgZGVjb2RlQ29tcG9uZW50cyhsZWZ0KSwgZGVjb2RlQ29tcG9uZW50cyhyaWdodCkpO1xufVxuXG5mdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGlucHV0KTtcblx0fSBjYXRjaCB7XG5cdFx0bGV0IHRva2VucyA9IGlucHV0Lm1hdGNoKHNpbmdsZU1hdGNoZXIpIHx8IFtdO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlucHV0ID0gZGVjb2RlQ29tcG9uZW50cyh0b2tlbnMsIGkpLmpvaW4oJycpO1xuXG5cdFx0XHR0b2tlbnMgPSBpbnB1dC5tYXRjaChzaW5nbGVNYXRjaGVyKSB8fCBbXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5wdXQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3VzdG9tRGVjb2RlVVJJQ29tcG9uZW50KGlucHV0KSB7XG5cdC8vIEtlZXAgdHJhY2sgb2YgYWxsIHRoZSByZXBsYWNlbWVudHMgYW5kIHByZWZpbGwgdGhlIG1hcCB3aXRoIHRoZSBgQk9NYFxuXHRjb25zdCByZXBsYWNlTWFwID0ge1xuXHRcdCclRkUlRkYnOiAnXFx1RkZGRFxcdUZGRkQnLFxuXHRcdCclRkYlRkUnOiAnXFx1RkZGRFxcdUZGRkQnLFxuXHR9O1xuXG5cdGxldCBtYXRjaCA9IG11bHRpTWF0Y2hlci5leGVjKGlucHV0KTtcblx0d2hpbGUgKG1hdGNoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIERlY29kZSBhcyBiaWcgY2h1bmtzIGFzIHBvc3NpYmxlXG5cdFx0XHRyZXBsYWNlTWFwW21hdGNoWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFswXSk7XG5cdFx0fSBjYXRjaCB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBkZWNvZGUobWF0Y2hbMF0pO1xuXG5cdFx0XHRpZiAocmVzdWx0ICE9PSBtYXRjaFswXSkge1xuXHRcdFx0XHRyZXBsYWNlTWFwW21hdGNoWzBdXSA9IHJlc3VsdDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRtYXRjaCA9IG11bHRpTWF0Y2hlci5leGVjKGlucHV0KTtcblx0fVxuXG5cdC8vIEFkZCBgJUMyYCBhdCB0aGUgZW5kIG9mIHRoZSBtYXAgdG8gbWFrZSBzdXJlIGl0IGRvZXMgbm90IHJlcGxhY2UgdGhlIGNvbWJpbmF0b3IgYmVmb3JlIGV2ZXJ5dGhpbmcgZWxzZVxuXHRyZXBsYWNlTWFwWyclQzInXSA9ICdcXHVGRkZEJztcblxuXHRjb25zdCBlbnRyaWVzID0gT2JqZWN0LmtleXMocmVwbGFjZU1hcCk7XG5cblx0Zm9yIChjb25zdCBrZXkgb2YgZW50cmllcykge1xuXHRcdC8vIFJlcGxhY2UgYWxsIGRlY29kZWQgY29tcG9uZW50c1xuXHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShuZXcgUmVnRXhwKGtleSwgJ2cnKSwgcmVwbGFjZU1hcFtrZXldKTtcblx0fVxuXG5cdHJldHVybiBpbnB1dDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVjb2RlVXJpQ29tcG9uZW50KGVuY29kZWRVUkkpIHtcblx0aWYgKHR5cGVvZiBlbmNvZGVkVVJJICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGBlbmNvZGVkVVJJYCB0byBiZSBvZiB0eXBlIGBzdHJpbmdgLCBnb3QgYCcgKyB0eXBlb2YgZW5jb2RlZFVSSSArICdgJyk7XG5cdH1cblxuXHR0cnkge1xuXHRcdC8vIFRyeSB0aGUgYnVpbHQgaW4gZGVjb2RlciBmaXJzdFxuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZW5jb2RlZFVSSSk7XG5cdH0gY2F0Y2gge1xuXHRcdC8vIEZhbGxiYWNrIHRvIGEgbW9yZSBhZHZhbmNlZCBkZWNvZGVyXG5cdFx0cmV0dXJuIGN1c3RvbURlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkVVJJKTtcblx0fVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGluY2x1ZGVLZXlzKG9iamVjdCwgcHJlZGljYXRlKSB7XG5cdGNvbnN0IHJlc3VsdCA9IHt9O1xuXG5cdGlmIChBcnJheS5pc0FycmF5KHByZWRpY2F0ZSkpIHtcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBwcmVkaWNhdGUpIHtcblx0XHRcdGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwga2V5KTtcblx0XHRcdGlmIChkZXNjcmlwdG9yPy5lbnVtZXJhYmxlKSB7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzY3JpcHRvcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIGBSZWZsZWN0Lm93bktleXMoKWAgaXMgcmVxdWlyZWQgdG8gcmV0cmlldmUgc3ltYm9sIHByb3BlcnRpZXNcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMob2JqZWN0KSkge1xuXHRcdFx0Y29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuXHRcdFx0aWYgKGRlc2NyaXB0b3IuZW51bWVyYWJsZSkge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXHRcdFx0XHRpZiAocHJlZGljYXRlKGtleSwgdmFsdWUsIG9iamVjdCkpIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2NyaXB0b3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y2x1ZGVLZXlzKG9iamVjdCwgcHJlZGljYXRlKSB7XG5cdGlmIChBcnJheS5pc0FycmF5KHByZWRpY2F0ZSkpIHtcblx0XHRjb25zdCBzZXQgPSBuZXcgU2V0KHByZWRpY2F0ZSk7XG5cdFx0cmV0dXJuIGluY2x1ZGVLZXlzKG9iamVjdCwga2V5ID0+ICFzZXQuaGFzKGtleSkpO1xuXHR9XG5cblx0cmV0dXJuIGluY2x1ZGVLZXlzKG9iamVjdCwgKGtleSwgdmFsdWUsIG9iamVjdCkgPT4gIXByZWRpY2F0ZShrZXksIHZhbHVlLCBvYmplY3QpKTtcbn1cbiIsIi8qIVxuICogalF1ZXJ5LnNjcm9sbFRvXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDcgQXJpZWwgRmxlc2xlciAtIGFmbGVzbGVyIOKXiyBnbWFpbCDigKIgY29tIHwgaHR0cHM6Ly9naXRodWIuY29tL2ZsZXNsZXJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVFxuICogaHR0cHM6Ly9naXRodWIuY29tL2ZsZXNsZXIvanF1ZXJ5LnNjcm9sbFRvXG4gKiBAcHJvamVjdERlc2NyaXB0aW9uIExpZ2h0d2VpZ2h0LCBjcm9zcy1icm93c2VyIGFuZCBoaWdobHkgY3VzdG9taXphYmxlIGFuaW1hdGVkIHNjcm9sbGluZyB3aXRoIGpRdWVyeVxuICogQGF1dGhvciBBcmllbCBGbGVzbGVyXG4gKiBAdmVyc2lvbiAyLjEuM1xuICovXG47KGZ1bmN0aW9uKGZhY3RvcnkpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gQU1EXG5cdFx0ZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0Ly8gQ29tbW9uSlNcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIEdsb2JhbFxuXHRcdGZhY3RvcnkoalF1ZXJ5KTtcblx0fVxufSkoZnVuY3Rpb24oJCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyICRzY3JvbGxUbyA9ICQuc2Nyb2xsVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBzZXR0aW5ncykge1xuXHRcdHJldHVybiAkKHdpbmRvdykuc2Nyb2xsVG8odGFyZ2V0LCBkdXJhdGlvbiwgc2V0dGluZ3MpO1xuXHR9O1xuXG5cdCRzY3JvbGxUby5kZWZhdWx0cyA9IHtcblx0XHRheGlzOid4eScsXG5cdFx0ZHVyYXRpb246IDAsXG5cdFx0bGltaXQ6dHJ1ZVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGlzV2luKGVsZW0pIHtcblx0XHRyZXR1cm4gIWVsZW0ubm9kZU5hbWUgfHxcblx0XHRcdCQuaW5BcnJheShlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksIFsnaWZyYW1lJywnI2RvY3VtZW50JywnaHRtbCcsJ2JvZHknXSkgIT09IC0xO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNGdW5jdGlvbihvYmopIHtcblx0XHQvLyBCcm91Z2h0IGZyb20galF1ZXJ5IHNpbmNlIGl0J3MgZGVwcmVjYXRlZFxuXHRcdHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nXG5cdH1cblxuXHQkLmZuLnNjcm9sbFRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgc2V0dGluZ3MpIHtcblx0XHRpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnb2JqZWN0Jykge1xuXHRcdFx0c2V0dGluZ3MgPSBkdXJhdGlvbjtcblx0XHRcdGR1cmF0aW9uID0gMDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBzZXR0aW5ncyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0c2V0dGluZ3MgPSB7IG9uQWZ0ZXI6c2V0dGluZ3MgfTtcblx0XHR9XG5cdFx0aWYgKHRhcmdldCA9PT0gJ21heCcpIHtcblx0XHRcdHRhcmdldCA9IDllOTtcblx0XHR9XG5cblx0XHRzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCAkc2Nyb2xsVG8uZGVmYXVsdHMsIHNldHRpbmdzKTtcblx0XHQvLyBTcGVlZCBpcyBzdGlsbCByZWNvZ25pemVkIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXHRcdGR1cmF0aW9uID0gZHVyYXRpb24gfHwgc2V0dGluZ3MuZHVyYXRpb247XG5cdFx0Ly8gTWFrZSBzdXJlIHRoZSBzZXR0aW5ncyBhcmUgZ2l2ZW4gcmlnaHRcblx0XHR2YXIgcXVldWUgPSBzZXR0aW5ncy5xdWV1ZSAmJiBzZXR0aW5ncy5heGlzLmxlbmd0aCA+IDE7XG5cdFx0aWYgKHF1ZXVlKSB7XG5cdFx0XHQvLyBMZXQncyBrZWVwIHRoZSBvdmVyYWxsIGR1cmF0aW9uXG5cdFx0XHRkdXJhdGlvbiAvPSAyO1xuXHRcdH1cblx0XHRzZXR0aW5ncy5vZmZzZXQgPSBib3RoKHNldHRpbmdzLm9mZnNldCk7XG5cdFx0c2V0dGluZ3Mub3ZlciA9IGJvdGgoc2V0dGluZ3Mub3Zlcik7XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gTnVsbCB0YXJnZXQgeWllbGRzIG5vdGhpbmcsIGp1c3QgbGlrZSBqUXVlcnkgZG9lc1xuXHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkgcmV0dXJuO1xuXG5cdFx0XHR2YXIgd2luID0gaXNXaW4odGhpcyksXG5cdFx0XHRcdGVsZW0gPSB3aW4gPyB0aGlzLmNvbnRlbnRXaW5kb3cgfHwgd2luZG93IDogdGhpcyxcblx0XHRcdFx0JGVsZW0gPSAkKGVsZW0pLFxuXHRcdFx0XHR0YXJnID0gdGFyZ2V0LFxuXHRcdFx0XHRhdHRyID0ge30sXG5cdFx0XHRcdHRvZmY7XG5cblx0XHRcdHN3aXRjaCAodHlwZW9mIHRhcmcpIHtcblx0XHRcdFx0Ly8gQSBudW1iZXIgd2lsbCBwYXNzIHRoZSByZWdleFxuXHRcdFx0XHRjYXNlICdudW1iZXInOlxuXHRcdFx0XHRjYXNlICdzdHJpbmcnOlxuXHRcdFx0XHRcdGlmICgvXihbKy1dPT8pP1xcZCsoXFwuXFxkKyk/KHB4fCUpPyQvLnRlc3QodGFyZykpIHtcblx0XHRcdFx0XHRcdHRhcmcgPSBib3RoKHRhcmcpO1xuXHRcdFx0XHRcdFx0Ly8gV2UgYXJlIGRvbmVcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBSZWxhdGl2ZS9BYnNvbHV0ZSBzZWxlY3RvclxuXHRcdFx0XHRcdHRhcmcgPSB3aW4gPyAkKHRhcmcpIDogJCh0YXJnLCBlbGVtKTtcblx0XHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRcdGNhc2UgJ29iamVjdCc6XG5cdFx0XHRcdFx0aWYgKHRhcmcubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdFx0XHRcdFx0Ly8gRE9NRWxlbWVudCAvIGpRdWVyeVxuXHRcdFx0XHRcdGlmICh0YXJnLmlzIHx8IHRhcmcuc3R5bGUpIHtcblx0XHRcdFx0XHRcdC8vIEdldCB0aGUgcmVhbCBwb3NpdGlvbiBvZiB0aGUgdGFyZ2V0XG5cdFx0XHRcdFx0XHR0b2ZmID0gKHRhcmcgPSAkKHRhcmcpKS5vZmZzZXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBvZmZzZXQgPSBpc0Z1bmN0aW9uKHNldHRpbmdzLm9mZnNldCkgJiYgc2V0dGluZ3Mub2Zmc2V0KGVsZW0sIHRhcmcpIHx8IHNldHRpbmdzLm9mZnNldDtcblxuXHRcdFx0JC5lYWNoKHNldHRpbmdzLmF4aXMuc3BsaXQoJycpLCBmdW5jdGlvbihpLCBheGlzKSB7XG5cdFx0XHRcdHZhciBQb3NcdD0gYXhpcyA9PT0gJ3gnID8gJ0xlZnQnIDogJ1RvcCcsXG5cdFx0XHRcdFx0cG9zID0gUG9zLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0a2V5ID0gJ3Njcm9sbCcgKyBQb3MsXG5cdFx0XHRcdFx0cHJldiA9ICRlbGVtW2tleV0oKSxcblx0XHRcdFx0XHRtYXggPSAkc2Nyb2xsVG8ubWF4KGVsZW0sIGF4aXMpO1xuXG5cdFx0XHRcdGlmICh0b2ZmKSB7Ly8galF1ZXJ5IC8gRE9NRWxlbWVudFxuXHRcdFx0XHRcdGF0dHJba2V5XSA9IHRvZmZbcG9zXSArICh3aW4gPyAwIDogcHJldiAtICRlbGVtLm9mZnNldCgpW3Bvc10pO1xuXG5cdFx0XHRcdFx0Ly8gSWYgaXQncyBhIGRvbSBlbGVtZW50LCByZWR1Y2UgdGhlIG1hcmdpblxuXHRcdFx0XHRcdGlmIChzZXR0aW5ncy5tYXJnaW4pIHtcblx0XHRcdFx0XHRcdGF0dHJba2V5XSAtPSBwYXJzZUludCh0YXJnLmNzcygnbWFyZ2luJytQb3MpLCAxMCkgfHwgMDtcblx0XHRcdFx0XHRcdGF0dHJba2V5XSAtPSBwYXJzZUludCh0YXJnLmNzcygnYm9yZGVyJytQb3MrJ1dpZHRoJyksIDEwKSB8fCAwO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGF0dHJba2V5XSArPSBvZmZzZXRbcG9zXSB8fCAwO1xuXG5cdFx0XHRcdFx0aWYgKHNldHRpbmdzLm92ZXJbcG9zXSkge1xuXHRcdFx0XHRcdFx0Ly8gU2Nyb2xsIHRvIGEgZnJhY3Rpb24gb2YgaXRzIHdpZHRoL2hlaWdodFxuXHRcdFx0XHRcdFx0YXR0cltrZXldICs9IHRhcmdbYXhpcyA9PT0gJ3gnPyd3aWR0aCc6J2hlaWdodCddKCkgKiBzZXR0aW5ncy5vdmVyW3Bvc107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciB2YWwgPSB0YXJnW3Bvc107XG5cdFx0XHRcdFx0Ly8gSGFuZGxlIHBlcmNlbnRhZ2UgdmFsdWVzXG5cdFx0XHRcdFx0YXR0cltrZXldID0gdmFsLnNsaWNlICYmIHZhbC5zbGljZSgtMSkgPT09ICclJyA/XG5cdFx0XHRcdFx0XHRwYXJzZUZsb2F0KHZhbCkgLyAxMDAgKiBtYXhcblx0XHRcdFx0XHRcdDogdmFsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTnVtYmVyIG9yICdudW1iZXInXG5cdFx0XHRcdGlmIChzZXR0aW5ncy5saW1pdCAmJiAvXlxcZCskLy50ZXN0KGF0dHJba2V5XSkpIHtcblx0XHRcdFx0XHQvLyBDaGVjayB0aGUgbGltaXRzXG5cdFx0XHRcdFx0YXR0cltrZXldID0gYXR0cltrZXldIDw9IDAgPyAwIDogTWF0aC5taW4oYXR0cltrZXldLCBtYXgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRG9uJ3Qgd2FzdGUgdGltZSBhbmltYXRpbmcsIGlmIHRoZXJlJ3Mgbm8gbmVlZC5cblx0XHRcdFx0aWYgKCFpICYmIHNldHRpbmdzLmF4aXMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdGlmIChwcmV2ID09PSBhdHRyW2tleV0pIHtcblx0XHRcdFx0XHRcdC8vIE5vIGFuaW1hdGlvbiBuZWVkZWRcblx0XHRcdFx0XHRcdGF0dHIgPSB7fTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHF1ZXVlKSB7XG5cdFx0XHRcdFx0XHQvLyBJbnRlcm1lZGlhdGUgYW5pbWF0aW9uXG5cdFx0XHRcdFx0XHRhbmltYXRlKHNldHRpbmdzLm9uQWZ0ZXJGaXJzdCk7XG5cdFx0XHRcdFx0XHQvLyBEb24ndCBhbmltYXRlIHRoaXMgYXhpcyBhZ2FpbiBpbiB0aGUgbmV4dCBpdGVyYXRpb24uXG5cdFx0XHRcdFx0XHRhdHRyID0ge307XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YW5pbWF0ZShzZXR0aW5ncy5vbkFmdGVyKTtcblxuXHRcdFx0ZnVuY3Rpb24gYW5pbWF0ZShjYWxsYmFjaykge1xuXHRcdFx0XHR2YXIgb3B0cyA9ICQuZXh0ZW5kKHt9LCBzZXR0aW5ncywge1xuXHRcdFx0XHRcdC8vIFRoZSBxdWV1ZSBzZXR0aW5nIGNvbmZsaWN0cyB3aXRoIGFuaW1hdGUoKVxuXHRcdFx0XHRcdC8vIEZvcmNlIGl0IHRvIGFsd2F5cyBiZSB0cnVlXG5cdFx0XHRcdFx0cXVldWU6IHRydWUsXG5cdFx0XHRcdFx0ZHVyYXRpb246IGR1cmF0aW9uLFxuXHRcdFx0XHRcdGNvbXBsZXRlOiBjYWxsYmFjayAmJiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoZWxlbSwgdGFyZywgc2V0dGluZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRlbGVtLmFuaW1hdGUoYXR0ciwgb3B0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0Ly8gTWF4IHNjcm9sbGluZyBwb3NpdGlvbiwgd29ya3Mgb24gcXVpcmtzIG1vZGVcblx0Ly8gSXQgb25seSBmYWlscyAobm90IHRvbyBiYWRseSkgb24gSUUsIHF1aXJrcyBtb2RlLlxuXHQkc2Nyb2xsVG8ubWF4ID0gZnVuY3Rpb24oZWxlbSwgYXhpcykge1xuXHRcdHZhciBEaW0gPSBheGlzID09PSAneCcgPyAnV2lkdGgnIDogJ0hlaWdodCcsXG5cdFx0XHRzY3JvbGwgPSAnc2Nyb2xsJytEaW07XG5cblx0XHRpZiAoIWlzV2luKGVsZW0pKVxuXHRcdFx0cmV0dXJuIGVsZW1bc2Nyb2xsXSAtICQoZWxlbSlbRGltLnRvTG93ZXJDYXNlKCldKCk7XG5cblx0XHR2YXIgc2l6ZSA9ICdjbGllbnQnICsgRGltLFxuXHRcdFx0ZG9jID0gZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0uZG9jdW1lbnQsXG5cdFx0XHRodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudCxcblx0XHRcdGJvZHkgPSBkb2MuYm9keTtcblxuXHRcdHJldHVybiBNYXRoLm1heChodG1sW3Njcm9sbF0sIGJvZHlbc2Nyb2xsXSkgLSBNYXRoLm1pbihodG1sW3NpemVdLCBib2R5W3NpemVdKTtcblx0fTtcblxuXHRmdW5jdGlvbiBib3RoKHZhbCkge1xuXHRcdHJldHVybiBpc0Z1bmN0aW9uKHZhbCkgfHwgJC5pc1BsYWluT2JqZWN0KHZhbCkgPyB2YWwgOiB7IHRvcDp2YWwsIGxlZnQ6dmFsIH07XG5cdH1cblxuXHQvLyBBZGQgc3BlY2lhbCBob29rcyBzbyB0aGF0IHdpbmRvdyBzY3JvbGwgcHJvcGVydGllcyBjYW4gYmUgYW5pbWF0ZWRcblx0JC5Ud2Vlbi5wcm9wSG9va3Muc2Nyb2xsTGVmdCA9XG5cdCQuVHdlZW4ucHJvcEhvb2tzLnNjcm9sbFRvcCA9IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRcdHJldHVybiAkKHQuZWxlbSlbdC5wcm9wXSgpO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbih0KSB7XG5cdFx0XHR2YXIgY3VyciA9IHRoaXMuZ2V0KHQpO1xuXHRcdFx0Ly8gSWYgaW50ZXJydXB0IGlzIHRydWUgYW5kIHVzZXIgc2Nyb2xsZWQsIHN0b3AgYW5pbWF0aW5nXG5cdFx0XHRpZiAodC5vcHRpb25zLmludGVycnVwdCAmJiB0Ll9sYXN0ICYmIHQuX2xhc3QgIT09IGN1cnIpIHtcblx0XHRcdFx0cmV0dXJuICQodC5lbGVtKS5zdG9wKCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgbmV4dCA9IE1hdGgucm91bmQodC5ub3cpO1xuXHRcdFx0Ly8gRG9uJ3Qgd2FzdGUgQ1BVXG5cdFx0XHQvLyBCcm93c2VycyBkb24ndCByZW5kZXIgZmxvYXRpbmcgcG9pbnQgc2Nyb2xsXG5cdFx0XHRpZiAoY3VyciAhPT0gbmV4dCkge1xuXHRcdFx0XHQkKHQuZWxlbSlbdC5wcm9wXShuZXh0KTtcblx0XHRcdFx0dC5fbGFzdCA9IHRoaXMuZ2V0KHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBBTUQgcmVxdWlyZW1lbnRcblx0cmV0dXJuICRzY3JvbGxUbztcbn0pO1xuIiwiaW1wb3J0IGRlY29kZUNvbXBvbmVudCBmcm9tICdkZWNvZGUtdXJpLWNvbXBvbmVudCc7XG5pbXBvcnQge2luY2x1ZGVLZXlzfSBmcm9tICdmaWx0ZXItb2JqJztcbmltcG9ydCBzcGxpdE9uRmlyc3QgZnJvbSAnc3BsaXQtb24tZmlyc3QnO1xuXG5jb25zdCBpc051bGxPclVuZGVmaW5lZCA9IHZhbHVlID0+IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL3ByZWZlci1jb2RlLXBvaW50XG5jb25zdCBzdHJpY3RVcmlFbmNvZGUgPSBzdHJpbmcgPT4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZykucmVwbGFjZUFsbCgvWyEnKCkqXS9nLCB4ID0+IGAlJHt4LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCl9YCk7XG5cbmNvbnN0IGVuY29kZUZyYWdtZW50SWRlbnRpZmllciA9IFN5bWJvbCgnZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyJyk7XG5cbmZ1bmN0aW9uIGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKSB7XG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzoge1xuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHJlc3VsdC5sZW5ndGg7XG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHRcdC4uLnJlc3VsdCwgW2VuY29kZShrZXksIG9wdGlvbnMpLCAnWycsIGluZGV4LCAnXSddLmpvaW4oJycpLFxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbJywgZW5jb2RlKGluZGV4LCBvcHRpb25zKSwgJ109JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyksXG5cdFx0XHRcdF07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2JyYWNrZXQnOiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXSddLmpvaW4oJycpLFxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXT0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKSxcblx0XHRcdFx0XTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29sb24tbGlzdC1zZXBhcmF0b3InOiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICc6bGlzdD0nXS5qb2luKCcnKSxcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnOmxpc3Q9JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyksXG5cdFx0XHRcdF07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2NvbW1hJzpcblx0XHRjYXNlICdzZXBhcmF0b3InOlxuXHRcdGNhc2UgJ2JyYWNrZXQtc2VwYXJhdG9yJzoge1xuXHRcdFx0Y29uc3Qga2V5VmFsdWVTZXBhcmF0b3IgPSBvcHRpb25zLmFycmF5Rm9ybWF0ID09PSAnYnJhY2tldC1zZXBhcmF0b3InXG5cdFx0XHRcdD8gJ1tdPSdcblx0XHRcdFx0OiAnPSc7XG5cblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhbnNsYXRlIG51bGwgdG8gYW4gZW1wdHkgc3RyaW5nIHNvIHRoYXQgaXQgZG9lc24ndCBzZXJpYWxpemUgYXMgJ251bGwnXG5cdFx0XHRcdHZhbHVlID0gdmFsdWUgPT09IG51bGwgPyAnJyA6IHZhbHVlO1xuXG5cdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtbZW5jb2RlKGtleSwgb3B0aW9ucyksIGtleVZhbHVlU2VwYXJhdG9yLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1tyZXN1bHQsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4ob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcildO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkZWZhdWx0OiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRpb25zKSxcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpLFxuXHRcdFx0XHRdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucykge1xuXHRsZXQgcmVzdWx0O1xuXG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRyZXN1bHQgPSAvXFxbKFxcZCopXSQvLmV4ZWMoa2V5KTtcblxuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXFxkKl0kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0ge307XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldW3Jlc3VsdFsxXV0gPSB2YWx1ZTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnYnJhY2tldCc6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0cmVzdWx0ID0gLyhcXFtdKSQvLmV4ZWMoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW10kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW3ZhbHVlXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIHZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29sb24tbGlzdC1zZXBhcmF0b3InOiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdHJlc3VsdCA9IC8oOmxpc3QpJC8uZXhlYyhrZXkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvOmxpc3QkLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW3ZhbHVlXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIHZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29tbWEnOlxuXHRcdGNhc2UgJ3NlcGFyYXRvcic6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0Y29uc3QgaXNBcnJheSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuaW5jbHVkZXMob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cdFx0XHRcdGNvbnN0IGlzRW5jb2RlZEFycmF5ID0gKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIWlzQXJyYXkgJiYgZGVjb2RlKHZhbHVlLCBvcHRpb25zKS5pbmNsdWRlcyhvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKSk7XG5cdFx0XHRcdHZhbHVlID0gaXNFbmNvZGVkQXJyYXkgPyBkZWNvZGUodmFsdWUsIG9wdGlvbnMpIDogdmFsdWU7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gaXNBcnJheSB8fCBpc0VuY29kZWRBcnJheSA/IHZhbHVlLnNwbGl0KG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpLm1hcChpdGVtID0+IGRlY29kZShpdGVtLCBvcHRpb25zKSkgOiAodmFsdWUgPT09IG51bGwgPyB2YWx1ZSA6IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykpO1xuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gbmV3VmFsdWU7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2JyYWNrZXQtc2VwYXJhdG9yJzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRjb25zdCBpc0FycmF5ID0gLyhcXFtdKSQvLnRlc3Qoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW10kLywgJycpO1xuXG5cdFx0XHRcdGlmICghaXNBcnJheSkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZSA/IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykgOiB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBhcnJheVZhbHVlID0gdmFsdWUgPT09IG51bGxcblx0XHRcdFx0XHQ/IFtdXG5cdFx0XHRcdFx0OiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpLnNwbGl0KG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpO1xuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gYXJyYXlWYWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIC4uLmFycmF5VmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkZWZhdWx0OiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFsuLi5bYWNjdW11bGF0b3Jba2V5XV0uZmxhdCgpLCB2YWx1ZV07XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUFycmF5Rm9ybWF0U2VwYXJhdG9yKHZhbHVlKSB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnIHx8IHZhbHVlLmxlbmd0aCAhPT0gMSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2FycmF5Rm9ybWF0U2VwYXJhdG9yIG11c3QgYmUgc2luZ2xlIGNoYXJhY3RlciBzdHJpbmcnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBlbmNvZGUodmFsdWUsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMuZW5jb2RlKSB7XG5cdFx0cmV0dXJuIG9wdGlvbnMuc3RyaWN0ID8gc3RyaWN0VXJpRW5jb2RlKHZhbHVlKSA6IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRlY29kZSh2YWx1ZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5kZWNvZGUpIHtcblx0XHRyZXR1cm4gZGVjb2RlQ29tcG9uZW50KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24ga2V5c1NvcnRlcihpbnB1dCkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcblx0XHRyZXR1cm4gaW5wdXQuc29ydCgpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4ga2V5c1NvcnRlcihPYmplY3Qua2V5cyhpbnB1dCkpXG5cdFx0XHQuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEpIC0gTnVtYmVyKGIpKVxuXHRcdFx0Lm1hcChrZXkgPT4gaW5wdXRba2V5XSk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUhhc2goaW5wdXQpIHtcblx0Y29uc3QgaGFzaFN0YXJ0ID0gaW5wdXQuaW5kZXhPZignIycpO1xuXHRpZiAoaGFzaFN0YXJ0ICE9PSAtMSkge1xuXHRcdGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgaGFzaFN0YXJ0KTtcblx0fVxuXG5cdHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gZ2V0SGFzaCh1cmwpIHtcblx0bGV0IGhhc2ggPSAnJztcblx0Y29uc3QgaGFzaFN0YXJ0ID0gdXJsLmluZGV4T2YoJyMnKTtcblx0aWYgKGhhc2hTdGFydCAhPT0gLTEpIHtcblx0XHRoYXNoID0gdXJsLnNsaWNlKGhhc2hTdGFydCk7XG5cdH1cblxuXHRyZXR1cm4gaGFzaDtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucywgdHlwZSkge1xuXHRpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHR5cGUodmFsdWUpO1xuXHR9XG5cblx0aWYgKG9wdGlvbnMucGFyc2VCb29sZWFucyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnIHx8IHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICdmYWxzZScpKSB7XG5cdFx0cmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJztcblx0fVxuXG5cdGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhTnVtYmVyLmlzTmFOKE51bWJlcih2YWx1ZSkpICYmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKSAhPT0gJycpKSB7XG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSk7XG5cdH1cblxuXHRpZiAob3B0aW9ucy5wYXJzZU51bWJlcnMgJiYgIU51bWJlci5pc05hTihOdW1iZXIodmFsdWUpKSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgIT09ICcnKSkge1xuXHRcdHJldHVybiBOdW1iZXIodmFsdWUpO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdChpbnB1dCkge1xuXHRpbnB1dCA9IHJlbW92ZUhhc2goaW5wdXQpO1xuXHRjb25zdCBxdWVyeVN0YXJ0ID0gaW5wdXQuaW5kZXhPZignPycpO1xuXHRpZiAocXVlcnlTdGFydCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQuc2xpY2UocXVlcnlTdGFydCArIDEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2UocXVlcnksIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IHtcblx0XHRkZWNvZGU6IHRydWUsXG5cdFx0c29ydDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnLFxuXHRcdGFycmF5Rm9ybWF0U2VwYXJhdG9yOiAnLCcsXG5cdFx0cGFyc2VOdW1iZXJzOiBmYWxzZSxcblx0XHRwYXJzZUJvb2xlYW5zOiBmYWxzZSxcblx0XHR0eXBlczogT2JqZWN0LmNyZWF0ZShudWxsKSxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdHZhbGlkYXRlQXJyYXlGb3JtYXRTZXBhcmF0b3Iob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cblx0Y29uc3QgZm9ybWF0dGVyID0gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucyk7XG5cblx0Ly8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIG5vIHByb3RvdHlwZVxuXHRjb25zdCByZXR1cm5WYWx1ZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0aWYgKHR5cGVvZiBxdWVyeSAhPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gcmV0dXJuVmFsdWU7XG5cdH1cblxuXHRxdWVyeSA9IHF1ZXJ5LnRyaW0oKS5yZXBsYWNlKC9eWz8jJl0vLCAnJyk7XG5cblx0aWYgKCFxdWVyeSkge1xuXHRcdHJldHVybiByZXR1cm5WYWx1ZTtcblx0fVxuXG5cdGZvciAoY29uc3QgcGFyYW1ldGVyIG9mIHF1ZXJ5LnNwbGl0KCcmJykpIHtcblx0XHRpZiAocGFyYW1ldGVyID09PSAnJykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGFyYW1ldGVyXyA9IG9wdGlvbnMuZGVjb2RlID8gcGFyYW1ldGVyLnJlcGxhY2VBbGwoJysnLCAnICcpIDogcGFyYW1ldGVyO1xuXG5cdFx0bGV0IFtrZXksIHZhbHVlXSA9IHNwbGl0T25GaXJzdChwYXJhbWV0ZXJfLCAnPScpO1xuXG5cdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRrZXkgPSBwYXJhbWV0ZXJfO1xuXHRcdH1cblxuXHRcdC8vIE1pc3NpbmcgYD1gIHNob3VsZCBiZSBgbnVsbGA6XG5cdFx0Ly8gaHR0cDovL3czLm9yZy9UUi8yMDEyL1dELXVybC0yMDEyMDUyNC8jY29sbGVjdC11cmwtcGFyYW1ldGVyc1xuXHRcdHZhbHVlID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiAoWydjb21tYScsICdzZXBhcmF0b3InLCAnYnJhY2tldC1zZXBhcmF0b3InXS5pbmNsdWRlcyhvcHRpb25zLmFycmF5Rm9ybWF0KSA/IHZhbHVlIDogZGVjb2RlKHZhbHVlLCBvcHRpb25zKSk7XG5cdFx0Zm9ybWF0dGVyKGRlY29kZShrZXksIG9wdGlvbnMpLCB2YWx1ZSwgcmV0dXJuVmFsdWUpO1xuXHR9XG5cblx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocmV0dXJuVmFsdWUpKSB7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgb3B0aW9ucy50eXBlc1trZXldICE9PSAnc3RyaW5nJykge1xuXHRcdFx0Zm9yIChjb25zdCBba2V5MiwgdmFsdWUyXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZSkpIHtcblx0XHRcdFx0Y29uc3QgdHlwZSA9IG9wdGlvbnMudHlwZXNba2V5XSA/IG9wdGlvbnMudHlwZXNba2V5XS5yZXBsYWNlKCdbXScsICcnKSA6IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFsdWVba2V5Ml0gPSBwYXJzZVZhbHVlKHZhbHVlMiwgb3B0aW9ucywgdHlwZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmIG9wdGlvbnMudHlwZXNba2V5XSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVyblZhbHVlW2tleV0gPSBPYmplY3QudmFsdWVzKHZhbHVlKS5qb2luKG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm5WYWx1ZVtrZXldID0gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucywgb3B0aW9ucy50eXBlc1trZXldKTtcblx0XHR9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zb3J0ID09PSBmYWxzZSkge1xuXHRcdHJldHVybiByZXR1cm5WYWx1ZTtcblx0fVxuXG5cdC8vIFRPRE86IFJlbW92ZSB0aGUgdXNlIG9mIGByZWR1Y2VgLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1yZWR1Y2Vcblx0cmV0dXJuIChvcHRpb25zLnNvcnQgPT09IHRydWUgPyBPYmplY3Qua2V5cyhyZXR1cm5WYWx1ZSkuc29ydCgpIDogT2JqZWN0LmtleXMocmV0dXJuVmFsdWUpLnNvcnQob3B0aW9ucy5zb3J0KSkucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuXHRcdGNvbnN0IHZhbHVlID0gcmV0dXJuVmFsdWVba2V5XTtcblx0XHRyZXN1bHRba2V5XSA9IEJvb2xlYW4odmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpID8ga2V5c1NvcnRlcih2YWx1ZSkgOiB2YWx1ZTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LCBPYmplY3QuY3JlYXRlKG51bGwpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeShvYmplY3QsIG9wdGlvbnMpIHtcblx0aWYgKCFvYmplY3QpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRvcHRpb25zID0ge1xuXHRcdGVuY29kZTogdHJ1ZSxcblx0XHRzdHJpY3Q6IHRydWUsXG5cdFx0YXJyYXlGb3JtYXQ6ICdub25lJyxcblx0XHRhcnJheUZvcm1hdFNlcGFyYXRvcjogJywnLFxuXHRcdC4uLm9wdGlvbnMsXG5cdH07XG5cblx0dmFsaWRhdGVBcnJheUZvcm1hdFNlcGFyYXRvcihvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKTtcblxuXHRjb25zdCBzaG91bGRGaWx0ZXIgPSBrZXkgPT4gKFxuXHRcdChvcHRpb25zLnNraXBOdWxsICYmIGlzTnVsbE9yVW5kZWZpbmVkKG9iamVjdFtrZXldKSlcblx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgb2JqZWN0W2tleV0gPT09ICcnKVxuXHQpO1xuXG5cdGNvbnN0IGZvcm1hdHRlciA9IGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKTtcblxuXHRjb25zdCBvYmplY3RDb3B5ID0ge307XG5cblx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xuXHRcdGlmICghc2hvdWxkRmlsdGVyKGtleSkpIHtcblx0XHRcdG9iamVjdENvcHlba2V5XSA9IHZhbHVlO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3RDb3B5KTtcblxuXHRpZiAob3B0aW9ucy5zb3J0ICE9PSBmYWxzZSkge1xuXHRcdGtleXMuc29ydChvcHRpb25zLnNvcnQpO1xuXHR9XG5cblx0cmV0dXJuIGtleXMubWFwKGtleSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRpZiAodmFsdWUubGVuZ3RoID09PSAwICYmIG9wdGlvbnMuYXJyYXlGb3JtYXQgPT09ICdicmFja2V0LXNlcGFyYXRvcicpIHtcblx0XHRcdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdGlvbnMpICsgJ1tdJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHZhbHVlXG5cdFx0XHRcdC5yZWR1Y2UoZm9ybWF0dGVyKGtleSksIFtdKVxuXHRcdFx0XHQuam9pbignJicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRpb25zKSArICc9JyArIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyk7XG5cdH0pLmZpbHRlcih4ID0+IHgubGVuZ3RoID4gMCkuam9pbignJicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVcmwodXJsLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0ZGVjb2RlOiB0cnVlLFxuXHRcdC4uLm9wdGlvbnMsXG5cdH07XG5cblx0bGV0IFt1cmxfLCBoYXNoXSA9IHNwbGl0T25GaXJzdCh1cmwsICcjJyk7XG5cblx0aWYgKHVybF8gPT09IHVuZGVmaW5lZCkge1xuXHRcdHVybF8gPSB1cmw7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHVybDogdXJsXz8uc3BsaXQoJz8nKT8uWzBdID8/ICcnLFxuXHRcdHF1ZXJ5OiBwYXJzZShleHRyYWN0KHVybCksIG9wdGlvbnMpLFxuXHRcdC4uLihvcHRpb25zICYmIG9wdGlvbnMucGFyc2VGcmFnbWVudElkZW50aWZpZXIgJiYgaGFzaCA/IHtmcmFnbWVudElkZW50aWZpZXI6IGRlY29kZShoYXNoLCBvcHRpb25zKX0gOiB7fSksXG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlVcmwob2JqZWN0LCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0ZW5jb2RlOiB0cnVlLFxuXHRcdHN0cmljdDogdHJ1ZSxcblx0XHRbZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyXTogdHJ1ZSxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdGNvbnN0IHVybCA9IHJlbW92ZUhhc2gob2JqZWN0LnVybCkuc3BsaXQoJz8nKVswXSB8fCAnJztcblx0Y29uc3QgcXVlcnlGcm9tVXJsID0gZXh0cmFjdChvYmplY3QudXJsKTtcblxuXHRjb25zdCBxdWVyeSA9IHtcblx0XHQuLi5wYXJzZShxdWVyeUZyb21VcmwsIHtzb3J0OiBmYWxzZX0pLFxuXHRcdC4uLm9iamVjdC5xdWVyeSxcblx0fTtcblxuXHRsZXQgcXVlcnlTdHJpbmcgPSBzdHJpbmdpZnkocXVlcnksIG9wdGlvbnMpO1xuXHRxdWVyeVN0cmluZyAmJj0gYD8ke3F1ZXJ5U3RyaW5nfWA7XG5cblx0bGV0IGhhc2ggPSBnZXRIYXNoKG9iamVjdC51cmwpO1xuXHRpZiAodHlwZW9mIG9iamVjdC5mcmFnbWVudElkZW50aWZpZXIgPT09ICdzdHJpbmcnKSB7XG5cdFx0Y29uc3QgdXJsT2JqZWN0Rm9yRnJhZ21lbnRFbmNvZGUgPSBuZXcgVVJMKHVybCk7XG5cdFx0dXJsT2JqZWN0Rm9yRnJhZ21lbnRFbmNvZGUuaGFzaCA9IG9iamVjdC5mcmFnbWVudElkZW50aWZpZXI7XG5cdFx0aGFzaCA9IG9wdGlvbnNbZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyXSA/IHVybE9iamVjdEZvckZyYWdtZW50RW5jb2RlLmhhc2ggOiBgIyR7b2JqZWN0LmZyYWdtZW50SWRlbnRpZmllcn1gO1xuXHR9XG5cblx0cmV0dXJuIGAke3VybH0ke3F1ZXJ5U3RyaW5nfSR7aGFzaH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGljayhpbnB1dCwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0cGFyc2VGcmFnbWVudElkZW50aWZpZXI6IHRydWUsXG5cdFx0W2VuY29kZUZyYWdtZW50SWRlbnRpZmllcl06IGZhbHNlLFxuXHRcdC4uLm9wdGlvbnMsXG5cdH07XG5cblx0Y29uc3Qge3VybCwgcXVlcnksIGZyYWdtZW50SWRlbnRpZmllcn0gPSBwYXJzZVVybChpbnB1dCwgb3B0aW9ucyk7XG5cblx0cmV0dXJuIHN0cmluZ2lmeVVybCh7XG5cdFx0dXJsLFxuXHRcdHF1ZXJ5OiBpbmNsdWRlS2V5cyhxdWVyeSwgZmlsdGVyKSxcblx0XHRmcmFnbWVudElkZW50aWZpZXIsXG5cdH0sIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhjbHVkZShpbnB1dCwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdGNvbnN0IGV4Y2x1c2lvbkZpbHRlciA9IEFycmF5LmlzQXJyYXkoZmlsdGVyKSA/IGtleSA9PiAhZmlsdGVyLmluY2x1ZGVzKGtleSkgOiAoa2V5LCB2YWx1ZSkgPT4gIWZpbHRlcihrZXksIHZhbHVlKTtcblxuXHRyZXR1cm4gcGljayhpbnB1dCwgZXhjbHVzaW9uRmlsdGVyLCBvcHRpb25zKTtcbn1cbiIsImltcG9ydCAqIGFzIHF1ZXJ5U3RyaW5nIGZyb20gJy4vYmFzZS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXJ5U3RyaW5nO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3BsaXRPbkZpcnN0KHN0cmluZywgc2VwYXJhdG9yKSB7XG5cdGlmICghKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBzZXBhcmF0b3IgPT09ICdzdHJpbmcnKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZSBhcmd1bWVudHMgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCcpO1xuXHR9XG5cblx0aWYgKHN0cmluZyA9PT0gJycgfHwgc2VwYXJhdG9yID09PSAnJykge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdGNvbnN0IHNlcGFyYXRvckluZGV4ID0gc3RyaW5nLmluZGV4T2Yoc2VwYXJhdG9yKTtcblxuXHRpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0cmV0dXJuIFtcblx0XHRzdHJpbmcuc2xpY2UoMCwgc2VwYXJhdG9ySW5kZXgpLFxuXHRcdHN0cmluZy5zbGljZShzZXBhcmF0b3JJbmRleCArIHNlcGFyYXRvci5sZW5ndGgpXG5cdF07XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8vIHJ1bnRpbWUgaGVscGVyIGZvciBzZXR0aW5nIHByb3BlcnRpZXMgb24gY29tcG9uZW50c1xuLy8gaW4gYSB0cmVlLXNoYWthYmxlIHdheVxuZXhwb3J0cy5kZWZhdWx0ID0gKHNmYywgcHJvcHMpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBzZmMuX192Y2NPcHRzIHx8IHNmYztcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgcHJvcHMpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWw7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiaW1wb3J0IHNjcmlwdCBmcm9tIFwiLi9hcHAudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzXCJcbmV4cG9ydCAqIGZyb20gXCIuL2FwcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anNcIlxuXG5pbXBvcnQgZXhwb3J0Q29tcG9uZW50IGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2V4cG9ydEhlbHBlci5qc1wiXG5jb25zdCBfX2V4cG9ydHNfXyA9IC8qI19fUFVSRV9fKi9leHBvcnRDb21wb25lbnQoc2NyaXB0LCBbWydfX2ZpbGUnLFwicHVibGljL3NyYy9hcHBsaWNhdGlvbi9hcHAudnVlXCJdXSlcbi8qIGhvdCByZWxvYWQgKi9cbmlmIChtb2R1bGUuaG90KSB7XG4gIF9fZXhwb3J0c19fLl9faG1ySWQgPSBcIjJhYzlhMTlmXCJcbiAgY29uc3QgYXBpID0gX19WVUVfSE1SX1JVTlRJTUVfX1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmICghYXBpLmNyZWF0ZVJlY29yZCgnMmFjOWExOWYnLCBfX2V4cG9ydHNfXykpIHtcbiAgICBhcGkucmVsb2FkKCcyYWM5YTE5ZicsIF9fZXhwb3J0c19fKVxuICB9XG4gIFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IF9fZXhwb3J0c19fIiwiZXhwb3J0IHsgZGVmYXVsdCB9IGZyb20gXCItIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3J1bGVTZXRbMV0ucnVsZXNbMTVdLnVzZVswXSEuL2FwcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anNcIjsgZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cnVsZVNldFsxXS5ydWxlc1sxNV0udXNlWzBdIS4vYXBwLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiIiwiLyoqXHJcbiAqINCc0L3QvtC20LXRgdGC0LLQtdC90L3QsNGPINGC0LDQsdC70LjRhtCwXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHRoaXNPYmogPSB0aGlzO1xyXG4gICAgY29uc3QgJHRoaXNPYmogPSAkKHRoaXMpO1xyXG4gICAgY29uc3QgaWROID0gJHRoaXNPYmouYXR0cignZGF0YS1pZG4nKSB8fCAnaWQnO1xyXG5cclxuICAgIGNvbnN0IGNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0ICRjaGVja2JveCA9ICQoJ1tkYXRhLXJvbGU9XCJjaGVja2JveC1yb3dcIl0nLCB0aGlzT2JqKTtcclxuICAgICAgICBjb25zdCAkYWxsID0gJCgnW2RhdGEtcm9sZT1cImNoZWNrYm94LWFsbFwiXScsIHRoaXNPYmopO1xyXG4gICAgICAgIGNvbnN0ICRtZW51ID0gJCgndGZvb3QgLmJ0bi1ncm91cCwgdGZvb3QgLmFsbC1jb250ZXh0LW1lbnUnLCB0aGlzT2JqKTtcclxuICAgICAgICBjb25zdCAkbWVudUl0ZW1zID0gJCgnLmRyb3Bkb3duLW1lbnUgbGkgYSwgLm1lbnUtZHJvcGRvd25fX2xpbmsnLCAkbWVudSk7XHJcbiAgICAgICAgaWYgKCRhbGwuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgJGNoZWNrYm94LmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkYWxsLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaWRzID0gJyc7XHJcbiAgICAgICAgaWYgKCRhbGwuaXMoJzpjaGVja2VkJykgJiYgJGFsbC52YWwoKSAmJiAoJGFsbC52YWwoKSAhPSAnaWRzJykpIHtcclxuICAgICAgICAgICAgaWRzICs9ICcmJyArIGlkTiArICc9JyArICRhbGwudmFsKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGNoZWNrYm94LmZpbHRlcignOmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWRzICs9ICcmJyArIGlkTiArICdbXT0nICsgJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRtZW51SXRlbXMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdocmVmJywgJCh0aGlzKS5hdHRyKCdkYXRhLWhyZWYnKSArIGlkcyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBpZiAoaWRzKSB7XHJcbiAgICAgICAgICAgICRtZW51LnNob3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkbWVudS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgJG1lbnUgPSAkKCd0Zm9vdCAuYnRuLWdyb3VwLCB0Zm9vdCAuYWxsLWNvbnRleHQtbWVudScsIHRoaXNPYmopO1xyXG4gICAgICAgIGNvbnN0ICRtZW51SXRlbXMgPSAkKCcuZHJvcGRvd24tbWVudSBsaSBhLCAubWVudS1kcm9wZG93bl9fbGluaycsICRtZW51KTtcclxuICAgICAgICAkbWVudUl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuYXR0cignZGF0YS1ocmVmJywgJCh0aGlzKS5hdHRyKCdocmVmJykpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGNoZWNrQWNjdXJhdGUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjaGVjaygpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgJCh0aGlzKS5vbignY2xpY2snLCAnW2RhdGEtcm9sZT1cImNoZWNrYm94LWFsbFwiXScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRjaGVja2JveCA9ICQoJ1tkYXRhLXJvbGU9XCJjaGVja2JveC1yb3dcIl0nLCB0aGlzT2JqKTtcclxuICAgICAgICBpZiAoJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkge1xyXG4gICAgICAgICAgICAkY2hlY2tib3gucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRjaGVja2JveC5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGVjaygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh0aGlzKS5vbignY2xpY2snLCAnW2RhdGEtcm9sZT1cImNoZWNrYm94LXJvd1wiXScsIGNoZWNrKTtcclxuICAgICQodGhpcykub24oJ2NvbnRleHRtZW51JywgJ1tkYXRhLXJvbGU9XCJjaGVja2JveC1yb3dcIl0nLCBjaGVja0FjY3VyYXRlKTtcclxuICAgICQodGhpcykub24oJ2NvbnRleHRtZW51JywgJ1tkYXRhLXJvbGU9XCJjaGVja2JveC1hbGxcIl0nLCBjaGVja0FjY3VyYXRlKTtcclxuICAgIGluaXQoKTtcclxuICAgIGNoZWNrKCk7XHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gICAgdmFyICR0aGlzT2JqO1xyXG4gICAgdmFyICRhdXRvdGV4dDtcclxuICAgIHZhciBkZWZhdWx0UGFyYW1zID0ge1xyXG4gICAgICAgIHNob3dJbnRlcnZhbDogMTAwMFxyXG4gICAgfTtcclxuICAgIHZhciBwYXJhbXM7XHJcbiAgICB2YXIgdGltZW91dF9pZCA9IDA7XHJcbiAgICBcclxuICAgIHZhciBtZXRob2RzID0ge1xyXG4gICAgICAgIGdldENvbXBsZXRpb246IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIFNldCA9IGRhdGEuU2V0O1xyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgJGF1dG90ZXh0LmVtcHR5KCk7XHJcbiAgICAgICAgICAgIGlmIChTZXQgJiYgKFNldC5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IFNldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gJzxsaT4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgKz0gJyAgPGEgaHJlZj1cIiNcIiBkYXRhLWlkPVwiJyArIFNldFtpXS5pZCArICdcIic7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIFNldFtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGtleSwgWydpZCcsICduYW1lJywgJ2Rlc2NyaXB0aW9uJywgJ2ltZyddKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArPSAnIGRhdGEtJyArIGtleSArICc9XCInICsgU2V0W2ldW2tleV0udG9TdHJpbmcoKSArICdcIic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSAnPic7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNldFtpXS5pbWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArPSAnICAgPGltZyBzcmM9XCInICsgU2V0W2ldLmltZyArICdcIiAvPic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgKz0gJyAgICA8c3BhbiBjbGFzcz1cInJhYXMtYXV0b3RleHRfX25hbWVcIj4nICsgU2V0W2ldLm5hbWUgKyAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCAgICArPSAnICAgIDxzcGFuIGNsYXNzPVwicmFhcy1hdXRvdGV4dF9fZGVzY3JpcHRpb25cIj4nICsgU2V0W2ldLmRlc2NyaXB0aW9uICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgKz0gJyAgPC9hPic7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCAgICArPSAnPC9saT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICRhdXRvdGV4dC5hcHBlbmQodGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkYXV0b3RleHQuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGF1dG90ZXh0LmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dE9uQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJGF1dG90ZXh0LnRyaWdnZXIoJ1JBQVNfYXV0b2NvbXBsZXRlci5jaGFuZ2UnKTtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSAkdGhpc09iai52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHVybCA9IHBhcmFtcy51cmw7XHJcbiAgICAgICAgICAgIGlmICgvXFwqLy50ZXN0KHVybCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSB1cmwucmVwbGFjZSgvXFwqLywgdGV4dCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gdXJsICsgdGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXRfaWQpO1xyXG4gICAgICAgICAgICB0aW1lb3V0X2lkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICQuZ2V0SlNPTih1cmwsIG1ldGhvZHMuZ2V0Q29tcGxldGlvbikgfSwgcGFyYW1zLnNob3dJbnRlcnZhbCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICRhdXRvdGV4dC50cmlnZ2VyKCdSQUFTX2F1dG9jb21wbGV0ZXIuY2xpY2snKTtcclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmNhbGxiYWNrLmFwcGx5KHRoaXMsIGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRhdXRvdGV4dC5oaWRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHsgXHJcbiAgICAgICAgICAgICRhdXRvdGV4dC5wYXJhbXMgPSBwYXJhbXMgPSAkLmV4dGVuZChkZWZhdWx0UGFyYW1zLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgJHRoaXNPYmoub24oJ2tleXVwJywgbWV0aG9kcy50ZXh0T25DaGFuZ2UpO1xyXG4gICAgICAgICAgICAvLyAyMDE1LTA1LTA0LCBBVlM6INC30LDQvNC10L3QuNC7ICRhdXRvdGV4dC5oaWRlINC90LAgZnVuY3Rpb24oKSB7ICRhdXRvdGV4dC5oaWRlKCkgfSwg0LjQsdC+INCz0LvRjtGH0LjRglxyXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7ICRhdXRvdGV4dC5oaWRlKCkgfSk7XHJcbiAgICAgICAgICAgICRhdXRvdGV4dC5vbignY2xpY2snLCAnYScsIG1ldGhvZHMub25DbGljayk7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgJHRoaXNPYmogPSAkKHRoaXMpO1xyXG4gICAgJGF1dG90ZXh0ID0gJHRoaXNPYmoubmV4dCgnW2RhdGEtcm9sZT1cInJhYXMtYXV0b3RleHRcIl0nKTtcclxuICAgIGlmICghJGF1dG90ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICRhdXRvdGV4dCA9ICQoJzx1bCBjbGFzcz1cInJhYXMtYXV0b3RleHRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBkYXRhLXJvbGU9XCJyYWFzLWF1dG90ZXh0XCI+PC91bD4nKVxyXG4gICAgICAgICR0aGlzT2JqLmFmdGVyKCRhdXRvdGV4dCk7XHJcbiAgICB9XHJcbiAgICBpZiAoJGF1dG90ZXh0LnBhcmFtcykge1xyXG4gICAgICAgICRwYXJhbXMgPSAkYXV0b3RleHQucGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC70L7Qs9C40LrQsCDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwXHJcbiAgICBpZiAoIG1ldGhvZHNbbWV0aG9kXSApIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kc1sgbWV0aG9kIF0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdvYmplY3QnIHx8ICFtZXRob2QpIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZmlsbCkge1xyXG4gICAgbGV0IHRleHQgPSAnJztcclxuICAgICQodGhpcykuZW1wdHkoKTtcclxuICAgIGNvbnN0IHNvdXJjZSA9IFtdO1xyXG4gICAgY29uc3QgcFZhbHVlID0gdW5kZWZpbmVkO1xyXG4gICAgZm9yIChsZXQgaSBpbiBmaWxsKSB7XHJcbiAgICAgICAgY29uc3Qgc291cmNlRW50cnkgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmaWxsW2ldLnZhbHVlIHx8IGZpbGxbaV0udmFsLFxyXG4gICAgICAgICAgICBjYXB0aW9uOiBmaWxsW2ldLmNhcHRpb24gfHwgZmlsbFtpXS50ZXh0LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGZpbGxbaV0uc2VsKSB7XHJcbiAgICAgICAgICAgIHBWYWx1ZSA9IHNvdXJjZUVudHJ5LnNlbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGV4dCA9ICc8b3B0aW9uIHZhbHVlPVwiJyArIGZpbGxbaV0udmFsICsgJ1wiJyArIChmaWxsW2ldLnNlbCA/ICcgc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiJyA6ICcnKTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZmlsbFtpXSkge1xyXG4gICAgICAgICAgICBpZiAoJC5pbkFycmF5KGtleSwgWyd2YWwnLCAnc2VsJywgJ3RleHQnXSkgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gJyBkYXRhLScgKyBrZXkgKyAnPVwiJyArIGZpbGxbaV1ba2V5XSArICdcIic7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VFbnRyeVsnZGF0YS0nICsga2V5XSA9IGZpbGxbaV1ba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0ZXh0ICs9ICc+JyArIGZpbGxbaV0udGV4dCArICc8L29wdGlvbj4nO1xyXG4gICAgICAgICQodGhpcykuYXBwZW5kKCQodGV4dCkpO1xyXG4gICAgICAgIHNvdXJjZS5wdXNoKHNvdXJjZUVudHJ5KTtcclxuICAgIH1cclxuICAgIC8vIGNvbnNvbGUubG9nKGZpbGwpXHJcbiAgICAkKHRoaXMpLnRyaWdnZXIoJ3JhYXMuZmlsbC1zZWxlY3QnLCB7IHNvdXJjZSwgdmFsdWU6IHBWYWx1ZSB9KTtcclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cmwsIHBhcmFtcykge1xyXG4gICAgdmFyIGRlZmF1bHRQYXJhbXMgPSB7XHJcbiAgICAgICAgJ2JlZm9yZSc6IGZ1bmN0aW9uKGRhdGEpIHsgcmV0dXJuIGRhdGE7IH0sXHJcbiAgICAgICAgJ2FmdGVyJzogZnVuY3Rpb24oZGF0YSkge31cclxuICAgIH1cclxuICAgIHBhcmFtcyA9ICQuZXh0ZW5kKGRlZmF1bHRQYXJhbXMsIHBhcmFtcyk7XHJcbiAgICB2YXIgdGhpc09iaiA9IHRoaXM7XHJcbiAgICAkLmdldEpTT04odXJsLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGZpbGwgPSBwYXJhbXMuYmVmb3JlLmNhbGwodGhpc09iaiwgZGF0YSk7XHJcbiAgICAgICAgJCh0aGlzT2JqKS5SQUFTX2ZpbGxTZWxlY3QoZmlsbCk7XHJcbiAgICAgICAgcGFyYW1zLmFmdGVyLmNhbGwodGhpc09iaiwgZGF0YSk7XHJcbiAgICB9KTtcclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICAgIHZhciB0aGlzT2JqID0gdGhpcztcclxuICAgIFxyXG4gICAgJCgnaW5wdXRbZGF0YS1oaW50XSwgdGV4dGFyZWFbZGF0YS1oaW50XSwgc2VsZWN0W2RhdGEtaGludF0nLCB0aGlzT2JqKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuXCIgcmVsPVwicG9wb3ZlclwiIGRhdGEtY29udGVudD1cIicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaGludCcpICsgJ1wiPjxzcGFuIGNsYXNzPVwicmFhcy1pY29uIGZhLXNvbGlkIGZhLWNpcmNsZS1xdWVzdGlvblwiPjwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICAgIGlmICghJCh0aGlzKS5jbG9zZXN0KCcuY29udHJvbC1ncm91cCcpLmZpbmQoJ2FbcmVsPVwicG9wb3ZlclwiXScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5jb250cm9sLWdyb3VwJykuZmluZCgnLmNvbnRyb2xzJykuYXBwZW5kKHRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59IiwiLyoqXHJcbiAqIEBkZXByZWNhdGVkINCU0LXRgNC10LLQviDQvNC10L3RjiDRgNC10LDQu9C40LfQvtCy0LDQvdC+INCyIFJBQVMgLSDQtNC+IDIwMjYtMDEtMDFcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gICAgdmFyICR0aGlzT2JqO1xyXG4gICAgdmFyIGRlZmF1bHRQYXJhbXMgPSB7IHNob3duTGV2ZWw6IDIgfTtcclxuICAgIHZhciBwYXJhbXMgPSB7fTtcclxuICAgIHZhciBtZXRob2RzID0ge1xyXG4gICAgICAgIGhpZGVVTDogZnVuY3Rpb24oJG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICQoJ3VsJywgJG9iaikuaGlkZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkUGx1c2VzOiBmdW5jdGlvbigkb2JqKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJCgnbGk6aGFzKHVsKScsICRvYmopLnByZXBlbmQoJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJqc1RyZWVQbHVzXCIgZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCI+PC9hPicpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdW5mb2xkOiBmdW5jdGlvbigkb2JqLCBzbG93bHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkb2JqLmNoaWxkcmVuKCdbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJykucmVtb3ZlQ2xhc3MoJ2pzVHJlZVBsdXMnKS5hZGRDbGFzcygnanNUcmVlTWludXMnKTtcclxuICAgICAgICAgICAgaWYgKHNsb3dseSkge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2xpZGVEb3duKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvbGQ6IGZ1bmN0aW9uKCRvYmosIHNsb3dseSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRvYmouY2hpbGRyZW4oJ1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nKS5yZW1vdmVDbGFzcygnanNUcmVlTWludXMnKS5hZGRDbGFzcygnanNUcmVlUGx1cycpO1xyXG4gICAgICAgICAgICBpZiAoc2xvd2x5KSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrUGx1czogZnVuY3Rpb24oKSBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICBtZXRob2RzLnVuZm9sZCgkKHRoaXMpLmNsb3Nlc3QoJ2xpJyksIHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja01pbnVzOiBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2RzLmZvbGQoJCh0aGlzKS5jbG9zZXN0KCdsaScpLCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdCA6IGZ1bmN0aW9uKG9wdGlvbnMpIHsgXHJcbiAgICAgICAgICAgIHBhcmFtcyA9ICQuZXh0ZW5kKGRlZmF1bHRQYXJhbXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zLnNob3duTGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWwgPSAnJztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLnNob3duTGV2ZWw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbCArPSAndWwgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICR0aGlzT2JqID0gJChzZWwsIHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHRoaXNPYmogPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkdGhpc09iai5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfQpNGD0L3QutGG0LjRjyBqUXVlcnkubWVudVRyZWUg0YPRgdGC0LDRgNC10LvQsCDQuCDQsdGD0LTQtdGCINC+0YLQutC70Y7Rh9C10L3QsCAwMS4wMS4yMDI2LiDQn9C+0LbQsNC70YPQudGB0YLQsCwg0L7QsdGA0LDRgtC40YLQtdGB0Ywg0Log0YDQsNC30YDQsNCx0L7RgtGH0LjQutGDINC00LvRjyDQvtCx0L3QvtCy0LvQtdC90LjRjyDRgdC40YHRgtC10LzRiyEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXRob2RzLmhpZGVVTCgkdGhpc09iaik7XHJcbiAgICAgICAgICAgIG1ldGhvZHMuYWRkUGx1c2VzKCR0aGlzT2JqKTtcclxuICAgICAgICAgICAgbWV0aG9kcy51bmZvbGQoJCgnbGkuYWN0aXZlJywgJHRoaXNPYmopLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICR0aGlzT2JqLm9uKCdjbGljaycsICcuanNUcmVlUGx1c1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nLCBtZXRob2RzLmNsaWNrUGx1cyk7XHJcbiAgICAgICAgICAgICR0aGlzT2JqLm9uKCdjbGljaycsICcuanNUcmVlTWludXNbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJywgbWV0aG9kcy5jbGlja01pbnVzKTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQu9C+0LPQuNC60LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsFxyXG4gICAgaWYgKCBtZXRob2RzW21ldGhvZF0gKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZHNbIG1ldGhvZCBdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0aG9kID09PSAnb2JqZWN0JyB8fCAhbWV0aG9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNoYW5nZV9xdWVyeSwgaW5jbHVkZV9kaXJzLCBpbml0aWFsX3BhdGgpIHtcclxuICAgIGlmICghaW5pdGlhbF9wYXRoKSB7XHJcbiAgICAgICAgaW5pdGlhbF9wYXRoID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZlxyXG4gICAgfVxyXG4gICAgaWYgKGNoYW5nZV9xdWVyeS5zdWJzdHIoMCwgMSkgPT0gJz8nKSB7XHJcbiAgICAgICAgY2hhbmdlX3F1ZXJ5ID0gY2hhbmdlX3F1ZXJ5LnN1YnN0cigxKTtcclxuICAgIH1cclxuICAgIHZhciBxdWVyeV9kaXIgPSBpbml0aWFsX3BhdGguc3BsaXQoJz8nKS5zbGljZSgwLCAxKS50b1N0cmluZygpO1xyXG4gICAgdmFyIHF1ZXJ5X3N0ciA9IGluaXRpYWxfcGF0aC5zcGxpdCgnPycpLnNsaWNlKDEpLnRvU3RyaW5nKCk7XHJcbiAgICBcclxuICAgIHZhciBvbGRfcXVlcnkgPSBxdWVyeV9zdHIuc3BsaXQoJyYnKTtcclxuICAgIHZhciBjaGFuZ2UgPSBjaGFuZ2VfcXVlcnkuc3BsaXQoJyYnKTtcclxuICAgIFxyXG4gICAgdmFyIHF1ZXJ5ID0ge307XHJcbiAgICB2YXIgdGVtcCA9IFtdO1xyXG4gICAgXHJcbiAgICB2YXIgbmV3X3F1ZXJ5ID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZF9xdWVyeS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRlbXAgPSBvbGRfcXVlcnlbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgICBpZiAodGVtcFswXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5W3RlbXBbMF1dID0gdGVtcFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYW5nZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRlbXAgPSBjaGFuZ2VbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgICBpZiAodGVtcFswXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5W3RlbXBbMF1dID0gdGVtcFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0ZW1wID0gW107XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gcXVlcnkpIHtcclxuICAgICAgICBpZiAocXVlcnlba2V5XSAmJiAocXVlcnlba2V5XS5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICB0ZW1wW3RlbXAubGVuZ3RoXSA9IGtleSArICc9JyArIHF1ZXJ5W2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcXVlcnkgPSB0ZW1wLmpvaW4oJyYnKTtcclxuICAgIHJldHVybiBxdWVyeTtcclxufTsiLCIvKipcclxuICogQGRlcHJlY2F0ZWQg0KDQtdC/0L7Qt9C40YLQvtGA0LjQuSDRgNC10LDQu9C40LfQvtCy0LDQvSDQsiBSQUFTIChyYWFzLXJlcG8sIHJhYXMtcmVwby10YWJsZSkgLSDQtNC+IDE4LjAzLjIwMjZcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHBhcmFtcykgeyBcclxuICAgIHZhciBkZWZhdWx0UGFyYW1zID0ge1xyXG4gICAgICAgICdyZXBvQ29udGFpbmVyJzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG8tY29udGFpbmVyXCJdJyxcclxuICAgICAgICAncmVwb0VsZW1lbnQnOiAnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1lbGVtZW50XCJdJyxcclxuICAgICAgICAncmVwb0VsZW1lbnRDaGFuZ2VzJzogeydkYXRhLXJvbGUnOiAncmFhcy1yZXBvLWVsZW1lbnQnfSxcclxuICAgICAgICAncmVwb0FkZCc6ICdbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWFkZFwiXScsXHJcbiAgICAgICAgJ3JlcG9Nb3ZlJzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG8tbW92ZVwiXScsXHJcbiAgICAgICAgJ3JlcG9EZWxldGUnOiAnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1kZWxcIl0nLFxyXG4gICAgICAgICdyZXBvJzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG9cIl0nLFxyXG4gICAgICAgICdvbkJlZm9yZUFkZCc6IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgJ29uQWZ0ZXJBZGQnOiBmdW5jdGlvbigpIHsgJCh0aGlzKS5maW5kKCdzZWxlY3Q6ZGlzYWJsZWQsIGlucHV0OmRpc2FibGVkLCB0ZXh0YXJlYTpkaXNhYmxlZCcpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7IH0sXHJcbiAgICAgICAgJ29uQmVmb3JlRGVsZXRlJzogZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAnb25BZnRlckRlbGV0ZSc6IGZ1bmN0aW9uKCkge31cclxuICAgIH1cclxuICAgIHBhcmFtcyA9ICQuZXh0ZW5kKGRlZmF1bHRQYXJhbXMsIHBhcmFtcyk7XHJcbiAgICB2YXIgJHJlcG9CbG9jayA9ICQodGhpcyk7XHJcbiAgICBpZiAoJCh0aGlzKS5sZW5ndGgpIHtcclxuICAgICAgICBhbGVydCgn0KTRg9C90LrRhtC40Y8gUkFBU19yZXBvINGD0YHRgtCw0YDQtdC70LAg0Lgg0LHRg9C00LXRgiDQvtGC0LrQu9GO0YfQtdC90LAgMTguMDMuMjAyNi4g0J/QvtC20LDQu9GD0LnRgdGC0LAsINC+0LHRgNCw0YLQuNGC0LXRgdGMINC6INGA0LDQt9GA0LDQsdC+0YLRh9C40LrRgyDQtNC70Y8g0L7QsdC90L7QstC70LXQvdC40Y8g0YHQuNGB0YLQtdC80YshJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciAkcmVwb0NvbnRhaW5lcjtcclxuICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtcmFhcy1yZXBvLWNvbnRhaW5lcicpKSB7XHJcbiAgICAgICAgJHJlcG9Db250YWluZXIgPSAkKCQodGhpcykuYXR0cignZGF0YS1yYWFzLXJlcG8tY29udGFpbmVyJykpO1xyXG4gICAgfSBlbHNlIGlmICgkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9Db250YWluZXIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkcmVwb0NvbnRhaW5lciA9ICRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0NvbnRhaW5lcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRyZXBvQ29udGFpbmVyID0gJChwYXJhbXMucmVwb0NvbnRhaW5lcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciAkcmVwbztcclxuICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtcmFhcy1yZXBvJykpIHtcclxuICAgICAgICAkcmVwbyA9ICQoJCh0aGlzKS5hdHRyKCdkYXRhLXJhYXMtcmVwbycpKTtcclxuICAgIH0gZWxzZSBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJHJlcG8gPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG8pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkcmVwbyA9ICQocGFyYW1zLnJlcG8pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjaGVja1JlcXVpcmVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRyZXBvRWxlbWVudDtcclxuICAgICAgICBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50ICsgJzpoYXMoKltkYXRhLXJlcXVpcmVkXSknKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKHBhcmFtcy5yZXBvRWxlbWVudCArICc6aGFzKCpbZGF0YS1yZXF1aXJlZF0pJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkcmVwb0VsZW1lbnQubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQuZmluZChwYXJhbXMucmVwb0RlbGV0ZSkuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudC5maW5kKHBhcmFtcy5yZXBvRGVsZXRlKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKHBhcmFtcy5yZXBvRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkcmVwb0VsZW1lbnQubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQuZmluZChwYXJhbXMucmVwb01vdmUpLnNob3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQuZmluZChwYXJhbXMucmVwb01vdmUpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRyZXBvQmxvY2sub24oJ2NsaWNrJywgcGFyYW1zLnJlcG9BZGQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHBhcmFtcy5vbkJlZm9yZUFkZC5jYWxsKCRyZXBvRWxlbWVudCk7XHJcbiAgICAgICAgdmFyICRyZXBvRWxlbWVudCA9ICRyZXBvLmNsb25lKHRydWUpO1xyXG4gICAgICAgICRyZXBvRWxlbWVudC5hdHRyKHBhcmFtcy5yZXBvRWxlbWVudENoYW5nZXMpO1xyXG4gICAgICAgICRyZXBvQ29udGFpbmVyLmFwcGVuZCgkcmVwb0VsZW1lbnQpO1xyXG4gICAgICAgICRyZXBvRWxlbWVudC50cmlnZ2VyKCdSQUFTX3JlcG8uYWRkJyk7XHJcbiAgICAgICAgcGFyYW1zLm9uQWZ0ZXJBZGQuY2FsbCgkcmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIGNoZWNrUmVxdWlyZWQoKTtcclxuICAgICAgICAkcmVwb0VsZW1lbnQuUkFBU0luaXRJbnB1dHMoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgJHJlcG9CbG9jay5vbignY2xpY2snLCBwYXJhbXMucmVwb0RlbGV0ZSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRyZXBvRWxlbWVudDtcclxuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KHBhcmFtcy5yZXBvRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QocGFyYW1zLnJlcG9FbGVtZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cignZGF0YS1yYWFzLXJlcG8tZWxlbWVudCcpKSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICQoJCh0aGlzKS5hdHRyKCdkYXRhLXJhYXMtcmVwby1lbGVtZW50JykpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKHBhcmFtcy5yZXBvRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmFtcy5vbkJlZm9yZURlbGV0ZS5jYWxsKCRyZXBvRWxlbWVudCk7XHJcbiAgICAgICAgJHJlcG9FbGVtZW50LnRyaWdnZXIoJ1JBQVNfcmVwby5kZWxldGUnKTtcclxuICAgICAgICAkcmVwb0VsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgcGFyYW1zLm9uQWZ0ZXJEZWxldGUuY2FsbCgkcmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIGNoZWNrUmVxdWlyZWQoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgYXhpcyA9ICRyZXBvQ29udGFpbmVyLmF0dHIoJ2RhdGEtYXhpcycpO1xyXG4gICAgJHJlcG9Db250YWluZXIuc29ydGFibGUoeyBheGlzOiBheGlzID8gKGF4aXMgPT0gJ2JvdGgnID8gJycgOiBheGlzKSA6ICd5JywgJ2hhbmRsZSc6IHBhcmFtcy5yZXBvTW92ZSwgY29udGFpbm1lbnQ6ICQodGhpcykgfSk7XHJcblxyXG5cclxuICAgIGNoZWNrUmVxdWlyZWQoKTtcclxufSIsIi8qKlxyXG4gKiBAZGVwcmVjYXRlZCDQlNC10YDQtdCy0L4g0YDQtdCw0LvQuNC30L7QstCw0L3QviDQsiBSQUFTIChjaGVja2JveC10cmVlKSAtINC00L4gMDEuMDEuMjAyNlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWV0aG9kKSB7XHJcbiAgICB2YXIgJHRoaXNPYmo7XHJcbiAgICB2YXIgbWV0aG9kcyA9IHtcclxuICAgICAgICBoaWRlVUw6IGZ1bmN0aW9uKCRvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkKCd1bCcsICRvYmopLmhpZGUoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFBsdXNlczogZnVuY3Rpb24oJG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICQoJ2xpOmhhcyh1bCknLCAkb2JqKS5wcmVwZW5kKCc8YSBocmVmPVwiI1wiIGNsYXNzPVwianNUcmVlUGx1c1wiIGRhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiPjwvYT4nKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuZm9sZDogZnVuY3Rpb24oJG9iaiwgc2xvd2x5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJG9iai5jaGlsZHJlbignW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScpLnJlbW92ZUNsYXNzKCdqc1RyZWVQbHVzJykuYWRkQ2xhc3MoJ2pzVHJlZU1pbnVzJyk7XHJcbiAgICAgICAgICAgIGlmIChzbG93bHkpIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLnNsaWRlRG93bigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb2xkOiBmdW5jdGlvbigkb2JqLCBzbG93bHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkb2JqLmNoaWxkcmVuKCdbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJykucmVtb3ZlQ2xhc3MoJ2pzVHJlZU1pbnVzJykuYWRkQ2xhc3MoJ2pzVHJlZVBsdXMnKTtcclxuICAgICAgICAgICAgaWYgKHNsb3dseSkge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2xpZGVVcCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja1BsdXM6IGZ1bmN0aW9uKCkgXHJcbiAgICAgICAgeyBcclxuICAgICAgICAgICAgbWV0aG9kcy51bmZvbGQoJCh0aGlzKS5jbG9zZXN0KCdsaScpLCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xpY2tNaW51czogZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kcy5mb2xkKCQodGhpcykuY2xvc2VzdCgnbGknKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrQ2hlY2tib3g6IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBncm91cDtcclxuICAgICAgICAgICAgdmFyICRsaSA9ICQodGhpcykuY2xvc2VzdCgnbGknKTtcclxuICAgICAgICAgICAgdmFyICRvYmogPSAkbGkuZmluZCgndWwgaW5wdXQ6Y2hlY2tib3gnKTtcclxuICAgICAgICAgICAgaWYgKGdyb3VwID0gJG9iai5hdHRyKCdkYXRhLWdyb3VwJykpIHtcclxuICAgICAgICAgICAgICAgICRvYmogPSAkb2JqLmZpbHRlcihmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoJCh0aGlzKS5hdHRyKCdkYXRhLWdyb3VwJykgPT0gZ3JvdXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgICRvYmoucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJG9iai5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCdpbnB1dDpjaGVja2JveDpjaGVja2VkJywgJGxpKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2RzLnVuZm9sZCgkbGksIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kcy5mb2xkKCRsaSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrQ2hlY2tib3hBY2N1cmF0ZTogZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrQ2hlY2tib3hBY2N1cmF0ZUxhYmVsOiBmdW5jdGlvbihlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kcy5jbGlja0NoZWNrYm94QWNjdXJhdGUuY2FsbCgkKHRoaXMpLmZpbmQoJz4gaW5wdXQ6Y2hlY2tib3gnKVswXSwgZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXQgOiBmdW5jdGlvbihvcHRpb25zKSB7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzKVxyXG4gICAgICAgICAgICAkdGhpc09iaiA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIGlmICgkdGhpc09iai5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfQpNGD0L3QutGG0LjRjyBqUXVlcnkudHJlZSDRg9GB0YLQsNGA0LXQu9CwINC4INCx0YPQtNC10YIg0L7RgtC60LvRjtGH0LXQvdCwIDAxLjAxLjIwMjYuINCf0L7QttCw0LvRg9C50YHRgtCwLCDQvtCx0YDQsNGC0LjRgtC10YHRjCDQuiDRgNCw0LfRgNCw0LHQvtGC0YfQuNC60YMg0LTQu9GPINC+0LHQvdC+0LLQu9C10L3QuNGPINGB0LjRgdGC0LXQvNGLIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGhvZHMuaGlkZVVMKCR0aGlzT2JqKTtcclxuICAgICAgICAgICAgbWV0aG9kcy5hZGRQbHVzZXMoJHRoaXNPYmopO1xyXG4gICAgICAgICAgICBtZXRob2RzLnVuZm9sZCgkKCdsaTpoYXMoaW5wdXQ6Y2hlY2tlZCknLCAkdGhpc09iaiksIGZhbHNlKTtcclxuICAgICAgICAgICAgJHRoaXNPYmoub24oJ2NsaWNrJywgJy5qc1RyZWVQbHVzW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScsIG1ldGhvZHMuY2xpY2tQbHVzKTtcclxuICAgICAgICAgICAgJHRoaXNPYmoub24oJ2NsaWNrJywgJy5qc1RyZWVNaW51c1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nLCBtZXRob2RzLmNsaWNrTWludXMpO1xyXG4gICAgICAgICAgICAkKCdpbnB1dDpjaGVja2JveCcsICR0aGlzT2JqKS5vbignY2xpY2snLCBtZXRob2RzLmNsaWNrQ2hlY2tib3gpO1xyXG4gICAgICAgICAgICAkKCdpbnB1dDpjaGVja2JveCcsICR0aGlzT2JqKS5vbignY29udGV4dG1lbnUnLCBtZXRob2RzLmNsaWNrQ2hlY2tib3hBY2N1cmF0ZSlcclxuICAgICAgICAgICAgJCgnbGFiZWw6aGFzKD5pbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0pJywgJHRoaXNPYmopLm9uKCdjb250ZXh0bWVudScsIG1ldGhvZHMuY2xpY2tDaGVja2JveEFjY3VyYXRlTGFiZWwpXHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgLy8g0LvQvtCz0LjQutCwINCy0YvQt9C+0LLQsCDQvNC10YLQvtC00LBcclxuICAgIGlmICggbWV0aG9kc1ttZXRob2RdICkge1xyXG4gICAgICAgIHJldHVybiBtZXRob2RzWyBtZXRob2QgXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ29iamVjdCcgfHwgIW1ldGhvZCkge1xyXG4gICAgICAgIHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBBcHAgZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHAudnVlJztcclxuXHJcbmltcG9ydCBxdWVyeVN0cmluZyBmcm9tICdxdWVyeS1zdHJpbmcnO1xyXG5pbXBvcnQgJ2pxdWVyeS5zY3JvbGx0bydcclxuXHJcbmltcG9ydCBSQUFTX3RyZWUgZnJvbSAnLi9saWJzL3JhYXMudHJlZS5qcyc7XHJcbmltcG9ydCBSQUFTX2F1dG9jb21wbGV0ZXIgZnJvbSAnLi9saWJzL3JhYXMuYXV0b2NvbXBsZXRlci5qcyc7XHJcbmltcG9ydCBSQUFTX21lbnVUcmVlIGZyb20gJy4vbGlicy9yYWFzLm1lbnUtdHJlZS5qcyc7XHJcbmltcG9ydCBSQUFTX2ZpbGxTZWxlY3QgZnJvbSAnLi9saWJzL3JhYXMuZmlsbC1zZWxlY3QuanMnO1xyXG5pbXBvcnQgUkFBU19nZXRTZWxlY3QgZnJvbSAnLi9saWJzL3JhYXMuZ2V0LXNlbGVjdC5qcyc7XHJcbmltcG9ydCBSQUFTX3JlcG8gZnJvbSAnLi9saWJzL3JhYXMucmVwby5qcyc7XHJcbmltcG9ydCBSQUFTSW5pdElucHV0cyBmcm9tICcuL2xpYnMvcmFhcy5pbml0LWlucHV0cy5qcyc7XHJcbmltcG9ydCBSQUFTX3F1ZXJ5U3RyaW5nIGZyb20gJy4vbGlicy9yYWFzLnF1ZXJ5LXN0cmluZy5qcyc7XHJcbmltcG9ydCBSQUFTX011bHRpVGFibGUgZnJvbSAnLi9saWJzL211bHRpdGFibGUuanMnXHJcblxyXG53aW5kb3cucXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZztcclxuXHJcbi8vIFZ1ZS51c2UoWW1hcFBsdWdpbiwgd2luZG93LnltYXBTZXR0aW5ncyk7XHJcblxyXG5qUXVlcnkoZnVuY3Rpb24gKCQpIHtcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBSQUFTX3RyZWUsXHJcbiAgICAgICAgUkFBU19hdXRvY29tcGxldGVyLFxyXG4gICAgICAgIFJBQVNfbWVudVRyZWUsXHJcbiAgICAgICAgUkFBU19maWxsU2VsZWN0LFxyXG4gICAgICAgIFJBQVNfZ2V0U2VsZWN0LFxyXG4gICAgICAgIFJBQVNfcmVwbyxcclxuICAgICAgICBSQUFTSW5pdElucHV0cyxcclxuICAgICAgICBSQUFTX011bHRpVGFibGUsXHJcbiAgICB9KTtcclxuICAgICQuZXh0ZW5kKHsgUkFBU19xdWVyeVN0cmluZyB9KTtcclxufSk7XHJcblxyXG5cclxubGV0IGFwcCwgdnVlUm9vdDtcclxudnVlUm9vdCA9IGFwcCA9IFZ1ZS5jcmVhdGVBcHAoQXBwKTtcclxuXHJcbndpbmRvdy5yZWdpc3RlcmVkUkFBU0NvbXBvbmVudHMgPSB7fTtcclxuT2JqZWN0LmtleXMod2luZG93LnJhYXNDb21wb25lbnRzKS5mb3JFYWNoKChjb21wb25lbnRVUk4pID0+IHtcclxuICAgIHdpbmRvdy5yZWdpc3RlcmVkUkFBU0NvbXBvbmVudHNbY29tcG9uZW50VVJOXSA9IHZ1ZVJvb3QuY29tcG9uZW50KGNvbXBvbmVudFVSTiwgcmFhc0NvbXBvbmVudHNbY29tcG9uZW50VVJOXSk7XHJcbn0pXHJcblxyXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCQpIHtcclxuICAgIHdpbmRvdy5hcHAgPSBhcHAubW91bnQoJyNyYWFzLWFwcCcpO1xyXG5cclxuICAgIHZhciBoYXNoID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaDtcclxuICAgIGlmIChoYXNoKSB7XHJcbiAgICAgICAgaWYgKCQoJy50YWJiYWJsZSB1bC5uYXYtdGFicyBhW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICQoJy50YWJiYWJsZSB1bC5uYXYtdGFicyBhW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS50YWIoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJC5zY3JvbGxUbygwLCAwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCQoJy5hY2NvcmRpb24gYS5hY2NvcmRpb24tdG9nZ2xlW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICQoJy5hY2NvcmRpb24gYS5hY2NvcmRpb24tdG9nZ2xlW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5jbG9zZXN0KCcuYWNjb3JkaW9uJykuZmluZCgnLmNvbGxhcHNlJykucmVtb3ZlQ2xhc3MoJ2luJyk7XHJcbiAgICAgICAgICAgICQoJy5hY2NvcmRpb24gYS5hY2NvcmRpb24tdG9nZ2xlW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5jbG9zZXN0KCcuYWNjb3JkaW9uLWdyb3VwJykuZmluZCgnLmNvbGxhcHNlJykuY29sbGFwc2UoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJC5zY3JvbGxUbygkKCcuYWNjb3JkaW9uIGEuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJylbMF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgJCgnKicpLmZvY3VzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoJy50YWJiYWJsZSAudGFiLXBhbmUnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNoPSAnIycgKyAkKHRoaXMpLmNsb3Nlc3QoJy50YWJiYWJsZSAudGFiLXBhbmUnKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy50YWJiYWJsZSB1bC5uYXYtdGFicyBhW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS50YWIoJ3Nob3cnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCQodGhpcykuY2xvc2VzdCgnLmFjY29yZGlvbiAuYWNjb3JkaW9uLWJvZHk6bm90KC5pbiknKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNoID0gJyMnICsgJCh0aGlzKS5jbG9zZXN0KCcuYWNjb3JkaW9uIC5hY2NvcmRpb24tYm9keScpLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgICAgIC8vJCh0aGlzKS5jbG9zZXN0KCcuYWNjb3JkaW9uJykuZmluZCgnLmNvbGxhcHNlLmluJykuY29sbGFwc2UoJ2hpZGUnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuYWNjb3JkaW9uJykuZmluZCgnYS5hY2NvcmRpb24tdG9nZ2xlW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5jbG9zZXN0KCcuYWNjb3JkaW9uLWdyb3VwJykuZmluZCgnLmNvbGxhcHNlJykuY29sbGFwc2UoJ3Nob3cnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdhW2RhdGEtdG9nZ2xlPVwidGFiXCJdJykub24oJ3Nob3duJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCB1cmwpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vICQuZGF0ZXBpY2tlci5zZXREZWZhdWx0cyh7IGRhdGVGb3JtYXQ6ICd5eS1tbS1kZCcgfSk7XHJcbiAgICAvLyAkLnRpbWVwaWNrZXIuc2V0RGVmYXVsdHMoeyBkYXRlRm9ybWF0OiAneXktbW0tZGQnLCB0aW1lRm9ybWF0OiAnaGg6bW0nLCBzZXBhcmF0b3I6ICcgJyB9KTtcclxuICAgIFxyXG4gICAgJCgnYm9keScpLlJBQVNJbml0SW5wdXRzKCk7XHJcbiAgICAkKCc6cmVzZXQnKS5jbGljayhmdW5jdGlvbigpIHsgZG9jdW1lbnQubG9jYXRpb24ucmVsb2FkKCk7IHJldHVybiBmYWxzZTsgfSk7XHJcbiAgICAkKCcqW3JlbCo9XCJwb3BvdmVyXCJdJykucG9wb3ZlcigpLmNsaWNrKGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH0pO1xyXG4gICAgXHJcbiAgICAkKCcqW2RhdGEtcmFhcy1yb2xlKj1cInRyZWVcIl0nKS5SQUFTX3RyZWUoKTtcclxuICAgICQoJypbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWJsb2NrXCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tYWRkXCJdKSknKVxyXG4gICAgICAgIC5maW5kKCdbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWNvbnRhaW5lclwiXScpXHJcbiAgICAgICAgLmFmdGVyKCc8YSBocmVmPVwiI1wiIGRhdGEtcm9sZT1cInJhYXMtcmVwby1hZGRcIj48aSBjbGFzcz1cImljb24gaWNvbi1wbHVzXCI+PC9pPjwvYT4nKTtcclxuICAgICQoJypbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWVsZW1lbnRcIl06bm90KDpoYXMoW2RhdGEtcm9sZT1cInJhYXMtcmVwby1kZWxcIl0pKSwgKltkYXRhLXJvbGU9XCJyYWFzLXJlcG9cIl06bm90KDpoYXMoW2RhdGEtcm9sZT1cInJhYXMtcmVwby1kZWxcIl0pKScpXHJcbiAgICAgICAgLmFwcGVuZCgnPGEgaHJlZj1cIiNcIiBkYXRhLXJvbGU9XCJyYWFzLXJlcG8tZGVsXCI+PGkgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCI+PC9pPjwvYT4nKTtcclxuICAgICQoJypbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWVsZW1lbnRcIl06bm90KDpoYXMoW2RhdGEtcm9sZT1cInJhYXMtcmVwby1tb3ZlXCJdKSksICpbZGF0YS1yb2xlPVwicmFhcy1yZXBvXCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tbW92ZVwiXSkpJylcclxuICAgICAgICAuYXBwZW5kKCc8YSBocmVmPVwiI1wiIGRhdGEtcm9sZT1cInJhYXMtcmVwby1tb3ZlXCI+PGkgY2xhc3M9XCJpY29uIGljb24tcmVzaXplLXZlcnRpY2FsXCI+PC9pPjwvYT4nKTtcclxuICAgICQoJypbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWJsb2NrXCJdJykuZWFjaChmdW5jdGlvbigpIHsgJCh0aGlzKS5SQUFTX3JlcG8oKSB9KTtcclxuXHJcbiAgICAkKCdbZGF0YS1yb2xlPVwibXVsdGl0YWJsZVwiXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5SQUFTX011bHRpVGFibGUoKTtcclxuICAgIH0pO1xyXG59KTsiXSwibmFtZXMiOlsiZGF0YSIsIndpbmRvd1dpZHRoIiwiYm9keVdpZHRoIiwid2luZG93SGVpZ2h0Iiwic2Nyb2xsVG9wIiwib2xkU2Nyb2xsVG9wIiwiaXNTY3JvbGxpbmdOb3ciLCJpc1Njcm9sbGluZ05vd1RpbWVvdXRJZCIsImlzU2Nyb2xsaW5nTm93RGVsYXkiLCJzY3JvbGxpbmdJbmFjY3VyYWN5Iiwic2Nyb2xsVG9TZWxlY3RvciIsIm1lZGlhVHlwZXMiLCJ4eGwiLCJ4bCIsImxnIiwibWQiLCJzbSIsInhzIiwibW91bnRlZCIsInNlbGYiLCJsaWdodEJveEluaXQiLCIkIiwid2luZG93IiwiaW5uZXJXaWR0aCIsIm91dGVySGVpZ2h0Iiwib3V0ZXJXaWR0aCIsImZpeEh0bWwiLCJvbiIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJkb2N1bWVudCIsImN1cnJlbnRVcmwiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwic2VhcmNoIiwidXJsIiwiYXR0ciIsInNwbGl0IiwicHJvY2Vzc0hhc2hMaW5rIiwiaGFzaCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ0aXRsZSIsIm1ldGhvZHMiLCJhcGkiLCJwb3N0RGF0YSIsImJsb2NrSWQiLCJyZXNwb25zZVR5cGUiLCJyZXF1ZXN0VHlwZSIsImFkZGl0aW9uYWxIZWFkZXJzIiwiYWJvcnRDb250cm9sbGVyIiwicmVhbFVybCIsInRlc3QiLCJob3N0IiwiaGVhZGVycyIsInJ4IiwiZmV0Y2hPcHRpb25zIiwic2lnbmFsIiwibWV0aG9kIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsIm5hbWUiLCJhcHBlbmQiLCJib2R5IiwicXVlcnlTdHJpbmciLCJzdHJpbmdpZnkiLCJhcnJheUZvcm1hdCIsIkpTT04iLCJyZXNwb25zZSIsImZldGNoIiwicmVzdWx0IiwianNvbiIsInRleHQiLCJnZXRTY3JvbGxPZmZzZXQiLCJkZXN0WSIsImdldE9iakZyb21IYXNoIiwiJG9iaiIsImxlbmd0aCIsInJlcGxhY2UiLCJqcUVtaXQiLCJoYXNDbGFzcyIsIm1vZGFsIiwiJGhhc2hMaW5rIiwiaHJlZiIsImNsaWNrIiwic2Nyb2xsVG8iLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJwcm9jZXNzQWxsSW1hZ2VMaW5rcyIsInN3aXBlIiwidHJhbnNpdGlvbiIsInR5cGVNYXBwaW5nIiwicGFyYW1zIiwiT2JqZWN0IiwiYXNzaWduIiwiZWFjaCIsImciLCJyZW1vdmVBdHRyIiwibGlnaHRjYXNlIiwiZSIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJ0cmlnZ2VyIiwiY2xlYXJJbnRlcnZhbCIsImNvbmZpcm0iLCJva1RleHQiLCJjYW5jZWxUZXh0IiwiJHJlZnMiLCJmb3JtYXRQcmljZSIsInByaWNlIiwibnVtVHh0IiwieCIsImZvcm1zIiwiZXZlbnROYW1lIiwib3JpZ2luYWxFdmVudCIsImRlc3RpbmF0aW9uIiwiaW5zdGFudCIsIm9mZnNldCIsInRvcCIsIkhUTUxFbGVtZW50IiwialF1ZXJ5IiwiTWF0aCIsIm1heCIsInJvdW5kIiwibWluIiwic2Nyb2xsVG9EYXRhIiwibGVmdCIsImJlaGF2aW9yIiwicHJvdGVjdFNjcm9sbGluZyIsImJvZHlPdXRlckhlaWdodCIsInBhcnNlSW50IiwiYWJzIiwiY29uc29sZSIsImxvZyIsImNvbXB1dGVkIiwid2luZG93Qm90dG9tUG9zaXRpb24iLCJzY3JvbGxEZWx0YSIsImZpeGVkSGVhZGVyQWN0aXZlIiwiZml4ZWRIZWFkZXIiLCJ3YXRjaCIsIkFwcCIsIkZpeGVkSGVhZGVyIiwibWl4aW5zIiwiZWwiLCJsYXN0U2Nyb2xsVG9wIiwiY29uZmlnIiwicmFhc0NvbmZpZyIsInJhYXNBcHBsaWNhdGlvbkRhdGEiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJvcGVuRmlsZU1hbmFnZXIiLCJyb290Rm9sZGVyIiwid2l0aEZpbGVTZWxlY3Rpb24iLCJyYWFzQXBwIiwiZmlsZW1hbmFnZXIiLCJvcGVuIiwiYWxlcnQiLCJfYWxlcnQiLCJfeCIsImFwcGx5IiwidG9TdHJpbmciLCJ0aGlzT2JqIiwiJHRoaXNPYmoiLCJpZE4iLCJjaGVjayIsIiRjaGVja2JveCIsIiRhbGwiLCIkbWVudSIsIiRtZW51SXRlbXMiLCJpcyIsInByb3AiLCJpZHMiLCJ2YWwiLCJmaWx0ZXIiLCJzaG93IiwiaGlkZSIsImluaXQiLCJjaGVja0FjY3VyYXRlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCIkYXV0b3RleHQiLCJkZWZhdWx0UGFyYW1zIiwic2hvd0ludGVydmFsIiwidGltZW91dF9pZCIsImdldENvbXBsZXRpb24iLCJTZXQiLCJpIiwiZW1wdHkiLCJpZCIsImtleSIsImluQXJyYXkiLCJpbWciLCJkZXNjcmlwdGlvbiIsInRleHRPbkNoYW5nZSIsImdldEpTT04iLCJvbkNsaWNrIiwiY2FsbGJhY2siLCJleHRlbmQiLCJuZXh0IiwiYWZ0ZXIiLCIkcGFyYW1zIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJfdHlwZW9mIiwiZmlsbCIsInNvdXJjZSIsInBWYWx1ZSIsInNvdXJjZUVudHJ5IiwidmFsdWUiLCJjYXB0aW9uIiwic2VsIiwiX3JlYWRPbmx5RXJyb3IiLCJwdXNoIiwiYmVmb3JlIiwiUkFBU19maWxsU2VsZWN0IiwiY2xvc2VzdCIsImZpbmQiLCJzaG93bkxldmVsIiwiaGlkZVVMIiwiYWRkUGx1c2VzIiwicHJlcGVuZCIsInVuZm9sZCIsInNsb3dseSIsImNoaWxkcmVuIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNsaWRlRG93biIsImZvbGQiLCJzbGlkZVVwIiwiY2xpY2tQbHVzIiwiY2xpY2tNaW51cyIsImNoYW5nZV9xdWVyeSIsImluY2x1ZGVfZGlycyIsImluaXRpYWxfcGF0aCIsInN1YnN0ciIsInF1ZXJ5X2RpciIsInF1ZXJ5X3N0ciIsIm9sZF9xdWVyeSIsImNoYW5nZSIsInF1ZXJ5IiwidGVtcCIsIm5ld19xdWVyeSIsImpvaW4iLCJvbkJlZm9yZUFkZCIsIm9uQWZ0ZXJBZGQiLCJvbkJlZm9yZURlbGV0ZSIsIm9uQWZ0ZXJEZWxldGUiLCIkcmVwb0Jsb2NrIiwiJHJlcG9Db250YWluZXIiLCJyZXBvQ29udGFpbmVyIiwiJHJlcG8iLCJyZXBvIiwiY2hlY2tSZXF1aXJlZCIsIiRyZXBvRWxlbWVudCIsInJlcG9FbGVtZW50IiwicmVwb0RlbGV0ZSIsInJlcG9Nb3ZlIiwicmVwb0FkZCIsImNsb25lIiwicmVwb0VsZW1lbnRDaGFuZ2VzIiwiUkFBU0luaXRJbnB1dHMiLCJyZW1vdmUiLCJheGlzIiwic29ydGFibGUiLCJjb250YWlubWVudCIsImNsaWNrQ2hlY2tib3giLCJncm91cCIsIiRsaSIsImluZGV4IiwiY2xpY2tDaGVja2JveEFjY3VyYXRlIiwiY2xpY2tDaGVja2JveEFjY3VyYXRlTGFiZWwiLCJSQUFTX3RyZWUiLCJSQUFTX2F1dG9jb21wbGV0ZXIiLCJSQUFTX21lbnVUcmVlIiwiUkFBU19nZXRTZWxlY3QiLCJSQUFTX3JlcG8iLCJSQUFTX3F1ZXJ5U3RyaW5nIiwiUkFBU19NdWx0aVRhYmxlIiwiZm4iLCJhcHAiLCJ2dWVSb290IiwiVnVlIiwiY3JlYXRlQXBwIiwicmVnaXN0ZXJlZFJBQVNDb21wb25lbnRzIiwia2V5cyIsInJhYXNDb21wb25lbnRzIiwiZm9yRWFjaCIsImNvbXBvbmVudFVSTiIsImNvbXBvbmVudCIsInJlYWR5IiwibW91bnQiLCJ0YWIiLCJjb2xsYXBzZSIsImZvY3VzIiwicmVsb2FkIiwicG9wb3ZlciJdLCJzb3VyY2VSb290IjoiIn0=