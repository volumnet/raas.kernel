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
  el: '#raas-app',
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
  methods: {
    lightBoxInit: function lightBoxInit() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    }
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
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(fill) {
  var text;
  $(this).empty();
  for (var i in fill) {
    text = '<option value="' + fill[i].val + '"' + (fill[i].sel ? ' selected="selected"' : '');
    for (var key in fill[i]) {
      if ($.inArray(key, ['val', 'sel', 'text']) == -1) {
        text += ' data-' + key + '="' + fill[i][key] + '"';
      }
    }
    text += '>' + fill[i].text + '</option>';
    $(this).append($(text));
  }
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
  $('select[multiple]').not('[disabled]', thisObj).multiselect({
    buttonText: function buttonText(options, select) {
      if (options.length == 0) {
        return '--';
      } else {
        var selected = '';
        var i = 0;
        options.each(function () {
          if (i < 3) {
            selected += $(this).text() + ', ';
          }
          i++;
        });
        selected = selected.substr(0, selected.length - 2);
        return selected + (options.length > 3 ? '...' : '');
      }
    },
    maxHeight: 200
  });
  $('input[data-hint], textarea[data-hint], select[data-hint]', thisObj).each(function () {
    var text = '<a class="btn" href="#" rel="popover" data-content="' + $(this).attr('data-hint') + '"><i class="fa fa-circle-question"></i></a>';
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
 * @deprecated Дерево меню реализовано в RAAS
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
 * @deprecated Дерево реализовано в RAAS (checkbox-tree)
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
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! query-string */ "./node_modules/query-string/index.js");
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











window.queryString = query_string__WEBPACK_IMPORTED_MODULE_10__["default"];

// Vue.use(YmapPlugin, window.ymapSettings);

jQuery(function ($) {
  $.fn.extend({
    RAAS_tree: _libs_raas_tree_js__WEBPACK_IMPORTED_MODULE_2__["default"],
    RAAS_autocompleter: _libs_raas_autocompleter_js__WEBPACK_IMPORTED_MODULE_3__["default"],
    RAAS_menuTree: _libs_raas_menu_tree_js__WEBPACK_IMPORTED_MODULE_4__["default"],
    RAAS_fillSelect: _libs_raas_fill_select_js__WEBPACK_IMPORTED_MODULE_5__["default"],
    RAAS_getSelect: _libs_raas_get_select_js__WEBPACK_IMPORTED_MODULE_6__["default"],
    RAAS_repo: _libs_raas_repo_js__WEBPACK_IMPORTED_MODULE_7__["default"],
    RAASInitInputs: _libs_raas_init_inputs_js__WEBPACK_IMPORTED_MODULE_8__["default"]
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
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZTtFQUNYQSxJQUFJQSxDQUFBLEVBQUc7SUFDSCxPQUFPO01BQ0g7QUFDWjtBQUNBO0FBQ0E7TUFDWUMsV0FBVyxFQUFFLENBQUM7TUFFZDtBQUNaO0FBQ0E7QUFDQTtNQUNZQyxTQUFTLEVBQUUsQ0FBQztNQUVaO0FBQ1o7QUFDQTtBQUNBO01BQ1lDLFlBQVksRUFBRSxDQUFDO01BRWY7QUFDWjtBQUNBO0FBQ0E7TUFDWUMsU0FBUyxFQUFFLENBQUM7TUFFWjtBQUNaO0FBQ0E7QUFDQTtNQUNZQyxZQUFZLEVBQUUsQ0FBQztNQUVmO0FBQ1o7QUFDQTtBQUNBO01BQ1lDLGNBQWMsRUFBRSxLQUFLO01BRXJCO0FBQ1o7QUFDQTtBQUNBO01BQ1lDLHVCQUF1QixFQUFFLEtBQUs7TUFFOUI7QUFDWjtBQUNBO0FBQ0E7TUFDWUMsbUJBQW1CLEVBQUUsR0FBRztNQUV4QjtBQUNaO0FBQ0E7QUFDQTtNQUNZQyxtQkFBbUIsRUFBRSxDQUFDO01BRXRCO0FBQ1o7QUFDQTtNQUNZQyxnQkFBZ0IsRUFBRSwrQkFBK0IsR0FDN0MseUJBQXlCLEdBQ3pCLHlFQUF5RSxHQUN6RSw4QkFBOEIsR0FDOUIsK0JBQStCLEdBQy9CLGlDQUFpQyxHQUNqQywrQkFBK0I7TUFDbkM7QUFDWjtBQUNBO0FBQ0E7TUFDWUMsVUFBVSxFQUFFO1FBQ1JDLEdBQUcsRUFBRSxJQUFJO1FBQ1RDLEVBQUUsRUFBRSxJQUFJO1FBQ1JDLEVBQUUsRUFBRSxHQUFHO1FBQ1BDLEVBQUUsRUFBRSxHQUFHO1FBQ1BDLEVBQUUsRUFBRSxHQUFHO1FBQ1BDLEVBQUUsRUFBRTtNQUNSO0lBQ0osQ0FBQztFQUNMLENBQUM7RUFDREMsT0FBT0EsQ0FBQSxFQUFHO0lBQ04sSUFBSUMsSUFBSSxHQUFHLElBQUk7SUFDZixJQUFJLENBQUNDLFlBQVksQ0FBQyxDQUFDO0lBQ25CLElBQUksQ0FBQ25CLFdBQVcsR0FBR29CLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLElBQUksQ0FBQ3BCLFlBQVksR0FBR2tCLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNFLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQ3RCLFNBQVMsR0FBR21CLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQ0ksVUFBVSxDQUFDLENBQUM7SUFDdkMsSUFBSSxDQUFDQyxPQUFPLENBQUMsQ0FBQztJQUNkTCxDQUFDLENBQUNDLE1BQU0sQ0FBQyxDQUNKSyxFQUFFLENBQUMsUUFBUSxFQUFFUixJQUFJLENBQUNPLE9BQU8sQ0FBQyxDQUMxQkMsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNO01BQ2hCLElBQUksQ0FBQzFCLFdBQVcsR0FBR29CLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNHLFVBQVUsQ0FBQyxDQUFDO01BQ3pDLElBQUksQ0FBQ3RCLFlBQVksR0FBR2tCLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNFLFdBQVcsQ0FBQyxDQUFDO01BQzNDLElBQUksQ0FBQ3RCLFNBQVMsR0FBR21CLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQ0ksVUFBVSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQ0RFLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTTtNQUNoQixJQUFJdEIsWUFBWSxHQUFHLElBQUksQ0FBQ0QsU0FBUztNQUNqQyxJQUFJLENBQUNBLFNBQVMsR0FBR2lCLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNsQixTQUFTLENBQUMsQ0FBQztNQUN0QyxJQUFJLElBQUksQ0FBQ0csdUJBQXVCLEVBQUU7UUFDOUJlLE1BQU0sQ0FBQ00sWUFBWSxDQUFDLElBQUksQ0FBQ3JCLHVCQUF1QixDQUFDO01BQ3JEO01BQ0EsSUFBSSxDQUFDLElBQUksQ0FBQ0QsY0FBYyxFQUFFO1FBQ3RCLElBQUksQ0FBQ0EsY0FBYyxHQUFHLElBQUk7TUFDOUI7TUFDQSxJQUFJLENBQUNDLHVCQUF1QixHQUFHZSxNQUFNLENBQUNPLFVBQVUsQ0FBQyxNQUFNO1FBQ25ELElBQUksQ0FBQ3hCLFlBQVksR0FBR0EsWUFBWTtRQUNoQyxJQUFJLENBQUNELFNBQVMsR0FBR2lCLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNsQixTQUFTLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUNHLHVCQUF1QixHQUFHLENBQUM7UUFDaEMsSUFBSSxDQUFDRCxjQUFjLEdBQUcsS0FBSztNQUMvQixDQUFDLEVBQUUsSUFBSSxDQUFDRSxtQkFBbUIsQ0FBQztJQUNoQyxDQUFDLENBQUM7SUFFTmEsQ0FBQyxDQUFDUyxRQUFRLENBQUMsQ0FBQ0gsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUNqQixnQkFBZ0IsRUFBRSxZQUFZO01BQ3ZELElBQUlxQixVQUFVLEdBQUdULE1BQU0sQ0FBQ1UsUUFBUSxDQUFDQyxRQUFRLEdBQUdYLE1BQU0sQ0FBQ1UsUUFBUSxDQUFDRSxNQUFNO01BQ2xFLElBQUlDLEdBQUcsR0FBR2QsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDZSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUNDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUM7TUFDQTtNQUNBO01BQ0EsSUFBSSxDQUFDRixHQUFHLElBQUtBLEdBQUcsSUFBSUosVUFBVyxFQUFFO1FBQzdCWixJQUFJLENBQUNtQixlQUFlLENBQUMsSUFBSSxDQUFDQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxLQUFLO01BQ2hCO0lBQ0osQ0FBQyxDQUFDO0lBQ0ZsQixDQUFDLENBQUNTLFFBQVEsQ0FBQyxDQUFDSCxFQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxZQUFZO01BQzNDTCxNQUFNLENBQUNrQixPQUFPLENBQUNDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRVgsUUFBUSxDQUFDWSxLQUFLLEVBQUVyQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNlLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUM7SUFDRmYsQ0FBQyxDQUFDQyxNQUFNLENBQUMsQ0FBQ0ssRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNO01BQ3ZCLElBQUlMLE1BQU0sQ0FBQ1UsUUFBUSxDQUFDTyxJQUFJLEVBQUU7UUFDdEIsSUFBSSxDQUFDRCxlQUFlLENBQUNoQixNQUFNLENBQUNVLFFBQVEsQ0FBQ08sSUFBSSxDQUFDO01BQzlDO0lBQ0osQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDbkMsU0FBUyxHQUFHLElBQUksQ0FBQ0MsWUFBWSxHQUFHZ0IsQ0FBQyxDQUFDQyxNQUFNLENBQUMsQ0FBQ2xCLFNBQVMsQ0FBQyxDQUFDOztJQUUxRDs7SUFFQTtFQUNKLENBQUM7RUFDRHVDLE9BQU8sRUFBRTtJQUNMO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNRLE1BQU1DLEdBQUdBLENBQ0xULEdBQUcsRUFDSFUsUUFBUSxHQUFHLElBQUksRUFDZkMsT0FBTyxHQUFHLElBQUksRUFDZEMsWUFBWSxHQUFHLGtCQUFrQixFQUNqQ0MsV0FBVyxHQUFHLG1DQUFtQyxFQUNqREMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQ3RCQyxlQUFlLEdBQUcsSUFBSSxFQUN4QjtNQUNFO01BQ0EsSUFBSUMsT0FBTyxHQUFHaEIsR0FBRyxDQUFDRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQy9CLElBQUksQ0FBQyxRQUFRLENBQUNlLElBQUksQ0FBQ0QsT0FBTyxDQUFDLEVBQUU7UUFDekIsSUFBSUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtVQUNuQkEsT0FBTyxHQUFHLElBQUksR0FBRzdCLE1BQU0sQ0FBQ1UsUUFBUSxDQUFDcUIsSUFBSSxHQUFHL0IsTUFBTSxDQUFDVSxRQUFRLENBQUNDLFFBQVEsR0FBR2tCLE9BQU87UUFDOUUsQ0FBQyxNQUFNO1VBQ0hBLE9BQU8sR0FBRyxJQUFJLEdBQUc3QixNQUFNLENBQUNVLFFBQVEsQ0FBQ3FCLElBQUksR0FBR0YsT0FBTztRQUNuRDtNQUNKO01BQ0EsTUFBTUcsT0FBTyxHQUFHO1FBQUMsR0FBR0w7TUFBaUIsQ0FBQztNQUN0QyxJQUFJTSxFQUFFO01BQ04sSUFBSVQsT0FBTyxFQUFFO1FBQ1QsSUFBSSxDQUFDLGVBQWUsQ0FBQ00sSUFBSSxDQUFDRCxPQUFPLENBQUMsRUFBRTtVQUNoQ0EsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDQyxJQUFJLENBQUNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksT0FBTyxHQUFHTCxPQUFPO1FBQ3JFO1FBQ0FRLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHUixPQUFPO01BQ3hDO01BQ0EsSUFBSSxNQUFNLENBQUNNLElBQUksQ0FBQ0wsWUFBWSxDQUFDLEVBQUU7UUFDM0JPLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBR1AsWUFBWTtNQUNwQztNQUNBLElBQUksTUFBTSxDQUFDSyxJQUFJLENBQUNKLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQ0gsUUFBUSxFQUFFO1FBQ3hDUyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUdOLFdBQVc7TUFDekM7TUFDQSxNQUFNUSxZQUFZLEdBQUc7UUFDakJGO01BQ0osQ0FBQztNQUNELElBQUlKLGVBQWUsRUFBRTtRQUNqQk0sWUFBWSxDQUFDQyxNQUFNLEdBQUdQLGVBQWUsQ0FBQ08sTUFBTTtNQUNoRDtNQUNBLElBQUksQ0FBQyxDQUFDWixRQUFRLEVBQUU7UUFDWlcsWUFBWSxDQUFDRSxNQUFNLEdBQUcsTUFBTTtRQUM1QixJQUFJLFFBQVEsQ0FBQ04sSUFBSSxDQUFDSixXQUFXLENBQUMsRUFBRTtVQUM1QixJQUFJLGFBQWEsQ0FBQ0ksSUFBSSxDQUFDSixXQUFXLENBQUMsRUFBRTtZQUNqQyxJQUFJVyxRQUFRLEdBQUksSUFBSUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsSUFBSWYsUUFBUSxZQUFZZSxRQUFRLEVBQUU7Y0FDOUJELFFBQVEsR0FBR2QsUUFBUTtZQUN2QixDQUFDLE1BQU07Y0FDSGMsUUFBUSxHQUFHLElBQUlDLFFBQVEsQ0FBQyxDQUFDO2NBQ3pCLEtBQUssTUFBTUMsSUFBSSxJQUFJaEIsUUFBUSxFQUFFO2dCQUN6QmMsUUFBUSxDQUFDRyxNQUFNLENBQUNELElBQUksRUFBRWhCLFFBQVEsQ0FBQ2dCLElBQUksQ0FBQyxDQUFDO2NBQ3pDO1lBQ0o7WUFDQUwsWUFBWSxDQUFDTyxJQUFJLEdBQUdKLFFBQVE7WUFDNUIsT0FBT0wsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7VUFDcEMsQ0FBQyxNQUFNO1lBQ0hFLFlBQVksQ0FBQ08sSUFBSSxHQUFHekMsTUFBTSxDQUFDMEMsV0FBVyxDQUFDQyxTQUFTLENBQUNwQixRQUFRLEVBQUU7Y0FBRXFCLFdBQVcsRUFBRTtZQUFVLENBQUMsQ0FBQztVQUMxRjtRQUNKLENBQUMsTUFBTSxJQUFLLE9BQU9yQixRQUFRLElBQUssUUFBUSxFQUFFO1VBQ3RDVyxZQUFZLENBQUNPLElBQUksR0FBR0ksSUFBSSxDQUFDRixTQUFTLENBQUNwQixRQUFRLENBQUM7UUFDaEQsQ0FBQyxNQUFNO1VBQ0hXLFlBQVksQ0FBQ08sSUFBSSxHQUFHbEIsUUFBUTtRQUNoQztNQUNKLENBQUMsTUFBTTtRQUNIVyxZQUFZLENBQUNFLE1BQU0sR0FBRyxLQUFLO01BQy9CO01BQ0E7TUFDQSxNQUFNVSxRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDbEIsT0FBTyxFQUFFSyxZQUFZLENBQUM7TUFDbkQsSUFBSWMsTUFBTTtNQUNWLElBQUksUUFBUSxDQUFDbEIsSUFBSSxDQUFDTCxZQUFZLENBQUMsRUFBRTtRQUM3QnVCLE1BQU0sR0FBRyxNQUFNRixRQUFRLENBQUNHLElBQUksQ0FBQyxDQUFDO01BQ2xDLENBQUMsTUFBTTtRQUNIRCxNQUFNLEdBQUcsTUFBTUYsUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQztNQUNsQztNQUNBLE9BQU9GLE1BQU07SUFFakIsQ0FBQztJQUNEO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNRRyxlQUFlQSxDQUFDQyxLQUFLLEdBQUcsSUFBSSxFQUFFO01BQzFCLE9BQU8sQ0FBQztJQUNaLENBQUM7SUFFRDtBQUNSO0FBQ0E7QUFDQTtBQUNBO0lBQ1FDLGNBQWNBLENBQUNwQyxJQUFJLEVBQUU7TUFDakIsSUFBSUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtRQUNoQkEsSUFBSSxHQUFHLEdBQUcsR0FBR0EsSUFBSTtNQUNyQjtNQUNBLElBQUlxQyxJQUFJLEdBQUd2RCxDQUFDLENBQUNrQixJQUFJLENBQUM7TUFDbEIsSUFBSXFDLElBQUksQ0FBQ0MsTUFBTSxFQUFFO1FBQ2IsT0FBT0QsSUFBSTtNQUNmO01BQ0FBLElBQUksR0FBR3ZELENBQUMsQ0FBQyxTQUFTLEdBQUdrQixJQUFJLENBQUN1QyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztNQUNsRCxJQUFJRixJQUFJLENBQUNDLE1BQU0sRUFBRTtRQUNiLE9BQU9ELElBQUk7TUFDZjtNQUNBLE9BQU8sSUFBSTtJQUNmLENBQUM7SUFFRDtBQUNSO0FBQ0E7QUFDQTtJQUNRdEMsZUFBZUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ2xCLElBQUksQ0FBQ3dDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRXhDLElBQUksQ0FBQztNQUNwQyxJQUFJcUMsSUFBSSxHQUFHLElBQUksQ0FBQ0QsY0FBYyxDQUFDcEMsSUFBSSxDQUFDO01BQ3BDLElBQUlxQyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsTUFBTSxFQUFFO1FBQ3JCLElBQUlELElBQUksQ0FBQ0ksUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1VBQ3hCSixJQUFJLENBQUNLLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDdEIsQ0FBQyxNQUFNLElBQUlMLElBQUksQ0FBQ0ksUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1VBQ2xDLElBQUlFLFNBQVMsR0FBRzdELENBQUMsQ0FDYixVQUFVLEdBQUdrQixJQUFJLEdBQUcsTUFBTSxHQUMxQixVQUFVLEdBQUdqQixNQUFNLENBQUNVLFFBQVEsQ0FBQ0MsUUFBUSxHQUFHWCxNQUFNLENBQUNVLFFBQVEsQ0FBQ0UsTUFBTSxHQUFHSyxJQUFJLEdBQUcsTUFBTSxHQUM5RSxVQUFVLEdBQUdqQixNQUFNLENBQUNVLFFBQVEsQ0FBQ21ELElBQUksR0FBRyxJQUN4QyxDQUFDO1VBQ0QsSUFBSUQsU0FBUyxDQUFDTCxNQUFNLEVBQUU7WUFDbEJLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0UsS0FBSyxDQUFDLENBQUM7VUFDeEI7UUFDSixDQUFDLE1BQU07VUFDSCxJQUFJLENBQUNDLFFBQVEsQ0FBQ1QsSUFBSSxDQUFDO1FBQ3ZCO01BQ0o7SUFDSixDQUFDO0lBRUQ7QUFDUjtBQUNBO0FBQ0E7SUFDUXhELFlBQVlBLENBQUNrRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7TUFDdkIsSUFBSUMsUUFBUSxHQUFHO1FBQ1hDLG9CQUFvQixFQUFFLElBQUk7UUFDMUJDLEtBQUssRUFBRSxJQUFJO1FBQ1hDLFVBQVUsRUFBRSxrQkFBa0I7UUFDOUJDLFdBQVcsRUFBRTtVQUNULE9BQU8sRUFBRTtRQUNiO01BQ0osQ0FBQztNQUNELElBQUlDLE1BQU0sR0FBR0MsTUFBTSxDQUFDQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUVQLFFBQVEsRUFBRUQsT0FBTyxDQUFDO01BQ2pELElBQUkvQixFQUFFLEdBQUcsdUNBQXVDO01BQ2hEbEMsQ0FBQyxDQUFDLHNEQUFzRCxDQUFDLENBQUMwRSxJQUFJLENBQUMsWUFBWTtRQUN2RSxJQUFJSCxNQUFNLENBQUNKLG9CQUFvQixFQUFFO1VBQzdCLElBQUlqQyxFQUFFLENBQUNILElBQUksQ0FBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7WUFDL0JmLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2UsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUM7VUFDekM7UUFDSjtRQUNBLElBQUk0RCxDQUFDLEdBQUczRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNlLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztRQUM3QyxJQUFJNEQsQ0FBQyxJQUFJM0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDZSxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUU7VUFDcENmLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2UsSUFBSSxDQUFDLFVBQVUsRUFBRSxXQUFXLElBQUk0RCxDQUFDLEdBQUcsR0FBRyxHQUFHQSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7VUFDMUQzRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM0RSxVQUFVLENBQUMsdUJBQXVCLENBQUM7VUFDM0M1RSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM0RSxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ3ZDO01BQ0osQ0FBQyxDQUFDO01BQ0Y1RSxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQzZFLFNBQVMsQ0FBQ04sTUFBTSxDQUFDO01BQzdDdkUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLFVBQVV3RSxDQUFDLEVBQUVuRyxJQUFJLEVBQUU7UUFDcEQsSUFBSSxTQUFTLENBQUNvRCxJQUFJLENBQUMvQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNlLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO1VBQ3RDO1VBQ0E7VUFDQSxJQUFJZ0UsUUFBUSxHQUFHOUUsTUFBTSxDQUFDK0UsV0FBVyxDQUFDLE1BQU07WUFDcEMsSUFBSWhGLENBQUMsQ0FBQyxxREFBcUQsQ0FBQyxDQUFDd0QsTUFBTSxFQUFFO2NBQ2pFeEQsQ0FBQyxDQUFDLHFEQUFxRCxDQUFDLENBQUNlLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQ2tFLE9BQU8sQ0FBQyxNQUFNLENBQUM7Y0FDM0doRixNQUFNLENBQUNpRixhQUFhLENBQUNILFFBQVEsQ0FBQztZQUNsQztVQUNKLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDWDtNQUNKLENBQUMsQ0FBQztJQUNOLENBQUM7SUFHRDtBQUNSO0FBQ0E7QUFDQTtJQUNRMUUsT0FBT0EsQ0FBQSxFQUFHO01BQ047SUFBQSxDQUNIO0lBR0Q7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDUThFLE9BQU9BLENBQUNoQyxJQUFJLEVBQUVpQyxNQUFNLEVBQUVDLFVBQVUsRUFBRTtNQUM5QixPQUFPLElBQUksQ0FBQ0MsS0FBSyxDQUFDSCxPQUFPLENBQUNBLE9BQU8sQ0FBQ2hDLElBQUksRUFBRWlDLE1BQU0sRUFBRUMsVUFBVSxDQUFDO0lBQy9ELENBQUM7SUFFRDtBQUNSO0FBQ0E7QUFDQTtBQUNBO0lBQ1FFLFdBQVdBLENBQUNDLEtBQUssRUFBRTtNQUNmLE9BQU92RixNQUFNLENBQUNzRixXQUFXLENBQUNDLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBRUQ7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDUUMsTUFBTUEsQ0FBQ0MsQ0FBQyxFQUFFQyxLQUFLLEVBQUU7TUFDYixPQUFPMUYsTUFBTSxDQUFDd0YsTUFBTSxDQUFDQyxDQUFDLEVBQUVDLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBRUQ7QUFDUjtBQUNBO0FBQ0E7QUFDQTtJQUNRakMsTUFBTUEsQ0FBQ2tDLFNBQVMsRUFBRWpILElBQUksR0FBRyxJQUFJLEVBQUVrSCxhQUFhLEdBQUcsSUFBSSxFQUFFO01BQ2pENUYsTUFBTSxDQUFDTyxVQUFVLENBQUMsWUFBWTtRQUMxQixJQUFJeUMsTUFBTSxHQUFHakQsQ0FBQyxDQUFDUyxRQUFRLENBQUMsQ0FBQ3dFLE9BQU8sQ0FBQ1csU0FBUyxFQUFFakgsSUFBSSxDQUFDO01BQ3JELENBQUMsRUFBRSxFQUFFLENBQUM7SUFDVixDQUFDO0lBRUQ7QUFDUjtBQUNBO0FBQ0E7QUFDQTtJQUNRcUYsUUFBUUEsQ0FBQzhCLFdBQVcsRUFBRUMsT0FBTyxHQUFHLEtBQUssRUFBRTtNQUNuQyxJQUFJMUMsS0FBSyxHQUFHLElBQUk7TUFDaEIsSUFBSSxPQUFPeUMsV0FBWSxJQUFJLFFBQVEsRUFBRTtRQUNqQ3pDLEtBQUssR0FBR3lDLFdBQVc7TUFDdkIsQ0FBQyxNQUFNLElBQUksT0FBT0EsV0FBWSxJQUFJLFFBQVEsRUFBRTtRQUN4Q0EsV0FBVyxHQUFHOUYsQ0FBQyxDQUFDOEYsV0FBVyxDQUFDO1FBQzVCekMsS0FBSyxHQUFHeUMsV0FBVyxDQUFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDQyxHQUFHO01BQ3BDLENBQUMsTUFBTSxJQUFJSCxXQUFXLFlBQVlJLFdBQVcsRUFBRTtRQUMzQzdDLEtBQUssR0FBR3JELENBQUMsQ0FBQzhGLFdBQVcsQ0FBQyxDQUFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDQyxHQUFHO01BQ3ZDLENBQUMsTUFBTSxJQUFJSCxXQUFXLFlBQVlLLE1BQU0sRUFBRTtRQUN0QzlDLEtBQUssR0FBR3lDLFdBQVcsQ0FBQ0UsTUFBTSxDQUFDLENBQUMsQ0FBQ0MsR0FBRztNQUNwQztNQUNBLElBQUk1QyxLQUFLLEtBQUssSUFBSSxFQUFFO1FBQ2hCO1FBQ0EsSUFBSTRDLEdBQUcsR0FBR0csSUFBSSxDQUFDQyxHQUFHLENBQUMsQ0FBQyxFQUFFRCxJQUFJLENBQUNFLEtBQUssQ0FBQ2pELEtBQUssR0FBRyxJQUFJLENBQUNELGVBQWUsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN0RTRDLEdBQUcsR0FBR0csSUFBSSxDQUFDRyxHQUFHLENBQUNOLEdBQUcsRUFBRWpHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0csV0FBVyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUNyQixZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJMEgsWUFBWSxHQUFHO1VBQ2ZDLElBQUksRUFBRSxDQUFDO1VBQ1BSLEdBQUc7VUFDSFMsUUFBUSxFQUFFWCxPQUFPLEdBQUcsU0FBUyxHQUFHO1FBQ3BDLENBQUM7UUFDRDtRQUNBOUYsTUFBTSxDQUFDK0QsUUFBUSxDQUFDd0MsWUFBWSxDQUFDO1FBQzdCO1FBQ0EsSUFBSSxDQUFDVCxPQUFPLEVBQUU7VUFDVixJQUFJWSxnQkFBZ0IsR0FBRzFHLE1BQU0sQ0FBQytFLFdBQVcsQ0FBQyxNQUFNO1lBQzVDLE1BQU00QixlQUFlLEdBQUdDLFFBQVEsQ0FBQzdHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0csV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUNLaUcsSUFBSSxDQUFDVSxHQUFHLENBQUNWLElBQUksQ0FBQ0UsS0FBSyxDQUFDLElBQUksQ0FBQ3ZILFNBQVMsQ0FBQyxHQUFHcUgsSUFBSSxDQUFDRSxLQUFLLENBQUNFLFlBQVksQ0FBQ1AsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM3RyxtQkFBbUIsSUFFMUZvSCxZQUFZLENBQUNQLEdBQUcsR0FBRyxJQUFJLENBQUNsSCxTQUFTLElBQ2pDLElBQUksQ0FBQ0EsU0FBUyxHQUFHLElBQUksQ0FBQ0QsWUFBWSxJQUFJOEgsZUFBZSxHQUFHLElBQUksQ0FBQ3hILG1CQUNqRTtZQUFJOztZQUVBb0gsWUFBWSxDQUFDUCxHQUFHLEdBQUcsSUFBSSxDQUFDbEgsU0FBUyxJQUNqQyxJQUFJLENBQUNBLFNBQVMsSUFBSSxJQUFJLENBQUNLLG1CQUMzQixDQUFDO1lBQUEsRUFDSjtjQUNFMkgsT0FBTyxDQUFDQyxHQUFHLENBQUMsb0JBQW9CLEdBQUdSLFlBQVksQ0FBQ1AsR0FBRyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUNsSCxTQUFTLENBQUM7Y0FDOUVrQixNQUFNLENBQUNpRixhQUFhLENBQUN5QixnQkFBZ0IsQ0FBQztjQUN0Q0EsZ0JBQWdCLEdBQUcsSUFBSTtZQUMzQixDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQzFILGNBQWMsRUFBRTtjQUM3QmdCLE1BQU0sQ0FBQytELFFBQVEsQ0FBQ3dDLFlBQVksQ0FBQztjQUM3Qk8sT0FBTyxDQUFDQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDakksU0FBUyxHQUFHLE1BQU0sR0FBR3lILFlBQVksQ0FBQ1AsR0FBRyxDQUFDO1lBQ3hGO1VBQ0osQ0FBQyxFQUFFLElBQUksQ0FBQzlHLG1CQUFtQixDQUFDO1FBQ2hDO1FBQ0E7TUFDSjtJQUNKO0VBQ0osQ0FBQztFQUNEOEgsUUFBUSxFQUFFO0lBQ047QUFDUjtBQUNBO0FBQ0E7SUFDUUMsb0JBQW9CQSxDQUFBLEVBQUc7TUFDbkIsT0FBTyxJQUFJLENBQUNuSSxTQUFTLEdBQUcsSUFBSSxDQUFDRCxZQUFZO0lBQzdDLENBQUM7SUFDRDtBQUNSO0FBQ0E7QUFDQTtJQUNRcUksV0FBV0EsQ0FBQSxFQUFHO01BQ1YsT0FBTyxJQUFJLENBQUNwSSxTQUFTLEdBQUcsSUFBSSxDQUFDQyxZQUFZO0lBQzdDO0VBQ0o7QUFDSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNyY0Q7QUFDQTtBQUNBO0FBQ0EsaUVBQWU7RUFDWEwsSUFBSUEsQ0FBQSxFQUFHO0lBQ0gsT0FBTztNQUNIeUksaUJBQWlCLEVBQUU7SUFDdkIsQ0FBQztFQUNMLENBQUM7RUFDREgsUUFBUSxFQUFFO0lBQ047QUFDUjtBQUNBO0FBQ0E7SUFDUUksV0FBV0EsQ0FBQSxFQUFHO01BQ1YsT0FBUSxJQUFJLENBQUN0SSxTQUFTLEdBQUdxSCxJQUFJLENBQUNDLEdBQUcsQ0FBQ3JHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDRyxXQUFXLENBQUMsQ0FBQyxFQUFFSCxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUNHLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDL0c7RUFDSixDQUFDO0VBQ0RtSCxLQUFLLEVBQUU7SUFDSHZJLFNBQVNBLENBQUEsRUFBRztNQUNSLElBQUksSUFBSSxDQUFDc0ksV0FBVyxFQUFFO1FBQ2xCLElBQUksSUFBSSxDQUFDRixXQUFXLEdBQUcsR0FBRyxFQUFFO1VBQ3hCLElBQUksQ0FBQ0MsaUJBQWlCLEdBQUcsS0FBSztRQUNsQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUNELFdBQVcsR0FBRyxDQUFDLEVBQUUsRUFBRTtVQUMvQixJQUFJLENBQUNDLGlCQUFpQixHQUFHLElBQUk7UUFDakM7TUFDSixDQUFDLE1BQU07UUFDSCxJQUFJLENBQUNBLGlCQUFpQixHQUFHLEtBQUs7TUFDbEM7SUFDSjtFQUNKO0FBQ0osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5QjRDO0FBQ3dCO0FBRXJFLGlFQUFlO0VBQ1hLLE1BQU0sRUFBRSxDQUFDRixrRUFBRyxFQUFFQyxrRkFBVyxDQUFDO0VBQzFCRSxFQUFFLEVBQUUsV0FBVztFQUNmL0ksSUFBSSxXQUFKQSxJQUFJQSxDQUFBLEVBQUc7SUFDSCxJQUFJc0UsTUFBSyxHQUFJO01BQ1RtRSxpQkFBaUIsRUFBRSxLQUFLO01BQ3hCTyxhQUFhLEVBQUUsQ0FBQztNQUNoQkMsTUFBTSxFQUFFM0gsTUFBTSxDQUFDNEg7SUFDbkIsQ0FBQztJQUNELElBQUk1SCxNQUFNLENBQUM2SCxtQkFBbUIsRUFBRTtNQUM1QnRELE1BQU0sQ0FBQ0MsTUFBTSxDQUFDeEIsTUFBTSxFQUFFaEQsTUFBTSxDQUFDNkgsbUJBQW1CLENBQUM7SUFDckQ7SUFDQSxPQUFPN0UsTUFBTTtFQUNqQixDQUFDO0VBQ0QzQixPQUFPLEVBQUU7SUFDTHZCLFlBQVksV0FBWkEsWUFBWUEsQ0FBQSxFQUFlO01BQUEsSUFBZGtFLE9BQU0sR0FBQThELFNBQUEsQ0FBQXZFLE1BQUEsUUFBQXVFLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUksQ0FBQyxDQUFDO0lBQ3pCO0VBQ0o7QUFDSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0QkQseUJBQXlCLEVBQUU7QUFDM0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsa0JBQWtCLG1CQUFtQjtBQUNyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekZPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsS0FBSyxJQUEwQztBQUMvQztBQUNBLEVBQUUsaUNBQU8sQ0FBQywyQ0FBUSxDQUFDLG9DQUFFLE9BQU87QUFBQTtBQUFBO0FBQUEsa0dBQUM7QUFDN0IsR0FBRyxLQUFLLEVBTU47QUFDRixDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwyREFBMkQ7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0TmtEO0FBQ1o7QUFDRzs7QUFFMUM7O0FBRUE7QUFDQSw2RkFBNkYsMkNBQTJDOztBQUV4STs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsZ0VBQWU7QUFDeEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFCQUFxQiwwREFBWTs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQiwwREFBWTs7QUFFaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCwyQ0FBMkMsSUFBSTtBQUMzRztBQUNBOztBQUVPO0FBQ1A7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LENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDMk8sU0FBUyxDQUFDLENBQUM7RUFDMUMzTyxDQUFDLENBQUMsdUVBQXVFLENBQUMsQ0FDckUrSyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FDekNwQixLQUFLLENBQUMsMEVBQTBFLENBQUM7RUFDdEYzSixDQUFDLENBQUMsMElBQTBJLENBQUMsQ0FDeEl5QyxNQUFNLENBQUMsNEVBQTRFLENBQUM7RUFDekZ6QyxDQUFDLENBQUMsNElBQTRJLENBQUMsQ0FDMUl5QyxNQUFNLENBQUMsc0ZBQXNGLENBQUM7RUFDbkd6QyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzBFLElBQUksQ0FBQyxZQUFXO0lBQUUxRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMrTyxTQUFTLENBQUMsQ0FBQztFQUFDLENBQUMsQ0FBQztBQUNoRixDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uLi9yYWFzLmNtcy9yZXNvdXJjZXMvanMudnVlMy9hcHBsaWNhdGlvbi9hcHAudnVlLmpzIiwid2VicGFjazovLy8uLi9yYWFzLmNtcy9yZXNvdXJjZXMvanMudnVlMy9hcHBsaWNhdGlvbi9taXhpbnMvZml4ZWQtaGVhZGVyLnZ1ZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uL2FwcC52dWUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2RlY29kZS11cmktY29tcG9uZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWx0ZXItb2JqL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcXVlcnkuc2Nyb2xsdG8vanF1ZXJ5LnNjcm9sbFRvLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9xdWVyeS1zdHJpbmcvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcXVlcnktc3RyaW5nL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zcGxpdC1vbi1maXJzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2V4cG9ydEhlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uL2FwcC52dWU/OGJmNiIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uL2FwcC52dWU/YmRiMiIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5hdXRvY29tcGxldGVyLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLmZpbGwtc2VsZWN0LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLmdldC1zZWxlY3QuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMuaW5pdC1pbnB1dHMuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMubWVudS10cmVlLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLnF1ZXJ5LXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5yZXBvLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLnRyZWUuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHZhciBcImpRdWVyeVwiIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDQmtCw0YDQutCw0YEg0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCo0LjRgNC40L3QsCDRjdC60YDQsNC90LBcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoOiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCo0LjRgNC40L3QsCBib2R5XHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBib2R5V2lkdGg6IDAsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0JLRi9GB0L7RgtCwINGN0LrRgNCw0L3QsFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgd2luZG93SGVpZ2h0OiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCh0LzQtdGJ0LXQvdC40LUg0L/QviDQstC10YDRgtC40LrQsNC70LhcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjcm9sbFRvcDogMCxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQodGC0LDRgNC+0LUg0YHQvNC10YnQtdC90LjQtSDQv9C+INCy0LXRgNGC0LjQutCw0LvQuFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgb2xkU2Nyb2xsVG9wOiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCf0YDQvtC40YHRhdC+0LTQuNGCINC70Lgg0YHQtdC50YfQsNGBINGB0LrRgNC+0LvQu9C40L3Qs1xyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlzU2Nyb2xsaW5nTm93OiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQn9GA0L7QuNGB0YXQvtC00LjRgiDQu9C4INGB0LXQudGH0LDRgSDRgdC60YDQvtC70LvQuNC90LMgKElEIyDRgtCw0LnQvNCw0YPRgtCwKVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQ6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCe0LbQuNC00LDQvdC40LUg0L7QutC+0L3Rh9Cw0L3QuNGPINGB0LrRgNC+0LvQu9C40L3Qs9CwLCDQvNGBXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpc1Njcm9sbGluZ05vd0RlbGF5OiAyNTAsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0J/QvtCz0YDQtdGI0L3QvtGB0YLRjCDRgdC60YDQvtC70LvQuNC90LPQsFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2Nyb2xsaW5nSW5hY2N1cmFjeTogNSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQodC10LvQtdC60YLQvtGAINGB0YHRi9C70L7QuiDQtNC70Y8gc2Nyb2xsVG9cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjcm9sbFRvU2VsZWN0b3I6ICdhW2hyZWYqPVwibW9kYWxcIl1baHJlZio9XCIjXCJdLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnYS5zY3JvbGxUb1tocmVmKj1cIiNcIl0sICcgKyBcclxuICAgICAgICAgICAgICAgICdhW2hyZWZePVwiI1wiXTpub3QoW2hyZWY9XCIjXCJdKTpub3QoW2RhdGEtdG9nZ2xlXSk6bm90KFtkYXRhLWJzLXRvZ2dsZV0pLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnLm1lbnUtdG9wX19saW5rW2hyZWYqPVwiI1wiXSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJy5tZW51LW1haW5fX2xpbmtbaHJlZio9XCIjXCJdLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnLm1lbnUtYm90dG9tX19saW5rW2hyZWYqPVwiI1wiXSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJy5tZW51LW1vYmlsZV9fbGlua1tocmVmKj1cIiNcIl0nLFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0JzQtdC00LjQsC3RgtC40L/RiyAo0YjQuNGA0LjQvdCwINCyIHB4KVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWVkaWFUeXBlczoge1xyXG4gICAgICAgICAgICAgICAgeHhsOiAxNDAwLFxyXG4gICAgICAgICAgICAgICAgeGw6IDEyMDAsXHJcbiAgICAgICAgICAgICAgICBsZzogOTkyLFxyXG4gICAgICAgICAgICAgICAgbWQ6IDc2OCxcclxuICAgICAgICAgICAgICAgIHNtOiA1NzYsXHJcbiAgICAgICAgICAgICAgICB4czogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgbW91bnRlZCgpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5saWdodEJveEluaXQoKTtcclxuICAgICAgICB0aGlzLndpbmRvd1dpZHRoID0gJCh3aW5kb3cpLmlubmVyV2lkdGgoKTtcclxuICAgICAgICB0aGlzLndpbmRvd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgIHRoaXMuYm9keVdpZHRoID0gJCgnYm9keScpLm91dGVyV2lkdGgoKTtcclxuICAgICAgICB0aGlzLmZpeEh0bWwoKTtcclxuICAgICAgICAkKHdpbmRvdylcclxuICAgICAgICAgICAgLm9uKCdyZXNpemUnLCBzZWxmLmZpeEh0bWwpXHJcbiAgICAgICAgICAgIC5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dXaWR0aCA9ICQod2luZG93KS5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2R5V2lkdGggPSAkKCdib2R5Jykub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ3Njcm9sbCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBvbGRTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2Nyb2xsaW5nTm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1Njcm9sbGluZ05vdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2Nyb2xsaW5nTm93VGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2xkU2Nyb2xsVG9wID0gb2xkU2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmdOb3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuaXNTY3JvbGxpbmdOb3dEZWxheSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNjcm9sbFRvU2VsZWN0b3IsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJykuc3BsaXQoJyMnKVswXTtcclxuICAgICAgICAgICAgLy8gaWYgKHVybCkge1xyXG4gICAgICAgICAgICAvLyAgICAgdXJsID0gJyMnICsgdXJsO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmICghdXJsIHx8ICh1cmwgPT0gY3VycmVudFVybCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHJvY2Vzc0hhc2hMaW5rKHRoaXMuaGFzaCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignc2hvdy5icy50YWInLCAnYScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgJCh0aGlzKS5hdHRyKCdocmVmJykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIYXNoTGluayh3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjcm9sbFRvcCA9IHRoaXMub2xkU2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICAvLyAkKCcubWVudS10cmlnZ2VyJykuYXBwZW5kVG8oJy5ib2R5X19tZW51LW1vYmlsZScpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLmNvbmZpcm0gPSB0aGlzLnJlZnMuY29uZmlybTtcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7RgtC/0YDQsNCy0LvRj9C10YIg0LfQsNC/0YDQvtGBINC6IEFQSVxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIFVSTCDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuFxyXG4gICAgICAgICAqIEBwYXJhbSAge21peGVkfSBwb3N0RGF0YSBQT1NULdC00LDQvdC90YvQtSDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuCAo0LXRgdC70LggbnVsbCwg0YLQviBHRVQt0LfQsNC/0YDQvtGBKVxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcn0gYmxvY2tJZCBJRCMg0LHQu9C+0LrQsCDQtNC70Y8g0LTQvtCx0LDQstC70LXQvdC40Y8gQUpBWD17YmxvY2tJZH0g0Lgg0LfQsNCz0L7Qu9C+0LLQutCwIFgtUkFBUy1CbG9jay1JZFxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVzcG9uc2VUeXBlIE1JTUUt0YLQuNC/INC/0L7Qu9GD0YfQsNC10LzQvtCz0L4g0L7RgtCy0LXRgtCwICjQtdGB0LvQuCDQv9GA0LjRgdGD0YLRgdGC0LLRg9C10YIg0YHQu9GN0YggLywg0YLQviDQvtGC0L/RgNCw0LLQu9GP0LXRgtGB0Y8g0YLQsNC60LbQtSDQt9Cw0LPQvtC70L7QstC+0LogQWNjZXB0KVxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVxdWVzdFR5cGUgTUlNRS3RgtC40L8g0LfQsNC/0YDQvtGB0LAgKNC10YHQu9C4INC/0YDQuNGB0YPRgtGB0YLQstGD0LXRgiDRgdC70Y3RiCAvLCDRgtC+INC+0YLQv9GA0LDQstC70Y/QtdGC0YHRjyDRgtCw0LrQttC1INC30LDQs9C+0LvQvtCy0L7QuiBDb250ZW50LVR5cGUpXHJcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBhZGRpdGlvbmFsSGVhZGVycyDQlNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC30LDQs9C+0LvQvtCy0LrQuFxyXG4gICAgICAgICAqIEBwYXJhbSB7QWJvcnRDb250cm9sbGVyfG51bGx9IGFib3J0Q29udHJvbGxlciDQmtC+0L3RgtGA0L7Qu9C70LXRgCDQv9GA0LXRgNGL0LLQsNC90LjRj1xyXG4gICAgICAgICAqIEByZXR1cm4ge21peGVkfSDQoNC10LfRg9C70YzRgtCw0YIg0LfQsNC/0YDQvtGB0LBcclxuICAgICAgICAgKi9cclxuICAgICAgICBhc3luYyBhcGkoXHJcbiAgICAgICAgICAgIHVybCwgXHJcbiAgICAgICAgICAgIHBvc3REYXRhID0gbnVsbCwgXHJcbiAgICAgICAgICAgIGJsb2NrSWQgPSBudWxsLCBcclxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlID0gJ2FwcGxpY2F0aW9uL2pzb24nLCBcclxuICAgICAgICAgICAgcmVxdWVzdFR5cGUgPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcclxuICAgICAgICAgICAgYWRkaXRpb25hbEhlYWRlcnMgPSB7fSxcclxuICAgICAgICAgICAgYWJvcnRDb250cm9sbGVyID0gbnVsbCxcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8gMjAyMy0xMS0wOSwgQVZTOiDQtNC+0LHQsNCy0LjQuyDQtNC10LvQtdC90LjQtSDQv9C+ICMsINGCLtC6LiDRhdGN0YjRgtC10LPQuCDQtNC70Y8g0YHQtdGA0LLQtdGA0LAg0YHQvNGL0YHQu9CwINC90LUg0LjQvNC10Y7RglxyXG4gICAgICAgICAgICBsZXQgcmVhbFVybCA9IHVybC5zcGxpdCgnIycpWzBdO1xyXG4gICAgICAgICAgICBpZiAoIS9cXC9cXC8vZ2kudGVzdChyZWFsVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlYWxVcmxbMF0gIT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbFVybCA9ICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHJlYWxVcmw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxVcmwgPSAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyByZWFsVXJsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7Li4uYWRkaXRpb25hbEhlYWRlcnN9O1xyXG4gICAgICAgICAgICBsZXQgcng7XHJcbiAgICAgICAgICAgIGlmIChibG9ja0lkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIS8oXFw/fCYpQUpBWD0vZ2kudGVzdChyZWFsVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxVcmwgKz0gKC9cXD8vZ2kudGVzdChyZWFsVXJsKSA/ICcmJyA6ICc/JykgKyAnQUpBWD0nICsgYmxvY2tJZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ1gtUkFBUy1CbG9jay1JZCddID0gYmxvY2tJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoL1xcLy9naS50ZXN0KHJlc3BvbnNlVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gcmVzcG9uc2VUeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgvXFwvL2dpLnRlc3QocmVxdWVzdFR5cGUpICYmICEhcG9zdERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gcmVxdWVzdFR5cGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZmV0Y2hPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGFib3J0Q29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLnNpZ25hbCA9IGFib3J0Q29udHJvbGxlci5zaWduYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEhcG9zdERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5tZXRob2QgPSAnUE9TVCc7XHJcbiAgICAgICAgICAgICAgICBpZiAoL2Zvcm0vZ2kudGVzdChyZXF1ZXN0VHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoL211bHRpcGFydC9naS50ZXN0KHJlcXVlc3RUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm9ybURhdGEgID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3N0RGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YSA9IHBvc3REYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBwb3N0RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChuYW1lLCBwb3N0RGF0YVtuYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLmJvZHkgPSBmb3JtRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyDQotCw0Lwg0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60LggYm91bmRhcnkg0YHRgtCw0LLQuNGC0YHRjywg0LHQtdC3INC90LXQs9C+INGE0LjQs9C90Y8g0L/QvtC70YPRh9Cw0LXRgtGB0Y9cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMuYm9keSA9IHdpbmRvdy5xdWVyeVN0cmluZy5zdHJpbmdpZnkocG9zdERhdGEsIHsgYXJyYXlGb3JtYXQ6ICdicmFja2V0JyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgcG9zdERhdGEpID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5ib2R5ID0gcG9zdERhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZmV0Y2hPcHRpb25zKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZWFsVXJsLCBmZXRjaE9wdGlvbnMpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAoL2pzb24vZ2kudGVzdChyZXNwb25zZVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINGB0LzQtdGJ0LXQvdC40LUg0L/QviDQstC10YDRgtC40LrQsNC70Lgg0LTQu9GPIHNjcm9sbFRvIFxyXG4gICAgICAgICAqICjQtNC70Y8g0YHQu9GD0YfQsNGPINGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC5INGI0LDQv9C60LgpXHJcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlc3RZINCi0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y9cclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0U2Nyb2xsT2Zmc2V0KGRlc3RZID0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0L7QsdGK0LXQutGC0LAg0L/QviDRhdGN0Ygt0YLQtdCz0YNcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaGFzaCDRhdGN0Ygt0YLQtdCzICjQv9C10YDQstGL0Lkg0YHQuNC80LLQvtC7ICMpXHJcbiAgICAgICAgICogQHJldHVybiB7alF1ZXJ5fG51bGx9IG51bGwsINC10YHQu9C4INC90LUg0L3QsNC50LTQtdC9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0T2JqRnJvbUhhc2goaGFzaCkge1xyXG4gICAgICAgICAgICBpZiAoaGFzaFswXSAhPSAnIycpIHtcclxuICAgICAgICAgICAgICAgIGhhc2ggPSAnIycgKyBoYXNoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCAkb2JqID0gJChoYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRvYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG9iajtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgJG9iaiA9ICQoJ1tuYW1lPVwiJyArIGhhc2gucmVwbGFjZSgnIycsICcnKSArICdcIl0nKTtcclxuICAgICAgICAgICAgaWYgKCRvYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG9iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQntCx0YDQsNCx0LDRgtGL0LLQsNC10YIg0YXRjdGILdGB0YHRi9C70LrRg1xyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBoYXNoINGF0Y3RiC3RgtC10LMgKNC/0LXRgNCy0YvQuSDRgdC40LzQstC+0LsgIylcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm9jZXNzSGFzaExpbmsoaGFzaCkge1xyXG4gICAgICAgICAgICB0aGlzLmpxRW1pdCgncHJvY2Vzc0hhc2hMaW5rJywgaGFzaCk7XHJcbiAgICAgICAgICAgIGxldCAkb2JqID0gdGhpcy5nZXRPYmpGcm9tSGFzaChoYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRvYmogJiYgJG9iai5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkb2JqLmhhc0NsYXNzKCdtb2RhbCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG9iai5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkb2JqLmhhc0NsYXNzKCd0YWItcGFuZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0ICRoYXNoTGluayA9ICQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhW2hyZWY9XCInICsgaGFzaCArICdcIl0sICcgKyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FbaHJlZj1cIicgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoICsgaGFzaCArICdcIl0sICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYVtocmVmPVwiJyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgJ1wiXSdcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkaGFzaExpbmsubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRoYXNoTGlua1swXS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUbygkb2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPIGxpZ2h0Qm94J9CwXHJcbiAgICAgICAgICogKNC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyBsaWdodENhc2UpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGlnaHRCb3hJbml0KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgICAgICBsZXQgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzQWxsSW1hZ2VMaW5rczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN3aXBlOiB0cnVlLCBcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdzY3JvbGxIb3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAgIHR5cGVNYXBwaW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2ltYWdlJzogJ2pwZyxqcGVnLGdpZixwbmcsYm1wLHdlYnAsc3ZnJywgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIGxldCByeCA9IC9cXC4oanBnfGpwZWd8cGpwZWd8cG5nfGdpZnx3ZWJwfHN2ZykkL2k7XHJcbiAgICAgICAgICAgICQoJ2E6bm90KFtkYXRhLXJlbF49bGlnaHRjYXNlXSk6bm90KFtkYXRhLW5vLWxpZ2h0Ym94XSknKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMucHJvY2Vzc0FsbEltYWdlTGlua3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocngudGVzdCgkKHRoaXMpLmF0dHIoJ2hyZWYnKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdkYXRhLWxpZ2h0Ym94JywgJ3RydWUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgZyA9ICQodGhpcykuYXR0cignZGF0YS1saWdodGJveC1nYWxsZXJ5Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZyB8fCAkKHRoaXMpLmF0dHIoJ2RhdGEtbGlnaHRib3gnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignZGF0YS1yZWwnLCAnbGlnaHRjYXNlJyArIChnID8gJzonICsgZyA6ICcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdkYXRhLWxpZ2h0Ym94LWdhbGxlcnknKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoJ2RhdGEtbGlnaHRib3gnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJ2FbZGF0YS1yZWxePWxpZ2h0Y2FzZV0nKS5saWdodGNhc2UocGFyYW1zKTtcclxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljay5saWdodGNhc2UnLCAnYScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoL3lvdXR1L2dpLnRlc3QoJCh0aGlzKS5hdHRyKCdocmVmJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JrQvtGB0YLRi9C70YwsINGH0YLQvtCx0Ysg0L3QtSDQtNC+0LbQuNC00LDRgtGM0YHRjyDQv9C+0LvQvdC+0Lkg0LfQsNCz0YDRg9C30LrQuCBZb3V0dWJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMjAyMy0wOS0xMywgQVZTOiDQtNC+0LHQsNCy0LjQu9C4INC/0LDRgNCw0LzQtdGC0YAgcmFhcy1saWdodGNhc2UtbG9hZGVkINGH0YLQvtCx0Ysg0L7QsdGA0LDQsdCw0YLRi9Cy0LDRgtGMINCz0LDQu9C10YDQtdGOINCy0LjQtNC10L5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2xpZ2h0Y2FzZS1jYXNlIGlmcmFtZTpub3QoW3JhYXMtbGlnaHRjYXNlLWxvYWRlZF0pJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjbGlnaHRjYXNlLWNhc2UgaWZyYW1lOm5vdChbcmFhcy1saWdodGNhc2UtbG9hZGVkXSknKS5hdHRyKCdyYWFzLWxpZ2h0Y2FzZS1sb2FkZWQnLCAnMScpLnRyaWdnZXIoJ2xvYWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC40LrRgdCw0YbQuNGPIEhUTUwgKNGF0LXQu9C/0LXRgCDQtNC70Y8g0LzQvtC00LjRhNC40LrQsNGG0LjQuCDQstC10YDRgdGC0LrQuClcclxuICAgICAgICAgKiAo0LDQsdGB0YLRgNCw0LrRgtC90YvQuSwg0LTQu9GPINC/0LXRgNC10L7Qv9GA0LXQtNC10LvQtdC90LjRjylcclxuICAgICAgICAgKi9cclxuICAgICAgICBmaXhIdG1sKCkge1xyXG4gICAgICAgICAgICAvLyAuLi5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0L7RgtC+0LHRgNCw0LbQtdC90LjRjyDQvtC60L3QsCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRj1xyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGV4dCAgICAgICDQotC10LrRgdGCINC30LDQv9GA0L7RgdCwXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBva1RleHQgICAgINCi0LXQutGB0YIg0LrQvdC+0L/QutC4IFwi0J7QmlwiXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBjYW5jZWxUZXh0INCi0LXQutGB0YIg0LrQvdC+0L/QutC4IFwi0J7RgtC80LXQvdCwXCJcclxuICAgICAgICAgKiBAcmV0dXJuIHtqUXVlcnkuUHJvbWlzZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25maXJtKHRleHQsIG9rVGV4dCwgY2FuY2VsVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kcmVmcy5jb25maXJtLmNvbmZpcm0odGV4dCwgb2tUZXh0LCBjYW5jZWxUZXh0KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INGG0LXQvdGLXHJcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSB4INCm0LXQvdCwXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvcm1hdFByaWNlKHByaWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZm9ybWF0UHJpY2UocHJpY2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0YfQuNGB0LvQuNGC0LXQu9GM0L3Ri9GFXHJcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSB4INCn0LjRgdC70L5cclxuICAgICAgICAgKiBAcGFyYW0gIHtBcnJheX0gZm9ybXMgPHByZT48Y29kZT5bXHJcbiAgICAgICAgICogICAgICfRgtC+0LLQsNGA0L7QsicsIFxyXG4gICAgICAgICAqICAgICAn0YLQvtCy0LDRgCcsIFxyXG4gICAgICAgICAqICAgICAn0YLQvtCy0LDRgNCwJ1xyXG4gICAgICAgICAqIF08L2NvZGU+PC9wcmU+INCh0LvQvtCy0L7RhNC+0YDQvNGLXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG51bVR4dCh4LCBmb3Jtcykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm51bVR4dCh4LCBmb3Jtcyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JPQtdC90LXRgNC40YDRg9C10YIgalF1ZXJ5LdGB0L7QsdGL0YLQuNC1INGD0YDQvtCy0L3RjyDQtNC+0LrRg9C80LXQvdGC0LBcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgICAqIEBwYXJhbSB7bWl4ZWR9IGRhdGEg0JTQsNC90L3Ri9C1INC00LvRjyDQv9C10YDQtdC00LDRh9C4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAganFFbWl0KGV2ZW50TmFtZSwgZGF0YSA9IG51bGwsIG9yaWdpbmFsRXZlbnQgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSAkKGRvY3VtZW50KS50cmlnZ2VyKGV2ZW50TmFtZSwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0sIDEwKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQodC60YDQvtC70LvQuNGCINC/0L4g0LLQtdGA0YLQuNC60LDQu9C4INC6INC30LDQtNCw0L3QvdC+0LzRgyDQvtCx0YrQtdC60YLRgy/Qv9C+0LfQuNGG0LjQuFxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcnxIVE1MRWxlbWVudHxqUXVlcnl9IGRlc3RpbmF0aW9uINCd0LDQt9C90LDRh9C10L3QuNC1ICjRgtC+0YfQtdC6INC/0L4gWSwg0LvQuNCx0L4g0Y3Qu9C10LzQtdC90YIpXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpbnN0YW50INCd0LXQvNC10LTQu9C10L3QvdGL0Lkg0YHQutGA0L7Qu9C7ICjQv9C70LDQstC90YvQuSwg0LXRgdC70LggZmFsc2UpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2Nyb2xsVG8oZGVzdGluYXRpb24sIGluc3RhbnQgPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBsZXQgZGVzdFkgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mKGRlc3RpbmF0aW9uKSA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoZGVzdGluYXRpb24pID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICQoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSBkZXN0aW5hdGlvbi5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdGluYXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSAkKGRlc3RpbmF0aW9uKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdGluYXRpb24gaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RZID0gZGVzdGluYXRpb24ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkZXN0WSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGVzdFkpXHJcbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChkZXN0WSArIHRoaXMuZ2V0U2Nyb2xsT2Zmc2V0KGRlc3RZKSkpO1xyXG4gICAgICAgICAgICAgICAgdG9wID0gTWF0aC5taW4odG9wLCAkKCcuYm9keScpLm91dGVySGVpZ2h0KCkgLSB0aGlzLndpbmRvd0hlaWdodCAtIDEpOyAvLyAyMDI0LTAxLTE1LCBBVlM6INCf0L7Qv9GA0LDQstC60LAg0L3QsCDQvdC40LbQvdC40Lkg0LrRgNCw0Lkg0LTQvtC60YPQvNC10L3RgtCwXHJcbiAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsVG9EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcCxcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogaW5zdGFudCA/ICdpbnN0YW50JyA6ICdzbW9vdGgnLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbFRvRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oc2Nyb2xsVG9EYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vIDIwMjMtMDktMTksIEFWUzog0YHQtNC10LvQsNC10Lwg0LfQsNGJ0LjRgtGDINGB0LrRgNC+0LvQu9C40L3Qs9CwXHJcbiAgICAgICAgICAgICAgICBpZiAoIWluc3RhbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvdGVjdFNjcm9sbGluZyA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvZHlPdXRlckhlaWdodCA9IHBhcnNlSW50KCQoJy5ib2R5Jykub3V0ZXJIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLmFicyhNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsVG9wKSAtIE1hdGgucm91bmQoc2Nyb2xsVG9EYXRhLnRvcCkpIDwgdGhpcy5zY3JvbGxpbmdJbmFjY3VyYWN5KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzY3JvbGxUb0RhdGEudG9wID4gdGhpcy5zY3JvbGxUb3ApICYmIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLnNjcm9sbFRvcCArIHRoaXMud2luZG93SGVpZ2h0ID49IGJvZHlPdXRlckhlaWdodCAtIHRoaXMuc2Nyb2xsaW5nSW5hY2N1cmFjeSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgfHwgLy8g0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10LwsINC10YHQu9C4INC00LLQuNC20LXQvNGB0Y8g0LLQvdC40LcsINC90L4g0LTQvtGB0YLQuNCz0LvQuCDQvdC40LfQsCDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNjcm9sbFRvRGF0YS50b3AgPCB0aGlzLnNjcm9sbFRvcCkgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIDw9IHRoaXMuc2Nyb2xsaW5nSW5hY2N1cmFjeSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgLy8g0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10LwsINC10YHQu9C4INC00LLQuNC20LXQvNGB0Y8g0LLQstC10YDRhSwg0L3QviDQtNC+0YHRgtC40LPQu9C4INCy0LXRgNGF0LAg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdG9wIHNjcm9sbGluZyB0byAnICsgc2Nyb2xsVG9EYXRhLnRvcCArICcgb24gJyArIHRoaXMuc2Nyb2xsVG9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHByb3RlY3RTY3JvbGxpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdGVjdFNjcm9sbGluZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTY3JvbGxpbmdOb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxUb0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbnRpbnVlIHNjcm9sbGluZyBmcm9tICcgKyB0aGlzLnNjcm9sbFRvcCArICcgdG8gJyArIHNjcm9sbFRvRGF0YS50b3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcy5pc1Njcm9sbGluZ05vd0RlbGF5KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gJC5zY3JvbGxUbyhzY3JvbGxUb0RhdGEudG9wLCBpbnN0YW50ID8gdGhpcy5pc1Njcm9sbGluZ05vd0RlbGF5IDogMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JrQvtC+0YDQtNC40L3QsNGC0Ysg0L3QuNC20L3QtdC5INCz0YDQsNC90LjRhtGLINC+0LrQvdCwXHJcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd2luZG93Qm90dG9tUG9zaXRpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcm9sbFRvcCArIHRoaXMud2luZG93SGVpZ2h0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J/QvtGB0LvQtdC00L3QtdC1INGB0LzQtdGJ0LXQvdC40LUg0L/QviDRgdC60YDQvtC70LvQuNC90LPRg1xyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBzY3JvbGxEZWx0YSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9wIC0gdGhpcy5vbGRTY3JvbGxUb3A7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0iLCIvKipcclxuICog0KTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LUg0LzQtdC90Y5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZml4ZWRIZWFkZXJBY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC40LrRgdC40YDQvtCy0LDQvdC90LDRjyDQu9C4INGI0LDQv9C60LBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZpeGVkSGVhZGVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2Nyb2xsVG9wID4gTWF0aC5tYXgoJCgnLmJvZHlfX2hlYWRlci1vdXRlcicpLm91dGVySGVpZ2h0KCksICQoJy5ib2R5X19oZWFkZXInKS5vdXRlckhlaWdodCgpKSk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICAgIHNjcm9sbFRvcCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZml4ZWRIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbERlbHRhID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXhlZEhlYWRlckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNjcm9sbERlbHRhIDwgLTYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXhlZEhlYWRlckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpeGVkSGVhZGVyQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfVxyXG59IiwiPHNjcmlwdD5cclxuaW1wb3J0IEFwcCBmcm9tICdjbXMvYXBwbGljYXRpb24vYXBwLnZ1ZS5qcyc7XHJcbmltcG9ydCBGaXhlZEhlYWRlciBmcm9tICdjbXMvYXBwbGljYXRpb24vbWl4aW5zL2ZpeGVkLWhlYWRlci52dWUuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbWl4aW5zOiBbQXBwLCBGaXhlZEhlYWRlcl0sXHJcbiAgICBlbDogJyNyYWFzLWFwcCcsXHJcbiAgICBkYXRhKCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIGZpeGVkSGVhZGVyQWN0aXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgbGFzdFNjcm9sbFRvcDogMCxcclxuICAgICAgICAgICAgY29uZmlnOiB3aW5kb3cucmFhc0NvbmZpZyxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICh3aW5kb3cucmFhc0FwcGxpY2F0aW9uRGF0YSkge1xyXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHJlc3VsdCwgd2luZG93LnJhYXNBcHBsaWNhdGlvbkRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICBsaWdodEJveEluaXQob3B0aW9ucyA9IHt9KSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG48L3NjcmlwdD4iLCJjb25zdCB0b2tlbiA9ICclW2EtZjAtOV17Mn0nO1xuY29uc3Qgc2luZ2xlTWF0Y2hlciA9IG5ldyBSZWdFeHAoJygnICsgdG9rZW4gKyAnKXwoW14lXSs/KScsICdnaScpO1xuY29uc3QgbXVsdGlNYXRjaGVyID0gbmV3IFJlZ0V4cCgnKCcgKyB0b2tlbiArICcpKycsICdnaScpO1xuXG5mdW5jdGlvbiBkZWNvZGVDb21wb25lbnRzKGNvbXBvbmVudHMsIHNwbGl0KSB7XG5cdHRyeSB7XG5cdFx0Ly8gVHJ5IHRvIGRlY29kZSB0aGUgZW50aXJlIHN0cmluZyBmaXJzdFxuXHRcdHJldHVybiBbZGVjb2RlVVJJQ29tcG9uZW50KGNvbXBvbmVudHMuam9pbignJykpXTtcblx0fSBjYXRjaCB7XG5cdFx0Ly8gRG8gbm90aGluZ1xuXHR9XG5cblx0aWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAxKSB7XG5cdFx0cmV0dXJuIGNvbXBvbmVudHM7XG5cdH1cblxuXHRzcGxpdCA9IHNwbGl0IHx8IDE7XG5cblx0Ly8gU3BsaXQgdGhlIGFycmF5IGluIDIgcGFydHNcblx0Y29uc3QgbGVmdCA9IGNvbXBvbmVudHMuc2xpY2UoMCwgc3BsaXQpO1xuXHRjb25zdCByaWdodCA9IGNvbXBvbmVudHMuc2xpY2Uoc3BsaXQpO1xuXG5cdHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmNhbGwoW10sIGRlY29kZUNvbXBvbmVudHMobGVmdCksIGRlY29kZUNvbXBvbmVudHMocmlnaHQpKTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChpbnB1dCk7XG5cdH0gY2F0Y2gge1xuXHRcdGxldCB0b2tlbnMgPSBpbnB1dC5tYXRjaChzaW5nbGVNYXRjaGVyKSB8fCBbXTtcblxuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpbnB1dCA9IGRlY29kZUNvbXBvbmVudHModG9rZW5zLCBpKS5qb2luKCcnKTtcblxuXHRcdFx0dG9rZW5zID0gaW5wdXQubWF0Y2goc2luZ2xlTWF0Y2hlcikgfHwgW107XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGlucHV0O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGN1c3RvbURlY29kZVVSSUNvbXBvbmVudChpbnB1dCkge1xuXHQvLyBLZWVwIHRyYWNrIG9mIGFsbCB0aGUgcmVwbGFjZW1lbnRzIGFuZCBwcmVmaWxsIHRoZSBtYXAgd2l0aCB0aGUgYEJPTWBcblx0Y29uc3QgcmVwbGFjZU1hcCA9IHtcblx0XHQnJUZFJUZGJzogJ1xcdUZGRkRcXHVGRkZEJyxcblx0XHQnJUZGJUZFJzogJ1xcdUZGRkRcXHVGRkZEJyxcblx0fTtcblxuXHRsZXQgbWF0Y2ggPSBtdWx0aU1hdGNoZXIuZXhlYyhpbnB1dCk7XG5cdHdoaWxlIChtYXRjaCkge1xuXHRcdHRyeSB7XG5cdFx0XHQvLyBEZWNvZGUgYXMgYmlnIGNodW5rcyBhcyBwb3NzaWJsZVxuXHRcdFx0cmVwbGFjZU1hcFttYXRjaFswXV0gPSBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbMF0pO1xuXHRcdH0gY2F0Y2gge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gZGVjb2RlKG1hdGNoWzBdKTtcblxuXHRcdFx0aWYgKHJlc3VsdCAhPT0gbWF0Y2hbMF0pIHtcblx0XHRcdFx0cmVwbGFjZU1hcFttYXRjaFswXV0gPSByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bWF0Y2ggPSBtdWx0aU1hdGNoZXIuZXhlYyhpbnB1dCk7XG5cdH1cblxuXHQvLyBBZGQgYCVDMmAgYXQgdGhlIGVuZCBvZiB0aGUgbWFwIHRvIG1ha2Ugc3VyZSBpdCBkb2VzIG5vdCByZXBsYWNlIHRoZSBjb21iaW5hdG9yIGJlZm9yZSBldmVyeXRoaW5nIGVsc2Vcblx0cmVwbGFjZU1hcFsnJUMyJ10gPSAnXFx1RkZGRCc7XG5cblx0Y29uc3QgZW50cmllcyA9IE9iamVjdC5rZXlzKHJlcGxhY2VNYXApO1xuXG5cdGZvciAoY29uc3Qga2V5IG9mIGVudHJpZXMpIHtcblx0XHQvLyBSZXBsYWNlIGFsbCBkZWNvZGVkIGNvbXBvbmVudHNcblx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobmV3IFJlZ0V4cChrZXksICdnJyksIHJlcGxhY2VNYXBba2V5XSk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlY29kZVVyaUNvbXBvbmVudChlbmNvZGVkVVJJKSB7XG5cdGlmICh0eXBlb2YgZW5jb2RlZFVSSSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBgZW5jb2RlZFVSSWAgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCwgZ290IGAnICsgdHlwZW9mIGVuY29kZWRVUkkgKyAnYCcpO1xuXHR9XG5cblx0dHJ5IHtcblx0XHQvLyBUcnkgdGhlIGJ1aWx0IGluIGRlY29kZXIgZmlyc3Rcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVuY29kZWRVUkkpO1xuXHR9IGNhdGNoIHtcblx0XHQvLyBGYWxsYmFjayB0byBhIG1vcmUgYWR2YW5jZWQgZGVjb2RlclxuXHRcdHJldHVybiBjdXN0b21EZWNvZGVVUklDb21wb25lbnQoZW5jb2RlZFVSSSk7XG5cdH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBpbmNsdWRlS2V5cyhvYmplY3QsIHByZWRpY2F0ZSkge1xuXHRjb25zdCByZXN1bHQgPSB7fTtcblxuXHRpZiAoQXJyYXkuaXNBcnJheShwcmVkaWNhdGUpKSB7XG5cdFx0Zm9yIChjb25zdCBrZXkgb2YgcHJlZGljYXRlKSB7XG5cdFx0XHRjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG5cdFx0XHRpZiAoZGVzY3JpcHRvcj8uZW51bWVyYWJsZSkge1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2NyaXB0b3IpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBgUmVmbGVjdC5vd25LZXlzKClgIGlzIHJlcXVpcmVkIHRvIHJldHJpZXZlIHN5bWJvbCBwcm9wZXJ0aWVzXG5cdFx0Zm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKG9iamVjdCkpIHtcblx0XHRcdGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwga2V5KTtcblx0XHRcdGlmIChkZXNjcmlwdG9yLmVudW1lcmFibGUpIHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcblx0XHRcdFx0aWYgKHByZWRpY2F0ZShrZXksIHZhbHVlLCBvYmplY3QpKSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjcmlwdG9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlS2V5cyhvYmplY3QsIHByZWRpY2F0ZSkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShwcmVkaWNhdGUpKSB7XG5cdFx0Y29uc3Qgc2V0ID0gbmV3IFNldChwcmVkaWNhdGUpO1xuXHRcdHJldHVybiBpbmNsdWRlS2V5cyhvYmplY3QsIGtleSA9PiAhc2V0LmhhcyhrZXkpKTtcblx0fVxuXG5cdHJldHVybiBpbmNsdWRlS2V5cyhvYmplY3QsIChrZXksIHZhbHVlLCBvYmplY3QpID0+ICFwcmVkaWNhdGUoa2V5LCB2YWx1ZSwgb2JqZWN0KSk7XG59XG4iLCIvKiFcbiAqIGpRdWVyeS5zY3JvbGxUb1xuICogQ29weXJpZ2h0IChjKSAyMDA3IEFyaWVsIEZsZXNsZXIgLSBhZmxlc2xlciDil4sgZ21haWwg4oCiIGNvbSB8IGh0dHBzOi8vZ2l0aHViLmNvbS9mbGVzbGVyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mbGVzbGVyL2pxdWVyeS5zY3JvbGxUb1xuICogQHByb2plY3REZXNjcmlwdGlvbiBMaWdodHdlaWdodCwgY3Jvc3MtYnJvd3NlciBhbmQgaGlnaGx5IGN1c3RvbWl6YWJsZSBhbmltYXRlZCBzY3JvbGxpbmcgd2l0aCBqUXVlcnlcbiAqIEBhdXRob3IgQXJpZWwgRmxlc2xlclxuICogQHZlcnNpb24gMi4xLjNcbiAqL1xuOyhmdW5jdGlvbihmYWN0b3J5KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcblx0fSBlbHNlIHtcblx0XHQvLyBHbG9iYWxcblx0XHRmYWN0b3J5KGpRdWVyeSk7XG5cdH1cbn0pKGZ1bmN0aW9uKCQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciAkc2Nyb2xsVG8gPSAkLnNjcm9sbFRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgc2V0dGluZ3MpIHtcblx0XHRyZXR1cm4gJCh3aW5kb3cpLnNjcm9sbFRvKHRhcmdldCwgZHVyYXRpb24sIHNldHRpbmdzKTtcblx0fTtcblxuXHQkc2Nyb2xsVG8uZGVmYXVsdHMgPSB7XG5cdFx0YXhpczoneHknLFxuXHRcdGR1cmF0aW9uOiAwLFxuXHRcdGxpbWl0OnRydWVcblx0fTtcblxuXHRmdW5jdGlvbiBpc1dpbihlbGVtKSB7XG5cdFx0cmV0dXJuICFlbGVtLm5vZGVOYW1lIHx8XG5cdFx0XHQkLmluQXJyYXkoZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLCBbJ2lmcmFtZScsJyNkb2N1bWVudCcsJ2h0bWwnLCdib2R5J10pICE9PSAtMTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG5cdFx0Ly8gQnJvdWdodCBmcm9tIGpRdWVyeSBzaW5jZSBpdCdzIGRlcHJlY2F0ZWRcblx0XHRyZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJ1xuXHR9XG5cblx0JC5mbi5zY3JvbGxUbyA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHNldHRpbmdzKSB7XG5cdFx0aWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHNldHRpbmdzID0gZHVyYXRpb247XG5cdFx0XHRkdXJhdGlvbiA9IDA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Ygc2V0dGluZ3MgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHNldHRpbmdzID0geyBvbkFmdGVyOnNldHRpbmdzIH07XG5cdFx0fVxuXHRcdGlmICh0YXJnZXQgPT09ICdtYXgnKSB7XG5cdFx0XHR0YXJnZXQgPSA5ZTk7XG5cdFx0fVxuXG5cdFx0c2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgJHNjcm9sbFRvLmRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cdFx0Ly8gU3BlZWQgaXMgc3RpbGwgcmVjb2duaXplZCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblx0XHRkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHNldHRpbmdzLmR1cmF0aW9uO1xuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgc2V0dGluZ3MgYXJlIGdpdmVuIHJpZ2h0XG5cdFx0dmFyIHF1ZXVlID0gc2V0dGluZ3MucXVldWUgJiYgc2V0dGluZ3MuYXhpcy5sZW5ndGggPiAxO1xuXHRcdGlmIChxdWV1ZSkge1xuXHRcdFx0Ly8gTGV0J3Mga2VlcCB0aGUgb3ZlcmFsbCBkdXJhdGlvblxuXHRcdFx0ZHVyYXRpb24gLz0gMjtcblx0XHR9XG5cdFx0c2V0dGluZ3Mub2Zmc2V0ID0gYm90aChzZXR0aW5ncy5vZmZzZXQpO1xuXHRcdHNldHRpbmdzLm92ZXIgPSBib3RoKHNldHRpbmdzLm92ZXIpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdC8vIE51bGwgdGFyZ2V0IHlpZWxkcyBub3RoaW5nLCBqdXN0IGxpa2UgalF1ZXJ5IGRvZXNcblx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHJldHVybjtcblxuXHRcdFx0dmFyIHdpbiA9IGlzV2luKHRoaXMpLFxuXHRcdFx0XHRlbGVtID0gd2luID8gdGhpcy5jb250ZW50V2luZG93IHx8IHdpbmRvdyA6IHRoaXMsXG5cdFx0XHRcdCRlbGVtID0gJChlbGVtKSxcblx0XHRcdFx0dGFyZyA9IHRhcmdldCxcblx0XHRcdFx0YXR0ciA9IHt9LFxuXHRcdFx0XHR0b2ZmO1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGVvZiB0YXJnKSB7XG5cdFx0XHRcdC8vIEEgbnVtYmVyIHdpbGwgcGFzcyB0aGUgcmVnZXhcblx0XHRcdFx0Y2FzZSAnbnVtYmVyJzpcblx0XHRcdFx0Y2FzZSAnc3RyaW5nJzpcblx0XHRcdFx0XHRpZiAoL14oWystXT0/KT9cXGQrKFxcLlxcZCspPyhweHwlKT8kLy50ZXN0KHRhcmcpKSB7XG5cdFx0XHRcdFx0XHR0YXJnID0gYm90aCh0YXJnKTtcblx0XHRcdFx0XHRcdC8vIFdlIGFyZSBkb25lXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gUmVsYXRpdmUvQWJzb2x1dGUgc2VsZWN0b3Jcblx0XHRcdFx0XHR0YXJnID0gd2luID8gJCh0YXJnKSA6ICQodGFyZywgZWxlbSk7XG5cdFx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0XHRjYXNlICdvYmplY3QnOlxuXHRcdFx0XHRcdGlmICh0YXJnLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRcdFx0XHRcdC8vIERPTUVsZW1lbnQgLyBqUXVlcnlcblx0XHRcdFx0XHRpZiAodGFyZy5pcyB8fCB0YXJnLnN0eWxlKSB7XG5cdFx0XHRcdFx0XHQvLyBHZXQgdGhlIHJlYWwgcG9zaXRpb24gb2YgdGhlIHRhcmdldFxuXHRcdFx0XHRcdFx0dG9mZiA9ICh0YXJnID0gJCh0YXJnKSkub2Zmc2V0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgb2Zmc2V0ID0gaXNGdW5jdGlvbihzZXR0aW5ncy5vZmZzZXQpICYmIHNldHRpbmdzLm9mZnNldChlbGVtLCB0YXJnKSB8fCBzZXR0aW5ncy5vZmZzZXQ7XG5cblx0XHRcdCQuZWFjaChzZXR0aW5ncy5heGlzLnNwbGl0KCcnKSwgZnVuY3Rpb24oaSwgYXhpcykge1xuXHRcdFx0XHR2YXIgUG9zXHQ9IGF4aXMgPT09ICd4JyA/ICdMZWZ0JyA6ICdUb3AnLFxuXHRcdFx0XHRcdHBvcyA9IFBvcy50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdGtleSA9ICdzY3JvbGwnICsgUG9zLFxuXHRcdFx0XHRcdHByZXYgPSAkZWxlbVtrZXldKCksXG5cdFx0XHRcdFx0bWF4ID0gJHNjcm9sbFRvLm1heChlbGVtLCBheGlzKTtcblxuXHRcdFx0XHRpZiAodG9mZikgey8vIGpRdWVyeSAvIERPTUVsZW1lbnRcblx0XHRcdFx0XHRhdHRyW2tleV0gPSB0b2ZmW3Bvc10gKyAod2luID8gMCA6IHByZXYgLSAkZWxlbS5vZmZzZXQoKVtwb3NdKTtcblxuXHRcdFx0XHRcdC8vIElmIGl0J3MgYSBkb20gZWxlbWVudCwgcmVkdWNlIHRoZSBtYXJnaW5cblx0XHRcdFx0XHRpZiAoc2V0dGluZ3MubWFyZ2luKSB7XG5cdFx0XHRcdFx0XHRhdHRyW2tleV0gLT0gcGFyc2VJbnQodGFyZy5jc3MoJ21hcmdpbicrUG9zKSwgMTApIHx8IDA7XG5cdFx0XHRcdFx0XHRhdHRyW2tleV0gLT0gcGFyc2VJbnQodGFyZy5jc3MoJ2JvcmRlcicrUG9zKydXaWR0aCcpLCAxMCkgfHwgMDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhdHRyW2tleV0gKz0gb2Zmc2V0W3Bvc10gfHwgMDtcblxuXHRcdFx0XHRcdGlmIChzZXR0aW5ncy5vdmVyW3Bvc10pIHtcblx0XHRcdFx0XHRcdC8vIFNjcm9sbCB0byBhIGZyYWN0aW9uIG9mIGl0cyB3aWR0aC9oZWlnaHRcblx0XHRcdFx0XHRcdGF0dHJba2V5XSArPSB0YXJnW2F4aXMgPT09ICd4Jz8nd2lkdGgnOidoZWlnaHQnXSgpICogc2V0dGluZ3Mub3Zlcltwb3NdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgdmFsID0gdGFyZ1twb3NdO1xuXHRcdFx0XHRcdC8vIEhhbmRsZSBwZXJjZW50YWdlIHZhbHVlc1xuXHRcdFx0XHRcdGF0dHJba2V5XSA9IHZhbC5zbGljZSAmJiB2YWwuc2xpY2UoLTEpID09PSAnJScgP1xuXHRcdFx0XHRcdFx0cGFyc2VGbG9hdCh2YWwpIC8gMTAwICogbWF4XG5cdFx0XHRcdFx0XHQ6IHZhbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE51bWJlciBvciAnbnVtYmVyJ1xuXHRcdFx0XHRpZiAoc2V0dGluZ3MubGltaXQgJiYgL15cXGQrJC8udGVzdChhdHRyW2tleV0pKSB7XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgdGhlIGxpbWl0c1xuXHRcdFx0XHRcdGF0dHJba2V5XSA9IGF0dHJba2V5XSA8PSAwID8gMCA6IE1hdGgubWluKGF0dHJba2V5XSwgbWF4KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERvbid0IHdhc3RlIHRpbWUgYW5pbWF0aW5nLCBpZiB0aGVyZSdzIG5vIG5lZWQuXG5cdFx0XHRcdGlmICghaSAmJiBzZXR0aW5ncy5heGlzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRpZiAocHJldiA9PT0gYXR0cltrZXldKSB7XG5cdFx0XHRcdFx0XHQvLyBObyBhbmltYXRpb24gbmVlZGVkXG5cdFx0XHRcdFx0XHRhdHRyID0ge307XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChxdWV1ZSkge1xuXHRcdFx0XHRcdFx0Ly8gSW50ZXJtZWRpYXRlIGFuaW1hdGlvblxuXHRcdFx0XHRcdFx0YW5pbWF0ZShzZXR0aW5ncy5vbkFmdGVyRmlyc3QpO1xuXHRcdFx0XHRcdFx0Ly8gRG9uJ3QgYW5pbWF0ZSB0aGlzIGF4aXMgYWdhaW4gaW4gdGhlIG5leHQgaXRlcmF0aW9uLlxuXHRcdFx0XHRcdFx0YXR0ciA9IHt9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGFuaW1hdGUoc2V0dGluZ3Mub25BZnRlcik7XG5cblx0XHRcdGZ1bmN0aW9uIGFuaW1hdGUoY2FsbGJhY2spIHtcblx0XHRcdFx0dmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgc2V0dGluZ3MsIHtcblx0XHRcdFx0XHQvLyBUaGUgcXVldWUgc2V0dGluZyBjb25mbGljdHMgd2l0aCBhbmltYXRlKClcblx0XHRcdFx0XHQvLyBGb3JjZSBpdCB0byBhbHdheXMgYmUgdHJ1ZVxuXHRcdFx0XHRcdHF1ZXVlOiB0cnVlLFxuXHRcdFx0XHRcdGR1cmF0aW9uOiBkdXJhdGlvbixcblx0XHRcdFx0XHRjb21wbGV0ZTogY2FsbGJhY2sgJiYgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKGVsZW0sIHRhcmcsIHNldHRpbmdzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkZWxlbS5hbmltYXRlKGF0dHIsIG9wdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIE1heCBzY3JvbGxpbmcgcG9zaXRpb24sIHdvcmtzIG9uIHF1aXJrcyBtb2RlXG5cdC8vIEl0IG9ubHkgZmFpbHMgKG5vdCB0b28gYmFkbHkpIG9uIElFLCBxdWlya3MgbW9kZS5cblx0JHNjcm9sbFRvLm1heCA9IGZ1bmN0aW9uKGVsZW0sIGF4aXMpIHtcblx0XHR2YXIgRGltID0gYXhpcyA9PT0gJ3gnID8gJ1dpZHRoJyA6ICdIZWlnaHQnLFxuXHRcdFx0c2Nyb2xsID0gJ3Njcm9sbCcrRGltO1xuXG5cdFx0aWYgKCFpc1dpbihlbGVtKSlcblx0XHRcdHJldHVybiBlbGVtW3Njcm9sbF0gLSAkKGVsZW0pW0RpbS50b0xvd2VyQ2FzZSgpXSgpO1xuXG5cdFx0dmFyIHNpemUgPSAnY2xpZW50JyArIERpbSxcblx0XHRcdGRvYyA9IGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtLmRvY3VtZW50LFxuXHRcdFx0aHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRib2R5ID0gZG9jLmJvZHk7XG5cblx0XHRyZXR1cm4gTWF0aC5tYXgoaHRtbFtzY3JvbGxdLCBib2R5W3Njcm9sbF0pIC0gTWF0aC5taW4oaHRtbFtzaXplXSwgYm9keVtzaXplXSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gYm90aCh2YWwpIHtcblx0XHRyZXR1cm4gaXNGdW5jdGlvbih2YWwpIHx8ICQuaXNQbGFpbk9iamVjdCh2YWwpID8gdmFsIDogeyB0b3A6dmFsLCBsZWZ0OnZhbCB9O1xuXHR9XG5cblx0Ly8gQWRkIHNwZWNpYWwgaG9va3Mgc28gdGhhdCB3aW5kb3cgc2Nyb2xsIHByb3BlcnRpZXMgY2FuIGJlIGFuaW1hdGVkXG5cdCQuVHdlZW4ucHJvcEhvb2tzLnNjcm9sbExlZnQgPVxuXHQkLlR3ZWVuLnByb3BIb29rcy5zY3JvbGxUb3AgPSB7XG5cdFx0Z2V0OiBmdW5jdGlvbih0KSB7XG5cdFx0XHRyZXR1cm4gJCh0LmVsZW0pW3QucHJvcF0oKTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24odCkge1xuXHRcdFx0dmFyIGN1cnIgPSB0aGlzLmdldCh0KTtcblx0XHRcdC8vIElmIGludGVycnVwdCBpcyB0cnVlIGFuZCB1c2VyIHNjcm9sbGVkLCBzdG9wIGFuaW1hdGluZ1xuXHRcdFx0aWYgKHQub3B0aW9ucy5pbnRlcnJ1cHQgJiYgdC5fbGFzdCAmJiB0Ll9sYXN0ICE9PSBjdXJyKSB7XG5cdFx0XHRcdHJldHVybiAkKHQuZWxlbSkuc3RvcCgpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG5leHQgPSBNYXRoLnJvdW5kKHQubm93KTtcblx0XHRcdC8vIERvbid0IHdhc3RlIENQVVxuXHRcdFx0Ly8gQnJvd3NlcnMgZG9uJ3QgcmVuZGVyIGZsb2F0aW5nIHBvaW50IHNjcm9sbFxuXHRcdFx0aWYgKGN1cnIgIT09IG5leHQpIHtcblx0XHRcdFx0JCh0LmVsZW0pW3QucHJvcF0obmV4dCk7XG5cdFx0XHRcdHQuX2xhc3QgPSB0aGlzLmdldCh0KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gQU1EIHJlcXVpcmVtZW50XG5cdHJldHVybiAkc2Nyb2xsVG87XG59KTtcbiIsImltcG9ydCBkZWNvZGVDb21wb25lbnQgZnJvbSAnZGVjb2RlLXVyaS1jb21wb25lbnQnO1xuaW1wb3J0IHtpbmNsdWRlS2V5c30gZnJvbSAnZmlsdGVyLW9iaic7XG5pbXBvcnQgc3BsaXRPbkZpcnN0IGZyb20gJ3NwbGl0LW9uLWZpcnN0JztcblxuY29uc3QgaXNOdWxsT3JVbmRlZmluZWQgPSB2YWx1ZSA9PiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9wcmVmZXItY29kZS1wb2ludFxuY29uc3Qgc3RyaWN0VXJpRW5jb2RlID0gc3RyaW5nID0+IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmcpLnJlcGxhY2VBbGwoL1shJygpKl0vZywgeCA9PiBgJSR7eC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpfWApO1xuXG5jb25zdCBlbmNvZGVGcmFnbWVudElkZW50aWZpZXIgPSBTeW1ib2woJ2VuY29kZUZyYWdtZW50SWRlbnRpZmllcicpO1xuXG5mdW5jdGlvbiBlbmNvZGVyRm9yQXJyYXlGb3JtYXQob3B0aW9ucykge1xuXHRzd2l0Y2ggKG9wdGlvbnMuYXJyYXlGb3JtYXQpIHtcblx0XHRjYXNlICdpbmRleCc6IHtcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSByZXN1bHQubGVuZ3RoO1xuXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsIFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1snLCBpbmRleCwgJ10nXS5qb2luKCcnKSxcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnWycsIGVuY29kZShpbmRleCwgb3B0aW9ucyksICddPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpLFxuXHRcdFx0XHRdO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjYXNlICdicmFja2V0Jzoge1xuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dmFsdWUgPT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBOdWxsICYmIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBFbXB0eVN0cmluZyAmJiB2YWx1ZSA9PT0gJycpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0Li4ucmVzdWx0LFxuXHRcdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnW10nXS5qb2luKCcnKSxcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnW109JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyksXG5cdFx0XHRcdF07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2NvbG9uLWxpc3Qtc2VwYXJhdG9yJzoge1xuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dmFsdWUgPT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBOdWxsICYmIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBFbXB0eVN0cmluZyAmJiB2YWx1ZSA9PT0gJycpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0Li4ucmVzdWx0LFxuXHRcdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnOmxpc3Q9J10uam9pbignJyksXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0Li4ucmVzdWx0LFxuXHRcdFx0XHRcdFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJzpsaXN0PScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpLFxuXHRcdFx0XHRdO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjYXNlICdjb21tYSc6XG5cdFx0Y2FzZSAnc2VwYXJhdG9yJzpcblx0XHRjYXNlICdicmFja2V0LXNlcGFyYXRvcic6IHtcblx0XHRcdGNvbnN0IGtleVZhbHVlU2VwYXJhdG9yID0gb3B0aW9ucy5hcnJheUZvcm1hdCA9PT0gJ2JyYWNrZXQtc2VwYXJhdG9yJ1xuXHRcdFx0XHQ/ICdbXT0nXG5cdFx0XHRcdDogJz0nO1xuXG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRyYW5zbGF0ZSBudWxsIHRvIGFuIGVtcHR5IHN0cmluZyBzbyB0aGF0IGl0IGRvZXNuJ3Qgc2VyaWFsaXplIGFzICdudWxsJ1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlID09PSBudWxsID8gJycgOiB2YWx1ZTtcblxuXHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiBbW2VuY29kZShrZXksIG9wdGlvbnMpLCBrZXlWYWx1ZVNlcGFyYXRvciwgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyldO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtbcmVzdWx0LCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpXTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZGVmYXVsdDoge1xuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dmFsdWUgPT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBOdWxsICYmIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBFbXB0eVN0cmluZyAmJiB2YWx1ZSA9PT0gJycpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0Li4ucmVzdWx0LFxuXHRcdFx0XHRcdFx0ZW5jb2RlKGtleSwgb3B0aW9ucyksXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0Li4ucmVzdWx0LFxuXHRcdFx0XHRcdFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJz0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKSxcblx0XHRcdFx0XTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlckZvckFycmF5Rm9ybWF0KG9wdGlvbnMpIHtcblx0bGV0IHJlc3VsdDtcblxuXHRzd2l0Y2ggKG9wdGlvbnMuYXJyYXlGb3JtYXQpIHtcblx0XHRjYXNlICdpbmRleCc6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0cmVzdWx0ID0gL1xcWyhcXGQqKV0kLy5leGVjKGtleSk7XG5cblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW1xcZCpdJC8sICcnKTtcblxuXHRcdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XVtyZXN1bHRbMV1dID0gdmFsdWU7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2JyYWNrZXQnOiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdHJlc3VsdCA9IC8oXFxbXSkkLy5leGVjKGtleSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9cXFtdJC8sICcnKTtcblxuXHRcdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFt2YWx1ZV07XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFsuLi5hY2N1bXVsYXRvcltrZXldLCB2YWx1ZV07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2NvbG9uLWxpc3Qtc2VwYXJhdG9yJzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRyZXN1bHQgPSAvKDpsaXN0KSQvLmV4ZWMoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLzpsaXN0JC8sICcnKTtcblxuXHRcdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFt2YWx1ZV07XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFsuLi5hY2N1bXVsYXRvcltrZXldLCB2YWx1ZV07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2NvbW1hJzpcblx0XHRjYXNlICdzZXBhcmF0b3InOiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGlzQXJyYXkgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmluY2x1ZGVzKG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpO1xuXHRcdFx0XHRjb25zdCBpc0VuY29kZWRBcnJheSA9ICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICFpc0FycmF5ICYmIGRlY29kZSh2YWx1ZSwgb3B0aW9ucykuaW5jbHVkZXMob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcikpO1xuXHRcdFx0XHR2YWx1ZSA9IGlzRW5jb2RlZEFycmF5ID8gZGVjb2RlKHZhbHVlLCBvcHRpb25zKSA6IHZhbHVlO1xuXHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IGlzQXJyYXkgfHwgaXNFbmNvZGVkQXJyYXkgPyB2YWx1ZS5zcGxpdChvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKS5tYXAoaXRlbSA9PiBkZWNvZGUoaXRlbSwgb3B0aW9ucykpIDogKHZhbHVlID09PSBudWxsID8gdmFsdWUgOiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpKTtcblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IG5ld1ZhbHVlO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjYXNlICdicmFja2V0LXNlcGFyYXRvcic6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0Y29uc3QgaXNBcnJheSA9IC8oXFxbXSkkLy50ZXN0KGtleSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9cXFtdJC8sICcnKTtcblxuXHRcdFx0XHRpZiAoIWlzQXJyYXkpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWUgPyBkZWNvZGUodmFsdWUsIG9wdGlvbnMpIDogdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgYXJyYXlWYWx1ZSA9IHZhbHVlID09PSBudWxsXG5cdFx0XHRcdFx0PyBbXVxuXHRcdFx0XHRcdDogZGVjb2RlKHZhbHVlLCBvcHRpb25zKS5zcGxpdChvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKTtcblxuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IGFycmF5VmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFsuLi5hY2N1bXVsYXRvcltrZXldLCAuLi5hcnJheVZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZGVmYXVsdDoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbLi4uW2FjY3VtdWxhdG9yW2tleV1dLmZsYXQoKSwgdmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVBcnJheUZvcm1hdFNlcGFyYXRvcih2YWx1ZSkge1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJyB8fCB2YWx1ZS5sZW5ndGggIT09IDEpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdhcnJheUZvcm1hdFNlcGFyYXRvciBtdXN0IGJlIHNpbmdsZSBjaGFyYWN0ZXIgc3RyaW5nJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZW5jb2RlKHZhbHVlLCBvcHRpb25zKSB7XG5cdGlmIChvcHRpb25zLmVuY29kZSkge1xuXHRcdHJldHVybiBvcHRpb25zLnN0cmljdCA/IHN0cmljdFVyaUVuY29kZSh2YWx1ZSkgOiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMuZGVjb2RlKSB7XG5cdFx0cmV0dXJuIGRlY29kZUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGtleXNTb3J0ZXIoaW5wdXQpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG5cdFx0cmV0dXJuIGlucHV0LnNvcnQoKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnKSB7XG5cdFx0cmV0dXJuIGtleXNTb3J0ZXIoT2JqZWN0LmtleXMoaW5wdXQpKVxuXHRcdFx0LnNvcnQoKGEsIGIpID0+IE51bWJlcihhKSAtIE51bWJlcihiKSlcblx0XHRcdC5tYXAoa2V5ID0+IGlucHV0W2tleV0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVIYXNoKGlucHV0KSB7XG5cdGNvbnN0IGhhc2hTdGFydCA9IGlucHV0LmluZGV4T2YoJyMnKTtcblx0aWYgKGhhc2hTdGFydCAhPT0gLTEpIHtcblx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKDAsIGhhc2hTdGFydCk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIGdldEhhc2godXJsKSB7XG5cdGxldCBoYXNoID0gJyc7XG5cdGNvbnN0IGhhc2hTdGFydCA9IHVybC5pbmRleE9mKCcjJyk7XG5cdGlmIChoYXNoU3RhcnQgIT09IC0xKSB7XG5cdFx0aGFzaCA9IHVybC5zbGljZShoYXNoU3RhcnQpO1xuXHR9XG5cblx0cmV0dXJuIGhhc2g7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUsIG9wdGlvbnMsIHR5cGUpIHtcblx0aWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHRpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiB0eXBlKHZhbHVlKTtcblx0fVxuXG5cdGlmIChvcHRpb25zLnBhcnNlQm9vbGVhbnMgJiYgdmFsdWUgIT09IG51bGwgJiYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJyB8fCB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAnZmFsc2UnKSkge1xuXHRcdHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG5cdH1cblxuXHRpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIU51bWJlci5pc05hTihOdW1iZXIodmFsdWUpKSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgIT09ICcnKSkge1xuXHRcdHJldHVybiBOdW1iZXIodmFsdWUpO1xuXHR9XG5cblx0aWYgKG9wdGlvbnMucGFyc2VOdW1iZXJzICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHZhbHVlKSkgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUudHJpbSgpICE9PSAnJykpIHtcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3QoaW5wdXQpIHtcblx0aW5wdXQgPSByZW1vdmVIYXNoKGlucHV0KTtcblx0Y29uc3QgcXVlcnlTdGFydCA9IGlucHV0LmluZGV4T2YoJz8nKTtcblx0aWYgKHF1ZXJ5U3RhcnQgPT09IC0xKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0LnNsaWNlKHF1ZXJ5U3RhcnQgKyAxKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHF1ZXJ5LCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0ZGVjb2RlOiB0cnVlLFxuXHRcdHNvcnQ6IHRydWUsXG5cdFx0YXJyYXlGb3JtYXQ6ICdub25lJyxcblx0XHRhcnJheUZvcm1hdFNlcGFyYXRvcjogJywnLFxuXHRcdHBhcnNlTnVtYmVyczogZmFsc2UsXG5cdFx0cGFyc2VCb29sZWFuczogZmFsc2UsXG5cdFx0dHlwZXM6IE9iamVjdC5jcmVhdGUobnVsbCksXG5cdFx0Li4ub3B0aW9ucyxcblx0fTtcblxuXHR2YWxpZGF0ZUFycmF5Rm9ybWF0U2VwYXJhdG9yKG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpO1xuXG5cdGNvbnN0IGZvcm1hdHRlciA9IHBhcnNlckZvckFycmF5Rm9ybWF0KG9wdGlvbnMpO1xuXG5cdC8vIENyZWF0ZSBhbiBvYmplY3Qgd2l0aCBubyBwcm90b3R5cGVcblx0Y29uc3QgcmV0dXJuVmFsdWUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdGlmICh0eXBlb2YgcXVlcnkgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHJldHVyblZhbHVlO1xuXHR9XG5cblx0cXVlcnkgPSBxdWVyeS50cmltKCkucmVwbGFjZSgvXls/IyZdLywgJycpO1xuXG5cdGlmICghcXVlcnkpIHtcblx0XHRyZXR1cm4gcmV0dXJuVmFsdWU7XG5cdH1cblxuXHRmb3IgKGNvbnN0IHBhcmFtZXRlciBvZiBxdWVyeS5zcGxpdCgnJicpKSB7XG5cdFx0aWYgKHBhcmFtZXRlciA9PT0gJycpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGNvbnN0IHBhcmFtZXRlcl8gPSBvcHRpb25zLmRlY29kZSA/IHBhcmFtZXRlci5yZXBsYWNlQWxsKCcrJywgJyAnKSA6IHBhcmFtZXRlcjtcblxuXHRcdGxldCBba2V5LCB2YWx1ZV0gPSBzcGxpdE9uRmlyc3QocGFyYW1ldGVyXywgJz0nKTtcblxuXHRcdGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0a2V5ID0gcGFyYW1ldGVyXztcblx0XHR9XG5cblx0XHQvLyBNaXNzaW5nIGA9YCBzaG91bGQgYmUgYG51bGxgOlxuXHRcdC8vIGh0dHA6Ly93My5vcmcvVFIvMjAxMi9XRC11cmwtMjAxMjA1MjQvI2NvbGxlY3QtdXJsLXBhcmFtZXRlcnNcblx0XHR2YWx1ZSA9IHZhbHVlID09PSB1bmRlZmluZWQgPyBudWxsIDogKFsnY29tbWEnLCAnc2VwYXJhdG9yJywgJ2JyYWNrZXQtc2VwYXJhdG9yJ10uaW5jbHVkZXMob3B0aW9ucy5hcnJheUZvcm1hdCkgPyB2YWx1ZSA6IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykpO1xuXHRcdGZvcm1hdHRlcihkZWNvZGUoa2V5LCBvcHRpb25zKSwgdmFsdWUsIHJldHVyblZhbHVlKTtcblx0fVxuXG5cdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHJldHVyblZhbHVlKSkge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmIG9wdGlvbnMudHlwZXNba2V5XSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdGZvciAoY29uc3QgW2tleTIsIHZhbHVlMl0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG5cdFx0XHRcdGNvbnN0IHR5cGUgPSBvcHRpb25zLnR5cGVzW2tleV0gPyBvcHRpb25zLnR5cGVzW2tleV0ucmVwbGFjZSgnW10nLCAnJykgOiB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhbHVlW2tleTJdID0gcGFyc2VWYWx1ZSh2YWx1ZTIsIG9wdGlvbnMsIHR5cGUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBvcHRpb25zLnR5cGVzW2tleV0gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm5WYWx1ZVtrZXldID0gT2JqZWN0LnZhbHVlcyh2YWx1ZSkuam9pbihvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuVmFsdWVba2V5XSA9IHBhcnNlVmFsdWUodmFsdWUsIG9wdGlvbnMsIG9wdGlvbnMudHlwZXNba2V5XSk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc29ydCA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gcmV0dXJuVmFsdWU7XG5cdH1cblxuXHQvLyBUT0RPOiBSZW1vdmUgdGhlIHVzZSBvZiBgcmVkdWNlYC5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVuaWNvcm4vbm8tYXJyYXktcmVkdWNlXG5cdHJldHVybiAob3B0aW9ucy5zb3J0ID09PSB0cnVlID8gT2JqZWN0LmtleXMocmV0dXJuVmFsdWUpLnNvcnQoKSA6IE9iamVjdC5rZXlzKHJldHVyblZhbHVlKS5zb3J0KG9wdGlvbnMuc29ydCkpLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IHJldHVyblZhbHVlW2tleV07XG5cdFx0cmVzdWx0W2tleV0gPSBCb29sZWFuKHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSA/IGtleXNTb3J0ZXIodmFsdWUpIDogdmFsdWU7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnkob2JqZWN0LCBvcHRpb25zKSB7XG5cdGlmICghb2JqZWN0KSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cblx0b3B0aW9ucyA9IHtcblx0XHRlbmNvZGU6IHRydWUsXG5cdFx0c3RyaWN0OiB0cnVlLFxuXHRcdGFycmF5Rm9ybWF0OiAnbm9uZScsXG5cdFx0YXJyYXlGb3JtYXRTZXBhcmF0b3I6ICcsJyxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdHZhbGlkYXRlQXJyYXlGb3JtYXRTZXBhcmF0b3Iob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cblx0Y29uc3Qgc2hvdWxkRmlsdGVyID0ga2V5ID0+IChcblx0XHQob3B0aW9ucy5za2lwTnVsbCAmJiBpc051bGxPclVuZGVmaW5lZChvYmplY3Rba2V5XSkpXG5cdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIG9iamVjdFtrZXldID09PSAnJylcblx0KTtcblxuXHRjb25zdCBmb3JtYXR0ZXIgPSBlbmNvZGVyRm9yQXJyYXlGb3JtYXQob3B0aW9ucyk7XG5cblx0Y29uc3Qgb2JqZWN0Q29weSA9IHt9O1xuXG5cdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcblx0XHRpZiAoIXNob3VsZEZpbHRlcihrZXkpKSB7XG5cdFx0XHRvYmplY3RDb3B5W2tleV0gPSB2YWx1ZTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0Q29weSk7XG5cblx0aWYgKG9wdGlvbnMuc29ydCAhPT0gZmFsc2UpIHtcblx0XHRrZXlzLnNvcnQob3B0aW9ucy5zb3J0KTtcblx0fVxuXG5cdHJldHVybiBrZXlzLm1hcChrZXkgPT4ge1xuXHRcdGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG5cblx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0aWYgKHZhbHVlLmxlbmd0aCA9PT0gMCAmJiBvcHRpb25zLmFycmF5Rm9ybWF0ID09PSAnYnJhY2tldC1zZXBhcmF0b3InKSB7XG5cdFx0XHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRpb25zKSArICdbXSc7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YWx1ZVxuXHRcdFx0XHQucmVkdWNlKGZvcm1hdHRlcihrZXkpLCBbXSlcblx0XHRcdFx0LmpvaW4oJyYnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0aW9ucykgKyAnPScgKyBlbmNvZGUodmFsdWUsIG9wdGlvbnMpO1xuXHR9KS5maWx0ZXIoeCA9PiB4Lmxlbmd0aCA+IDApLmpvaW4oJyYnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVXJsKHVybCwgb3B0aW9ucykge1xuXHRvcHRpb25zID0ge1xuXHRcdGRlY29kZTogdHJ1ZSxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdGxldCBbdXJsXywgaGFzaF0gPSBzcGxpdE9uRmlyc3QodXJsLCAnIycpO1xuXG5cdGlmICh1cmxfID09PSB1bmRlZmluZWQpIHtcblx0XHR1cmxfID0gdXJsO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR1cmw6IHVybF8/LnNwbGl0KCc/Jyk/LlswXSA/PyAnJyxcblx0XHRxdWVyeTogcGFyc2UoZXh0cmFjdCh1cmwpLCBvcHRpb25zKSxcblx0XHQuLi4ob3B0aW9ucyAmJiBvcHRpb25zLnBhcnNlRnJhZ21lbnRJZGVudGlmaWVyICYmIGhhc2ggPyB7ZnJhZ21lbnRJZGVudGlmaWVyOiBkZWNvZGUoaGFzaCwgb3B0aW9ucyl9IDoge30pLFxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5VXJsKG9iamVjdCwgb3B0aW9ucykge1xuXHRvcHRpb25zID0ge1xuXHRcdGVuY29kZTogdHJ1ZSxcblx0XHRzdHJpY3Q6IHRydWUsXG5cdFx0W2VuY29kZUZyYWdtZW50SWRlbnRpZmllcl06IHRydWUsXG5cdFx0Li4ub3B0aW9ucyxcblx0fTtcblxuXHRjb25zdCB1cmwgPSByZW1vdmVIYXNoKG9iamVjdC51cmwpLnNwbGl0KCc/JylbMF0gfHwgJyc7XG5cdGNvbnN0IHF1ZXJ5RnJvbVVybCA9IGV4dHJhY3Qob2JqZWN0LnVybCk7XG5cblx0Y29uc3QgcXVlcnkgPSB7XG5cdFx0Li4ucGFyc2UocXVlcnlGcm9tVXJsLCB7c29ydDogZmFsc2V9KSxcblx0XHQuLi5vYmplY3QucXVlcnksXG5cdH07XG5cblx0bGV0IHF1ZXJ5U3RyaW5nID0gc3RyaW5naWZ5KHF1ZXJ5LCBvcHRpb25zKTtcblx0cXVlcnlTdHJpbmcgJiY9IGA/JHtxdWVyeVN0cmluZ31gO1xuXG5cdGxldCBoYXNoID0gZ2V0SGFzaChvYmplY3QudXJsKTtcblx0aWYgKHR5cGVvZiBvYmplY3QuZnJhZ21lbnRJZGVudGlmaWVyID09PSAnc3RyaW5nJykge1xuXHRcdGNvbnN0IHVybE9iamVjdEZvckZyYWdtZW50RW5jb2RlID0gbmV3IFVSTCh1cmwpO1xuXHRcdHVybE9iamVjdEZvckZyYWdtZW50RW5jb2RlLmhhc2ggPSBvYmplY3QuZnJhZ21lbnRJZGVudGlmaWVyO1xuXHRcdGhhc2ggPSBvcHRpb25zW2VuY29kZUZyYWdtZW50SWRlbnRpZmllcl0gPyB1cmxPYmplY3RGb3JGcmFnbWVudEVuY29kZS5oYXNoIDogYCMke29iamVjdC5mcmFnbWVudElkZW50aWZpZXJ9YDtcblx0fVxuXG5cdHJldHVybiBgJHt1cmx9JHtxdWVyeVN0cmluZ30ke2hhc2h9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBpY2soaW5wdXQsIGZpbHRlciwgb3B0aW9ucykge1xuXHRvcHRpb25zID0ge1xuXHRcdHBhcnNlRnJhZ21lbnRJZGVudGlmaWVyOiB0cnVlLFxuXHRcdFtlbmNvZGVGcmFnbWVudElkZW50aWZpZXJdOiBmYWxzZSxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdGNvbnN0IHt1cmwsIHF1ZXJ5LCBmcmFnbWVudElkZW50aWZpZXJ9ID0gcGFyc2VVcmwoaW5wdXQsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBzdHJpbmdpZnlVcmwoe1xuXHRcdHVybCxcblx0XHRxdWVyeTogaW5jbHVkZUtleXMocXVlcnksIGZpbHRlciksXG5cdFx0ZnJhZ21lbnRJZGVudGlmaWVyLFxuXHR9LCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y2x1ZGUoaW5wdXQsIGZpbHRlciwgb3B0aW9ucykge1xuXHRjb25zdCBleGNsdXNpb25GaWx0ZXIgPSBBcnJheS5pc0FycmF5KGZpbHRlcikgPyBrZXkgPT4gIWZpbHRlci5pbmNsdWRlcyhrZXkpIDogKGtleSwgdmFsdWUpID0+ICFmaWx0ZXIoa2V5LCB2YWx1ZSk7XG5cblx0cmV0dXJuIHBpY2soaW5wdXQsIGV4Y2x1c2lvbkZpbHRlciwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgKiBhcyBxdWVyeVN0cmluZyBmcm9tICcuL2Jhc2UuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBxdWVyeVN0cmluZztcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNwbGl0T25GaXJzdChzdHJpbmcsIHNlcGFyYXRvcikge1xuXHRpZiAoISh0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJyAmJiB0eXBlb2Ygc2VwYXJhdG9yID09PSAnc3RyaW5nJykpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCB0aGUgYXJndW1lbnRzIHRvIGJlIG9mIHR5cGUgYHN0cmluZ2AnKTtcblx0fVxuXG5cdGlmIChzdHJpbmcgPT09ICcnIHx8IHNlcGFyYXRvciA9PT0gJycpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRjb25zdCBzZXBhcmF0b3JJbmRleCA9IHN0cmluZy5pbmRleE9mKHNlcGFyYXRvcik7XG5cblx0aWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdHJldHVybiBbXG5cdFx0c3RyaW5nLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KSxcblx0XHRzdHJpbmcuc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyBzZXBhcmF0b3IubGVuZ3RoKVxuXHRdO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vLyBydW50aW1lIGhlbHBlciBmb3Igc2V0dGluZyBwcm9wZXJ0aWVzIG9uIGNvbXBvbmVudHNcbi8vIGluIGEgdHJlZS1zaGFrYWJsZSB3YXlcbmV4cG9ydHMuZGVmYXVsdCA9IChzZmMsIHByb3BzKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gc2ZjLl9fdmNjT3B0cyB8fCBzZmM7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIHByb3BzKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gdmFsO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcbiIsImltcG9ydCBzY3JpcHQgZnJvbSBcIi4vYXBwLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiXG5leHBvcnQgKiBmcm9tIFwiLi9hcHAudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzXCJcblxuaW1wb3J0IGV4cG9ydENvbXBvbmVudCBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9leHBvcnRIZWxwZXIuanNcIlxuY29uc3QgX19leHBvcnRzX18gPSAvKiNfX1BVUkVfXyovZXhwb3J0Q29tcG9uZW50KHNjcmlwdCwgW1snX19maWxlJyxcInB1YmxpYy9zcmMvYXBwbGljYXRpb24vYXBwLnZ1ZVwiXV0pXG4vKiBob3QgcmVsb2FkICovXG5pZiAobW9kdWxlLmhvdCkge1xuICBfX2V4cG9ydHNfXy5fX2htcklkID0gXCIyYWM5YTE5ZlwiXG4gIGNvbnN0IGFwaSA9IF9fVlVFX0hNUl9SVU5USU1FX19cbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAoIWFwaS5jcmVhdGVSZWNvcmQoJzJhYzlhMTlmJywgX19leHBvcnRzX18pKSB7XG4gICAgYXBpLnJlbG9hZCgnMmFjOWExOWYnLCBfX2V4cG9ydHNfXylcbiAgfVxuICBcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBfX2V4cG9ydHNfXyIsImV4cG9ydCB7IGRlZmF1bHQgfSBmcm9tIFwiLSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzE1XS51c2VbMF0hLi9hcHAudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzXCI7IGV4cG9ydCAqIGZyb20gXCItIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3J1bGVTZXRbMV0ucnVsZXNbMTVdLnVzZVswXSEuL2FwcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anNcIiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gICAgdmFyICR0aGlzT2JqO1xyXG4gICAgdmFyICRhdXRvdGV4dDtcclxuICAgIHZhciBkZWZhdWx0UGFyYW1zID0ge1xyXG4gICAgICAgIHNob3dJbnRlcnZhbDogMTAwMFxyXG4gICAgfTtcclxuICAgIHZhciBwYXJhbXM7XHJcbiAgICB2YXIgdGltZW91dF9pZCA9IDA7XHJcbiAgICBcclxuICAgIHZhciBtZXRob2RzID0ge1xyXG4gICAgICAgIGdldENvbXBsZXRpb246IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIFNldCA9IGRhdGEuU2V0O1xyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgJGF1dG90ZXh0LmVtcHR5KCk7XHJcbiAgICAgICAgICAgIGlmIChTZXQgJiYgKFNldC5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IFNldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gJzxsaT4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgKz0gJyAgPGEgaHJlZj1cIiNcIiBkYXRhLWlkPVwiJyArIFNldFtpXS5pZCArICdcIic7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIFNldFtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGtleSwgWydpZCcsICduYW1lJywgJ2Rlc2NyaXB0aW9uJywgJ2ltZyddKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArPSAnIGRhdGEtJyArIGtleSArICc9XCInICsgU2V0W2ldW2tleV0udG9TdHJpbmcoKSArICdcIic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSAnPic7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNldFtpXS5pbWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArPSAnICAgPGltZyBzcmM9XCInICsgU2V0W2ldLmltZyArICdcIiAvPic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgKz0gJyAgICA8c3BhbiBjbGFzcz1cInJhYXMtYXV0b3RleHRfX25hbWVcIj4nICsgU2V0W2ldLm5hbWUgKyAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCAgICArPSAnICAgIDxzcGFuIGNsYXNzPVwicmFhcy1hdXRvdGV4dF9fZGVzY3JpcHRpb25cIj4nICsgU2V0W2ldLmRlc2NyaXB0aW9uICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgKz0gJyAgPC9hPic7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCAgICArPSAnPC9saT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICRhdXRvdGV4dC5hcHBlbmQodGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkYXV0b3RleHQuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGF1dG90ZXh0LmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dE9uQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJGF1dG90ZXh0LnRyaWdnZXIoJ1JBQVNfYXV0b2NvbXBsZXRlci5jaGFuZ2UnKTtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSAkdGhpc09iai52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHVybCA9IHBhcmFtcy51cmw7XHJcbiAgICAgICAgICAgIGlmICgvXFwqLy50ZXN0KHVybCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSB1cmwucmVwbGFjZSgvXFwqLywgdGV4dCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gdXJsICsgdGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXRfaWQpO1xyXG4gICAgICAgICAgICB0aW1lb3V0X2lkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICQuZ2V0SlNPTih1cmwsIG1ldGhvZHMuZ2V0Q29tcGxldGlvbikgfSwgcGFyYW1zLnNob3dJbnRlcnZhbCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICRhdXRvdGV4dC50cmlnZ2VyKCdSQUFTX2F1dG9jb21wbGV0ZXIuY2xpY2snKTtcclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmNhbGxiYWNrLmFwcGx5KHRoaXMsIGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRhdXRvdGV4dC5oaWRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHsgXHJcbiAgICAgICAgICAgICRhdXRvdGV4dC5wYXJhbXMgPSBwYXJhbXMgPSAkLmV4dGVuZChkZWZhdWx0UGFyYW1zLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgJHRoaXNPYmoub24oJ2tleXVwJywgbWV0aG9kcy50ZXh0T25DaGFuZ2UpO1xyXG4gICAgICAgICAgICAvLyAyMDE1LTA1LTA0LCBBVlM6INC30LDQvNC10L3QuNC7ICRhdXRvdGV4dC5oaWRlINC90LAgZnVuY3Rpb24oKSB7ICRhdXRvdGV4dC5oaWRlKCkgfSwg0LjQsdC+INCz0LvRjtGH0LjRglxyXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7ICRhdXRvdGV4dC5oaWRlKCkgfSk7XHJcbiAgICAgICAgICAgICRhdXRvdGV4dC5vbignY2xpY2snLCAnYScsIG1ldGhvZHMub25DbGljayk7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgJHRoaXNPYmogPSAkKHRoaXMpO1xyXG4gICAgJGF1dG90ZXh0ID0gJHRoaXNPYmoubmV4dCgnW2RhdGEtcm9sZT1cInJhYXMtYXV0b3RleHRcIl0nKTtcclxuICAgIGlmICghJGF1dG90ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICRhdXRvdGV4dCA9ICQoJzx1bCBjbGFzcz1cInJhYXMtYXV0b3RleHRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBkYXRhLXJvbGU9XCJyYWFzLWF1dG90ZXh0XCI+PC91bD4nKVxyXG4gICAgICAgICR0aGlzT2JqLmFmdGVyKCRhdXRvdGV4dCk7XHJcbiAgICB9XHJcbiAgICBpZiAoJGF1dG90ZXh0LnBhcmFtcykge1xyXG4gICAgICAgICRwYXJhbXMgPSAkYXV0b3RleHQucGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC70L7Qs9C40LrQsCDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwXHJcbiAgICBpZiAoIG1ldGhvZHNbbWV0aG9kXSApIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kc1sgbWV0aG9kIF0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdvYmplY3QnIHx8ICFtZXRob2QpIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZmlsbCkge1xyXG4gICAgdmFyIHRleHQ7XHJcbiAgICAkKHRoaXMpLmVtcHR5KCk7XHJcbiAgICBmb3IgKHZhciBpIGluIGZpbGwpIHtcclxuICAgICAgICB0ZXh0ID0gJzxvcHRpb24gdmFsdWU9XCInICsgZmlsbFtpXS52YWwgKyAnXCInICsgKGZpbGxbaV0uc2VsID8gJyBzZWxlY3RlZD1cInNlbGVjdGVkXCInIDogJycpO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBmaWxsW2ldKSB7XHJcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkoa2V5LCBbJ3ZhbCcsICdzZWwnLCAndGV4dCddKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dCArPSAnIGRhdGEtJyArIGtleSArICc9XCInICsgZmlsbFtpXVtrZXldICsgJ1wiJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0ZXh0ICs9ICc+JyArIGZpbGxbaV0udGV4dCArICc8L29wdGlvbj4nO1xyXG4gICAgICAgICQodGhpcykuYXBwZW5kKCQodGV4dCkpO1xyXG4gICAgfVxyXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHVybCwgcGFyYW1zKSB7XHJcbiAgICB2YXIgZGVmYXVsdFBhcmFtcyA9IHtcclxuICAgICAgICAnYmVmb3JlJzogZnVuY3Rpb24oZGF0YSkgeyByZXR1cm4gZGF0YTsgfSxcclxuICAgICAgICAnYWZ0ZXInOiBmdW5jdGlvbihkYXRhKSB7fVxyXG4gICAgfVxyXG4gICAgcGFyYW1zID0gJC5leHRlbmQoZGVmYXVsdFBhcmFtcywgcGFyYW1zKTtcclxuICAgIHZhciB0aGlzT2JqID0gdGhpcztcclxuICAgICQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICB2YXIgZmlsbCA9IHBhcmFtcy5iZWZvcmUuY2FsbCh0aGlzT2JqLCBkYXRhKTtcclxuICAgICAgICAkKHRoaXNPYmopLlJBQVNfZmlsbFNlbGVjdChmaWxsKTtcclxuICAgICAgICBwYXJhbXMuYWZ0ZXIuY2FsbCh0aGlzT2JqLCBkYXRhKTtcclxuICAgIH0pO1xyXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRoaXNPYmogPSB0aGlzO1xyXG4gICAgXHJcbiAgICAkKCdzZWxlY3RbbXVsdGlwbGVdJykubm90KCdbZGlzYWJsZWRdJywgdGhpc09iaikubXVsdGlzZWxlY3Qoe1xyXG4gICAgICAgIGJ1dHRvblRleHQ6IGZ1bmN0aW9uKG9wdGlvbnMsIHNlbGVjdCkge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnLS0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9ICcnO1xyXG4gICAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgICBvcHRpb25zLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChpIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQgKz0gJCh0aGlzKS50ZXh0KCkgKyAnLCAnO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBzZWxlY3RlZCA9IHNlbGVjdGVkLnN1YnN0cigwLCBzZWxlY3RlZC5sZW5ndGggLTIpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZCArIChvcHRpb25zLmxlbmd0aCA+IDMgPyAnLi4uJyA6ICcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWF4SGVpZ2h0OiAyMDBcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAkKCdpbnB1dFtkYXRhLWhpbnRdLCB0ZXh0YXJlYVtkYXRhLWhpbnRdLCBzZWxlY3RbZGF0YS1oaW50XScsIHRoaXNPYmopLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRleHQgPSAnPGEgY2xhc3M9XCJidG5cIiBocmVmPVwiI1wiIHJlbD1cInBvcG92ZXJcIiBkYXRhLWNvbnRlbnQ9XCInICsgJCh0aGlzKS5hdHRyKCdkYXRhLWhpbnQnKSArICdcIj48aSBjbGFzcz1cImZhIGZhLWNpcmNsZS1xdWVzdGlvblwiPjwvaT48L2E+JztcclxuICAgICAgICBpZiAoISQodGhpcykuY2xvc2VzdCgnLmNvbnRyb2wtZ3JvdXAnKS5maW5kKCdhW3JlbD1cInBvcG92ZXJcIl0nKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuY29udHJvbC1ncm91cCcpLmZpbmQoJy5jb250cm9scycpLmFwcGVuZCh0ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSIsIi8qKlxyXG4gKiBAZGVwcmVjYXRlZCDQlNC10YDQtdCy0L4g0LzQtdC90Y4g0YDQtdCw0LvQuNC30L7QstCw0L3QviDQsiBSQUFTXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtZXRob2QpIHtcclxuICAgIHZhciAkdGhpc09iajtcclxuICAgIHZhciBkZWZhdWx0UGFyYW1zID0geyBzaG93bkxldmVsOiAyIH07XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICB2YXIgbWV0aG9kcyA9IHtcclxuICAgICAgICBoaWRlVUw6IGZ1bmN0aW9uKCRvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkKCd1bCcsICRvYmopLmhpZGUoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFBsdXNlczogZnVuY3Rpb24oJG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICQoJ2xpOmhhcyh1bCknLCAkb2JqKS5wcmVwZW5kKCc8YSBocmVmPVwiI1wiIGNsYXNzPVwianNUcmVlUGx1c1wiIGRhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiPjwvYT4nKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuZm9sZDogZnVuY3Rpb24oJG9iaiwgc2xvd2x5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJG9iai5jaGlsZHJlbignW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScpLnJlbW92ZUNsYXNzKCdqc1RyZWVQbHVzJykuYWRkQ2xhc3MoJ2pzVHJlZU1pbnVzJyk7XHJcbiAgICAgICAgICAgIGlmIChzbG93bHkpIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLnNsaWRlRG93bigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb2xkOiBmdW5jdGlvbigkb2JqLCBzbG93bHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkb2JqLmNoaWxkcmVuKCdbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJykucmVtb3ZlQ2xhc3MoJ2pzVHJlZU1pbnVzJykuYWRkQ2xhc3MoJ2pzVHJlZVBsdXMnKTtcclxuICAgICAgICAgICAgaWYgKHNsb3dseSkge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2xpZGVVcCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja1BsdXM6IGZ1bmN0aW9uKCkgXHJcbiAgICAgICAgeyBcclxuICAgICAgICAgICAgbWV0aG9kcy51bmZvbGQoJCh0aGlzKS5jbG9zZXN0KCdsaScpLCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xpY2tNaW51czogZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kcy5mb2xkKCQodGhpcykuY2xvc2VzdCgnbGknKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXQgOiBmdW5jdGlvbihvcHRpb25zKSB7IFxyXG4gICAgICAgICAgICBwYXJhbXMgPSAkLmV4dGVuZChkZWZhdWx0UGFyYW1zLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5zaG93bkxldmVsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsID0gJyc7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtcy5zaG93bkxldmVsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWwgKz0gJ3VsICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkdGhpc09iaiA9ICQoc2VsLCB0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICR0aGlzT2JqID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJHRoaXNPYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgn0KTRg9C90LrRhtC40Y8galF1ZXJ5Lm1lbnVUcmVlINGD0YHRgtCw0YDQtdC70LAg0Lgg0LHRg9C00LXRgiDQvtGC0LrQu9GO0YfQtdC90LAgMDEuMDEuMjAyNi4g0J/QvtC20LDQu9GD0LnRgdGC0LAsINC+0LHRgNCw0YLQuNGC0LXRgdGMINC6INGA0LDQt9GA0LDQsdC+0YLRh9C40LrRgyDQtNC70Y8g0L7QsdC90L7QstC70LXQvdC40Y8g0YHQuNGB0YLQtdC80YshJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0aG9kcy5oaWRlVUwoJHRoaXNPYmopO1xyXG4gICAgICAgICAgICBtZXRob2RzLmFkZFBsdXNlcygkdGhpc09iaik7XHJcbiAgICAgICAgICAgIG1ldGhvZHMudW5mb2xkKCQoJ2xpLmFjdGl2ZScsICR0aGlzT2JqKSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAkdGhpc09iai5vbignY2xpY2snLCAnLmpzVHJlZVBsdXNbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJywgbWV0aG9kcy5jbGlja1BsdXMpO1xyXG4gICAgICAgICAgICAkdGhpc09iai5vbignY2xpY2snLCAnLmpzVHJlZU1pbnVzW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScsIG1ldGhvZHMuY2xpY2tNaW51cyk7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgLy8g0LvQvtCz0LjQutCwINCy0YvQt9C+0LLQsCDQvNC10YLQvtC00LBcclxuICAgIGlmICggbWV0aG9kc1ttZXRob2RdICkge1xyXG4gICAgICAgIHJldHVybiBtZXRob2RzWyBtZXRob2QgXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ29iamVjdCcgfHwgIW1ldGhvZCkge1xyXG4gICAgICAgIHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH1cclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjaGFuZ2VfcXVlcnksIGluY2x1ZGVfZGlycywgaW5pdGlhbF9wYXRoKSB7XHJcbiAgICBpZiAoIWluaXRpYWxfcGF0aCkge1xyXG4gICAgICAgIGluaXRpYWxfcGF0aCA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWZcclxuICAgIH1cclxuICAgIGlmIChjaGFuZ2VfcXVlcnkuc3Vic3RyKDAsIDEpID09ICc/Jykge1xyXG4gICAgICAgIGNoYW5nZV9xdWVyeSA9IGNoYW5nZV9xdWVyeS5zdWJzdHIoMSk7XHJcbiAgICB9XHJcbiAgICB2YXIgcXVlcnlfZGlyID0gaW5pdGlhbF9wYXRoLnNwbGl0KCc/Jykuc2xpY2UoMCwgMSkudG9TdHJpbmcoKTtcclxuICAgIHZhciBxdWVyeV9zdHIgPSBpbml0aWFsX3BhdGguc3BsaXQoJz8nKS5zbGljZSgxKS50b1N0cmluZygpO1xyXG4gICAgXHJcbiAgICB2YXIgb2xkX3F1ZXJ5ID0gcXVlcnlfc3RyLnNwbGl0KCcmJyk7XHJcbiAgICB2YXIgY2hhbmdlID0gY2hhbmdlX3F1ZXJ5LnNwbGl0KCcmJyk7XHJcbiAgICBcclxuICAgIHZhciBxdWVyeSA9IHt9O1xyXG4gICAgdmFyIHRlbXAgPSBbXTtcclxuICAgIFxyXG4gICAgdmFyIG5ld19xdWVyeSA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGRfcXVlcnkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0ZW1wID0gb2xkX3F1ZXJ5W2ldLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgaWYgKHRlbXBbMF0ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBxdWVyeVt0ZW1wWzBdXSA9IHRlbXBbMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFuZ2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0ZW1wID0gY2hhbmdlW2ldLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgaWYgKHRlbXBbMF0ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBxdWVyeVt0ZW1wWzBdXSA9IHRlbXBbMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGVtcCA9IFtdO1xyXG4gICAgZm9yICh2YXIga2V5IGluIHF1ZXJ5KSB7XHJcbiAgICAgICAgaWYgKHF1ZXJ5W2tleV0gJiYgKHF1ZXJ5W2tleV0ubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICAgICAgdGVtcFt0ZW1wLmxlbmd0aF0gPSBrZXkgKyAnPScgKyBxdWVyeVtrZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHF1ZXJ5ID0gdGVtcC5qb2luKCcmJyk7XHJcbiAgICByZXR1cm4gcXVlcnk7XHJcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocGFyYW1zKSB7IFxyXG4gICAgdmFyIGRlZmF1bHRQYXJhbXMgPSB7XHJcbiAgICAgICAgJ3JlcG9Db250YWluZXInOiAnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1jb250YWluZXJcIl0nLFxyXG4gICAgICAgICdyZXBvRWxlbWVudCc6ICdbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWVsZW1lbnRcIl0nLFxyXG4gICAgICAgICdyZXBvRWxlbWVudENoYW5nZXMnOiB7J2RhdGEtcm9sZSc6ICdyYWFzLXJlcG8tZWxlbWVudCd9LFxyXG4gICAgICAgICdyZXBvQWRkJzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG8tYWRkXCJdJyxcclxuICAgICAgICAncmVwb01vdmUnOiAnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1tb3ZlXCJdJyxcclxuICAgICAgICAncmVwb0RlbGV0ZSc6ICdbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWRlbFwiXScsXHJcbiAgICAgICAgJ3JlcG8nOiAnW2RhdGEtcm9sZT1cInJhYXMtcmVwb1wiXScsXHJcbiAgICAgICAgJ29uQmVmb3JlQWRkJzogZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAnb25BZnRlckFkZCc6IGZ1bmN0aW9uKCkgeyAkKHRoaXMpLmZpbmQoJ3NlbGVjdDpkaXNhYmxlZCwgaW5wdXQ6ZGlzYWJsZWQsIHRleHRhcmVhOmRpc2FibGVkJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKTsgfSxcclxuICAgICAgICAnb25CZWZvcmVEZWxldGUnOiBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgICdvbkFmdGVyRGVsZXRlJzogZnVuY3Rpb24oKSB7fVxyXG4gICAgfVxyXG4gICAgcGFyYW1zID0gJC5leHRlbmQoZGVmYXVsdFBhcmFtcywgcGFyYW1zKTtcclxuICAgIHZhciAkcmVwb0Jsb2NrID0gJCh0aGlzKTtcclxuICAgIFxyXG4gICAgdmFyICRyZXBvQ29udGFpbmVyO1xyXG4gICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1yYWFzLXJlcG8tY29udGFpbmVyJykpIHtcclxuICAgICAgICAkcmVwb0NvbnRhaW5lciA9ICQoJCh0aGlzKS5hdHRyKCdkYXRhLXJhYXMtcmVwby1jb250YWluZXInKSk7XHJcbiAgICB9IGVsc2UgaWYgKCRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0NvbnRhaW5lcikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICRyZXBvQ29udGFpbmVyID0gJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvQ29udGFpbmVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJHJlcG9Db250YWluZXIgPSAkKHBhcmFtcy5yZXBvQ29udGFpbmVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdmFyICRyZXBvO1xyXG4gICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1yYWFzLXJlcG8nKSkge1xyXG4gICAgICAgICRyZXBvID0gJCgkKHRoaXMpLmF0dHIoJ2RhdGEtcmFhcy1yZXBvJykpO1xyXG4gICAgfSBlbHNlIGlmICgkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG8pLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkcmVwbyA9ICRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwbyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRyZXBvID0gJChwYXJhbXMucmVwbyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNoZWNrUmVxdWlyZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgJHJlcG9FbGVtZW50O1xyXG4gICAgICAgIGlmICgkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0VsZW1lbnQgKyAnOmhhcygqW2RhdGEtcmVxdWlyZWRdKScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICQocGFyYW1zLnJlcG9FbGVtZW50ICsgJzpoYXMoKltkYXRhLXJlcXVpcmVkXSknKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRyZXBvRWxlbWVudC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudC5maW5kKHBhcmFtcy5yZXBvRGVsZXRlKS5zaG93KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50LmZpbmQocGFyYW1zLnJlcG9EZWxldGUpLmhpZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICQocGFyYW1zLnJlcG9FbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRyZXBvRWxlbWVudC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudC5maW5kKHBhcmFtcy5yZXBvTW92ZSkuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudC5maW5kKHBhcmFtcy5yZXBvTW92ZSkuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHJlcG9CbG9jay5vbignY2xpY2snLCBwYXJhbXMucmVwb0FkZCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcGFyYW1zLm9uQmVmb3JlQWRkLmNhbGwoJHJlcG9FbGVtZW50KTtcclxuICAgICAgICB2YXIgJHJlcG9FbGVtZW50ID0gJHJlcG8uY2xvbmUodHJ1ZSk7XHJcbiAgICAgICAgJHJlcG9FbGVtZW50LmF0dHIocGFyYW1zLnJlcG9FbGVtZW50Q2hhbmdlcyk7XHJcbiAgICAgICAgJHJlcG9Db250YWluZXIuYXBwZW5kKCRyZXBvRWxlbWVudCk7XHJcbiAgICAgICAgJHJlcG9FbGVtZW50LnRyaWdnZXIoJ1JBQVNfcmVwby5hZGQnKTtcclxuICAgICAgICBwYXJhbXMub25BZnRlckFkZC5jYWxsKCRyZXBvRWxlbWVudCk7XHJcbiAgICAgICAgY2hlY2tSZXF1aXJlZCgpO1xyXG4gICAgICAgICRyZXBvRWxlbWVudC5SQUFTSW5pdElucHV0cygpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAkcmVwb0Jsb2NrLm9uKCdjbGljaycsIHBhcmFtcy5yZXBvRGVsZXRlLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgJHJlcG9FbGVtZW50O1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QocGFyYW1zLnJlcG9FbGVtZW50KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICQodGhpcykuY2xvc2VzdChwYXJhbXMucmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLXJhYXMtcmVwby1lbGVtZW50JykpIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50ID0gJCgkKHRoaXMpLmF0dHIoJ2RhdGEtcmFhcy1yZXBvLWVsZW1lbnQnKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICgkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICQocGFyYW1zLnJlcG9FbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFyYW1zLm9uQmVmb3JlRGVsZXRlLmNhbGwoJHJlcG9FbGVtZW50KTtcclxuICAgICAgICAkcmVwb0VsZW1lbnQudHJpZ2dlcignUkFBU19yZXBvLmRlbGV0ZScpO1xyXG4gICAgICAgICRyZXBvRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICBwYXJhbXMub25BZnRlckRlbGV0ZS5jYWxsKCRyZXBvRWxlbWVudCk7XHJcbiAgICAgICAgY2hlY2tSZXF1aXJlZCgpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBheGlzID0gJHJlcG9Db250YWluZXIuYXR0cignZGF0YS1heGlzJyk7XHJcbiAgICAkcmVwb0NvbnRhaW5lci5zb3J0YWJsZSh7IGF4aXM6IGF4aXMgPyAoYXhpcyA9PSAnYm90aCcgPyAnJyA6IGF4aXMpIDogJ3knLCAnaGFuZGxlJzogcGFyYW1zLnJlcG9Nb3ZlLCBjb250YWlubWVudDogJCh0aGlzKSB9KTtcclxuXHJcblxyXG4gICAgY2hlY2tSZXF1aXJlZCgpO1xyXG59IiwiLyoqXHJcbiAqIEBkZXByZWNhdGVkINCU0LXRgNC10LLQviDRgNC10LDQu9C40LfQvtCy0LDQvdC+INCyIFJBQVMgKGNoZWNrYm94LXRyZWUpXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtZXRob2QpIHtcclxuICAgIHZhciAkdGhpc09iajtcclxuICAgIHZhciBtZXRob2RzID0ge1xyXG4gICAgICAgIGhpZGVVTDogZnVuY3Rpb24oJG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICQoJ3VsJywgJG9iaikuaGlkZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkUGx1c2VzOiBmdW5jdGlvbigkb2JqKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJCgnbGk6aGFzKHVsKScsICRvYmopLnByZXBlbmQoJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJqc1RyZWVQbHVzXCIgZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCI+PC9hPicpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdW5mb2xkOiBmdW5jdGlvbigkb2JqLCBzbG93bHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkb2JqLmNoaWxkcmVuKCdbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJykucmVtb3ZlQ2xhc3MoJ2pzVHJlZVBsdXMnKS5hZGRDbGFzcygnanNUcmVlTWludXMnKTtcclxuICAgICAgICAgICAgaWYgKHNsb3dseSkge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2xpZGVEb3duKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvbGQ6IGZ1bmN0aW9uKCRvYmosIHNsb3dseSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRvYmouY2hpbGRyZW4oJ1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nKS5yZW1vdmVDbGFzcygnanNUcmVlTWludXMnKS5hZGRDbGFzcygnanNUcmVlUGx1cycpO1xyXG4gICAgICAgICAgICBpZiAoc2xvd2x5KSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrUGx1czogZnVuY3Rpb24oKSBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICBtZXRob2RzLnVuZm9sZCgkKHRoaXMpLmNsb3Nlc3QoJ2xpJyksIHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja01pbnVzOiBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2RzLmZvbGQoJCh0aGlzKS5jbG9zZXN0KCdsaScpLCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xpY2tDaGVja2JveDogZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGdyb3VwO1xyXG4gICAgICAgICAgICB2YXIgJGxpID0gJCh0aGlzKS5jbG9zZXN0KCdsaScpO1xyXG4gICAgICAgICAgICB2YXIgJG9iaiA9ICRsaS5maW5kKCd1bCBpbnB1dDpjaGVja2JveCcpO1xyXG4gICAgICAgICAgICBpZiAoZ3JvdXAgPSAkb2JqLmF0dHIoJ2RhdGEtZ3JvdXAnKSkge1xyXG4gICAgICAgICAgICAgICAgJG9iaiA9ICRvYmouZmlsdGVyKGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkKHRoaXMpLmF0dHIoJ2RhdGEtZ3JvdXAnKSA9PSBncm91cCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgJG9iai5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQnLCAkbGkpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZHMudW5mb2xkKCRsaSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2RzLmZvbGQoJGxpLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xpY2tDaGVja2JveEFjY3VyYXRlOiBmdW5jdGlvbihlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xpY2tDaGVja2JveEFjY3VyYXRlTGFiZWw6IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2RzLmNsaWNrQ2hlY2tib3hBY2N1cmF0ZS5jYWxsKCQodGhpcykuZmluZCgnPiBpbnB1dDpjaGVja2JveCcpWzBdLCBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdCA6IGZ1bmN0aW9uKG9wdGlvbnMpIHsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMpXHJcbiAgICAgICAgICAgICR0aGlzT2JqID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgaWYgKCR0aGlzT2JqLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ9Ck0YPQvdC60YbQuNGPIGpRdWVyeS50cmVlINGD0YHRgtCw0YDQtdC70LAg0Lgg0LHRg9C00LXRgiDQvtGC0LrQu9GO0YfQtdC90LAgMDEuMDEuMjAyNi4g0J/QvtC20LDQu9GD0LnRgdGC0LAsINC+0LHRgNCw0YLQuNGC0LXRgdGMINC6INGA0LDQt9GA0LDQsdC+0YLRh9C40LrRgyDQtNC70Y8g0L7QsdC90L7QstC70LXQvdC40Y8g0YHQuNGB0YLQtdC80YshJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0aG9kcy5oaWRlVUwoJHRoaXNPYmopO1xyXG4gICAgICAgICAgICBtZXRob2RzLmFkZFBsdXNlcygkdGhpc09iaik7XHJcbiAgICAgICAgICAgIG1ldGhvZHMudW5mb2xkKCQoJ2xpOmhhcyhpbnB1dDpjaGVja2VkKScsICR0aGlzT2JqKSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAkdGhpc09iai5vbignY2xpY2snLCAnLmpzVHJlZVBsdXNbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJywgbWV0aG9kcy5jbGlja1BsdXMpO1xyXG4gICAgICAgICAgICAkdGhpc09iai5vbignY2xpY2snLCAnLmpzVHJlZU1pbnVzW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScsIG1ldGhvZHMuY2xpY2tNaW51cyk7XHJcbiAgICAgICAgICAgICQoJ2lucHV0OmNoZWNrYm94JywgJHRoaXNPYmopLm9uKCdjbGljaycsIG1ldGhvZHMuY2xpY2tDaGVja2JveCk7XHJcbiAgICAgICAgICAgICQoJ2lucHV0OmNoZWNrYm94JywgJHRoaXNPYmopLm9uKCdjb250ZXh0bWVudScsIG1ldGhvZHMuY2xpY2tDaGVja2JveEFjY3VyYXRlKVxyXG4gICAgICAgICAgICAkKCdsYWJlbDpoYXMoPmlucHV0W3R5cGU9XCJjaGVja2JveFwiXSknLCAkdGhpc09iaikub24oJ2NvbnRleHRtZW51JywgbWV0aG9kcy5jbGlja0NoZWNrYm94QWNjdXJhdGVMYWJlbClcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQu9C+0LPQuNC60LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsFxyXG4gICAgaWYgKCBtZXRob2RzW21ldGhvZF0gKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZHNbIG1ldGhvZCBdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0aG9kID09PSAnb2JqZWN0JyB8fCAhbWV0aG9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGpRdWVyeTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEFwcCBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcC52dWUnO1xyXG5cclxuaW1wb3J0IHF1ZXJ5U3RyaW5nIGZyb20gJ3F1ZXJ5LXN0cmluZyc7XHJcbmltcG9ydCAnanF1ZXJ5LnNjcm9sbHRvJ1xyXG5cclxuaW1wb3J0IFJBQVNfdHJlZSBmcm9tICcuL2xpYnMvcmFhcy50cmVlLmpzJztcclxuaW1wb3J0IFJBQVNfYXV0b2NvbXBsZXRlciBmcm9tICcuL2xpYnMvcmFhcy5hdXRvY29tcGxldGVyLmpzJztcclxuaW1wb3J0IFJBQVNfbWVudVRyZWUgZnJvbSAnLi9saWJzL3JhYXMubWVudS10cmVlLmpzJztcclxuaW1wb3J0IFJBQVNfZmlsbFNlbGVjdCBmcm9tICcuL2xpYnMvcmFhcy5maWxsLXNlbGVjdC5qcyc7XHJcbmltcG9ydCBSQUFTX2dldFNlbGVjdCBmcm9tICcuL2xpYnMvcmFhcy5nZXQtc2VsZWN0LmpzJztcclxuaW1wb3J0IFJBQVNfcmVwbyBmcm9tICcuL2xpYnMvcmFhcy5yZXBvLmpzJztcclxuaW1wb3J0IFJBQVNJbml0SW5wdXRzIGZyb20gJy4vbGlicy9yYWFzLmluaXQtaW5wdXRzLmpzJztcclxuaW1wb3J0IFJBQVNfcXVlcnlTdHJpbmcgZnJvbSAnLi9saWJzL3JhYXMucXVlcnktc3RyaW5nLmpzJztcclxuXHJcbndpbmRvdy5xdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nO1xyXG5cclxuLy8gVnVlLnVzZShZbWFwUGx1Z2luLCB3aW5kb3cueW1hcFNldHRpbmdzKTtcclxuXHJcbmpRdWVyeShmdW5jdGlvbiAoJCkge1xyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIFJBQVNfdHJlZSxcclxuICAgICAgICBSQUFTX2F1dG9jb21wbGV0ZXIsXHJcbiAgICAgICAgUkFBU19tZW51VHJlZSxcclxuICAgICAgICBSQUFTX2ZpbGxTZWxlY3QsXHJcbiAgICAgICAgUkFBU19nZXRTZWxlY3QsXHJcbiAgICAgICAgUkFBU19yZXBvLFxyXG4gICAgICAgIFJBQVNJbml0SW5wdXRzLFxyXG4gICAgfSk7XHJcbiAgICAkLmV4dGVuZCh7IFJBQVNfcXVlcnlTdHJpbmcgfSk7XHJcbn0pO1xyXG5cclxuXHJcbmxldCBhcHAsIHZ1ZVJvb3Q7XHJcbnZ1ZVJvb3QgPSBhcHAgPSBWdWUuY3JlYXRlQXBwKEFwcCk7XHJcblxyXG53aW5kb3cucmVnaXN0ZXJlZFJBQVNDb21wb25lbnRzID0ge307XHJcbk9iamVjdC5rZXlzKHdpbmRvdy5yYWFzQ29tcG9uZW50cykuZm9yRWFjaCgoY29tcG9uZW50VVJOKSA9PiB7XHJcbiAgICB3aW5kb3cucmVnaXN0ZXJlZFJBQVNDb21wb25lbnRzW2NvbXBvbmVudFVSTl0gPSB2dWVSb290LmNvbXBvbmVudChjb21wb25lbnRVUk4sIHJhYXNDb21wb25lbnRzW2NvbXBvbmVudFVSTl0pO1xyXG59KVxyXG5cclxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKSB7XHJcbiAgICB3aW5kb3cuYXBwID0gYXBwLm1vdW50KCcjcmFhcy1hcHAnKTtcclxuXHJcbiAgICB2YXIgaGFzaCA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2g7XHJcbiAgICBpZiAoaGFzaCkge1xyXG4gICAgICAgIGlmICgkKCcudGFiYmFibGUgdWwubmF2LXRhYnMgYVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkKCcudGFiYmFibGUgdWwubmF2LXRhYnMgYVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykudGFiKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICQuc2Nyb2xsVG8oMCwgMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICgkKCcuYWNjb3JkaW9uIGEuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkKCcuYWNjb3JkaW9uIGEuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykuY2xvc2VzdCgnLmFjY29yZGlvbicpLmZpbmQoJy5jb2xsYXBzZScpLnJlbW92ZUNsYXNzKCdpbicpO1xyXG4gICAgICAgICAgICAkKCcuYWNjb3JkaW9uIGEuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykuY2xvc2VzdCgnLmFjY29yZGlvbi1ncm91cCcpLmZpbmQoJy5jb2xsYXBzZScpLmNvbGxhcHNlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICQuc2Nyb2xsVG8oJCgnLmFjY29yZGlvbiBhLmFjY29yZGlvbi10b2dnbGVbaHJlZj1cIicgKyBoYXNoICsgJ1wiXScpWzBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgICQoJyonKS5mb2N1cyhmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KCcudGFiYmFibGUgLnRhYi1wYW5lJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaGFzaD0gJyMnICsgJCh0aGlzKS5jbG9zZXN0KCcudGFiYmFibGUgLnRhYi1wYW5lJykuYXR0cignaWQnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcudGFiYmFibGUgdWwubmF2LXRhYnMgYVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykudGFiKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoJy5hY2NvcmRpb24gLmFjY29yZGlvbi1ib2R5Om5vdCguaW4pJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaGFzaCA9ICcjJyArICQodGhpcykuY2xvc2VzdCgnLmFjY29yZGlvbiAuYWNjb3JkaW9uLWJvZHknKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgICAgICAvLyQodGhpcykuY2xvc2VzdCgnLmFjY29yZGlvbicpLmZpbmQoJy5jb2xsYXBzZS5pbicpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmFjY29yZGlvbicpLmZpbmQoJ2EuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykuY2xvc2VzdCgnLmFjY29yZGlvbi1ncm91cCcpLmZpbmQoJy5jb2xsYXBzZScpLmNvbGxhcHNlKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnYVtkYXRhLXRvZ2dsZT1cInRhYlwiXScpLm9uKCdzaG93bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgdXJsKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvLyAkLmRhdGVwaWNrZXIuc2V0RGVmYXVsdHMoeyBkYXRlRm9ybWF0OiAneXktbW0tZGQnIH0pO1xyXG4gICAgLy8gJC50aW1lcGlja2VyLnNldERlZmF1bHRzKHsgZGF0ZUZvcm1hdDogJ3l5LW1tLWRkJywgdGltZUZvcm1hdDogJ2hoOm1tJywgc2VwYXJhdG9yOiAnICcgfSk7XHJcbiAgICBcclxuICAgICQoJ2JvZHknKS5SQUFTSW5pdElucHV0cygpO1xyXG4gICAgJCgnOnJlc2V0JykuY2xpY2soZnVuY3Rpb24oKSB7IGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCgpOyByZXR1cm4gZmFsc2U7IH0pO1xyXG4gICAgJCgnKltyZWwqPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoKS5jbGljayhmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlOyB9KTtcclxuICAgIFxyXG4gICAgJCgnKltkYXRhLXJhYXMtcm9sZSo9XCJ0cmVlXCJdJykuUkFBU190cmVlKCk7XHJcbiAgICAkKCcqW2RhdGEtcm9sZT1cInJhYXMtcmVwby1ibG9ja1wiXTpub3QoOmhhcyhbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWFkZFwiXSkpJylcclxuICAgICAgICAuZmluZCgnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1jb250YWluZXJcIl0nKVxyXG4gICAgICAgIC5hZnRlcignPGEgaHJlZj1cIiNcIiBkYXRhLXJvbGU9XCJyYWFzLXJlcG8tYWRkXCI+PGkgY2xhc3M9XCJpY29uIGljb24tcGx1c1wiPjwvaT48L2E+Jyk7XHJcbiAgICAkKCcqW2RhdGEtcm9sZT1cInJhYXMtcmVwby1lbGVtZW50XCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tZGVsXCJdKSksICpbZGF0YS1yb2xlPVwicmFhcy1yZXBvXCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tZGVsXCJdKSknKVxyXG4gICAgICAgIC5hcHBlbmQoJzxhIGhyZWY9XCIjXCIgZGF0YS1yb2xlPVwicmFhcy1yZXBvLWRlbFwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiPjwvaT48L2E+Jyk7XHJcbiAgICAkKCcqW2RhdGEtcm9sZT1cInJhYXMtcmVwby1lbGVtZW50XCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tbW92ZVwiXSkpLCAqW2RhdGEtcm9sZT1cInJhYXMtcmVwb1wiXTpub3QoOmhhcyhbZGF0YS1yb2xlPVwicmFhcy1yZXBvLW1vdmVcIl0pKScpXHJcbiAgICAgICAgLmFwcGVuZCgnPGEgaHJlZj1cIiNcIiBkYXRhLXJvbGU9XCJyYWFzLXJlcG8tbW92ZVwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLXJlc2l6ZS12ZXJ0aWNhbFwiPjwvaT48L2E+Jyk7XHJcbiAgICAkKCcqW2RhdGEtcm9sZT1cInJhYXMtcmVwby1ibG9ja1wiXScpLmVhY2goZnVuY3Rpb24oKSB7ICQodGhpcykuUkFBU19yZXBvKCkgfSk7XHJcbn0pOyJdLCJuYW1lcyI6WyJkYXRhIiwid2luZG93V2lkdGgiLCJib2R5V2lkdGgiLCJ3aW5kb3dIZWlnaHQiLCJzY3JvbGxUb3AiLCJvbGRTY3JvbGxUb3AiLCJpc1Njcm9sbGluZ05vdyIsImlzU2Nyb2xsaW5nTm93VGltZW91dElkIiwiaXNTY3JvbGxpbmdOb3dEZWxheSIsInNjcm9sbGluZ0luYWNjdXJhY3kiLCJzY3JvbGxUb1NlbGVjdG9yIiwibWVkaWFUeXBlcyIsInh4bCIsInhsIiwibGciLCJtZCIsInNtIiwieHMiLCJtb3VudGVkIiwic2VsZiIsImxpZ2h0Qm94SW5pdCIsIiQiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwib3V0ZXJIZWlnaHQiLCJvdXRlcldpZHRoIiwiZml4SHRtbCIsIm9uIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImRvY3VtZW50IiwiY3VycmVudFVybCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJzZWFyY2giLCJ1cmwiLCJhdHRyIiwic3BsaXQiLCJwcm9jZXNzSGFzaExpbmsiLCJoYXNoIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInRpdGxlIiwibWV0aG9kcyIsImFwaSIsInBvc3REYXRhIiwiYmxvY2tJZCIsInJlc3BvbnNlVHlwZSIsInJlcXVlc3RUeXBlIiwiYWRkaXRpb25hbEhlYWRlcnMiLCJhYm9ydENvbnRyb2xsZXIiLCJyZWFsVXJsIiwidGVzdCIsImhvc3QiLCJoZWFkZXJzIiwicngiLCJmZXRjaE9wdGlvbnMiLCJzaWduYWwiLCJtZXRob2QiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwibmFtZSIsImFwcGVuZCIsImJvZHkiLCJxdWVyeVN0cmluZyIsInN0cmluZ2lmeSIsImFycmF5Rm9ybWF0IiwiSlNPTiIsInJlc3BvbnNlIiwiZmV0Y2giLCJyZXN1bHQiLCJqc29uIiwidGV4dCIsImdldFNjcm9sbE9mZnNldCIsImRlc3RZIiwiZ2V0T2JqRnJvbUhhc2giLCIkb2JqIiwibGVuZ3RoIiwicmVwbGFjZSIsImpxRW1pdCIsImhhc0NsYXNzIiwibW9kYWwiLCIkaGFzaExpbmsiLCJocmVmIiwiY2xpY2siLCJzY3JvbGxUbyIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsInByb2Nlc3NBbGxJbWFnZUxpbmtzIiwic3dpcGUiLCJ0cmFuc2l0aW9uIiwidHlwZU1hcHBpbmciLCJwYXJhbXMiLCJPYmplY3QiLCJhc3NpZ24iLCJlYWNoIiwiZyIsInJlbW92ZUF0dHIiLCJsaWdodGNhc2UiLCJlIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInRyaWdnZXIiLCJjbGVhckludGVydmFsIiwiY29uZmlybSIsIm9rVGV4dCIsImNhbmNlbFRleHQiLCIkcmVmcyIsImZvcm1hdFByaWNlIiwicHJpY2UiLCJudW1UeHQiLCJ4IiwiZm9ybXMiLCJldmVudE5hbWUiLCJvcmlnaW5hbEV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnN0YW50Iiwib2Zmc2V0IiwidG9wIiwiSFRNTEVsZW1lbnQiLCJqUXVlcnkiLCJNYXRoIiwibWF4Iiwicm91bmQiLCJtaW4iLCJzY3JvbGxUb0RhdGEiLCJsZWZ0IiwiYmVoYXZpb3IiLCJwcm90ZWN0U2Nyb2xsaW5nIiwiYm9keU91dGVySGVpZ2h0IiwicGFyc2VJbnQiLCJhYnMiLCJjb25zb2xlIiwibG9nIiwiY29tcHV0ZWQiLCJ3aW5kb3dCb3R0b21Qb3NpdGlvbiIsInNjcm9sbERlbHRhIiwiZml4ZWRIZWFkZXJBY3RpdmUiLCJmaXhlZEhlYWRlciIsIndhdGNoIiwiQXBwIiwiRml4ZWRIZWFkZXIiLCJtaXhpbnMiLCJlbCIsImxhc3RTY3JvbGxUb3AiLCJjb25maWciLCJyYWFzQ29uZmlnIiwicmFhc0FwcGxpY2F0aW9uRGF0YSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIiR0aGlzT2JqIiwiJGF1dG90ZXh0IiwiZGVmYXVsdFBhcmFtcyIsInNob3dJbnRlcnZhbCIsInRpbWVvdXRfaWQiLCJnZXRDb21wbGV0aW9uIiwiU2V0IiwiaSIsImVtcHR5IiwiaWQiLCJrZXkiLCJpbkFycmF5IiwidG9TdHJpbmciLCJpbWciLCJkZXNjcmlwdGlvbiIsInNob3ciLCJoaWRlIiwidGV4dE9uQ2hhbmdlIiwidmFsIiwiZ2V0SlNPTiIsIm9uQ2xpY2siLCJjYWxsYmFjayIsImFwcGx5IiwiaW5pdCIsImV4dGVuZCIsIm5leHQiLCJhZnRlciIsIiRwYXJhbXMiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsIl90eXBlb2YiLCJmaWxsIiwic2VsIiwiYmVmb3JlIiwidGhpc09iaiIsIlJBQVNfZmlsbFNlbGVjdCIsIm5vdCIsIm11bHRpc2VsZWN0IiwiYnV0dG9uVGV4dCIsInNlbGVjdCIsInNlbGVjdGVkIiwic3Vic3RyIiwibWF4SGVpZ2h0IiwiY2xvc2VzdCIsImZpbmQiLCJzaG93bkxldmVsIiwiaGlkZVVMIiwiYWRkUGx1c2VzIiwicHJlcGVuZCIsInVuZm9sZCIsInNsb3dseSIsImNoaWxkcmVuIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNsaWRlRG93biIsImZvbGQiLCJzbGlkZVVwIiwiY2xpY2tQbHVzIiwiY2xpY2tNaW51cyIsImFsZXJ0IiwiY2hhbmdlX3F1ZXJ5IiwiaW5jbHVkZV9kaXJzIiwiaW5pdGlhbF9wYXRoIiwicXVlcnlfZGlyIiwicXVlcnlfc3RyIiwib2xkX3F1ZXJ5IiwiY2hhbmdlIiwicXVlcnkiLCJ0ZW1wIiwibmV3X3F1ZXJ5Iiwiam9pbiIsIm9uQmVmb3JlQWRkIiwib25BZnRlckFkZCIsIm9uQmVmb3JlRGVsZXRlIiwib25BZnRlckRlbGV0ZSIsIiRyZXBvQmxvY2siLCIkcmVwb0NvbnRhaW5lciIsInJlcG9Db250YWluZXIiLCIkcmVwbyIsInJlcG8iLCJjaGVja1JlcXVpcmVkIiwiJHJlcG9FbGVtZW50IiwicmVwb0VsZW1lbnQiLCJyZXBvRGVsZXRlIiwicmVwb01vdmUiLCJyZXBvQWRkIiwiY2xvbmUiLCJyZXBvRWxlbWVudENoYW5nZXMiLCJSQUFTSW5pdElucHV0cyIsInJlbW92ZSIsImF4aXMiLCJzb3J0YWJsZSIsImNvbnRhaW5tZW50IiwiY2xpY2tDaGVja2JveCIsImdyb3VwIiwiJGxpIiwiZmlsdGVyIiwiaW5kZXgiLCJpcyIsInByb3AiLCJjbGlja0NoZWNrYm94QWNjdXJhdGUiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsImNsaWNrQ2hlY2tib3hBY2N1cmF0ZUxhYmVsIiwiUkFBU190cmVlIiwiUkFBU19hdXRvY29tcGxldGVyIiwiUkFBU19tZW51VHJlZSIsIlJBQVNfZ2V0U2VsZWN0IiwiUkFBU19yZXBvIiwiUkFBU19xdWVyeVN0cmluZyIsImZuIiwiYXBwIiwidnVlUm9vdCIsIlZ1ZSIsImNyZWF0ZUFwcCIsInJlZ2lzdGVyZWRSQUFTQ29tcG9uZW50cyIsImtleXMiLCJyYWFzQ29tcG9uZW50cyIsImZvckVhY2giLCJjb21wb25lbnRVUk4iLCJjb21wb25lbnQiLCJyZWFkeSIsIm1vdW50IiwidGFiIiwiY29sbGFwc2UiLCJmb2N1cyIsInJlbG9hZCIsInBvcG92ZXIiXSwic291cmNlUm9vdCI6IiJ9