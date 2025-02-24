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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[17].use[0]!./public/src/application/app.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[17].use[0]!./public/src/application/app.vue?vue&type=script&lang=js ***!
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
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_17_use_0_app_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_17_use_0_app_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[17].use[0]!./app.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[17].use[0]!./public/src/application/app.vue?vue&type=script&lang=js");
 

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
    var text = '<a class="btn" href="#" rel="popover" data-content="' + $(this).attr('data-hint') + '"><i class="icon-question-sign"></i></a>';
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












// import { Ckeditor } from '@ckeditor/ckeditor5-vue';

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
// vueRoot.use(Ckeditor);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZTtFQUNYQSxJQUFJQSxDQUFBLEVBQUc7SUFDSCxPQUFPO01BQ0g7QUFDWjtBQUNBO0FBQ0E7TUFDWUMsV0FBVyxFQUFFLENBQUM7TUFFZDtBQUNaO0FBQ0E7QUFDQTtNQUNZQyxTQUFTLEVBQUUsQ0FBQztNQUVaO0FBQ1o7QUFDQTtBQUNBO01BQ1lDLFlBQVksRUFBRSxDQUFDO01BRWY7QUFDWjtBQUNBO0FBQ0E7TUFDWUMsU0FBUyxFQUFFLENBQUM7TUFFWjtBQUNaO0FBQ0E7QUFDQTtNQUNZQyxZQUFZLEVBQUUsQ0FBQztNQUVmO0FBQ1o7QUFDQTtBQUNBO01BQ1lDLGNBQWMsRUFBRSxLQUFLO01BRXJCO0FBQ1o7QUFDQTtBQUNBO01BQ1lDLHVCQUF1QixFQUFFLEtBQUs7TUFFOUI7QUFDWjtBQUNBO0FBQ0E7TUFDWUMsbUJBQW1CLEVBQUUsR0FBRztNQUV4QjtBQUNaO0FBQ0E7QUFDQTtNQUNZQyxtQkFBbUIsRUFBRSxDQUFDO01BRXRCO0FBQ1o7QUFDQTtNQUNZQyxnQkFBZ0IsRUFBRSwrQkFBK0IsR0FDN0MseUJBQXlCLEdBQ3pCLHlFQUF5RSxHQUN6RSw4QkFBOEIsR0FDOUIsK0JBQStCLEdBQy9CLGlDQUFpQyxHQUNqQywrQkFBK0I7TUFDbkM7QUFDWjtBQUNBO0FBQ0E7TUFDWUMsVUFBVSxFQUFFO1FBQ1JDLEdBQUcsRUFBRSxJQUFJO1FBQ1RDLEVBQUUsRUFBRSxJQUFJO1FBQ1JDLEVBQUUsRUFBRSxHQUFHO1FBQ1BDLEVBQUUsRUFBRSxHQUFHO1FBQ1BDLEVBQUUsRUFBRSxHQUFHO1FBQ1BDLEVBQUUsRUFBRTtNQUNSO0lBQ0osQ0FBQztFQUNMLENBQUM7RUFDREMsT0FBT0EsQ0FBQSxFQUFHO0lBQ04sSUFBSUMsSUFBSSxHQUFHLElBQUk7SUFDZixJQUFJLENBQUNDLFlBQVksQ0FBQyxDQUFDO0lBQ25CLElBQUksQ0FBQ25CLFdBQVcsR0FBR29CLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLElBQUksQ0FBQ3BCLFlBQVksR0FBR2tCLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNFLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQ3RCLFNBQVMsR0FBR21CLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQ0ksVUFBVSxDQUFDLENBQUM7SUFDdkMsSUFBSSxDQUFDQyxPQUFPLENBQUMsQ0FBQztJQUNkTCxDQUFDLENBQUNDLE1BQU0sQ0FBQyxDQUNKSyxFQUFFLENBQUMsUUFBUSxFQUFFUixJQUFJLENBQUNPLE9BQU8sQ0FBQyxDQUMxQkMsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNO01BQ2hCLElBQUksQ0FBQzFCLFdBQVcsR0FBR29CLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNHLFVBQVUsQ0FBQyxDQUFDO01BQ3pDLElBQUksQ0FBQ3RCLFlBQVksR0FBR2tCLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNFLFdBQVcsQ0FBQyxDQUFDO01BQzNDLElBQUksQ0FBQ3RCLFNBQVMsR0FBR21CLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQ0ksVUFBVSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQ0RFLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTTtNQUNoQixJQUFJdEIsWUFBWSxHQUFHLElBQUksQ0FBQ0QsU0FBUztNQUNqQyxJQUFJLENBQUNBLFNBQVMsR0FBR2lCLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNsQixTQUFTLENBQUMsQ0FBQztNQUN0QyxJQUFJLElBQUksQ0FBQ0csdUJBQXVCLEVBQUU7UUFDOUJlLE1BQU0sQ0FBQ00sWUFBWSxDQUFDLElBQUksQ0FBQ3JCLHVCQUF1QixDQUFDO01BQ3JEO01BQ0EsSUFBSSxDQUFDLElBQUksQ0FBQ0QsY0FBYyxFQUFFO1FBQ3RCLElBQUksQ0FBQ0EsY0FBYyxHQUFHLElBQUk7TUFDOUI7TUFDQSxJQUFJLENBQUNDLHVCQUF1QixHQUFHZSxNQUFNLENBQUNPLFVBQVUsQ0FBQyxNQUFNO1FBQ25ELElBQUksQ0FBQ3hCLFlBQVksR0FBR0EsWUFBWTtRQUNoQyxJQUFJLENBQUNELFNBQVMsR0FBR2lCLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNsQixTQUFTLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUNHLHVCQUF1QixHQUFHLENBQUM7UUFDaEMsSUFBSSxDQUFDRCxjQUFjLEdBQUcsS0FBSztNQUMvQixDQUFDLEVBQUUsSUFBSSxDQUFDRSxtQkFBbUIsQ0FBQztJQUNoQyxDQUFDLENBQUM7SUFFTmEsQ0FBQyxDQUFDUyxRQUFRLENBQUMsQ0FBQ0gsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUNqQixnQkFBZ0IsRUFBRSxZQUFZO01BQ3ZELElBQUlxQixVQUFVLEdBQUdULE1BQU0sQ0FBQ1UsUUFBUSxDQUFDQyxRQUFRLEdBQUdYLE1BQU0sQ0FBQ1UsUUFBUSxDQUFDRSxNQUFNO01BQ2xFLElBQUlDLEdBQUcsR0FBR2QsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDZSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUNDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUM7TUFDQTtNQUNBO01BQ0EsSUFBSSxDQUFDRixHQUFHLElBQUtBLEdBQUcsSUFBSUosVUFBVyxFQUFFO1FBQzdCWixJQUFJLENBQUNtQixlQUFlLENBQUMsSUFBSSxDQUFDQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxLQUFLO01BQ2hCO0lBQ0osQ0FBQyxDQUFDO0lBQ0ZsQixDQUFDLENBQUNTLFFBQVEsQ0FBQyxDQUFDSCxFQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxZQUFZO01BQzNDTCxNQUFNLENBQUNrQixPQUFPLENBQUNDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRVgsUUFBUSxDQUFDWSxLQUFLLEVBQUVyQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNlLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUM7SUFDRmYsQ0FBQyxDQUFDQyxNQUFNLENBQUMsQ0FBQ0ssRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNO01BQ3ZCLElBQUlMLE1BQU0sQ0FBQ1UsUUFBUSxDQUFDTyxJQUFJLEVBQUU7UUFDdEIsSUFBSSxDQUFDRCxlQUFlLENBQUNoQixNQUFNLENBQUNVLFFBQVEsQ0FBQ08sSUFBSSxDQUFDO01BQzlDO0lBQ0osQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDbkMsU0FBUyxHQUFHLElBQUksQ0FBQ0MsWUFBWSxHQUFHZ0IsQ0FBQyxDQUFDQyxNQUFNLENBQUMsQ0FBQ2xCLFNBQVMsQ0FBQyxDQUFDOztJQUUxRDs7SUFFQTtFQUNKLENBQUM7RUFDRHVDLE9BQU8sRUFBRTtJQUNMO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNRLE1BQU1DLEdBQUdBLENBQ0xULEdBQUcsRUFDSFUsUUFBUSxHQUFHLElBQUksRUFDZkMsT0FBTyxHQUFHLElBQUksRUFDZEMsWUFBWSxHQUFHLGtCQUFrQixFQUNqQ0MsV0FBVyxHQUFHLG1DQUFtQyxFQUNqREMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQ3RCQyxlQUFlLEdBQUcsSUFBSSxFQUN4QjtNQUNFO01BQ0EsSUFBSUMsT0FBTyxHQUFHaEIsR0FBRyxDQUFDRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQy9CLElBQUksQ0FBQyxRQUFRLENBQUNlLElBQUksQ0FBQ0QsT0FBTyxDQUFDLEVBQUU7UUFDekIsSUFBSUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtVQUNuQkEsT0FBTyxHQUFHLElBQUksR0FBRzdCLE1BQU0sQ0FBQ1UsUUFBUSxDQUFDcUIsSUFBSSxHQUFHL0IsTUFBTSxDQUFDVSxRQUFRLENBQUNDLFFBQVEsR0FBR2tCLE9BQU87UUFDOUUsQ0FBQyxNQUFNO1VBQ0hBLE9BQU8sR0FBRyxJQUFJLEdBQUc3QixNQUFNLENBQUNVLFFBQVEsQ0FBQ3FCLElBQUksR0FBR0YsT0FBTztRQUNuRDtNQUNKO01BQ0EsTUFBTUcsT0FBTyxHQUFHO1FBQUMsR0FBR0w7TUFBaUIsQ0FBQztNQUN0QyxJQUFJTSxFQUFFO01BQ04sSUFBSVQsT0FBTyxFQUFFO1FBQ1QsSUFBSSxDQUFDLGVBQWUsQ0FBQ00sSUFBSSxDQUFDRCxPQUFPLENBQUMsRUFBRTtVQUNoQ0EsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDQyxJQUFJLENBQUNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksT0FBTyxHQUFHTCxPQUFPO1FBQ3JFO1FBQ0FRLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHUixPQUFPO01BQ3hDO01BQ0EsSUFBSSxNQUFNLENBQUNNLElBQUksQ0FBQ0wsWUFBWSxDQUFDLEVBQUU7UUFDM0JPLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBR1AsWUFBWTtNQUNwQztNQUNBLElBQUksTUFBTSxDQUFDSyxJQUFJLENBQUNKLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQ0gsUUFBUSxFQUFFO1FBQ3hDUyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUdOLFdBQVc7TUFDekM7TUFDQSxNQUFNUSxZQUFZLEdBQUc7UUFDakJGO01BQ0osQ0FBQztNQUNELElBQUlKLGVBQWUsRUFBRTtRQUNqQk0sWUFBWSxDQUFDQyxNQUFNLEdBQUdQLGVBQWUsQ0FBQ08sTUFBTTtNQUNoRDtNQUNBLElBQUksQ0FBQyxDQUFDWixRQUFRLEVBQUU7UUFDWlcsWUFBWSxDQUFDRSxNQUFNLEdBQUcsTUFBTTtRQUM1QixJQUFJLFFBQVEsQ0FBQ04sSUFBSSxDQUFDSixXQUFXLENBQUMsRUFBRTtVQUM1QixJQUFJLGFBQWEsQ0FBQ0ksSUFBSSxDQUFDSixXQUFXLENBQUMsRUFBRTtZQUNqQyxJQUFJVyxRQUFRLEdBQUksSUFBSUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsSUFBSWYsUUFBUSxZQUFZZSxRQUFRLEVBQUU7Y0FDOUJELFFBQVEsR0FBR2QsUUFBUTtZQUN2QixDQUFDLE1BQU07Y0FDSGMsUUFBUSxHQUFHLElBQUlDLFFBQVEsQ0FBQyxDQUFDO2NBQ3pCLEtBQUssTUFBTUMsSUFBSSxJQUFJaEIsUUFBUSxFQUFFO2dCQUN6QmMsUUFBUSxDQUFDRyxNQUFNLENBQUNELElBQUksRUFBRWhCLFFBQVEsQ0FBQ2dCLElBQUksQ0FBQyxDQUFDO2NBQ3pDO1lBQ0o7WUFDQUwsWUFBWSxDQUFDTyxJQUFJLEdBQUdKLFFBQVE7WUFDNUIsT0FBT0wsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7VUFDcEMsQ0FBQyxNQUFNO1lBQ0hFLFlBQVksQ0FBQ08sSUFBSSxHQUFHekMsTUFBTSxDQUFDMEMsV0FBVyxDQUFDQyxTQUFTLENBQUNwQixRQUFRLEVBQUU7Y0FBRXFCLFdBQVcsRUFBRTtZQUFVLENBQUMsQ0FBQztVQUMxRjtRQUNKLENBQUMsTUFBTSxJQUFLLE9BQU9yQixRQUFRLElBQUssUUFBUSxFQUFFO1VBQ3RDVyxZQUFZLENBQUNPLElBQUksR0FBR0ksSUFBSSxDQUFDRixTQUFTLENBQUNwQixRQUFRLENBQUM7UUFDaEQsQ0FBQyxNQUFNO1VBQ0hXLFlBQVksQ0FBQ08sSUFBSSxHQUFHbEIsUUFBUTtRQUNoQztNQUNKLENBQUMsTUFBTTtRQUNIVyxZQUFZLENBQUNFLE1BQU0sR0FBRyxLQUFLO01BQy9CO01BQ0E7TUFDQSxNQUFNVSxRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDbEIsT0FBTyxFQUFFSyxZQUFZLENBQUM7TUFDbkQsSUFBSWMsTUFBTTtNQUNWLElBQUksUUFBUSxDQUFDbEIsSUFBSSxDQUFDTCxZQUFZLENBQUMsRUFBRTtRQUM3QnVCLE1BQU0sR0FBRyxNQUFNRixRQUFRLENBQUNHLElBQUksQ0FBQyxDQUFDO01BQ2xDLENBQUMsTUFBTTtRQUNIRCxNQUFNLEdBQUcsTUFBTUYsUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQztNQUNsQztNQUNBLE9BQU9GLE1BQU07SUFFakIsQ0FBQztJQUNEO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNRRyxlQUFlQSxDQUFDQyxLQUFLLEdBQUcsSUFBSSxFQUFFO01BQzFCLE9BQU8sQ0FBQztJQUNaLENBQUM7SUFFRDtBQUNSO0FBQ0E7QUFDQTtBQUNBO0lBQ1FDLGNBQWNBLENBQUNwQyxJQUFJLEVBQUU7TUFDakIsSUFBSUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtRQUNoQkEsSUFBSSxHQUFHLEdBQUcsR0FBR0EsSUFBSTtNQUNyQjtNQUNBLElBQUlxQyxJQUFJLEdBQUd2RCxDQUFDLENBQUNrQixJQUFJLENBQUM7TUFDbEIsSUFBSXFDLElBQUksQ0FBQ0MsTUFBTSxFQUFFO1FBQ2IsT0FBT0QsSUFBSTtNQUNmO01BQ0FBLElBQUksR0FBR3ZELENBQUMsQ0FBQyxTQUFTLEdBQUdrQixJQUFJLENBQUN1QyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztNQUNsRCxJQUFJRixJQUFJLENBQUNDLE1BQU0sRUFBRTtRQUNiLE9BQU9ELElBQUk7TUFDZjtNQUNBLE9BQU8sSUFBSTtJQUNmLENBQUM7SUFFRDtBQUNSO0FBQ0E7QUFDQTtJQUNRdEMsZUFBZUEsQ0FBQ0MsSUFBSSxFQUFFO01BQ2xCLElBQUksQ0FBQ3dDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRXhDLElBQUksQ0FBQztNQUNwQyxJQUFJcUMsSUFBSSxHQUFHLElBQUksQ0FBQ0QsY0FBYyxDQUFDcEMsSUFBSSxDQUFDO01BQ3BDLElBQUlxQyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsTUFBTSxFQUFFO1FBQ3JCLElBQUlELElBQUksQ0FBQ0ksUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1VBQ3hCSixJQUFJLENBQUNLLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDdEIsQ0FBQyxNQUFNLElBQUlMLElBQUksQ0FBQ0ksUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1VBQ2xDLElBQUlFLFNBQVMsR0FBRzdELENBQUMsQ0FDYixVQUFVLEdBQUdrQixJQUFJLEdBQUcsTUFBTSxHQUMxQixVQUFVLEdBQUdqQixNQUFNLENBQUNVLFFBQVEsQ0FBQ0MsUUFBUSxHQUFHWCxNQUFNLENBQUNVLFFBQVEsQ0FBQ0UsTUFBTSxHQUFHSyxJQUFJLEdBQUcsTUFBTSxHQUM5RSxVQUFVLEdBQUdqQixNQUFNLENBQUNVLFFBQVEsQ0FBQ21ELElBQUksR0FBRyxJQUN4QyxDQUFDO1VBQ0QsSUFBSUQsU0FBUyxDQUFDTCxNQUFNLEVBQUU7WUFDbEJLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0UsS0FBSyxDQUFDLENBQUM7VUFDeEI7UUFDSixDQUFDLE1BQU07VUFDSCxJQUFJLENBQUNDLFFBQVEsQ0FBQ1QsSUFBSSxDQUFDO1FBQ3ZCO01BQ0o7SUFDSixDQUFDO0lBRUQ7QUFDUjtBQUNBO0FBQ0E7SUFDUXhELFlBQVlBLENBQUNrRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7TUFDdkIsSUFBSUMsUUFBUSxHQUFHO1FBQ1hDLG9CQUFvQixFQUFFLElBQUk7UUFDMUJDLEtBQUssRUFBRSxJQUFJO1FBQ1hDLFVBQVUsRUFBRSxrQkFBa0I7UUFDOUJDLFdBQVcsRUFBRTtVQUNULE9BQU8sRUFBRTtRQUNiO01BQ0osQ0FBQztNQUNELElBQUlDLE1BQU0sR0FBR0MsTUFBTSxDQUFDQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUVQLFFBQVEsRUFBRUQsT0FBTyxDQUFDO01BQ2pELElBQUkvQixFQUFFLEdBQUcsdUNBQXVDO01BQ2hEbEMsQ0FBQyxDQUFDLHNEQUFzRCxDQUFDLENBQUMwRSxJQUFJLENBQUMsWUFBWTtRQUN2RSxJQUFJSCxNQUFNLENBQUNKLG9CQUFvQixFQUFFO1VBQzdCLElBQUlqQyxFQUFFLENBQUNILElBQUksQ0FBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7WUFDL0JmLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2UsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUM7VUFDekM7UUFDSjtRQUNBLElBQUk0RCxDQUFDLEdBQUczRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNlLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztRQUM3QyxJQUFJNEQsQ0FBQyxJQUFJM0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDZSxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUU7VUFDcENmLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2UsSUFBSSxDQUFDLFVBQVUsRUFBRSxXQUFXLElBQUk0RCxDQUFDLEdBQUcsR0FBRyxHQUFHQSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7VUFDMUQzRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM0RSxVQUFVLENBQUMsdUJBQXVCLENBQUM7VUFDM0M1RSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM0RSxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ3ZDO01BQ0osQ0FBQyxDQUFDO01BQ0Y1RSxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQzZFLFNBQVMsQ0FBQ04sTUFBTSxDQUFDO01BQzdDdkUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLFVBQVV3RSxDQUFDLEVBQUVuRyxJQUFJLEVBQUU7UUFDcEQsSUFBSSxTQUFTLENBQUNvRCxJQUFJLENBQUMvQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNlLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO1VBQ3RDO1VBQ0E7VUFDQSxJQUFJZ0UsUUFBUSxHQUFHOUUsTUFBTSxDQUFDK0UsV0FBVyxDQUFDLE1BQU07WUFDcEMsSUFBSWhGLENBQUMsQ0FBQyxxREFBcUQsQ0FBQyxDQUFDd0QsTUFBTSxFQUFFO2NBQ2pFeEQsQ0FBQyxDQUFDLHFEQUFxRCxDQUFDLENBQUNlLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQ2tFLE9BQU8sQ0FBQyxNQUFNLENBQUM7Y0FDM0doRixNQUFNLENBQUNpRixhQUFhLENBQUNILFFBQVEsQ0FBQztZQUNsQztVQUNKLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDWDtNQUNKLENBQUMsQ0FBQztJQUNOLENBQUM7SUFHRDtBQUNSO0FBQ0E7QUFDQTtJQUNRMUUsT0FBT0EsQ0FBQSxFQUFHO01BQ047SUFBQSxDQUNIO0lBR0Q7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDUThFLE9BQU9BLENBQUNoQyxJQUFJLEVBQUVpQyxNQUFNLEVBQUVDLFVBQVUsRUFBRTtNQUM5QixPQUFPLElBQUksQ0FBQ0MsS0FBSyxDQUFDSCxPQUFPLENBQUNBLE9BQU8sQ0FBQ2hDLElBQUksRUFBRWlDLE1BQU0sRUFBRUMsVUFBVSxDQUFDO0lBQy9ELENBQUM7SUFFRDtBQUNSO0FBQ0E7QUFDQTtBQUNBO0lBQ1FFLFdBQVdBLENBQUNDLEtBQUssRUFBRTtNQUNmLE9BQU92RixNQUFNLENBQUNzRixXQUFXLENBQUNDLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBRUQ7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDUUMsTUFBTUEsQ0FBQ0MsQ0FBQyxFQUFFQyxLQUFLLEVBQUU7TUFDYixPQUFPMUYsTUFBTSxDQUFDd0YsTUFBTSxDQUFDQyxDQUFDLEVBQUVDLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBRUQ7QUFDUjtBQUNBO0FBQ0E7QUFDQTtJQUNRakMsTUFBTUEsQ0FBQ2tDLFNBQVMsRUFBRWpILElBQUksR0FBRyxJQUFJLEVBQUVrSCxhQUFhLEdBQUcsSUFBSSxFQUFFO01BQ2pENUYsTUFBTSxDQUFDTyxVQUFVLENBQUMsWUFBWTtRQUMxQixJQUFJeUMsTUFBTSxHQUFHakQsQ0FBQyxDQUFDUyxRQUFRLENBQUMsQ0FBQ3dFLE9BQU8sQ0FBQ1csU0FBUyxFQUFFakgsSUFBSSxDQUFDO01BQ3JELENBQUMsRUFBRSxFQUFFLENBQUM7SUFDVixDQUFDO0lBRUQ7QUFDUjtBQUNBO0FBQ0E7QUFDQTtJQUNRcUYsUUFBUUEsQ0FBQzhCLFdBQVcsRUFBRUMsT0FBTyxHQUFHLEtBQUssRUFBRTtNQUNuQyxJQUFJMUMsS0FBSyxHQUFHLElBQUk7TUFDaEIsSUFBSSxPQUFPeUMsV0FBWSxJQUFJLFFBQVEsRUFBRTtRQUNqQ3pDLEtBQUssR0FBR3lDLFdBQVc7TUFDdkIsQ0FBQyxNQUFNLElBQUksT0FBT0EsV0FBWSxJQUFJLFFBQVEsRUFBRTtRQUN4Q0EsV0FBVyxHQUFHOUYsQ0FBQyxDQUFDOEYsV0FBVyxDQUFDO1FBQzVCekMsS0FBSyxHQUFHeUMsV0FBVyxDQUFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDQyxHQUFHO01BQ3BDLENBQUMsTUFBTSxJQUFJSCxXQUFXLFlBQVlJLFdBQVcsRUFBRTtRQUMzQzdDLEtBQUssR0FBR3JELENBQUMsQ0FBQzhGLFdBQVcsQ0FBQyxDQUFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDQyxHQUFHO01BQ3ZDLENBQUMsTUFBTSxJQUFJSCxXQUFXLFlBQVlLLE1BQU0sRUFBRTtRQUN0QzlDLEtBQUssR0FBR3lDLFdBQVcsQ0FBQ0UsTUFBTSxDQUFDLENBQUMsQ0FBQ0MsR0FBRztNQUNwQztNQUNBLElBQUk1QyxLQUFLLEtBQUssSUFBSSxFQUFFO1FBQ2hCO1FBQ0EsSUFBSTRDLEdBQUcsR0FBR0csSUFBSSxDQUFDQyxHQUFHLENBQUMsQ0FBQyxFQUFFRCxJQUFJLENBQUNFLEtBQUssQ0FBQ2pELEtBQUssR0FBRyxJQUFJLENBQUNELGVBQWUsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN0RTRDLEdBQUcsR0FBR0csSUFBSSxDQUFDRyxHQUFHLENBQUNOLEdBQUcsRUFBRWpHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0csV0FBVyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUNyQixZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJMEgsWUFBWSxHQUFHO1VBQ2ZDLElBQUksRUFBRSxDQUFDO1VBQ1BSLEdBQUc7VUFDSFMsUUFBUSxFQUFFWCxPQUFPLEdBQUcsU0FBUyxHQUFHO1FBQ3BDLENBQUM7UUFDRDtRQUNBOUYsTUFBTSxDQUFDK0QsUUFBUSxDQUFDd0MsWUFBWSxDQUFDO1FBQzdCO1FBQ0EsSUFBSSxDQUFDVCxPQUFPLEVBQUU7VUFDVixJQUFJWSxnQkFBZ0IsR0FBRzFHLE1BQU0sQ0FBQytFLFdBQVcsQ0FBQyxNQUFNO1lBQzVDLE1BQU00QixlQUFlLEdBQUdDLFFBQVEsQ0FBQzdHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQ0csV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUNLaUcsSUFBSSxDQUFDVSxHQUFHLENBQUNWLElBQUksQ0FBQ0UsS0FBSyxDQUFDLElBQUksQ0FBQ3ZILFNBQVMsQ0FBQyxHQUFHcUgsSUFBSSxDQUFDRSxLQUFLLENBQUNFLFlBQVksQ0FBQ1AsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM3RyxtQkFBbUIsSUFFMUZvSCxZQUFZLENBQUNQLEdBQUcsR0FBRyxJQUFJLENBQUNsSCxTQUFTLElBQ2pDLElBQUksQ0FBQ0EsU0FBUyxHQUFHLElBQUksQ0FBQ0QsWUFBWSxJQUFJOEgsZUFBZSxHQUFHLElBQUksQ0FBQ3hILG1CQUNqRTtZQUFJOztZQUVBb0gsWUFBWSxDQUFDUCxHQUFHLEdBQUcsSUFBSSxDQUFDbEgsU0FBUyxJQUNqQyxJQUFJLENBQUNBLFNBQVMsSUFBSSxJQUFJLENBQUNLLG1CQUMzQixDQUFDO1lBQUEsRUFDSjtjQUNFMkgsT0FBTyxDQUFDQyxHQUFHLENBQUMsb0JBQW9CLEdBQUdSLFlBQVksQ0FBQ1AsR0FBRyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUNsSCxTQUFTLENBQUM7Y0FDOUVrQixNQUFNLENBQUNpRixhQUFhLENBQUN5QixnQkFBZ0IsQ0FBQztjQUN0Q0EsZ0JBQWdCLEdBQUcsSUFBSTtZQUMzQixDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQzFILGNBQWMsRUFBRTtjQUM3QmdCLE1BQU0sQ0FBQytELFFBQVEsQ0FBQ3dDLFlBQVksQ0FBQztjQUM3Qk8sT0FBTyxDQUFDQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDakksU0FBUyxHQUFHLE1BQU0sR0FBR3lILFlBQVksQ0FBQ1AsR0FBRyxDQUFDO1lBQ3hGO1VBQ0osQ0FBQyxFQUFFLElBQUksQ0FBQzlHLG1CQUFtQixDQUFDO1FBQ2hDO1FBQ0E7TUFDSjtJQUNKO0VBQ0osQ0FBQztFQUNEOEgsUUFBUSxFQUFFO0lBQ047QUFDUjtBQUNBO0FBQ0E7SUFDUUMsb0JBQW9CQSxDQUFBLEVBQUc7TUFDbkIsT0FBTyxJQUFJLENBQUNuSSxTQUFTLEdBQUcsSUFBSSxDQUFDRCxZQUFZO0lBQzdDLENBQUM7SUFDRDtBQUNSO0FBQ0E7QUFDQTtJQUNRcUksV0FBV0EsQ0FBQSxFQUFHO01BQ1YsT0FBTyxJQUFJLENBQUNwSSxTQUFTLEdBQUcsSUFBSSxDQUFDQyxZQUFZO0lBQzdDO0VBQ0o7QUFDSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNyY0Q7QUFDQTtBQUNBO0FBQ0EsaUVBQWU7RUFDWEwsSUFBSUEsQ0FBQSxFQUFHO0lBQ0gsT0FBTztNQUNIeUksaUJBQWlCLEVBQUU7SUFDdkIsQ0FBQztFQUNMLENBQUM7RUFDREgsUUFBUSxFQUFFO0lBQ047QUFDUjtBQUNBO0FBQ0E7SUFDUUksV0FBV0EsQ0FBQSxFQUFHO01BQ1YsT0FBUSxJQUFJLENBQUN0SSxTQUFTLEdBQUdxSCxJQUFJLENBQUNDLEdBQUcsQ0FBQ3JHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDRyxXQUFXLENBQUMsQ0FBQyxFQUFFSCxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUNHLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDL0c7RUFDSixDQUFDO0VBQ0RtSCxLQUFLLEVBQUU7SUFDSHZJLFNBQVNBLENBQUEsRUFBRztNQUNSLElBQUksSUFBSSxDQUFDc0ksV0FBVyxFQUFFO1FBQ2xCLElBQUksSUFBSSxDQUFDRixXQUFXLEdBQUcsR0FBRyxFQUFFO1VBQ3hCLElBQUksQ0FBQ0MsaUJBQWlCLEdBQUcsS0FBSztRQUNsQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUNELFdBQVcsR0FBRyxDQUFDLEVBQUUsRUFBRTtVQUMvQixJQUFJLENBQUNDLGlCQUFpQixHQUFHLElBQUk7UUFDakM7TUFDSixDQUFDLE1BQU07UUFDSCxJQUFJLENBQUNBLGlCQUFpQixHQUFHLEtBQUs7TUFDbEM7SUFDSjtFQUNKO0FBQ0osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5QjRDO0FBQ3dCO0FBRXJFLGlFQUFlO0VBQ1hLLE1BQU0sRUFBRSxDQUFDRixrRUFBRyxFQUFFQyxrRkFBVyxDQUFDO0VBQzFCRSxFQUFFLEVBQUUsV0FBVztFQUNmL0ksSUFBSSxXQUFKQSxJQUFJQSxDQUFBLEVBQUc7SUFDSCxJQUFJc0UsTUFBSyxHQUFJO01BQ1RtRSxpQkFBaUIsRUFBRSxLQUFLO01BQ3hCTyxhQUFhLEVBQUUsQ0FBQztNQUNoQkMsTUFBTSxFQUFFM0gsTUFBTSxDQUFDNEg7SUFDbkIsQ0FBQztJQUNELElBQUk1SCxNQUFNLENBQUM2SCxtQkFBbUIsRUFBRTtNQUM1QnRELE1BQU0sQ0FBQ0MsTUFBTSxDQUFDeEIsTUFBTSxFQUFFaEQsTUFBTSxDQUFDNkgsbUJBQW1CLENBQUM7SUFDckQ7SUFDQSxPQUFPN0UsTUFBTTtFQUNqQixDQUFDO0VBQ0QzQixPQUFPLEVBQUU7SUFDTHZCLFlBQVksV0FBWkEsWUFBWUEsQ0FBQSxFQUFlO01BQUEsSUFBZGtFLE9BQU0sR0FBQThELFNBQUEsQ0FBQXZFLE1BQUEsUUFBQXVFLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUksQ0FBQyxDQUFDO0lBQ3pCO0VBQ0o7QUFDSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0QkQseUJBQXlCLEVBQUU7QUFDM0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsa0JBQWtCLG1CQUFtQjtBQUNyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekZPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsS0FBSyxJQUEwQztBQUMvQztBQUNBLEVBQUUsaUNBQU8sQ0FBQywyQ0FBUSxDQUFDLG9DQUFFLE9BQU87QUFBQTtBQUFBO0FBQUEsa0dBQUM7QUFDN0IsR0FBRyxLQUFLLEVBTU47QUFDRixDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwyREFBMkQ7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0TmtEO0FBQ1o7QUFDRzs7QUFFMUM7O0FBRUE7QUFDQSw2RkFBNkYsMkNBQTJDOztBQUV4STs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsZ0VBQWU7QUFDeEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFCQUFxQiwwREFBWTs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQiwwREFBWTs7QUFFaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCwyQ0FBMkMsSUFBSTtBQUMzRztBQUNBOztBQUVPO0FBQ1A7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LENBQUM7RUFFcEUvRCxDQUFDLENBQUMsMkJBQTJCLENBQUMsQ0FBQzJPLFNBQVMsQ0FBQyxDQUFDO0VBQzFDM08sQ0FBQyxDQUFDLHVFQUF1RSxDQUFDLENBQ3JFK0ssSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQ3pDcEIsS0FBSyxDQUFDLDBFQUEwRSxDQUFDO0VBQ3RGM0osQ0FBQyxDQUFDLDBJQUEwSSxDQUFDLENBQ3hJeUMsTUFBTSxDQUFDLDRFQUE0RSxDQUFDO0VBQ3pGekMsQ0FBQyxDQUFDLDRJQUE0SSxDQUFDLENBQzFJeUMsTUFBTSxDQUFDLHNGQUFzRixDQUFDO0VBQ25HekMsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMwRSxJQUFJLENBQUMsWUFBVztJQUFFMUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDK08sU0FBUyxDQUFDLENBQUM7RUFBQyxDQUFDLENBQUM7QUFDaEYsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vcmFhcy5jbXMvcmVzb3VyY2VzL2pzLnZ1ZTMvYXBwbGljYXRpb24vYXBwLnZ1ZS5qcyIsIndlYnBhY2s6Ly8vLi4vcmFhcy5jbXMvcmVzb3VyY2VzL2pzLnZ1ZTMvYXBwbGljYXRpb24vbWl4aW5zL2ZpeGVkLWhlYWRlci52dWUuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9hcHBsaWNhdGlvbi9hcHAudnVlIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kZWNvZGUtdXJpLWNvbXBvbmVudC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZmlsdGVyLW9iai9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanF1ZXJ5LnNjcm9sbHRvL2pxdWVyeS5zY3JvbGxUby5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcXVlcnktc3RyaW5nL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3F1ZXJ5LXN0cmluZy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3BsaXQtb24tZmlyc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9leHBvcnRIZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9hcHBsaWNhdGlvbi9hcHAudnVlPzlmODEiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9hcHBsaWNhdGlvbi9hcHAudnVlP2I0MGUiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMuYXV0b2NvbXBsZXRlci5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5maWxsLXNlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5nZXQtc2VsZWN0LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLmluaXQtaW5wdXRzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLm1lbnUtdHJlZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5xdWVyeS1zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMucmVwby5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy50cmVlLmpzIiwid2VicGFjazovLy9leHRlcm5hbCB2YXIgXCJqUXVlcnlcIiIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog0JrQsNGA0LrQsNGBINC/0YDQuNC70L7QttC10L3QuNGPXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBkYXRhKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQqNC40YDQuNC90LAg0Y3QutGA0LDQvdCwXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB3aW5kb3dXaWR0aDogMCxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQqNC40YDQuNC90LAgYm9keVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgYm9keVdpZHRoOiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCS0YvRgdC+0YLQsCDRjdC60YDQsNC90LBcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHdpbmRvd0hlaWdodDogMCxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQodC80LXRidC10L3QuNC1INC/0L4g0LLQtdGA0YLQuNC60LDQu9C4XHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzY3JvbGxUb3A6IDAsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0KHRgtCw0YDQvtC1INGB0LzQtdGJ0LXQvdC40LUg0L/QviDQstC10YDRgtC40LrQsNC70LhcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG9sZFNjcm9sbFRvcDogMCxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQn9GA0L7QuNGB0YXQvtC00LjRgiDQu9C4INGB0LXQudGH0LDRgSDRgdC60YDQvtC70LvQuNC90LNcclxuICAgICAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpc1Njcm9sbGluZ05vdzogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0J/RgNC+0LjRgdGF0L7QtNC40YIg0LvQuCDRgdC10LnRh9Cw0YEg0YHQutGA0L7Qu9C70LjQvdCzIChJRCMg0YLQsNC50LzQsNGD0YLQsClcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlzU2Nyb2xsaW5nTm93VGltZW91dElkOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQntC20LjQtNCw0L3QuNC1INC+0LrQvtC90YfQsNC90LjRjyDRgdC60YDQvtC70LvQuNC90LPQsCwg0LzRgVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaXNTY3JvbGxpbmdOb3dEZWxheTogMjUwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCf0L7Qs9GA0LXRiNC90L7RgdGC0Ywg0YHQutGA0L7Qu9C70LjQvdCz0LBcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjcm9sbGluZ0luYWNjdXJhY3k6IDUsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0KHQtdC70LXQutGC0L7RgCDRgdGB0YvQu9C+0Log0LTQu9GPIHNjcm9sbFRvXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzY3JvbGxUb1NlbGVjdG9yOiAnYVtocmVmKj1cIm1vZGFsXCJdW2hyZWYqPVwiI1wiXSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJ2Euc2Nyb2xsVG9baHJlZio9XCIjXCJdLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnYVtocmVmXj1cIiNcIl06bm90KFtocmVmPVwiI1wiXSk6bm90KFtkYXRhLXRvZ2dsZV0pOm5vdChbZGF0YS1icy10b2dnbGVdKSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJy5tZW51LXRvcF9fbGlua1tocmVmKj1cIiNcIl0sICcgKyBcclxuICAgICAgICAgICAgICAgICcubWVudS1tYWluX19saW5rW2hyZWYqPVwiI1wiXSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJy5tZW51LWJvdHRvbV9fbGlua1tocmVmKj1cIiNcIl0sICcgKyBcclxuICAgICAgICAgICAgICAgICcubWVudS1tb2JpbGVfX2xpbmtbaHJlZio9XCIjXCJdJyxcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCc0LXQtNC40LAt0YLQuNC/0YsgKNGI0LjRgNC40L3QsCDQsiBweClcclxuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1lZGlhVHlwZXM6IHtcclxuICAgICAgICAgICAgICAgIHh4bDogMTQwMCxcclxuICAgICAgICAgICAgICAgIHhsOiAxMjAwLFxyXG4gICAgICAgICAgICAgICAgbGc6IDk5MixcclxuICAgICAgICAgICAgICAgIG1kOiA3NjgsXHJcbiAgICAgICAgICAgICAgICBzbTogNTc2LFxyXG4gICAgICAgICAgICAgICAgeHM6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIG1vdW50ZWQoKSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubGlnaHRCb3hJbml0KCk7XHJcbiAgICAgICAgdGhpcy53aW5kb3dXaWR0aCA9ICQod2luZG93KS5pbm5lcldpZHRoKCk7XHJcbiAgICAgICAgdGhpcy53aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICB0aGlzLmJvZHlXaWR0aCA9ICQoJ2JvZHknKS5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgdGhpcy5maXhIdG1sKCk7XHJcbiAgICAgICAgJCh3aW5kb3cpXHJcbiAgICAgICAgICAgIC5vbigncmVzaXplJywgc2VsZi5maXhIdG1sKVxyXG4gICAgICAgICAgICAub24oJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2luZG93V2lkdGggPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keVdpZHRoID0gJCgnYm9keScpLm91dGVyV2lkdGgoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2xkU2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3A7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsaW5nTm93VGltZW91dElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmlzU2Nyb2xsaW5nTm93VGltZW91dElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1Njcm9sbGluZ05vdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmdOb3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1Njcm9sbGluZ05vd1RpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9sZFNjcm9sbFRvcCA9IG9sZFNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2Nyb2xsaW5nTm93VGltZW91dElkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2Nyb2xsaW5nTm93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmlzU2Nyb2xsaW5nTm93RGVsYXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zY3JvbGxUb1NlbGVjdG9yLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50VXJsID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgICAgICAgICAgbGV0IHVybCA9ICQodGhpcykuYXR0cignaHJlZicpLnNwbGl0KCcjJylbMF07XHJcbiAgICAgICAgICAgIC8vIGlmICh1cmwpIHtcclxuICAgICAgICAgICAgLy8gICAgIHVybCA9ICcjJyArIHVybDtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICBpZiAoIXVybCB8fCAodXJsID09IGN1cnJlbnRVcmwpKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnByb2Nlc3NIYXNoTGluayh0aGlzLmhhc2gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ3Nob3cuYnMudGFiJywgJ2EnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsICQodGhpcykuYXR0cignaHJlZicpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGFzaExpbmsod2luZG93LmxvY2F0aW9uLmhhc2gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxUb3AgPSB0aGlzLm9sZFNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgLy8gJCgnLm1lbnUtdHJpZ2dlcicpLmFwcGVuZFRvKCcuYm9keV9fbWVudS1tb2JpbGUnKTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5jb25maXJtID0gdGhpcy5yZWZzLmNvbmZpcm07XHJcbiAgICB9LFxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCe0YLQv9GA0LDQstC70Y/QtdGCINC30LDQv9GA0L7RgSDQuiBBUElcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHVybCBVUkwg0LTQu9GPINC+0YLQv9GA0LDQstC60LhcclxuICAgICAgICAgKiBAcGFyYW0gIHttaXhlZH0gcG9zdERhdGEgUE9TVC3QtNCw0L3QvdGL0LUg0LTQu9GPINC+0YLQv9GA0LDQstC60LggKNC10YHQu9C4IG51bGwsINGC0L4gR0VULdC30LDQv9GA0L7RgSlcclxuICAgICAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGJsb2NrSWQgSUQjINCx0LvQvtC60LAg0LTQu9GPINC00L7QsdCw0LLQu9C10L3QuNGPIEFKQVg9e2Jsb2NrSWR9INC4INC30LDQs9C+0LvQvtCy0LrQsCBYLVJBQVMtQmxvY2stSWRcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlc3BvbnNlVHlwZSBNSU1FLdGC0LjQvyDQv9C+0LvRg9GH0LDQtdC80L7Qs9C+INC+0YLQstC10YLQsCAo0LXRgdC70Lgg0L/RgNC40YHRg9GC0YHRgtCy0YPQtdGCINGB0LvRjdGIIC8sINGC0L4g0L7RgtC/0YDQsNCy0LvRj9C10YLRgdGPINGC0LDQutC20LUg0LfQsNCz0L7Qu9C+0LLQvtC6IEFjY2VwdClcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlcXVlc3RUeXBlIE1JTUUt0YLQuNC/INC30LDQv9GA0L7RgdCwICjQtdGB0LvQuCDQv9GA0LjRgdGD0YLRgdGC0LLRg9C10YIg0YHQu9GN0YggLywg0YLQviDQvtGC0L/RgNCw0LLQu9GP0LXRgtGB0Y8g0YLQsNC60LbQtSDQt9Cw0LPQvtC70L7QstC+0LogQ29udGVudC1UeXBlKVxyXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gYWRkaXRpb25hbEhlYWRlcnMg0JTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQt9Cw0LPQvtC70L7QstC60LhcclxuICAgICAgICAgKiBAcGFyYW0ge0Fib3J0Q29udHJvbGxlcnxudWxsfSBhYm9ydENvbnRyb2xsZXIg0JrQvtC90YLRgNC+0LvQu9C10YAg0L/RgNC10YDRi9Cy0LDQvdC40Y9cclxuICAgICAgICAgKiBAcmV0dXJuIHttaXhlZH0g0KDQtdC30YPQu9GM0YLQsNGCINC30LDQv9GA0L7RgdCwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYXN5bmMgYXBpKFxyXG4gICAgICAgICAgICB1cmwsIFxyXG4gICAgICAgICAgICBwb3N0RGF0YSA9IG51bGwsIFxyXG4gICAgICAgICAgICBibG9ja0lkID0gbnVsbCwgXHJcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZSA9ICdhcHBsaWNhdGlvbi9qc29uJywgXHJcbiAgICAgICAgICAgIHJlcXVlc3RUeXBlID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxIZWFkZXJzID0ge30sXHJcbiAgICAgICAgICAgIGFib3J0Q29udHJvbGxlciA9IG51bGwsXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIDIwMjMtMTEtMDksIEFWUzog0LTQvtCx0LDQstC40Lsg0LTQtdC70LXQvdC40LUg0L/QviAjLCDRgi7Qui4g0YXRjdGI0YLQtdCz0Lgg0LTQu9GPINGB0LXRgNCy0LXRgNCwINGB0LzRi9GB0LvQsCDQvdC1INC40LzQtdGO0YJcclxuICAgICAgICAgICAgbGV0IHJlYWxVcmwgPSB1cmwuc3BsaXQoJyMnKVswXTtcclxuICAgICAgICAgICAgaWYgKCEvXFwvXFwvL2dpLnRlc3QocmVhbFVybCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZWFsVXJsWzBdICE9ICcvJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxVcmwgPSAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyByZWFsVXJsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFsVXJsID0gJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgcmVhbFVybDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gey4uLmFkZGl0aW9uYWxIZWFkZXJzfTtcclxuICAgICAgICAgICAgbGV0IHJ4O1xyXG4gICAgICAgICAgICBpZiAoYmxvY2tJZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEvKFxcP3wmKUFKQVg9L2dpLnRlc3QocmVhbFVybCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFsVXJsICs9ICgvXFw/L2dpLnRlc3QocmVhbFVybCkgPyAnJicgOiAnPycpICsgJ0FKQVg9JyArIGJsb2NrSWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzWydYLVJBQVMtQmxvY2stSWQnXSA9IGJsb2NrSWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKC9cXC8vZ2kudGVzdChyZXNwb25zZVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzWydBY2NlcHQnXSA9IHJlc3BvbnNlVHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoL1xcLy9naS50ZXN0KHJlcXVlc3RUeXBlKSAmJiAhIXBvc3REYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHJlcXVlc3RUeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZldGNoT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChhYm9ydENvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSBhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghIXBvc3REYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMubWV0aG9kID0gJ1BPU1QnO1xyXG4gICAgICAgICAgICAgICAgaWYgKC9mb3JtL2dpLnRlc3QocmVxdWVzdFR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9tdWx0aXBhcnQvZ2kudGVzdChyZXF1ZXN0VHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZvcm1EYXRhICA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9zdERhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEgPSBwb3N0RGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcG9zdERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQobmFtZSwgcG9zdERhdGFbbmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5ib2R5ID0gZm9ybURhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBoZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8g0KLQsNC8INCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC4IGJvdW5kYXJ5INGB0YLQsNCy0LjRgtGB0Y8sINCx0LXQtyDQvdC10LPQviDRhNC40LPQvdGPINC/0L7Qu9GD0YfQsNC10YLRgdGPXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLmJvZHkgPSB3aW5kb3cucXVlcnlTdHJpbmcuc3RyaW5naWZ5KHBvc3REYXRhLCB7IGFycmF5Rm9ybWF0OiAnYnJhY2tldCcgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHBvc3REYXRhKSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMuYm9keSA9IHBvc3REYXRhO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLm1ldGhvZCA9ICdHRVQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZldGNoT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVhbFVybCwgZmV0Y2hPcHRpb25zKTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDtcclxuICAgICAgICAgICAgaWYgKC9qc29uL2dpLnRlc3QocmVzcG9uc2VUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J/QvtC70YPRh9Cw0LXRgiDRgdC80LXRidC10L3QuNC1INC/0L4g0LLQtdGA0YLQuNC60LDQu9C4INC00LvRjyBzY3JvbGxUbyBcclxuICAgICAgICAgKiAo0LTQu9GPINGB0LvRg9GH0LDRjyDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7QuSDRiNCw0L/QutC4KVxyXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZXN0WSDQotC+0YfQutCwINC90LDQt9C90LDRh9C10L3QuNGPXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFNjcm9sbE9mZnNldChkZXN0WSA9IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J/QvtC70YPRh9C10L3QuNC1INC+0LHRitC10LrRgtCwINC/0L4g0YXRjdGILdGC0LXQs9GDXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGhhc2gg0YXRjdGILdGC0LXQsyAo0L/QtdGA0LLRi9C5INGB0LjQvNCy0L7QuyAjKVxyXG4gICAgICAgICAqIEByZXR1cm4ge2pRdWVyeXxudWxsfSBudWxsLCDQtdGB0LvQuCDQvdC1INC90LDQudC00LXQvVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldE9iakZyb21IYXNoKGhhc2gpIHtcclxuICAgICAgICAgICAgaWYgKGhhc2hbMF0gIT0gJyMnKSB7XHJcbiAgICAgICAgICAgICAgICBoYXNoID0gJyMnICsgaGFzaDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgJG9iaiA9ICQoaGFzaCk7XHJcbiAgICAgICAgICAgIGlmICgkb2JqLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRvYmo7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICRvYmogPSAkKCdbbmFtZT1cIicgKyBoYXNoLnJlcGxhY2UoJyMnLCAnJykgKyAnXCJdJyk7XHJcbiAgICAgICAgICAgIGlmICgkb2JqLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRvYmo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7QsdGA0LDQsdCw0YLRi9Cy0LDQtdGCINGF0Y3RiC3RgdGB0YvQu9C60YNcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaGFzaCDRhdGN0Ygt0YLQtdCzICjQv9C10YDQstGL0Lkg0YHQuNC80LLQvtC7ICMpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvY2Vzc0hhc2hMaW5rKGhhc2gpIHtcclxuICAgICAgICAgICAgdGhpcy5qcUVtaXQoJ3Byb2Nlc3NIYXNoTGluaycsIGhhc2gpO1xyXG4gICAgICAgICAgICBsZXQgJG9iaiA9IHRoaXMuZ2V0T2JqRnJvbUhhc2goaGFzaCk7XHJcbiAgICAgICAgICAgIGlmICgkb2JqICYmICRvYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJG9iai5oYXNDbGFzcygnbW9kYWwnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRvYmoubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJG9iai5oYXNDbGFzcygndGFiLXBhbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCAkaGFzaExpbmsgPSAkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYVtocmVmPVwiJyArIGhhc2ggKyAnXCJdLCAnICsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhW2hyZWY9XCInICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCArIGhhc2ggKyAnXCJdLCAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FbaHJlZj1cIicgKyB3aW5kb3cubG9jYXRpb24uaHJlZiArICdcIl0nXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGhhc2hMaW5rLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaGFzaExpbmtbMF0uY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8oJG9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyBsaWdodEJveCfQsFxyXG4gICAgICAgICAqICjQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8gbGlnaHRDYXNlKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxpZ2h0Qm94SW5pdChvcHRpb25zID0ge30pIHtcclxuICAgICAgICAgICAgbGV0IGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc0FsbEltYWdlTGlua3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzd2lwZTogdHJ1ZSwgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnc2Nyb2xsSG9yaXpvbnRhbCcsXHJcbiAgICAgICAgICAgICAgICB0eXBlTWFwcGluZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICdpbWFnZSc6ICdqcGcsanBlZyxnaWYscG5nLGJtcCx3ZWJwLHN2ZycsIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKVxyXG4gICAgICAgICAgICBsZXQgcnggPSAvXFwuKGpwZ3xqcGVnfHBqcGVnfHBuZ3xnaWZ8d2VicHxzdmcpJC9pO1xyXG4gICAgICAgICAgICAkKCdhOm5vdChbZGF0YS1yZWxePWxpZ2h0Y2FzZV0pOm5vdChbZGF0YS1uby1saWdodGJveF0pJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLnByb2Nlc3NBbGxJbWFnZUxpbmtzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ4LnRlc3QoJCh0aGlzKS5hdHRyKCdocmVmJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignZGF0YS1saWdodGJveCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGcgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtbGlnaHRib3gtZ2FsbGVyeScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGcgfHwgJCh0aGlzKS5hdHRyKCdkYXRhLWxpZ2h0Ym94JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2RhdGEtcmVsJywgJ2xpZ2h0Y2FzZScgKyAoZyA/ICc6JyArIGcgOiAnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQXR0cignZGF0YS1saWdodGJveC1nYWxsZXJ5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdkYXRhLWxpZ2h0Ym94Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCdhW2RhdGEtcmVsXj1saWdodGNhc2VdJykubGlnaHRjYXNlKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2xpY2subGlnaHRjYXNlJywgJ2EnLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKC95b3V0dS9naS50ZXN0KCQodGhpcykuYXR0cignaHJlZicpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINCa0L7RgdGC0YvQu9GMLCDRh9GC0L7QsdGLINC90LUg0LTQvtC20LjQtNCw0YLRjNGB0Y8g0L/QvtC70L3QvtC5INC30LDQs9GA0YPQt9C60LggWW91dHViZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIDIwMjMtMDktMTMsIEFWUzog0LTQvtCx0LDQstC40LvQuCDQv9Cw0YDQsNC80LXRgtGAIHJhYXMtbGlnaHRjYXNlLWxvYWRlZCDRh9GC0L7QsdGLINC+0LHRgNCw0LHQsNGC0YvQstCw0YLRjCDQs9Cw0LvQtdGA0LXRjiDQstC40LTQtdC+XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludGVydmFsID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoJyNsaWdodGNhc2UtY2FzZSBpZnJhbWU6bm90KFtyYWFzLWxpZ2h0Y2FzZS1sb2FkZWRdKScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2xpZ2h0Y2FzZS1jYXNlIGlmcmFtZTpub3QoW3JhYXMtbGlnaHRjYXNlLWxvYWRlZF0pJykuYXR0cigncmFhcy1saWdodGNhc2UtbG9hZGVkJywgJzEnKS50cmlnZ2VyKCdsb2FkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0KTQuNC60YHQsNGG0LjRjyBIVE1MICjRhdC10LvQv9C10YAg0LTQu9GPINC80L7QtNC40YTQuNC60LDRhtC40Lgg0LLQtdGA0YHRgtC60LgpXHJcbiAgICAgICAgICogKNCw0LHRgdGC0YDQsNC60YLQvdGL0LksINC00LvRjyDQv9C10YDQtdC+0L/RgNC10LTQtdC70LXQvdC40Y8pXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZml4SHRtbCgpIHtcclxuICAgICAgICAgICAgLy8gLi4uXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC+0YLQvtCx0YDQsNC20LXQvdC40Y8g0L7QutC90LAg0L/QvtC00YLQstC10YDQttC00LXQvdC40Y9cclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRleHQgICAgICAg0KLQtdC60YHRgiDQt9Cw0L/RgNC+0YHQsFxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gb2tUZXh0ICAgICDQotC10LrRgdGCINC60L3QvtC/0LrQuCBcItCe0JpcIlxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gY2FuY2VsVGV4dCDQotC10LrRgdGCINC60L3QvtC/0LrQuCBcItCe0YLQvNC10L3QsFwiXHJcbiAgICAgICAgICogQHJldHVybiB7alF1ZXJ5LlByb21pc2V9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uZmlybSh0ZXh0LCBva1RleHQsIGNhbmNlbFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJHJlZnMuY29uZmlybS5jb25maXJtKHRleHQsIG9rVGV4dCwgY2FuY2VsVGV4dCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDRhtC10L3Ri1xyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcn0geCDQptC10L3QsFxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3JtYXRQcmljZShwcmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmZvcm1hdFByaWNlKHByaWNlKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INGH0LjRgdC70LjRgtC10LvRjNC90YvRhVxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcn0geCDQp9C40YHQu9C+XHJcbiAgICAgICAgICogQHBhcmFtICB7QXJyYXl9IGZvcm1zIDxwcmU+PGNvZGU+W1xyXG4gICAgICAgICAqICAgICAn0YLQvtCy0LDRgNC+0LInLCBcclxuICAgICAgICAgKiAgICAgJ9GC0L7QstCw0YAnLCBcclxuICAgICAgICAgKiAgICAgJ9GC0L7QstCw0YDQsCdcclxuICAgICAgICAgKiBdPC9jb2RlPjwvcHJlPiDQodC70L7QstC+0YTQvtGA0LzRi1xyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICBudW1UeHQoeCwgZm9ybXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5udW1UeHQoeCwgZm9ybXMpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCT0LXQvdC10YDQuNGA0YPQtdGCIGpRdWVyeS3RgdC+0LHRi9GC0LjQtSDRg9GA0L7QstC90Y8g0LTQvtC60YPQvNC10L3RgtCwXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICAgKiBAcGFyYW0ge21peGVkfSBkYXRhINCU0LDQvdC90YvQtSDQtNC70Y8g0L/QtdGA0LXQtNCw0YfQuFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGpxRW1pdChldmVudE5hbWUsIGRhdGEgPSBudWxsLCBvcmlnaW5hbEV2ZW50ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gJChkb2N1bWVudCkudHJpZ2dlcihldmVudE5hbWUsIGRhdGEpO1xyXG4gICAgICAgICAgICB9LCAxMCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0KHQutGA0L7Qu9C70LjRgiDQv9C+INCy0LXRgNGC0LjQutCw0LvQuCDQuiDQt9Cw0LTQsNC90L3QvtC80YMg0L7QsdGK0LXQutGC0YMv0L/QvtC30LjRhtC40LhcclxuICAgICAgICAgKiBAcGFyYW0gIHtOdW1iZXJ8SFRNTEVsZW1lbnR8alF1ZXJ5fSBkZXN0aW5hdGlvbiDQndCw0LfQvdCw0YfQtdC90LjQtSAo0YLQvtGH0LXQuiDQv9C+IFksINC70LjQsdC+INGN0LvQtdC80LXQvdGCKVxyXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5zdGFudCDQndC10LzQtdC00LvQtdC90L3Ri9C5INGB0LrRgNC+0LvQuyAo0L/Qu9Cw0LLQvdGL0LksINC10YHQu9C4IGZhbHNlKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNjcm9sbFRvKGRlc3RpbmF0aW9uLCBpbnN0YW50ID0gZmFsc2UpIHtcclxuICAgICAgICAgICAgbGV0IGRlc3RZID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZihkZXN0aW5hdGlvbikgPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RZID0gZGVzdGluYXRpb247XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGRlc3RpbmF0aW9uKSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb24gPSAkKGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGRlc3RZID0gZGVzdGluYXRpb24ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlc3RpbmF0aW9uIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RZID0gJChkZXN0aW5hdGlvbikub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlc3RpbmF0aW9uIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0WSA9IGRlc3RpbmF0aW9uLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGVzdFkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRlc3RZKVxyXG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQoZGVzdFkgKyB0aGlzLmdldFNjcm9sbE9mZnNldChkZXN0WSkpKTtcclxuICAgICAgICAgICAgICAgIHRvcCA9IE1hdGgubWluKHRvcCwgJCgnLmJvZHknKS5vdXRlckhlaWdodCgpIC0gdGhpcy53aW5kb3dIZWlnaHQgLSAxKTsgLy8gMjAyNC0wMS0xNSwgQVZTOiDQn9C+0L/RgNCw0LLQutCwINC90LAg0L3QuNC20L3QuNC5INC60YDQsNC5INC00L7QutGD0LzQtdC90YLQsFxyXG4gICAgICAgICAgICAgICAgbGV0IHNjcm9sbFRvRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLCBcclxuICAgICAgICAgICAgICAgICAgICB0b3AsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6IGluc3RhbnQgPyAnaW5zdGFudCcgOiAnc21vb3RoJyxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxUb0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHNjcm9sbFRvRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAvLyAyMDIzLTA5LTE5LCBBVlM6INGB0LTQtdC70LDQtdC8INC30LDRidC40YLRgyDRgdC60YDQvtC70LvQuNC90LPQsFxyXG4gICAgICAgICAgICAgICAgaWYgKCFpbnN0YW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3RlY3RTY3JvbGxpbmcgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBib2R5T3V0ZXJIZWlnaHQgPSBwYXJzZUludCgkKCcuYm9keScpLm91dGVySGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoTWF0aC5hYnMoTWF0aC5yb3VuZCh0aGlzLnNjcm9sbFRvcCkgLSBNYXRoLnJvdW5kKHNjcm9sbFRvRGF0YS50b3ApKSA8IHRoaXMuc2Nyb2xsaW5nSW5hY2N1cmFjeSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2Nyb2xsVG9EYXRhLnRvcCA+IHRoaXMuc2Nyb2xsVG9wKSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5zY3JvbGxUb3AgKyB0aGlzLndpbmRvd0hlaWdodCA+PSBib2R5T3V0ZXJIZWlnaHQgLSB0aGlzLnNjcm9sbGluZ0luYWNjdXJhY3kpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHx8IC8vINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8LCDQtdGB0LvQuCDQtNCy0LjQttC10LzRgdGPINCy0L3QuNC3LCDQvdC+INC00L7RgdGC0LjQs9C70Lgg0L3QuNC30LAg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzY3JvbGxUb0RhdGEudG9wIDwgdGhpcy5zY3JvbGxUb3ApICYmIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLnNjcm9sbFRvcCA8PSB0aGlzLnNjcm9sbGluZ0luYWNjdXJhY3kpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIC8vINCe0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8LCDQtdGB0LvQuCDQtNCy0LjQttC10LzRgdGPINCy0LLQtdGA0YUsINC90L4g0LTQvtGB0YLQuNCz0LvQuCDQstC10YDRhdCwINGB0YLRgNCw0L3QuNGG0YtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RvcCBzY3JvbGxpbmcgdG8gJyArIHNjcm9sbFRvRGF0YS50b3AgKyAnIG9uICcgKyB0aGlzLnNjcm9sbFRvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChwcm90ZWN0U2Nyb2xsaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3RlY3RTY3JvbGxpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2Nyb2xsaW5nTm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oc2Nyb2xsVG9EYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb250aW51ZSBzY3JvbGxpbmcgZnJvbSAnICsgdGhpcy5zY3JvbGxUb3AgKyAnIHRvICcgKyBzY3JvbGxUb0RhdGEudG9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRoaXMuaXNTY3JvbGxpbmdOb3dEZWxheSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICQuc2Nyb2xsVG8oc2Nyb2xsVG9EYXRhLnRvcCwgaW5zdGFudCA/IHRoaXMuaXNTY3JvbGxpbmdOb3dEZWxheSA6IDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCa0L7QvtGA0LTQuNC90LDRgtGLINC90LjQttC90LXQuSDQs9GA0LDQvdC40YbRiyDQvtC60L3QsFxyXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHdpbmRvd0JvdHRvbVBvc2l0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY3JvbGxUb3AgKyB0aGlzLndpbmRvd0hlaWdodDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCf0L7RgdC70LXQtNC90LXQtSDRgdC80LXRidC10L3QuNC1INC/0L4g0YHQutGA0L7Qu9C70LjQvdCz0YNcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2Nyb2xsRGVsdGEoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcm9sbFRvcCAtIHRoaXMub2xkU2Nyb2xsVG9wO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG59IiwiLyoqXHJcbiAqINCk0LjQutGB0LjRgNC+0LLQsNC90L3QvtC1INC80LXQvdGOXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBkYXRhKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZpeGVkSGVhZGVyQWN0aXZlOiBmYWxzZSxcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0KTQuNC60YHQuNGA0L7QstCw0L3QvdCw0Y8g0LvQuCDRiNCw0L/QutCwXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmaXhlZEhlYWRlcigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNjcm9sbFRvcCA+IE1hdGgubWF4KCQoJy5ib2R5X19oZWFkZXItb3V0ZXInKS5vdXRlckhlaWdodCgpLCAkKCcuYm9keV9faGVhZGVyJykub3V0ZXJIZWlnaHQoKSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgICBzY3JvbGxUb3AoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpeGVkSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxEZWx0YSA+IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZml4ZWRIZWFkZXJBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zY3JvbGxEZWx0YSA8IC02MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZml4ZWRIZWFkZXJBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXhlZEhlYWRlckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH1cclxufSIsIjxzY3JpcHQ+XHJcbmltcG9ydCBBcHAgZnJvbSAnY21zL2FwcGxpY2F0aW9uL2FwcC52dWUuanMnO1xyXG5pbXBvcnQgRml4ZWRIZWFkZXIgZnJvbSAnY21zL2FwcGxpY2F0aW9uL21peGlucy9maXhlZC1oZWFkZXIudnVlLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1peGluczogW0FwcCwgRml4ZWRIZWFkZXJdLFxyXG4gICAgZWw6ICcjcmFhcy1hcHAnLFxyXG4gICAgZGF0YSgpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICBmaXhlZEhlYWRlckFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGxhc3RTY3JvbGxUb3A6IDAsXHJcbiAgICAgICAgICAgIGNvbmZpZzogd2luZG93LnJhYXNDb25maWcsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAod2luZG93LnJhYXNBcHBsaWNhdGlvbkRhdGEpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihyZXN1bHQsIHdpbmRvdy5yYWFzQXBwbGljYXRpb25EYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgbGlnaHRCb3hJbml0KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuPC9zY3JpcHQ+IiwiY29uc3QgdG9rZW4gPSAnJVthLWYwLTldezJ9JztcbmNvbnN0IHNpbmdsZU1hdGNoZXIgPSBuZXcgUmVnRXhwKCcoJyArIHRva2VuICsgJyl8KFteJV0rPyknLCAnZ2knKTtcbmNvbnN0IG11bHRpTWF0Y2hlciA9IG5ldyBSZWdFeHAoJygnICsgdG9rZW4gKyAnKSsnLCAnZ2knKTtcblxuZnVuY3Rpb24gZGVjb2RlQ29tcG9uZW50cyhjb21wb25lbnRzLCBzcGxpdCkge1xuXHR0cnkge1xuXHRcdC8vIFRyeSB0byBkZWNvZGUgdGhlIGVudGlyZSBzdHJpbmcgZmlyc3Rcblx0XHRyZXR1cm4gW2RlY29kZVVSSUNvbXBvbmVudChjb21wb25lbnRzLmpvaW4oJycpKV07XG5cdH0gY2F0Y2gge1xuXHRcdC8vIERvIG5vdGhpbmdcblx0fVxuXG5cdGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9XG5cblx0c3BsaXQgPSBzcGxpdCB8fCAxO1xuXG5cdC8vIFNwbGl0IHRoZSBhcnJheSBpbiAyIHBhcnRzXG5cdGNvbnN0IGxlZnQgPSBjb21wb25lbnRzLnNsaWNlKDAsIHNwbGl0KTtcblx0Y29uc3QgcmlnaHQgPSBjb21wb25lbnRzLnNsaWNlKHNwbGl0KTtcblxuXHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5jYWxsKFtdLCBkZWNvZGVDb21wb25lbnRzKGxlZnQpLCBkZWNvZGVDb21wb25lbnRzKHJpZ2h0KSk7XG59XG5cbmZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuXHR0cnkge1xuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoaW5wdXQpO1xuXHR9IGNhdGNoIHtcblx0XHRsZXQgdG9rZW5zID0gaW5wdXQubWF0Y2goc2luZ2xlTWF0Y2hlcikgfHwgW107XG5cblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aW5wdXQgPSBkZWNvZGVDb21wb25lbnRzKHRva2VucywgaSkuam9pbignJyk7XG5cblx0XHRcdHRva2VucyA9IGlucHV0Lm1hdGNoKHNpbmdsZU1hdGNoZXIpIHx8IFtdO1xuXHRcdH1cblxuXHRcdHJldHVybiBpbnB1dDtcblx0fVxufVxuXG5mdW5jdGlvbiBjdXN0b21EZWNvZGVVUklDb21wb25lbnQoaW5wdXQpIHtcblx0Ly8gS2VlcCB0cmFjayBvZiBhbGwgdGhlIHJlcGxhY2VtZW50cyBhbmQgcHJlZmlsbCB0aGUgbWFwIHdpdGggdGhlIGBCT01gXG5cdGNvbnN0IHJlcGxhY2VNYXAgPSB7XG5cdFx0JyVGRSVGRic6ICdcXHVGRkZEXFx1RkZGRCcsXG5cdFx0JyVGRiVGRSc6ICdcXHVGRkZEXFx1RkZGRCcsXG5cdH07XG5cblx0bGV0IG1hdGNoID0gbXVsdGlNYXRjaGVyLmV4ZWMoaW5wdXQpO1xuXHR3aGlsZSAobWF0Y2gpIHtcblx0XHR0cnkge1xuXHRcdFx0Ly8gRGVjb2RlIGFzIGJpZyBjaHVua3MgYXMgcG9zc2libGVcblx0XHRcdHJlcGxhY2VNYXBbbWF0Y2hbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzBdKTtcblx0XHR9IGNhdGNoIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGRlY29kZShtYXRjaFswXSk7XG5cblx0XHRcdGlmIChyZXN1bHQgIT09IG1hdGNoWzBdKSB7XG5cdFx0XHRcdHJlcGxhY2VNYXBbbWF0Y2hbMF1dID0gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG1hdGNoID0gbXVsdGlNYXRjaGVyLmV4ZWMoaW5wdXQpO1xuXHR9XG5cblx0Ly8gQWRkIGAlQzJgIGF0IHRoZSBlbmQgb2YgdGhlIG1hcCB0byBtYWtlIHN1cmUgaXQgZG9lcyBub3QgcmVwbGFjZSB0aGUgY29tYmluYXRvciBiZWZvcmUgZXZlcnl0aGluZyBlbHNlXG5cdHJlcGxhY2VNYXBbJyVDMiddID0gJ1xcdUZGRkQnO1xuXG5cdGNvbnN0IGVudHJpZXMgPSBPYmplY3Qua2V5cyhyZXBsYWNlTWFwKTtcblxuXHRmb3IgKGNvbnN0IGtleSBvZiBlbnRyaWVzKSB7XG5cdFx0Ly8gUmVwbGFjZSBhbGwgZGVjb2RlZCBjb21wb25lbnRzXG5cdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoa2V5LCAnZycpLCByZXBsYWNlTWFwW2tleV0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWNvZGVVcmlDb21wb25lbnQoZW5jb2RlZFVSSSkge1xuXHRpZiAodHlwZW9mIGVuY29kZWRVUkkgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYGVuY29kZWRVUklgIHRvIGJlIG9mIHR5cGUgYHN0cmluZ2AsIGdvdCBgJyArIHR5cGVvZiBlbmNvZGVkVVJJICsgJ2AnKTtcblx0fVxuXG5cdHRyeSB7XG5cdFx0Ly8gVHJ5IHRoZSBidWlsdCBpbiBkZWNvZGVyIGZpcnN0XG5cdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkVVJJKTtcblx0fSBjYXRjaCB7XG5cdFx0Ly8gRmFsbGJhY2sgdG8gYSBtb3JlIGFkdmFuY2VkIGRlY29kZXJcblx0XHRyZXR1cm4gY3VzdG9tRGVjb2RlVVJJQ29tcG9uZW50KGVuY29kZWRVUkkpO1xuXHR9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaW5jbHVkZUtleXMob2JqZWN0LCBwcmVkaWNhdGUpIHtcblx0Y29uc3QgcmVzdWx0ID0ge307XG5cblx0aWYgKEFycmF5LmlzQXJyYXkocHJlZGljYXRlKSkge1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIHByZWRpY2F0ZSkge1xuXHRcdFx0Y29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuXHRcdFx0aWYgKGRlc2NyaXB0b3I/LmVudW1lcmFibGUpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjcmlwdG9yKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gYFJlZmxlY3Qub3duS2V5cygpYCBpcyByZXF1aXJlZCB0byByZXRyaWV2ZSBzeW1ib2wgcHJvcGVydGllc1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhvYmplY3QpKSB7XG5cdFx0XHRjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG5cdFx0XHRpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG5cdFx0XHRcdGlmIChwcmVkaWNhdGUoa2V5LCB2YWx1ZSwgb2JqZWN0KSkge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzY3JpcHRvcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhjbHVkZUtleXMob2JqZWN0LCBwcmVkaWNhdGUpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkocHJlZGljYXRlKSkge1xuXHRcdGNvbnN0IHNldCA9IG5ldyBTZXQocHJlZGljYXRlKTtcblx0XHRyZXR1cm4gaW5jbHVkZUtleXMob2JqZWN0LCBrZXkgPT4gIXNldC5oYXMoa2V5KSk7XG5cdH1cblxuXHRyZXR1cm4gaW5jbHVkZUtleXMob2JqZWN0LCAoa2V5LCB2YWx1ZSwgb2JqZWN0KSA9PiAhcHJlZGljYXRlKGtleSwgdmFsdWUsIG9iamVjdCkpO1xufVxuIiwiLyohXG4gKiBqUXVlcnkuc2Nyb2xsVG9cbiAqIENvcHlyaWdodCAoYykgMjAwNyBBcmllbCBGbGVzbGVyIC0gYWZsZXNsZXIg4peLIGdtYWlsIOKAoiBjb20gfCBodHRwczovL2dpdGh1Yi5jb20vZmxlc2xlclxuICogTGljZW5zZWQgdW5kZXIgTUlUXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmxlc2xlci9qcXVlcnkuc2Nyb2xsVG9cbiAqIEBwcm9qZWN0RGVzY3JpcHRpb24gTGlnaHR3ZWlnaHQsIGNyb3NzLWJyb3dzZXIgYW5kIGhpZ2hseSBjdXN0b21pemFibGUgYW5pbWF0ZWQgc2Nyb2xsaW5nIHdpdGggalF1ZXJ5XG4gKiBAYXV0aG9yIEFyaWVsIEZsZXNsZXJcbiAqIEB2ZXJzaW9uIDIuMS4zXG4gKi9cbjsoZnVuY3Rpb24oZmFjdG9yeSkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gR2xvYmFsXG5cdFx0ZmFjdG9yeShqUXVlcnkpO1xuXHR9XG59KShmdW5jdGlvbigkKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgJHNjcm9sbFRvID0gJC5zY3JvbGxUbyA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHNldHRpbmdzKSB7XG5cdFx0cmV0dXJuICQod2luZG93KS5zY3JvbGxUbyh0YXJnZXQsIGR1cmF0aW9uLCBzZXR0aW5ncyk7XG5cdH07XG5cblx0JHNjcm9sbFRvLmRlZmF1bHRzID0ge1xuXHRcdGF4aXM6J3h5Jyxcblx0XHRkdXJhdGlvbjogMCxcblx0XHRsaW1pdDp0cnVlXG5cdH07XG5cblx0ZnVuY3Rpb24gaXNXaW4oZWxlbSkge1xuXHRcdHJldHVybiAhZWxlbS5ub2RlTmFtZSB8fFxuXHRcdFx0JC5pbkFycmF5KGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSwgWydpZnJhbWUnLCcjZG9jdW1lbnQnLCdodG1sJywnYm9keSddKSAhPT0gLTE7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuXHRcdC8vIEJyb3VnaHQgZnJvbSBqUXVlcnkgc2luY2UgaXQncyBkZXByZWNhdGVkXG5cdFx0cmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbidcblx0fVxuXG5cdCQuZm4uc2Nyb2xsVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBzZXR0aW5ncykge1xuXHRcdGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRzZXR0aW5ncyA9IGR1cmF0aW9uO1xuXHRcdFx0ZHVyYXRpb24gPSAwO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHNldHRpbmdzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRzZXR0aW5ncyA9IHsgb25BZnRlcjpzZXR0aW5ncyB9O1xuXHRcdH1cblx0XHRpZiAodGFyZ2V0ID09PSAnbWF4Jykge1xuXHRcdFx0dGFyZ2V0ID0gOWU5O1xuXHRcdH1cblxuXHRcdHNldHRpbmdzID0gJC5leHRlbmQoe30sICRzY3JvbGxUby5kZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRcdC8vIFNwZWVkIGlzIHN0aWxsIHJlY29nbml6ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5cdFx0ZHVyYXRpb24gPSBkdXJhdGlvbiB8fCBzZXR0aW5ncy5kdXJhdGlvbjtcblx0XHQvLyBNYWtlIHN1cmUgdGhlIHNldHRpbmdzIGFyZSBnaXZlbiByaWdodFxuXHRcdHZhciBxdWV1ZSA9IHNldHRpbmdzLnF1ZXVlICYmIHNldHRpbmdzLmF4aXMubGVuZ3RoID4gMTtcblx0XHRpZiAocXVldWUpIHtcblx0XHRcdC8vIExldCdzIGtlZXAgdGhlIG92ZXJhbGwgZHVyYXRpb25cblx0XHRcdGR1cmF0aW9uIC89IDI7XG5cdFx0fVxuXHRcdHNldHRpbmdzLm9mZnNldCA9IGJvdGgoc2V0dGluZ3Mub2Zmc2V0KTtcblx0XHRzZXR0aW5ncy5vdmVyID0gYm90aChzZXR0aW5ncy5vdmVyKTtcblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBOdWxsIHRhcmdldCB5aWVsZHMgbm90aGluZywganVzdCBsaWtlIGpRdWVyeSBkb2VzXG5cdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSByZXR1cm47XG5cblx0XHRcdHZhciB3aW4gPSBpc1dpbih0aGlzKSxcblx0XHRcdFx0ZWxlbSA9IHdpbiA/IHRoaXMuY29udGVudFdpbmRvdyB8fCB3aW5kb3cgOiB0aGlzLFxuXHRcdFx0XHQkZWxlbSA9ICQoZWxlbSksXG5cdFx0XHRcdHRhcmcgPSB0YXJnZXQsXG5cdFx0XHRcdGF0dHIgPSB7fSxcblx0XHRcdFx0dG9mZjtcblxuXHRcdFx0c3dpdGNoICh0eXBlb2YgdGFyZykge1xuXHRcdFx0XHQvLyBBIG51bWJlciB3aWxsIHBhc3MgdGhlIHJlZ2V4XG5cdFx0XHRcdGNhc2UgJ251bWJlcic6XG5cdFx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdFx0aWYgKC9eKFsrLV09Pyk/XFxkKyhcXC5cXGQrKT8ocHh8JSk/JC8udGVzdCh0YXJnKSkge1xuXHRcdFx0XHRcdFx0dGFyZyA9IGJvdGgodGFyZyk7XG5cdFx0XHRcdFx0XHQvLyBXZSBhcmUgZG9uZVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIFJlbGF0aXZlL0Fic29sdXRlIHNlbGVjdG9yXG5cdFx0XHRcdFx0dGFyZyA9IHdpbiA/ICQodGFyZykgOiAkKHRhcmcsIGVsZW0pO1xuXHRcdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdFx0Y2FzZSAnb2JqZWN0Jzpcblx0XHRcdFx0XHRpZiAodGFyZy5sZW5ndGggPT09IDApIHJldHVybjtcblx0XHRcdFx0XHQvLyBET01FbGVtZW50IC8galF1ZXJ5XG5cdFx0XHRcdFx0aWYgKHRhcmcuaXMgfHwgdGFyZy5zdHlsZSkge1xuXHRcdFx0XHRcdFx0Ly8gR2V0IHRoZSByZWFsIHBvc2l0aW9uIG9mIHRoZSB0YXJnZXRcblx0XHRcdFx0XHRcdHRvZmYgPSAodGFyZyA9ICQodGFyZykpLm9mZnNldCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIG9mZnNldCA9IGlzRnVuY3Rpb24oc2V0dGluZ3Mub2Zmc2V0KSAmJiBzZXR0aW5ncy5vZmZzZXQoZWxlbSwgdGFyZykgfHwgc2V0dGluZ3Mub2Zmc2V0O1xuXG5cdFx0XHQkLmVhY2goc2V0dGluZ3MuYXhpcy5zcGxpdCgnJyksIGZ1bmN0aW9uKGksIGF4aXMpIHtcblx0XHRcdFx0dmFyIFBvc1x0PSBheGlzID09PSAneCcgPyAnTGVmdCcgOiAnVG9wJyxcblx0XHRcdFx0XHRwb3MgPSBQb3MudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRrZXkgPSAnc2Nyb2xsJyArIFBvcyxcblx0XHRcdFx0XHRwcmV2ID0gJGVsZW1ba2V5XSgpLFxuXHRcdFx0XHRcdG1heCA9ICRzY3JvbGxUby5tYXgoZWxlbSwgYXhpcyk7XG5cblx0XHRcdFx0aWYgKHRvZmYpIHsvLyBqUXVlcnkgLyBET01FbGVtZW50XG5cdFx0XHRcdFx0YXR0cltrZXldID0gdG9mZltwb3NdICsgKHdpbiA/IDAgOiBwcmV2IC0gJGVsZW0ub2Zmc2V0KClbcG9zXSk7XG5cblx0XHRcdFx0XHQvLyBJZiBpdCdzIGEgZG9tIGVsZW1lbnQsIHJlZHVjZSB0aGUgbWFyZ2luXG5cdFx0XHRcdFx0aWYgKHNldHRpbmdzLm1hcmdpbikge1xuXHRcdFx0XHRcdFx0YXR0cltrZXldIC09IHBhcnNlSW50KHRhcmcuY3NzKCdtYXJnaW4nK1BvcyksIDEwKSB8fCAwO1xuXHRcdFx0XHRcdFx0YXR0cltrZXldIC09IHBhcnNlSW50KHRhcmcuY3NzKCdib3JkZXInK1BvcysnV2lkdGgnKSwgMTApIHx8IDA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YXR0cltrZXldICs9IG9mZnNldFtwb3NdIHx8IDA7XG5cblx0XHRcdFx0XHRpZiAoc2V0dGluZ3Mub3Zlcltwb3NdKSB7XG5cdFx0XHRcdFx0XHQvLyBTY3JvbGwgdG8gYSBmcmFjdGlvbiBvZiBpdHMgd2lkdGgvaGVpZ2h0XG5cdFx0XHRcdFx0XHRhdHRyW2tleV0gKz0gdGFyZ1theGlzID09PSAneCc/J3dpZHRoJzonaGVpZ2h0J10oKSAqIHNldHRpbmdzLm92ZXJbcG9zXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHZhbCA9IHRhcmdbcG9zXTtcblx0XHRcdFx0XHQvLyBIYW5kbGUgcGVyY2VudGFnZSB2YWx1ZXNcblx0XHRcdFx0XHRhdHRyW2tleV0gPSB2YWwuc2xpY2UgJiYgdmFsLnNsaWNlKC0xKSA9PT0gJyUnID9cblx0XHRcdFx0XHRcdHBhcnNlRmxvYXQodmFsKSAvIDEwMCAqIG1heFxuXHRcdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBOdW1iZXIgb3IgJ251bWJlcidcblx0XHRcdFx0aWYgKHNldHRpbmdzLmxpbWl0ICYmIC9eXFxkKyQvLnRlc3QoYXR0cltrZXldKSkge1xuXHRcdFx0XHRcdC8vIENoZWNrIHRoZSBsaW1pdHNcblx0XHRcdFx0XHRhdHRyW2tleV0gPSBhdHRyW2tleV0gPD0gMCA/IDAgOiBNYXRoLm1pbihhdHRyW2tleV0sIG1heCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEb24ndCB3YXN0ZSB0aW1lIGFuaW1hdGluZywgaWYgdGhlcmUncyBubyBuZWVkLlxuXHRcdFx0XHRpZiAoIWkgJiYgc2V0dGluZ3MuYXhpcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0aWYgKHByZXYgPT09IGF0dHJba2V5XSkge1xuXHRcdFx0XHRcdFx0Ly8gTm8gYW5pbWF0aW9uIG5lZWRlZFxuXHRcdFx0XHRcdFx0YXR0ciA9IHt9O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocXVldWUpIHtcblx0XHRcdFx0XHRcdC8vIEludGVybWVkaWF0ZSBhbmltYXRpb25cblx0XHRcdFx0XHRcdGFuaW1hdGUoc2V0dGluZ3Mub25BZnRlckZpcnN0KTtcblx0XHRcdFx0XHRcdC8vIERvbid0IGFuaW1hdGUgdGhpcyBheGlzIGFnYWluIGluIHRoZSBuZXh0IGl0ZXJhdGlvbi5cblx0XHRcdFx0XHRcdGF0dHIgPSB7fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRhbmltYXRlKHNldHRpbmdzLm9uQWZ0ZXIpO1xuXG5cdFx0XHRmdW5jdGlvbiBhbmltYXRlKGNhbGxiYWNrKSB7XG5cdFx0XHRcdHZhciBvcHRzID0gJC5leHRlbmQoe30sIHNldHRpbmdzLCB7XG5cdFx0XHRcdFx0Ly8gVGhlIHF1ZXVlIHNldHRpbmcgY29uZmxpY3RzIHdpdGggYW5pbWF0ZSgpXG5cdFx0XHRcdFx0Ly8gRm9yY2UgaXQgdG8gYWx3YXlzIGJlIHRydWVcblx0XHRcdFx0XHRxdWV1ZTogdHJ1ZSxcblx0XHRcdFx0XHRkdXJhdGlvbjogZHVyYXRpb24sXG5cdFx0XHRcdFx0Y29tcGxldGU6IGNhbGxiYWNrICYmIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChlbGVtLCB0YXJnLCBzZXR0aW5ncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JGVsZW0uYW5pbWF0ZShhdHRyLCBvcHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHQvLyBNYXggc2Nyb2xsaW5nIHBvc2l0aW9uLCB3b3JrcyBvbiBxdWlya3MgbW9kZVxuXHQvLyBJdCBvbmx5IGZhaWxzIChub3QgdG9vIGJhZGx5KSBvbiBJRSwgcXVpcmtzIG1vZGUuXG5cdCRzY3JvbGxUby5tYXggPSBmdW5jdGlvbihlbGVtLCBheGlzKSB7XG5cdFx0dmFyIERpbSA9IGF4aXMgPT09ICd4JyA/ICdXaWR0aCcgOiAnSGVpZ2h0Jyxcblx0XHRcdHNjcm9sbCA9ICdzY3JvbGwnK0RpbTtcblxuXHRcdGlmICghaXNXaW4oZWxlbSkpXG5cdFx0XHRyZXR1cm4gZWxlbVtzY3JvbGxdIC0gJChlbGVtKVtEaW0udG9Mb3dlckNhc2UoKV0oKTtcblxuXHRcdHZhciBzaXplID0gJ2NsaWVudCcgKyBEaW0sXG5cdFx0XHRkb2MgPSBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbS5kb2N1bWVudCxcblx0XHRcdGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50LFxuXHRcdFx0Ym9keSA9IGRvYy5ib2R5O1xuXG5cdFx0cmV0dXJuIE1hdGgubWF4KGh0bWxbc2Nyb2xsXSwgYm9keVtzY3JvbGxdKSAtIE1hdGgubWluKGh0bWxbc2l6ZV0sIGJvZHlbc2l6ZV0pO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGJvdGgodmFsKSB7XG5cdFx0cmV0dXJuIGlzRnVuY3Rpb24odmFsKSB8fCAkLmlzUGxhaW5PYmplY3QodmFsKSA/IHZhbCA6IHsgdG9wOnZhbCwgbGVmdDp2YWwgfTtcblx0fVxuXG5cdC8vIEFkZCBzcGVjaWFsIGhvb2tzIHNvIHRoYXQgd2luZG93IHNjcm9sbCBwcm9wZXJ0aWVzIGNhbiBiZSBhbmltYXRlZFxuXHQkLlR3ZWVuLnByb3BIb29rcy5zY3JvbGxMZWZ0ID1cblx0JC5Ud2Vlbi5wcm9wSG9va3Muc2Nyb2xsVG9wID0ge1xuXHRcdGdldDogZnVuY3Rpb24odCkge1xuXHRcdFx0cmV0dXJuICQodC5lbGVtKVt0LnByb3BdKCk7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRcdHZhciBjdXJyID0gdGhpcy5nZXQodCk7XG5cdFx0XHQvLyBJZiBpbnRlcnJ1cHQgaXMgdHJ1ZSBhbmQgdXNlciBzY3JvbGxlZCwgc3RvcCBhbmltYXRpbmdcblx0XHRcdGlmICh0Lm9wdGlvbnMuaW50ZXJydXB0ICYmIHQuX2xhc3QgJiYgdC5fbGFzdCAhPT0gY3Vycikge1xuXHRcdFx0XHRyZXR1cm4gJCh0LmVsZW0pLnN0b3AoKTtcblx0XHRcdH1cblx0XHRcdHZhciBuZXh0ID0gTWF0aC5yb3VuZCh0Lm5vdyk7XG5cdFx0XHQvLyBEb24ndCB3YXN0ZSBDUFVcblx0XHRcdC8vIEJyb3dzZXJzIGRvbid0IHJlbmRlciBmbG9hdGluZyBwb2ludCBzY3JvbGxcblx0XHRcdGlmIChjdXJyICE9PSBuZXh0KSB7XG5cdFx0XHRcdCQodC5lbGVtKVt0LnByb3BdKG5leHQpO1xuXHRcdFx0XHR0Ll9sYXN0ID0gdGhpcy5nZXQodCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEFNRCByZXF1aXJlbWVudFxuXHRyZXR1cm4gJHNjcm9sbFRvO1xufSk7XG4iLCJpbXBvcnQgZGVjb2RlQ29tcG9uZW50IGZyb20gJ2RlY29kZS11cmktY29tcG9uZW50JztcbmltcG9ydCB7aW5jbHVkZUtleXN9IGZyb20gJ2ZpbHRlci1vYmonO1xuaW1wb3J0IHNwbGl0T25GaXJzdCBmcm9tICdzcGxpdC1vbi1maXJzdCc7XG5cbmNvbnN0IGlzTnVsbE9yVW5kZWZpbmVkID0gdmFsdWUgPT4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZDtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVuaWNvcm4vcHJlZmVyLWNvZGUtcG9pbnRcbmNvbnN0IHN0cmljdFVyaUVuY29kZSA9IHN0cmluZyA9PiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKS5yZXBsYWNlQWxsKC9bIScoKSpdL2csIHggPT4gYCUke3guY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKX1gKTtcblxuY29uc3QgZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyID0gU3ltYm9sKCdlbmNvZGVGcmFnbWVudElkZW50aWZpZXInKTtcblxuZnVuY3Rpb24gZW5jb2RlckZvckFycmF5Rm9ybWF0KG9wdGlvbnMpIHtcblx0c3dpdGNoIChvcHRpb25zLmFycmF5Rm9ybWF0KSB7XG5cdFx0Y2FzZSAnaW5kZXgnOiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gcmVzdWx0Lmxlbmd0aDtcblxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dmFsdWUgPT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBOdWxsICYmIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBFbXB0eVN0cmluZyAmJiB2YWx1ZSA9PT0gJycpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0Li4ucmVzdWx0LCBbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbJywgaW5kZXgsICddJ10uam9pbignJyksXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0Li4ucmVzdWx0LFxuXHRcdFx0XHRcdFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1snLCBlbmNvZGUoaW5kZXgsIG9wdGlvbnMpLCAnXT0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKSxcblx0XHRcdFx0XTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnYnJhY2tldCc6IHtcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRcdFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1tdJ10uam9pbignJyksXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0Li4ucmVzdWx0LFxuXHRcdFx0XHRcdFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1tdPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpLFxuXHRcdFx0XHRdO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjYXNlICdjb2xvbi1saXN0LXNlcGFyYXRvcic6IHtcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRcdFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJzpsaXN0PSddLmpvaW4oJycpLFxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICc6bGlzdD0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKSxcblx0XHRcdFx0XTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29tbWEnOlxuXHRcdGNhc2UgJ3NlcGFyYXRvcic6XG5cdFx0Y2FzZSAnYnJhY2tldC1zZXBhcmF0b3InOiB7XG5cdFx0XHRjb25zdCBrZXlWYWx1ZVNlcGFyYXRvciA9IG9wdGlvbnMuYXJyYXlGb3JtYXQgPT09ICdicmFja2V0LXNlcGFyYXRvcidcblx0XHRcdFx0PyAnW109J1xuXHRcdFx0XHQ6ICc9JztcblxuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dmFsdWUgPT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBOdWxsICYmIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHx8IChvcHRpb25zLnNraXBFbXB0eVN0cmluZyAmJiB2YWx1ZSA9PT0gJycpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUcmFuc2xhdGUgbnVsbCB0byBhbiBlbXB0eSBzdHJpbmcgc28gdGhhdCBpdCBkb2Vzbid0IHNlcmlhbGl6ZSBhcyAnbnVsbCdcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZSA9PT0gbnVsbCA/ICcnIDogdmFsdWU7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gW1tlbmNvZGUoa2V5LCBvcHRpb25zKSwga2V5VmFsdWVTZXBhcmF0b3IsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbW3Jlc3VsdCwgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbihvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKV07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGRlZmF1bHQ6IHtcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRcdGVuY29kZShrZXksIG9wdGlvbnMpLFxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICc9JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyksXG5cdFx0XHRcdF07XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKSB7XG5cdGxldCByZXN1bHQ7XG5cblx0c3dpdGNoIChvcHRpb25zLmFycmF5Rm9ybWF0KSB7XG5cdFx0Y2FzZSAnaW5kZXgnOiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdHJlc3VsdCA9IC9cXFsoXFxkKildJC8uZXhlYyhrZXkpO1xuXG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9cXFtcXGQqXSQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB7fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV1bcmVzdWx0WzFdXSA9IHZhbHVlO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjYXNlICdicmFja2V0Jzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRyZXN1bHQgPSAvKFxcW10pJC8uZXhlYyhrZXkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXSQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbdmFsdWVdO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbLi4uYWNjdW11bGF0b3Jba2V5XSwgdmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjYXNlICdjb2xvbi1saXN0LXNlcGFyYXRvcic6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0cmVzdWx0ID0gLyg6bGlzdCkkLy5leGVjKGtleSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC86bGlzdCQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbdmFsdWVdO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbLi4uYWNjdW11bGF0b3Jba2V5XSwgdmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjYXNlICdjb21tYSc6XG5cdFx0Y2FzZSAnc2VwYXJhdG9yJzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRjb25zdCBpc0FycmF5ID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5pbmNsdWRlcyhvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKTtcblx0XHRcdFx0Y29uc3QgaXNFbmNvZGVkQXJyYXkgPSAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhaXNBcnJheSAmJiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpLmluY2x1ZGVzKG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpKTtcblx0XHRcdFx0dmFsdWUgPSBpc0VuY29kZWRBcnJheSA/IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykgOiB2YWx1ZTtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBpc0FycmF5IHx8IGlzRW5jb2RlZEFycmF5ID8gdmFsdWUuc3BsaXQob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcikubWFwKGl0ZW0gPT4gZGVjb2RlKGl0ZW0sIG9wdGlvbnMpKSA6ICh2YWx1ZSA9PT0gbnVsbCA/IHZhbHVlIDogZGVjb2RlKHZhbHVlLCBvcHRpb25zKSk7XG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBuZXdWYWx1ZTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnYnJhY2tldC1zZXBhcmF0b3InOiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGlzQXJyYXkgPSAvKFxcW10pJC8udGVzdChrZXkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXSQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFpc0FycmF5KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlID8gZGVjb2RlKHZhbHVlLCBvcHRpb25zKSA6IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGFycmF5VmFsdWUgPSB2YWx1ZSA9PT0gbnVsbFxuXHRcdFx0XHRcdD8gW11cblx0XHRcdFx0XHQ6IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykuc3BsaXQob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBhcnJheVZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbLi4uYWNjdW11bGF0b3Jba2V5XSwgLi4uYXJyYXlWYWx1ZV07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGRlZmF1bHQ6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLlthY2N1bXVsYXRvcltrZXldXS5mbGF0KCksIHZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXJyYXlGb3JtYXRTZXBhcmF0b3IodmFsdWUpIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgfHwgdmFsdWUubGVuZ3RoICE9PSAxKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignYXJyYXlGb3JtYXRTZXBhcmF0b3IgbXVzdCBiZSBzaW5nbGUgY2hhcmFjdGVyIHN0cmluZycpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWx1ZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5lbmNvZGUpIHtcblx0XHRyZXR1cm4gb3B0aW9ucy5zdHJpY3QgPyBzdHJpY3RVcmlFbmNvZGUodmFsdWUpIDogZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlKHZhbHVlLCBvcHRpb25zKSB7XG5cdGlmIChvcHRpb25zLmRlY29kZSkge1xuXHRcdHJldHVybiBkZWNvZGVDb21wb25lbnQodmFsdWUpO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBrZXlzU29ydGVyKGlucHV0KSB7XG5cdGlmIChBcnJheS5pc0FycmF5KGlucHV0KSkge1xuXHRcdHJldHVybiBpbnB1dC5zb3J0KCk7XG5cdH1cblxuXHRpZiAodHlwZW9mIGlucHV0ID09PSAnb2JqZWN0Jykge1xuXHRcdHJldHVybiBrZXlzU29ydGVyKE9iamVjdC5rZXlzKGlucHV0KSlcblx0XHRcdC5zb3J0KChhLCBiKSA9PiBOdW1iZXIoYSkgLSBOdW1iZXIoYikpXG5cdFx0XHQubWFwKGtleSA9PiBpbnB1dFtrZXldKTtcblx0fVxuXG5cdHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSGFzaChpbnB1dCkge1xuXHRjb25zdCBoYXNoU3RhcnQgPSBpbnB1dC5pbmRleE9mKCcjJyk7XG5cdGlmIChoYXNoU3RhcnQgIT09IC0xKSB7XG5cdFx0aW5wdXQgPSBpbnB1dC5zbGljZSgwLCBoYXNoU3RhcnQpO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiBnZXRIYXNoKHVybCkge1xuXHRsZXQgaGFzaCA9ICcnO1xuXHRjb25zdCBoYXNoU3RhcnQgPSB1cmwuaW5kZXhPZignIycpO1xuXHRpZiAoaGFzaFN0YXJ0ICE9PSAtMSkge1xuXHRcdGhhc2ggPSB1cmwuc2xpY2UoaGFzaFN0YXJ0KTtcblx0fVxuXG5cdHJldHVybiBoYXNoO1xufVxuXG5mdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlLCBvcHRpb25zLCB0eXBlKSB7XG5cdGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0aWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gdHlwZSh2YWx1ZSk7XG5cdH1cblxuXHRpZiAob3B0aW9ucy5wYXJzZUJvb2xlYW5zICYmIHZhbHVlICE9PSBudWxsICYmICh2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZScgfHwgdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ZhbHNlJykpIHtcblx0XHRyZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnO1xuXHR9XG5cblx0aWYgKHR5cGUgPT09ICdudW1iZXInICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHZhbHVlKSkgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUudHJpbSgpICE9PSAnJykpIHtcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKTtcblx0fVxuXG5cdGlmIChvcHRpb25zLnBhcnNlTnVtYmVycyAmJiAhTnVtYmVyLmlzTmFOKE51bWJlcih2YWx1ZSkpICYmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKSAhPT0gJycpKSB7XG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0KGlucHV0KSB7XG5cdGlucHV0ID0gcmVtb3ZlSGFzaChpbnB1dCk7XG5cdGNvbnN0IHF1ZXJ5U3RhcnQgPSBpbnB1dC5pbmRleE9mKCc/Jyk7XG5cdGlmIChxdWVyeVN0YXJ0ID09PSAtMSkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdHJldHVybiBpbnB1dC5zbGljZShxdWVyeVN0YXJ0ICsgMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShxdWVyeSwgb3B0aW9ucykge1xuXHRvcHRpb25zID0ge1xuXHRcdGRlY29kZTogdHJ1ZSxcblx0XHRzb3J0OiB0cnVlLFxuXHRcdGFycmF5Rm9ybWF0OiAnbm9uZScsXG5cdFx0YXJyYXlGb3JtYXRTZXBhcmF0b3I6ICcsJyxcblx0XHRwYXJzZU51bWJlcnM6IGZhbHNlLFxuXHRcdHBhcnNlQm9vbGVhbnM6IGZhbHNlLFxuXHRcdHR5cGVzOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuXHRcdC4uLm9wdGlvbnMsXG5cdH07XG5cblx0dmFsaWRhdGVBcnJheUZvcm1hdFNlcGFyYXRvcihvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKTtcblxuXHRjb25zdCBmb3JtYXR0ZXIgPSBwYXJzZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKTtcblxuXHQvLyBDcmVhdGUgYW4gb2JqZWN0IHdpdGggbm8gcHJvdG90eXBlXG5cdGNvbnN0IHJldHVyblZhbHVlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRpZiAodHlwZW9mIHF1ZXJ5ICE9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiByZXR1cm5WYWx1ZTtcblx0fVxuXG5cdHF1ZXJ5ID0gcXVlcnkudHJpbSgpLnJlcGxhY2UoL15bPyMmXS8sICcnKTtcblxuXHRpZiAoIXF1ZXJ5KSB7XG5cdFx0cmV0dXJuIHJldHVyblZhbHVlO1xuXHR9XG5cblx0Zm9yIChjb25zdCBwYXJhbWV0ZXIgb2YgcXVlcnkuc3BsaXQoJyYnKSkge1xuXHRcdGlmIChwYXJhbWV0ZXIgPT09ICcnKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXJhbWV0ZXJfID0gb3B0aW9ucy5kZWNvZGUgPyBwYXJhbWV0ZXIucmVwbGFjZUFsbCgnKycsICcgJykgOiBwYXJhbWV0ZXI7XG5cblx0XHRsZXQgW2tleSwgdmFsdWVdID0gc3BsaXRPbkZpcnN0KHBhcmFtZXRlcl8sICc9Jyk7XG5cblx0XHRpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGtleSA9IHBhcmFtZXRlcl87XG5cdFx0fVxuXG5cdFx0Ly8gTWlzc2luZyBgPWAgc2hvdWxkIGJlIGBudWxsYDpcblx0XHQvLyBodHRwOi8vdzMub3JnL1RSLzIwMTIvV0QtdXJsLTIwMTIwNTI0LyNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG5cdFx0dmFsdWUgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IChbJ2NvbW1hJywgJ3NlcGFyYXRvcicsICdicmFja2V0LXNlcGFyYXRvciddLmluY2x1ZGVzKG9wdGlvbnMuYXJyYXlGb3JtYXQpID8gdmFsdWUgOiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpKTtcblx0XHRmb3JtYXR0ZXIoZGVjb2RlKGtleSwgb3B0aW9ucyksIHZhbHVlLCByZXR1cm5WYWx1ZSk7XG5cdH1cblxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhyZXR1cm5WYWx1ZSkpIHtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBvcHRpb25zLnR5cGVzW2tleV0gIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRmb3IgKGNvbnN0IFtrZXkyLCB2YWx1ZTJdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuXHRcdFx0XHRjb25zdCB0eXBlID0gb3B0aW9ucy50eXBlc1trZXldID8gb3B0aW9ucy50eXBlc1trZXldLnJlcGxhY2UoJ1tdJywgJycpIDogdW5kZWZpbmVkO1xuXHRcdFx0XHR2YWx1ZVtrZXkyXSA9IHBhcnNlVmFsdWUodmFsdWUyLCBvcHRpb25zLCB0eXBlKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgb3B0aW9ucy50eXBlc1trZXldID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuVmFsdWVba2V5XSA9IE9iamVjdC52YWx1ZXModmFsdWUpLmpvaW4ob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVyblZhbHVlW2tleV0gPSBwYXJzZVZhbHVlKHZhbHVlLCBvcHRpb25zLCBvcHRpb25zLnR5cGVzW2tleV0pO1xuXHRcdH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNvcnQgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIHJldHVyblZhbHVlO1xuXHR9XG5cblx0Ly8gVE9ETzogUmVtb3ZlIHRoZSB1c2Ugb2YgYHJlZHVjZWAuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLWFycmF5LXJlZHVjZVxuXHRyZXR1cm4gKG9wdGlvbnMuc29ydCA9PT0gdHJ1ZSA/IE9iamVjdC5rZXlzKHJldHVyblZhbHVlKS5zb3J0KCkgOiBPYmplY3Qua2V5cyhyZXR1cm5WYWx1ZSkuc29ydChvcHRpb25zLnNvcnQpKS5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSByZXR1cm5WYWx1ZVtrZXldO1xuXHRcdHJlc3VsdFtrZXldID0gQm9vbGVhbih2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyBrZXlzU29ydGVyKHZhbHVlKSA6IHZhbHVlO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5KG9iamVjdCwgb3B0aW9ucykge1xuXHRpZiAoIW9iamVjdCkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdG9wdGlvbnMgPSB7XG5cdFx0ZW5jb2RlOiB0cnVlLFxuXHRcdHN0cmljdDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnLFxuXHRcdGFycmF5Rm9ybWF0U2VwYXJhdG9yOiAnLCcsXG5cdFx0Li4ub3B0aW9ucyxcblx0fTtcblxuXHR2YWxpZGF0ZUFycmF5Rm9ybWF0U2VwYXJhdG9yKG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpO1xuXG5cdGNvbnN0IHNob3VsZEZpbHRlciA9IGtleSA9PiAoXG5cdFx0KG9wdGlvbnMuc2tpcE51bGwgJiYgaXNOdWxsT3JVbmRlZmluZWQob2JqZWN0W2tleV0pKVxuXHRcdHx8IChvcHRpb25zLnNraXBFbXB0eVN0cmluZyAmJiBvYmplY3Rba2V5XSA9PT0gJycpXG5cdCk7XG5cblx0Y29uc3QgZm9ybWF0dGVyID0gZW5jb2RlckZvckFycmF5Rm9ybWF0KG9wdGlvbnMpO1xuXG5cdGNvbnN0IG9iamVjdENvcHkgPSB7fTtcblxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmplY3QpKSB7XG5cdFx0aWYgKCFzaG91bGRGaWx0ZXIoa2V5KSkge1xuXHRcdFx0b2JqZWN0Q29weVtrZXldID0gdmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdENvcHkpO1xuXG5cdGlmIChvcHRpb25zLnNvcnQgIT09IGZhbHNlKSB7XG5cdFx0a2V5cy5zb3J0KG9wdGlvbnMuc29ydCk7XG5cdH1cblxuXHRyZXR1cm4ga2V5cy5tYXAoa2V5ID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG5cdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdGlmICh2YWx1ZS5sZW5ndGggPT09IDAgJiYgb3B0aW9ucy5hcnJheUZvcm1hdCA9PT0gJ2JyYWNrZXQtc2VwYXJhdG9yJykge1xuXHRcdFx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0aW9ucykgKyAnW10nO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFsdWVcblx0XHRcdFx0LnJlZHVjZShmb3JtYXR0ZXIoa2V5KSwgW10pXG5cdFx0XHRcdC5qb2luKCcmJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdGlvbnMpICsgJz0nICsgZW5jb2RlKHZhbHVlLCBvcHRpb25zKTtcblx0fSkuZmlsdGVyKHggPT4geC5sZW5ndGggPiAwKS5qb2luKCcmJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVybCh1cmwsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IHtcblx0XHRkZWNvZGU6IHRydWUsXG5cdFx0Li4ub3B0aW9ucyxcblx0fTtcblxuXHRsZXQgW3VybF8sIGhhc2hdID0gc3BsaXRPbkZpcnN0KHVybCwgJyMnKTtcblxuXHRpZiAodXJsXyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dXJsXyA9IHVybDtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dXJsOiB1cmxfPy5zcGxpdCgnPycpPy5bMF0gPz8gJycsXG5cdFx0cXVlcnk6IHBhcnNlKGV4dHJhY3QodXJsKSwgb3B0aW9ucyksXG5cdFx0Li4uKG9wdGlvbnMgJiYgb3B0aW9ucy5wYXJzZUZyYWdtZW50SWRlbnRpZmllciAmJiBoYXNoID8ge2ZyYWdtZW50SWRlbnRpZmllcjogZGVjb2RlKGhhc2gsIG9wdGlvbnMpfSA6IHt9KSxcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeVVybChvYmplY3QsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IHtcblx0XHRlbmNvZGU6IHRydWUsXG5cdFx0c3RyaWN0OiB0cnVlLFxuXHRcdFtlbmNvZGVGcmFnbWVudElkZW50aWZpZXJdOiB0cnVlLFxuXHRcdC4uLm9wdGlvbnMsXG5cdH07XG5cblx0Y29uc3QgdXJsID0gcmVtb3ZlSGFzaChvYmplY3QudXJsKS5zcGxpdCgnPycpWzBdIHx8ICcnO1xuXHRjb25zdCBxdWVyeUZyb21VcmwgPSBleHRyYWN0KG9iamVjdC51cmwpO1xuXG5cdGNvbnN0IHF1ZXJ5ID0ge1xuXHRcdC4uLnBhcnNlKHF1ZXJ5RnJvbVVybCwge3NvcnQ6IGZhbHNlfSksXG5cdFx0Li4ub2JqZWN0LnF1ZXJ5LFxuXHR9O1xuXG5cdGxldCBxdWVyeVN0cmluZyA9IHN0cmluZ2lmeShxdWVyeSwgb3B0aW9ucyk7XG5cdHF1ZXJ5U3RyaW5nICYmPSBgPyR7cXVlcnlTdHJpbmd9YDtcblxuXHRsZXQgaGFzaCA9IGdldEhhc2gob2JqZWN0LnVybCk7XG5cdGlmICh0eXBlb2Ygb2JqZWN0LmZyYWdtZW50SWRlbnRpZmllciA9PT0gJ3N0cmluZycpIHtcblx0XHRjb25zdCB1cmxPYmplY3RGb3JGcmFnbWVudEVuY29kZSA9IG5ldyBVUkwodXJsKTtcblx0XHR1cmxPYmplY3RGb3JGcmFnbWVudEVuY29kZS5oYXNoID0gb2JqZWN0LmZyYWdtZW50SWRlbnRpZmllcjtcblx0XHRoYXNoID0gb3B0aW9uc1tlbmNvZGVGcmFnbWVudElkZW50aWZpZXJdID8gdXJsT2JqZWN0Rm9yRnJhZ21lbnRFbmNvZGUuaGFzaCA6IGAjJHtvYmplY3QuZnJhZ21lbnRJZGVudGlmaWVyfWA7XG5cdH1cblxuXHRyZXR1cm4gYCR7dXJsfSR7cXVlcnlTdHJpbmd9JHtoYXNofWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwaWNrKGlucHV0LCBmaWx0ZXIsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IHtcblx0XHRwYXJzZUZyYWdtZW50SWRlbnRpZmllcjogdHJ1ZSxcblx0XHRbZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyXTogZmFsc2UsXG5cdFx0Li4ub3B0aW9ucyxcblx0fTtcblxuXHRjb25zdCB7dXJsLCBxdWVyeSwgZnJhZ21lbnRJZGVudGlmaWVyfSA9IHBhcnNlVXJsKGlucHV0LCBvcHRpb25zKTtcblxuXHRyZXR1cm4gc3RyaW5naWZ5VXJsKHtcblx0XHR1cmwsXG5cdFx0cXVlcnk6IGluY2x1ZGVLZXlzKHF1ZXJ5LCBmaWx0ZXIpLFxuXHRcdGZyYWdtZW50SWRlbnRpZmllcixcblx0fSwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlKGlucHV0LCBmaWx0ZXIsIG9wdGlvbnMpIHtcblx0Y29uc3QgZXhjbHVzaW9uRmlsdGVyID0gQXJyYXkuaXNBcnJheShmaWx0ZXIpID8ga2V5ID0+ICFmaWx0ZXIuaW5jbHVkZXMoa2V5KSA6IChrZXksIHZhbHVlKSA9PiAhZmlsdGVyKGtleSwgdmFsdWUpO1xuXG5cdHJldHVybiBwaWNrKGlucHV0LCBleGNsdXNpb25GaWx0ZXIsIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0ICogYXMgcXVlcnlTdHJpbmcgZnJvbSAnLi9iYXNlLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgcXVlcnlTdHJpbmc7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzcGxpdE9uRmlyc3Qoc3RyaW5nLCBzZXBhcmF0b3IpIHtcblx0aWYgKCEodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHNlcGFyYXRvciA9PT0gJ3N0cmluZycpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgdGhlIGFyZ3VtZW50cyB0byBiZSBvZiB0eXBlIGBzdHJpbmdgJyk7XG5cdH1cblxuXHRpZiAoc3RyaW5nID09PSAnJyB8fCBzZXBhcmF0b3IgPT09ICcnKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0Y29uc3Qgc2VwYXJhdG9ySW5kZXggPSBzdHJpbmcuaW5kZXhPZihzZXBhcmF0b3IpO1xuXG5cdGlmIChzZXBhcmF0b3JJbmRleCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRyZXR1cm4gW1xuXHRcdHN0cmluZy5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCksXG5cdFx0c3RyaW5nLnNsaWNlKHNlcGFyYXRvckluZGV4ICsgc2VwYXJhdG9yLmxlbmd0aClcblx0XTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLy8gcnVudGltZSBoZWxwZXIgZm9yIHNldHRpbmcgcHJvcGVydGllcyBvbiBjb21wb25lbnRzXG4vLyBpbiBhIHRyZWUtc2hha2FibGUgd2F5XG5leHBvcnRzLmRlZmF1bHQgPSAoc2ZjLCBwcm9wcykgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IHNmYy5fX3ZjY09wdHMgfHwgc2ZjO1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBwcm9wcykge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCJpbXBvcnQgc2NyaXB0IGZyb20gXCIuL2FwcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anNcIlxuZXhwb3J0ICogZnJvbSBcIi4vYXBwLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiXG5cbmltcG9ydCBleHBvcnRDb21wb25lbnQgZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvZXhwb3J0SGVscGVyLmpzXCJcbmNvbnN0IF9fZXhwb3J0c19fID0gLyojX19QVVJFX18qL2V4cG9ydENvbXBvbmVudChzY3JpcHQsIFtbJ19fZmlsZScsXCJwdWJsaWMvc3JjL2FwcGxpY2F0aW9uL2FwcC52dWVcIl1dKVxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgX19leHBvcnRzX18uX19obXJJZCA9IFwiMmFjOWExOWZcIlxuICBjb25zdCBhcGkgPSBfX1ZVRV9ITVJfUlVOVElNRV9fXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFhcGkuY3JlYXRlUmVjb3JkKCcyYWM5YTE5ZicsIF9fZXhwb3J0c19fKSkge1xuICAgIGFwaS5yZWxvYWQoJzJhYzlhMTlmJywgX19leHBvcnRzX18pXG4gIH1cbiAgXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgX19leHBvcnRzX18iLCJleHBvcnQgeyBkZWZhdWx0IH0gZnJvbSBcIi0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cnVsZVNldFsxXS5ydWxlc1sxN10udXNlWzBdIS4vYXBwLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiOyBleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzE3XS51c2VbMF0hLi9hcHAudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzXCIiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtZXRob2QpIHtcclxuICAgIHZhciAkdGhpc09iajtcclxuICAgIHZhciAkYXV0b3RleHQ7XHJcbiAgICB2YXIgZGVmYXVsdFBhcmFtcyA9IHtcclxuICAgICAgICBzaG93SW50ZXJ2YWw6IDEwMDBcclxuICAgIH07XHJcbiAgICB2YXIgcGFyYW1zO1xyXG4gICAgdmFyIHRpbWVvdXRfaWQgPSAwO1xyXG4gICAgXHJcbiAgICB2YXIgbWV0aG9kcyA9IHtcclxuICAgICAgICBnZXRDb21wbGV0aW9uOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBTZXQgPSBkYXRhLlNldDtcclxuICAgICAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgICAgICRhdXRvdGV4dC5lbXB0eSgpO1xyXG4gICAgICAgICAgICBpZiAoU2V0ICYmIChTZXQubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBTZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICc8bGk+JztcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICAgICs9ICcgIDxhIGhyZWY9XCIjXCIgZGF0YS1pZD1cIicgKyBTZXRbaV0uaWQgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBTZXRbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShrZXksIFsnaWQnLCAnbmFtZScsICdkZXNjcmlwdGlvbicsICdpbWcnXSkgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgKz0gJyBkYXRhLScgKyBrZXkgKyAnPVwiJyArIFNldFtpXVtrZXldLnRvU3RyaW5nKCkgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gJz4nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChTZXRbaV0uaW1nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgKz0gJyAgIDxpbWcgc3JjPVwiJyArIFNldFtpXS5pbWcgKyAnXCIgLz4nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICAgICs9ICcgICAgPHNwYW4gY2xhc3M9XCJyYWFzLWF1dG90ZXh0X19uYW1lXCI+JyArIFNldFtpXS5uYW1lICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgKz0gJyAgICA8c3BhbiBjbGFzcz1cInJhYXMtYXV0b3RleHRfX2Rlc2NyaXB0aW9uXCI+JyArIFNldFtpXS5kZXNjcmlwdGlvbiArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICAgICs9ICcgIDwvYT4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgKz0gJzwvbGk+JztcclxuICAgICAgICAgICAgICAgICAgICAkYXV0b3RleHQuYXBwZW5kKHRleHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJGF1dG90ZXh0LnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRhdXRvdGV4dC5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRPbkNoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRhdXRvdGV4dC50cmlnZ2VyKCdSQUFTX2F1dG9jb21wbGV0ZXIuY2hhbmdlJyk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gJHRoaXNPYmoudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBwYXJhbXMudXJsO1xyXG4gICAgICAgICAgICBpZiAoL1xcKi8udGVzdCh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gdXJsLnJlcGxhY2UoL1xcKi8sIHRleHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IHVybCArIHRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0X2lkKTtcclxuICAgICAgICAgICAgdGltZW91dF9pZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyAkLmdldEpTT04odXJsLCBtZXRob2RzLmdldENvbXBsZXRpb24pIH0sIHBhcmFtcy5zaG93SW50ZXJ2YWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25DbGljazogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAkYXV0b3RleHQudHJpZ2dlcignUkFBU19hdXRvY29tcGxldGVyLmNsaWNrJyk7XHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5jYWxsYmFjay5hcHBseSh0aGlzLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkYXV0b3RleHQuaGlkZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7IFxyXG4gICAgICAgICAgICAkYXV0b3RleHQucGFyYW1zID0gcGFyYW1zID0gJC5leHRlbmQoZGVmYXVsdFBhcmFtcywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICR0aGlzT2JqLm9uKCdrZXl1cCcsIG1ldGhvZHMudGV4dE9uQ2hhbmdlKTtcclxuICAgICAgICAgICAgLy8gMjAxNS0wNS0wNCwgQVZTOiDQt9Cw0LzQtdC90LjQuyAkYXV0b3RleHQuaGlkZSDQvdCwIGZ1bmN0aW9uKCkgeyAkYXV0b3RleHQuaGlkZSgpIH0sINC40LHQviDQs9C70Y7Rh9C40YJcclxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkgeyAkYXV0b3RleHQuaGlkZSgpIH0pO1xyXG4gICAgICAgICAgICAkYXV0b3RleHQub24oJ2NsaWNrJywgJ2EnLCBtZXRob2RzLm9uQ2xpY2spO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgICR0aGlzT2JqID0gJCh0aGlzKTtcclxuICAgICRhdXRvdGV4dCA9ICR0aGlzT2JqLm5leHQoJ1tkYXRhLXJvbGU9XCJyYWFzLWF1dG90ZXh0XCJdJyk7XHJcbiAgICBpZiAoISRhdXRvdGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAkYXV0b3RleHQgPSAkKCc8dWwgY2xhc3M9XCJyYWFzLWF1dG90ZXh0XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgZGF0YS1yb2xlPVwicmFhcy1hdXRvdGV4dFwiPjwvdWw+JylcclxuICAgICAgICAkdGhpc09iai5hZnRlcigkYXV0b3RleHQpO1xyXG4gICAgfVxyXG4gICAgaWYgKCRhdXRvdGV4dC5wYXJhbXMpIHtcclxuICAgICAgICAkcGFyYW1zID0gJGF1dG90ZXh0LnBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICAvLyDQu9C+0LPQuNC60LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsFxyXG4gICAgaWYgKCBtZXRob2RzW21ldGhvZF0gKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZHNbIG1ldGhvZCBdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0aG9kID09PSAnb2JqZWN0JyB8fCAhbWV0aG9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGZpbGwpIHtcclxuICAgIHZhciB0ZXh0O1xyXG4gICAgJCh0aGlzKS5lbXB0eSgpO1xyXG4gICAgZm9yICh2YXIgaSBpbiBmaWxsKSB7XHJcbiAgICAgICAgdGV4dCA9ICc8b3B0aW9uIHZhbHVlPVwiJyArIGZpbGxbaV0udmFsICsgJ1wiJyArIChmaWxsW2ldLnNlbCA/ICcgc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiJyA6ICcnKTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmlsbFtpXSkge1xyXG4gICAgICAgICAgICBpZiAoJC5pbkFycmF5KGtleSwgWyd2YWwnLCAnc2VsJywgJ3RleHQnXSkgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gJyBkYXRhLScgKyBrZXkgKyAnPVwiJyArIGZpbGxbaV1ba2V5XSArICdcIic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGV4dCArPSAnPicgKyBmaWxsW2ldLnRleHQgKyAnPC9vcHRpb24+JztcclxuICAgICAgICAkKHRoaXMpLmFwcGVuZCgkKHRleHQpKTtcclxuICAgIH1cclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cmwsIHBhcmFtcykge1xyXG4gICAgdmFyIGRlZmF1bHRQYXJhbXMgPSB7XHJcbiAgICAgICAgJ2JlZm9yZSc6IGZ1bmN0aW9uKGRhdGEpIHsgcmV0dXJuIGRhdGE7IH0sXHJcbiAgICAgICAgJ2FmdGVyJzogZnVuY3Rpb24oZGF0YSkge31cclxuICAgIH1cclxuICAgIHBhcmFtcyA9ICQuZXh0ZW5kKGRlZmF1bHRQYXJhbXMsIHBhcmFtcyk7XHJcbiAgICB2YXIgdGhpc09iaiA9IHRoaXM7XHJcbiAgICAkLmdldEpTT04odXJsLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgdmFyIGZpbGwgPSBwYXJhbXMuYmVmb3JlLmNhbGwodGhpc09iaiwgZGF0YSk7XHJcbiAgICAgICAgJCh0aGlzT2JqKS5SQUFTX2ZpbGxTZWxlY3QoZmlsbCk7XHJcbiAgICAgICAgcGFyYW1zLmFmdGVyLmNhbGwodGhpc09iaiwgZGF0YSk7XHJcbiAgICB9KTtcclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICAgIHZhciB0aGlzT2JqID0gdGhpcztcclxuICAgIFxyXG4gICAgJCgnc2VsZWN0W211bHRpcGxlXScpLm5vdCgnW2Rpc2FibGVkXScsIHRoaXNPYmopLm11bHRpc2VsZWN0KHtcclxuICAgICAgICBidXR0b25UZXh0OiBmdW5jdGlvbihvcHRpb25zLCBzZWxlY3QpIHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJy0tJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSAnJztcclxuICAgICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgICAgb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoaSA8IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkICs9ICQodGhpcykudGV4dCgpICsgJywgJztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBzZWxlY3RlZC5zdWJzdHIoMCwgc2VsZWN0ZWQubGVuZ3RoIC0yKTtcclxuICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWQgKyAob3B0aW9ucy5sZW5ndGggPiAzID8gJy4uLicgOiAnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1heEhlaWdodDogMjAwXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgJCgnaW5wdXRbZGF0YS1oaW50XSwgdGV4dGFyZWFbZGF0YS1oaW50XSwgc2VsZWN0W2RhdGEtaGludF0nLCB0aGlzT2JqKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gJzxhIGNsYXNzPVwiYnRuXCIgaHJlZj1cIiNcIiByZWw9XCJwb3BvdmVyXCIgZGF0YS1jb250ZW50PVwiJyArICQodGhpcykuYXR0cignZGF0YS1oaW50JykgKyAnXCI+PGkgY2xhc3M9XCJpY29uLXF1ZXN0aW9uLXNpZ25cIj48L2k+PC9hPic7XHJcbiAgICAgICAgaWYgKCEkKHRoaXMpLmNsb3Nlc3QoJy5jb250cm9sLWdyb3VwJykuZmluZCgnYVtyZWw9XCJwb3BvdmVyXCJdJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmNvbnRyb2wtZ3JvdXAnKS5maW5kKCcuY29udHJvbHMnKS5hcHBlbmQodGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0iLCIvKipcclxuICogQGRlcHJlY2F0ZWQg0JTQtdGA0LXQstC+INC80LXQvdGOINGA0LXQsNC70LjQt9C+0LLQsNC90L4g0LIgUkFBU1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWV0aG9kKSB7XHJcbiAgICB2YXIgJHRoaXNPYmo7XHJcbiAgICB2YXIgZGVmYXVsdFBhcmFtcyA9IHsgc2hvd25MZXZlbDogMiB9O1xyXG4gICAgdmFyIHBhcmFtcyA9IHt9O1xyXG4gICAgdmFyIG1ldGhvZHMgPSB7XHJcbiAgICAgICAgaGlkZVVMOiBmdW5jdGlvbigkb2JqKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJCgndWwnLCAkb2JqKS5oaWRlKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRQbHVzZXM6IGZ1bmN0aW9uKCRvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkKCdsaTpoYXModWwpJywgJG9iaikucHJlcGVuZCgnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImpzVHJlZVBsdXNcIiBkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIj48L2E+Jyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1bmZvbGQ6IGZ1bmN0aW9uKCRvYmosIHNsb3dseSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRvYmouY2hpbGRyZW4oJ1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nKS5yZW1vdmVDbGFzcygnanNUcmVlUGx1cycpLmFkZENsYXNzKCdqc1RyZWVNaW51cycpO1xyXG4gICAgICAgICAgICBpZiAoc2xvd2x5KSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5zbGlkZURvd24oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9sZDogZnVuY3Rpb24oJG9iaiwgc2xvd2x5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJG9iai5jaGlsZHJlbignW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScpLnJlbW92ZUNsYXNzKCdqc1RyZWVNaW51cycpLmFkZENsYXNzKCdqc1RyZWVQbHVzJyk7XHJcbiAgICAgICAgICAgIGlmIChzbG93bHkpIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLnNsaWRlVXAoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xpY2tQbHVzOiBmdW5jdGlvbigpIFxyXG4gICAgICAgIHsgXHJcbiAgICAgICAgICAgIG1ldGhvZHMudW5mb2xkKCQodGhpcykuY2xvc2VzdCgnbGknKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrTWludXM6IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1ldGhvZHMuZm9sZCgkKHRoaXMpLmNsb3Nlc3QoJ2xpJyksIHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0IDogZnVuY3Rpb24ob3B0aW9ucykgeyBcclxuICAgICAgICAgICAgcGFyYW1zID0gJC5leHRlbmQoZGVmYXVsdFBhcmFtcywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuc2hvd25MZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMuc2hvd25MZXZlbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsICs9ICd1bCAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHRoaXNPYmogPSAkKHNlbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkdGhpc09iaiA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCR0aGlzT2JqLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ9Ck0YPQvdC60YbQuNGPIGpRdWVyeS5tZW51VHJlZSDRg9GB0YLQsNGA0LXQu9CwINC4INCx0YPQtNC10YIg0L7RgtC60LvRjtGH0LXQvdCwIDAxLjAxLjIwMjYuINCf0L7QttCw0LvRg9C50YHRgtCwLCDQvtCx0YDQsNGC0LjRgtC10YHRjCDQuiDRgNCw0LfRgNCw0LHQvtGC0YfQuNC60YMg0LTQu9GPINC+0LHQvdC+0LLQu9C10L3QuNGPINGB0LjRgdGC0LXQvNGLIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGhvZHMuaGlkZVVMKCR0aGlzT2JqKTtcclxuICAgICAgICAgICAgbWV0aG9kcy5hZGRQbHVzZXMoJHRoaXNPYmopO1xyXG4gICAgICAgICAgICBtZXRob2RzLnVuZm9sZCgkKCdsaS5hY3RpdmUnLCAkdGhpc09iaiksIGZhbHNlKTtcclxuICAgICAgICAgICAgJHRoaXNPYmoub24oJ2NsaWNrJywgJy5qc1RyZWVQbHVzW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScsIG1ldGhvZHMuY2xpY2tQbHVzKTtcclxuICAgICAgICAgICAgJHRoaXNPYmoub24oJ2NsaWNrJywgJy5qc1RyZWVNaW51c1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nLCBtZXRob2RzLmNsaWNrTWludXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINC70L7Qs9C40LrQsCDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwXHJcbiAgICBpZiAoIG1ldGhvZHNbbWV0aG9kXSApIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kc1sgbWV0aG9kIF0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdvYmplY3QnIHx8ICFtZXRob2QpIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2hhbmdlX3F1ZXJ5LCBpbmNsdWRlX2RpcnMsIGluaXRpYWxfcGF0aCkge1xyXG4gICAgaWYgKCFpbml0aWFsX3BhdGgpIHtcclxuICAgICAgICBpbml0aWFsX3BhdGggPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmXHJcbiAgICB9XHJcbiAgICBpZiAoY2hhbmdlX3F1ZXJ5LnN1YnN0cigwLCAxKSA9PSAnPycpIHtcclxuICAgICAgICBjaGFuZ2VfcXVlcnkgPSBjaGFuZ2VfcXVlcnkuc3Vic3RyKDEpO1xyXG4gICAgfVxyXG4gICAgdmFyIHF1ZXJ5X2RpciA9IGluaXRpYWxfcGF0aC5zcGxpdCgnPycpLnNsaWNlKDAsIDEpLnRvU3RyaW5nKCk7XHJcbiAgICB2YXIgcXVlcnlfc3RyID0gaW5pdGlhbF9wYXRoLnNwbGl0KCc/Jykuc2xpY2UoMSkudG9TdHJpbmcoKTtcclxuICAgIFxyXG4gICAgdmFyIG9sZF9xdWVyeSA9IHF1ZXJ5X3N0ci5zcGxpdCgnJicpO1xyXG4gICAgdmFyIGNoYW5nZSA9IGNoYW5nZV9xdWVyeS5zcGxpdCgnJicpO1xyXG4gICAgXHJcbiAgICB2YXIgcXVlcnkgPSB7fTtcclxuICAgIHZhciB0ZW1wID0gW107XHJcbiAgICBcclxuICAgIHZhciBuZXdfcXVlcnkgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkX3F1ZXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGVtcCA9IG9sZF9xdWVyeVtpXS5zcGxpdCgnPScpO1xyXG4gICAgICAgIGlmICh0ZW1wWzBdLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcXVlcnlbdGVtcFswXV0gPSB0ZW1wWzFdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhbmdlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGVtcCA9IGNoYW5nZVtpXS5zcGxpdCgnPScpO1xyXG4gICAgICAgIGlmICh0ZW1wWzBdLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcXVlcnlbdGVtcFswXV0gPSB0ZW1wWzFdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRlbXAgPSBbXTtcclxuICAgIGZvciAodmFyIGtleSBpbiBxdWVyeSkge1xyXG4gICAgICAgIGlmIChxdWVyeVtrZXldICYmIChxdWVyeVtrZXldLmxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgICAgIHRlbXBbdGVtcC5sZW5ndGhdID0ga2V5ICsgJz0nICsgcXVlcnlba2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBxdWVyeSA9IHRlbXAuam9pbignJicpO1xyXG4gICAgcmV0dXJuIHF1ZXJ5O1xyXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHBhcmFtcykgeyBcclxuICAgIHZhciBkZWZhdWx0UGFyYW1zID0ge1xyXG4gICAgICAgICdyZXBvQ29udGFpbmVyJzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG8tY29udGFpbmVyXCJdJyxcclxuICAgICAgICAncmVwb0VsZW1lbnQnOiAnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1lbGVtZW50XCJdJyxcclxuICAgICAgICAncmVwb0VsZW1lbnRDaGFuZ2VzJzogeydkYXRhLXJvbGUnOiAncmFhcy1yZXBvLWVsZW1lbnQnfSxcclxuICAgICAgICAncmVwb0FkZCc6ICdbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWFkZFwiXScsXHJcbiAgICAgICAgJ3JlcG9Nb3ZlJzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG8tbW92ZVwiXScsXHJcbiAgICAgICAgJ3JlcG9EZWxldGUnOiAnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1kZWxcIl0nLFxyXG4gICAgICAgICdyZXBvJzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG9cIl0nLFxyXG4gICAgICAgICdvbkJlZm9yZUFkZCc6IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgJ29uQWZ0ZXJBZGQnOiBmdW5jdGlvbigpIHsgJCh0aGlzKS5maW5kKCdzZWxlY3Q6ZGlzYWJsZWQsIGlucHV0OmRpc2FibGVkLCB0ZXh0YXJlYTpkaXNhYmxlZCcpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7IH0sXHJcbiAgICAgICAgJ29uQmVmb3JlRGVsZXRlJzogZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAnb25BZnRlckRlbGV0ZSc6IGZ1bmN0aW9uKCkge31cclxuICAgIH1cclxuICAgIHBhcmFtcyA9ICQuZXh0ZW5kKGRlZmF1bHRQYXJhbXMsIHBhcmFtcyk7XHJcbiAgICB2YXIgJHJlcG9CbG9jayA9ICQodGhpcyk7XHJcbiAgICBcclxuICAgIHZhciAkcmVwb0NvbnRhaW5lcjtcclxuICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtcmFhcy1yZXBvLWNvbnRhaW5lcicpKSB7XHJcbiAgICAgICAgJHJlcG9Db250YWluZXIgPSAkKCQodGhpcykuYXR0cignZGF0YS1yYWFzLXJlcG8tY29udGFpbmVyJykpO1xyXG4gICAgfSBlbHNlIGlmICgkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9Db250YWluZXIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkcmVwb0NvbnRhaW5lciA9ICRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0NvbnRhaW5lcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRyZXBvQ29udGFpbmVyID0gJChwYXJhbXMucmVwb0NvbnRhaW5lcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciAkcmVwbztcclxuICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtcmFhcy1yZXBvJykpIHtcclxuICAgICAgICAkcmVwbyA9ICQoJCh0aGlzKS5hdHRyKCdkYXRhLXJhYXMtcmVwbycpKTtcclxuICAgIH0gZWxzZSBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJHJlcG8gPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG8pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkcmVwbyA9ICQocGFyYW1zLnJlcG8pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjaGVja1JlcXVpcmVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRyZXBvRWxlbWVudDtcclxuICAgICAgICBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50ICsgJzpoYXMoKltkYXRhLXJlcXVpcmVkXSknKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKHBhcmFtcy5yZXBvRWxlbWVudCArICc6aGFzKCpbZGF0YS1yZXF1aXJlZF0pJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkcmVwb0VsZW1lbnQubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQuZmluZChwYXJhbXMucmVwb0RlbGV0ZSkuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudC5maW5kKHBhcmFtcy5yZXBvRGVsZXRlKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKHBhcmFtcy5yZXBvRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkcmVwb0VsZW1lbnQubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQuZmluZChwYXJhbXMucmVwb01vdmUpLnNob3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQuZmluZChwYXJhbXMucmVwb01vdmUpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRyZXBvQmxvY2sub24oJ2NsaWNrJywgcGFyYW1zLnJlcG9BZGQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHBhcmFtcy5vbkJlZm9yZUFkZC5jYWxsKCRyZXBvRWxlbWVudCk7XHJcbiAgICAgICAgdmFyICRyZXBvRWxlbWVudCA9ICRyZXBvLmNsb25lKHRydWUpO1xyXG4gICAgICAgICRyZXBvRWxlbWVudC5hdHRyKHBhcmFtcy5yZXBvRWxlbWVudENoYW5nZXMpO1xyXG4gICAgICAgICRyZXBvQ29udGFpbmVyLmFwcGVuZCgkcmVwb0VsZW1lbnQpO1xyXG4gICAgICAgICRyZXBvRWxlbWVudC50cmlnZ2VyKCdSQUFTX3JlcG8uYWRkJyk7XHJcbiAgICAgICAgcGFyYW1zLm9uQWZ0ZXJBZGQuY2FsbCgkcmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIGNoZWNrUmVxdWlyZWQoKTtcclxuICAgICAgICAkcmVwb0VsZW1lbnQuUkFBU0luaXRJbnB1dHMoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgJHJlcG9CbG9jay5vbignY2xpY2snLCBwYXJhbXMucmVwb0RlbGV0ZSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRyZXBvRWxlbWVudDtcclxuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KHBhcmFtcy5yZXBvRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QocGFyYW1zLnJlcG9FbGVtZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cignZGF0YS1yYWFzLXJlcG8tZWxlbWVudCcpKSB7XHJcbiAgICAgICAgICAgICRyZXBvRWxlbWVudCA9ICQoJCh0aGlzKS5hdHRyKCdkYXRhLXJhYXMtcmVwby1lbGVtZW50JykpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9FbGVtZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKHBhcmFtcy5yZXBvRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmFtcy5vbkJlZm9yZURlbGV0ZS5jYWxsKCRyZXBvRWxlbWVudCk7XHJcbiAgICAgICAgJHJlcG9FbGVtZW50LnRyaWdnZXIoJ1JBQVNfcmVwby5kZWxldGUnKTtcclxuICAgICAgICAkcmVwb0VsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgcGFyYW1zLm9uQWZ0ZXJEZWxldGUuY2FsbCgkcmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIGNoZWNrUmVxdWlyZWQoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgYXhpcyA9ICRyZXBvQ29udGFpbmVyLmF0dHIoJ2RhdGEtYXhpcycpO1xyXG4gICAgJHJlcG9Db250YWluZXIuc29ydGFibGUoeyBheGlzOiBheGlzID8gKGF4aXMgPT0gJ2JvdGgnID8gJycgOiBheGlzKSA6ICd5JywgJ2hhbmRsZSc6IHBhcmFtcy5yZXBvTW92ZSwgY29udGFpbm1lbnQ6ICQodGhpcykgfSk7XHJcblxyXG5cclxuICAgIGNoZWNrUmVxdWlyZWQoKTtcclxufSIsIi8qKlxyXG4gKiBAZGVwcmVjYXRlZCDQlNC10YDQtdCy0L4g0YDQtdCw0LvQuNC30L7QstCw0L3QviDQsiBSQUFTIChjaGVja2JveC10cmVlKVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWV0aG9kKSB7XHJcbiAgICB2YXIgJHRoaXNPYmo7XHJcbiAgICB2YXIgbWV0aG9kcyA9IHtcclxuICAgICAgICBoaWRlVUw6IGZ1bmN0aW9uKCRvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkKCd1bCcsICRvYmopLmhpZGUoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFBsdXNlczogZnVuY3Rpb24oJG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICQoJ2xpOmhhcyh1bCknLCAkb2JqKS5wcmVwZW5kKCc8YSBocmVmPVwiI1wiIGNsYXNzPVwianNUcmVlUGx1c1wiIGRhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiPjwvYT4nKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuZm9sZDogZnVuY3Rpb24oJG9iaiwgc2xvd2x5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJG9iai5jaGlsZHJlbignW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScpLnJlbW92ZUNsYXNzKCdqc1RyZWVQbHVzJykuYWRkQ2xhc3MoJ2pzVHJlZU1pbnVzJyk7XHJcbiAgICAgICAgICAgIGlmIChzbG93bHkpIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLnNsaWRlRG93bigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb2xkOiBmdW5jdGlvbigkb2JqLCBzbG93bHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkb2JqLmNoaWxkcmVuKCdbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJykucmVtb3ZlQ2xhc3MoJ2pzVHJlZU1pbnVzJykuYWRkQ2xhc3MoJ2pzVHJlZVBsdXMnKTtcclxuICAgICAgICAgICAgaWYgKHNsb3dseSkge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2xpZGVVcCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja1BsdXM6IGZ1bmN0aW9uKCkgXHJcbiAgICAgICAgeyBcclxuICAgICAgICAgICAgbWV0aG9kcy51bmZvbGQoJCh0aGlzKS5jbG9zZXN0KCdsaScpLCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xpY2tNaW51czogZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kcy5mb2xkKCQodGhpcykuY2xvc2VzdCgnbGknKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrQ2hlY2tib3g6IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBncm91cDtcclxuICAgICAgICAgICAgdmFyICRsaSA9ICQodGhpcykuY2xvc2VzdCgnbGknKTtcclxuICAgICAgICAgICAgdmFyICRvYmogPSAkbGkuZmluZCgndWwgaW5wdXQ6Y2hlY2tib3gnKTtcclxuICAgICAgICAgICAgaWYgKGdyb3VwID0gJG9iai5hdHRyKCdkYXRhLWdyb3VwJykpIHtcclxuICAgICAgICAgICAgICAgICRvYmogPSAkb2JqLmZpbHRlcihmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoJCh0aGlzKS5hdHRyKCdkYXRhLWdyb3VwJykgPT0gZ3JvdXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgICRvYmoucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJG9iai5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCdpbnB1dDpjaGVja2JveDpjaGVja2VkJywgJGxpKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2RzLnVuZm9sZCgkbGksIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kcy5mb2xkKCRsaSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrQ2hlY2tib3hBY2N1cmF0ZTogZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrQ2hlY2tib3hBY2N1cmF0ZUxhYmVsOiBmdW5jdGlvbihlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbWV0aG9kcy5jbGlja0NoZWNrYm94QWNjdXJhdGUuY2FsbCgkKHRoaXMpLmZpbmQoJz4gaW5wdXQ6Y2hlY2tib3gnKVswXSwgZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXQgOiBmdW5jdGlvbihvcHRpb25zKSB7IFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzKVxyXG4gICAgICAgICAgICAkdGhpc09iaiA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIGlmICgkdGhpc09iai5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfQpNGD0L3QutGG0LjRjyBqUXVlcnkudHJlZSDRg9GB0YLQsNGA0LXQu9CwINC4INCx0YPQtNC10YIg0L7RgtC60LvRjtGH0LXQvdCwIDAxLjAxLjIwMjYuINCf0L7QttCw0LvRg9C50YHRgtCwLCDQvtCx0YDQsNGC0LjRgtC10YHRjCDQuiDRgNCw0LfRgNCw0LHQvtGC0YfQuNC60YMg0LTQu9GPINC+0LHQvdC+0LLQu9C10L3QuNGPINGB0LjRgdGC0LXQvNGLIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGhvZHMuaGlkZVVMKCR0aGlzT2JqKTtcclxuICAgICAgICAgICAgbWV0aG9kcy5hZGRQbHVzZXMoJHRoaXNPYmopO1xyXG4gICAgICAgICAgICBtZXRob2RzLnVuZm9sZCgkKCdsaTpoYXMoaW5wdXQ6Y2hlY2tlZCknLCAkdGhpc09iaiksIGZhbHNlKTtcclxuICAgICAgICAgICAgJHRoaXNPYmoub24oJ2NsaWNrJywgJy5qc1RyZWVQbHVzW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScsIG1ldGhvZHMuY2xpY2tQbHVzKTtcclxuICAgICAgICAgICAgJHRoaXNPYmoub24oJ2NsaWNrJywgJy5qc1RyZWVNaW51c1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nLCBtZXRob2RzLmNsaWNrTWludXMpO1xyXG4gICAgICAgICAgICAkKCdpbnB1dDpjaGVja2JveCcsICR0aGlzT2JqKS5vbignY2xpY2snLCBtZXRob2RzLmNsaWNrQ2hlY2tib3gpO1xyXG4gICAgICAgICAgICAkKCdpbnB1dDpjaGVja2JveCcsICR0aGlzT2JqKS5vbignY29udGV4dG1lbnUnLCBtZXRob2RzLmNsaWNrQ2hlY2tib3hBY2N1cmF0ZSlcclxuICAgICAgICAgICAgJCgnbGFiZWw6aGFzKD5pbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0pJywgJHRoaXNPYmopLm9uKCdjb250ZXh0bWVudScsIG1ldGhvZHMuY2xpY2tDaGVja2JveEFjY3VyYXRlTGFiZWwpXHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgLy8g0LvQvtCz0LjQutCwINCy0YvQt9C+0LLQsCDQvNC10YLQvtC00LBcclxuICAgIGlmICggbWV0aG9kc1ttZXRob2RdICkge1xyXG4gICAgICAgIHJldHVybiBtZXRob2RzWyBtZXRob2QgXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ29iamVjdCcgfHwgIW1ldGhvZCkge1xyXG4gICAgICAgIHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBBcHAgZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHAudnVlJztcclxuXHJcbmltcG9ydCBxdWVyeVN0cmluZyBmcm9tICdxdWVyeS1zdHJpbmcnO1xyXG5pbXBvcnQgJ2pxdWVyeS5zY3JvbGx0bydcclxuXHJcbmltcG9ydCBSQUFTX3RyZWUgZnJvbSAnLi9saWJzL3JhYXMudHJlZS5qcyc7XHJcbmltcG9ydCBSQUFTX2F1dG9jb21wbGV0ZXIgZnJvbSAnLi9saWJzL3JhYXMuYXV0b2NvbXBsZXRlci5qcyc7XHJcbmltcG9ydCBSQUFTX21lbnVUcmVlIGZyb20gJy4vbGlicy9yYWFzLm1lbnUtdHJlZS5qcyc7XHJcbmltcG9ydCBSQUFTX2ZpbGxTZWxlY3QgZnJvbSAnLi9saWJzL3JhYXMuZmlsbC1zZWxlY3QuanMnO1xyXG5pbXBvcnQgUkFBU19nZXRTZWxlY3QgZnJvbSAnLi9saWJzL3JhYXMuZ2V0LXNlbGVjdC5qcyc7XHJcbmltcG9ydCBSQUFTX3JlcG8gZnJvbSAnLi9saWJzL3JhYXMucmVwby5qcyc7XHJcbmltcG9ydCBSQUFTSW5pdElucHV0cyBmcm9tICcuL2xpYnMvcmFhcy5pbml0LWlucHV0cy5qcyc7XHJcbmltcG9ydCBSQUFTX3F1ZXJ5U3RyaW5nIGZyb20gJy4vbGlicy9yYWFzLnF1ZXJ5LXN0cmluZy5qcyc7XHJcblxyXG4vLyBpbXBvcnQgeyBDa2VkaXRvciB9IGZyb20gJ0Bja2VkaXRvci9ja2VkaXRvcjUtdnVlJztcclxuXHJcblxyXG53aW5kb3cucXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZztcclxuXHJcbi8vIFZ1ZS51c2UoWW1hcFBsdWdpbiwgd2luZG93LnltYXBTZXR0aW5ncyk7XHJcblxyXG5qUXVlcnkoZnVuY3Rpb24gKCQpIHtcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBSQUFTX3RyZWUsXHJcbiAgICAgICAgUkFBU19hdXRvY29tcGxldGVyLFxyXG4gICAgICAgIFJBQVNfbWVudVRyZWUsXHJcbiAgICAgICAgUkFBU19maWxsU2VsZWN0LFxyXG4gICAgICAgIFJBQVNfZ2V0U2VsZWN0LFxyXG4gICAgICAgIFJBQVNfcmVwbyxcclxuICAgICAgICBSQUFTSW5pdElucHV0cyxcclxuICAgIH0pO1xyXG4gICAgJC5leHRlbmQoeyBSQUFTX3F1ZXJ5U3RyaW5nIH0pO1xyXG59KTtcclxuXHJcblxyXG5sZXQgYXBwLCB2dWVSb290O1xyXG52dWVSb290ID0gYXBwID0gVnVlLmNyZWF0ZUFwcChBcHApO1xyXG4vLyB2dWVSb290LnVzZShDa2VkaXRvcik7XHJcblxyXG53aW5kb3cucmVnaXN0ZXJlZFJBQVNDb21wb25lbnRzID0ge307XHJcbk9iamVjdC5rZXlzKHdpbmRvdy5yYWFzQ29tcG9uZW50cykuZm9yRWFjaCgoY29tcG9uZW50VVJOKSA9PiB7XHJcbiAgICB3aW5kb3cucmVnaXN0ZXJlZFJBQVNDb21wb25lbnRzW2NvbXBvbmVudFVSTl0gPSB2dWVSb290LmNvbXBvbmVudChjb21wb25lbnRVUk4sIHJhYXNDb21wb25lbnRzW2NvbXBvbmVudFVSTl0pO1xyXG59KVxyXG5cclxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKSB7XHJcbiAgICB3aW5kb3cuYXBwID0gYXBwLm1vdW50KCcjcmFhcy1hcHAnKTtcclxuXHJcbiAgICB2YXIgaGFzaCA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2g7XHJcbiAgICBpZiAoaGFzaCkge1xyXG4gICAgICAgIGlmICgkKCcudGFiYmFibGUgdWwubmF2LXRhYnMgYVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkKCcudGFiYmFibGUgdWwubmF2LXRhYnMgYVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykudGFiKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICQuc2Nyb2xsVG8oMCwgMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICgkKCcuYWNjb3JkaW9uIGEuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkKCcuYWNjb3JkaW9uIGEuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykuY2xvc2VzdCgnLmFjY29yZGlvbicpLmZpbmQoJy5jb2xsYXBzZScpLnJlbW92ZUNsYXNzKCdpbicpO1xyXG4gICAgICAgICAgICAkKCcuYWNjb3JkaW9uIGEuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykuY2xvc2VzdCgnLmFjY29yZGlvbi1ncm91cCcpLmZpbmQoJy5jb2xsYXBzZScpLmNvbGxhcHNlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICQuc2Nyb2xsVG8oJCgnLmFjY29yZGlvbiBhLmFjY29yZGlvbi10b2dnbGVbaHJlZj1cIicgKyBoYXNoICsgJ1wiXScpWzBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgICQoJyonKS5mb2N1cyhmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KCcudGFiYmFibGUgLnRhYi1wYW5lJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaGFzaD0gJyMnICsgJCh0aGlzKS5jbG9zZXN0KCcudGFiYmFibGUgLnRhYi1wYW5lJykuYXR0cignaWQnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcudGFiYmFibGUgdWwubmF2LXRhYnMgYVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykudGFiKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoJy5hY2NvcmRpb24gLmFjY29yZGlvbi1ib2R5Om5vdCguaW4pJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaGFzaCA9ICcjJyArICQodGhpcykuY2xvc2VzdCgnLmFjY29yZGlvbiAuYWNjb3JkaW9uLWJvZHknKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgICAgICAvLyQodGhpcykuY2xvc2VzdCgnLmFjY29yZGlvbicpLmZpbmQoJy5jb2xsYXBzZS5pbicpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmFjY29yZGlvbicpLmZpbmQoJ2EuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykuY2xvc2VzdCgnLmFjY29yZGlvbi1ncm91cCcpLmZpbmQoJy5jb2xsYXBzZScpLmNvbGxhcHNlKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnYVtkYXRhLXRvZ2dsZT1cInRhYlwiXScpLm9uKCdzaG93bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgdXJsKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvLyAkLmRhdGVwaWNrZXIuc2V0RGVmYXVsdHMoeyBkYXRlRm9ybWF0OiAneXktbW0tZGQnIH0pO1xyXG4gICAgLy8gJC50aW1lcGlja2VyLnNldERlZmF1bHRzKHsgZGF0ZUZvcm1hdDogJ3l5LW1tLWRkJywgdGltZUZvcm1hdDogJ2hoOm1tJywgc2VwYXJhdG9yOiAnICcgfSk7XHJcbiAgICBcclxuICAgICQoJ2JvZHknKS5SQUFTSW5pdElucHV0cygpO1xyXG4gICAgJCgnOnJlc2V0JykuY2xpY2soZnVuY3Rpb24oKSB7IGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCgpOyByZXR1cm4gZmFsc2U7IH0pO1xyXG4gICAgJCgnKltyZWwqPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoKS5jbGljayhmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlOyB9KTtcclxuICAgIFxyXG4gICAgJCgnKltkYXRhLXJhYXMtcm9sZSo9XCJ0cmVlXCJdJykuUkFBU190cmVlKCk7XHJcbiAgICAkKCcqW2RhdGEtcm9sZT1cInJhYXMtcmVwby1ibG9ja1wiXTpub3QoOmhhcyhbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWFkZFwiXSkpJylcclxuICAgICAgICAuZmluZCgnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1jb250YWluZXJcIl0nKVxyXG4gICAgICAgIC5hZnRlcignPGEgaHJlZj1cIiNcIiBkYXRhLXJvbGU9XCJyYWFzLXJlcG8tYWRkXCI+PGkgY2xhc3M9XCJpY29uIGljb24tcGx1c1wiPjwvaT48L2E+Jyk7XHJcbiAgICAkKCcqW2RhdGEtcm9sZT1cInJhYXMtcmVwby1lbGVtZW50XCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tZGVsXCJdKSksICpbZGF0YS1yb2xlPVwicmFhcy1yZXBvXCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tZGVsXCJdKSknKVxyXG4gICAgICAgIC5hcHBlbmQoJzxhIGhyZWY9XCIjXCIgZGF0YS1yb2xlPVwicmFhcy1yZXBvLWRlbFwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiPjwvaT48L2E+Jyk7XHJcbiAgICAkKCcqW2RhdGEtcm9sZT1cInJhYXMtcmVwby1lbGVtZW50XCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tbW92ZVwiXSkpLCAqW2RhdGEtcm9sZT1cInJhYXMtcmVwb1wiXTpub3QoOmhhcyhbZGF0YS1yb2xlPVwicmFhcy1yZXBvLW1vdmVcIl0pKScpXHJcbiAgICAgICAgLmFwcGVuZCgnPGEgaHJlZj1cIiNcIiBkYXRhLXJvbGU9XCJyYWFzLXJlcG8tbW92ZVwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLXJlc2l6ZS12ZXJ0aWNhbFwiPjwvaT48L2E+Jyk7XHJcbiAgICAkKCcqW2RhdGEtcm9sZT1cInJhYXMtcmVwby1ibG9ja1wiXScpLmVhY2goZnVuY3Rpb24oKSB7ICQodGhpcykuUkFBU19yZXBvKCkgfSk7XHJcbn0pOyJdLCJuYW1lcyI6WyJkYXRhIiwid2luZG93V2lkdGgiLCJib2R5V2lkdGgiLCJ3aW5kb3dIZWlnaHQiLCJzY3JvbGxUb3AiLCJvbGRTY3JvbGxUb3AiLCJpc1Njcm9sbGluZ05vdyIsImlzU2Nyb2xsaW5nTm93VGltZW91dElkIiwiaXNTY3JvbGxpbmdOb3dEZWxheSIsInNjcm9sbGluZ0luYWNjdXJhY3kiLCJzY3JvbGxUb1NlbGVjdG9yIiwibWVkaWFUeXBlcyIsInh4bCIsInhsIiwibGciLCJtZCIsInNtIiwieHMiLCJtb3VudGVkIiwic2VsZiIsImxpZ2h0Qm94SW5pdCIsIiQiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwib3V0ZXJIZWlnaHQiLCJvdXRlcldpZHRoIiwiZml4SHRtbCIsIm9uIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImRvY3VtZW50IiwiY3VycmVudFVybCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJzZWFyY2giLCJ1cmwiLCJhdHRyIiwic3BsaXQiLCJwcm9jZXNzSGFzaExpbmsiLCJoYXNoIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInRpdGxlIiwibWV0aG9kcyIsImFwaSIsInBvc3REYXRhIiwiYmxvY2tJZCIsInJlc3BvbnNlVHlwZSIsInJlcXVlc3RUeXBlIiwiYWRkaXRpb25hbEhlYWRlcnMiLCJhYm9ydENvbnRyb2xsZXIiLCJyZWFsVXJsIiwidGVzdCIsImhvc3QiLCJoZWFkZXJzIiwicngiLCJmZXRjaE9wdGlvbnMiLCJzaWduYWwiLCJtZXRob2QiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwibmFtZSIsImFwcGVuZCIsImJvZHkiLCJxdWVyeVN0cmluZyIsInN0cmluZ2lmeSIsImFycmF5Rm9ybWF0IiwiSlNPTiIsInJlc3BvbnNlIiwiZmV0Y2giLCJyZXN1bHQiLCJqc29uIiwidGV4dCIsImdldFNjcm9sbE9mZnNldCIsImRlc3RZIiwiZ2V0T2JqRnJvbUhhc2giLCIkb2JqIiwibGVuZ3RoIiwicmVwbGFjZSIsImpxRW1pdCIsImhhc0NsYXNzIiwibW9kYWwiLCIkaGFzaExpbmsiLCJocmVmIiwiY2xpY2siLCJzY3JvbGxUbyIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsInByb2Nlc3NBbGxJbWFnZUxpbmtzIiwic3dpcGUiLCJ0cmFuc2l0aW9uIiwidHlwZU1hcHBpbmciLCJwYXJhbXMiLCJPYmplY3QiLCJhc3NpZ24iLCJlYWNoIiwiZyIsInJlbW92ZUF0dHIiLCJsaWdodGNhc2UiLCJlIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInRyaWdnZXIiLCJjbGVhckludGVydmFsIiwiY29uZmlybSIsIm9rVGV4dCIsImNhbmNlbFRleHQiLCIkcmVmcyIsImZvcm1hdFByaWNlIiwicHJpY2UiLCJudW1UeHQiLCJ4IiwiZm9ybXMiLCJldmVudE5hbWUiLCJvcmlnaW5hbEV2ZW50IiwiZGVzdGluYXRpb24iLCJpbnN0YW50Iiwib2Zmc2V0IiwidG9wIiwiSFRNTEVsZW1lbnQiLCJqUXVlcnkiLCJNYXRoIiwibWF4Iiwicm91bmQiLCJtaW4iLCJzY3JvbGxUb0RhdGEiLCJsZWZ0IiwiYmVoYXZpb3IiLCJwcm90ZWN0U2Nyb2xsaW5nIiwiYm9keU91dGVySGVpZ2h0IiwicGFyc2VJbnQiLCJhYnMiLCJjb25zb2xlIiwibG9nIiwiY29tcHV0ZWQiLCJ3aW5kb3dCb3R0b21Qb3NpdGlvbiIsInNjcm9sbERlbHRhIiwiZml4ZWRIZWFkZXJBY3RpdmUiLCJmaXhlZEhlYWRlciIsIndhdGNoIiwiQXBwIiwiRml4ZWRIZWFkZXIiLCJtaXhpbnMiLCJlbCIsImxhc3RTY3JvbGxUb3AiLCJjb25maWciLCJyYWFzQ29uZmlnIiwicmFhc0FwcGxpY2F0aW9uRGF0YSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIiR0aGlzT2JqIiwiJGF1dG90ZXh0IiwiZGVmYXVsdFBhcmFtcyIsInNob3dJbnRlcnZhbCIsInRpbWVvdXRfaWQiLCJnZXRDb21wbGV0aW9uIiwiU2V0IiwiaSIsImVtcHR5IiwiaWQiLCJrZXkiLCJpbkFycmF5IiwidG9TdHJpbmciLCJpbWciLCJkZXNjcmlwdGlvbiIsInNob3ciLCJoaWRlIiwidGV4dE9uQ2hhbmdlIiwidmFsIiwiZ2V0SlNPTiIsIm9uQ2xpY2siLCJjYWxsYmFjayIsImFwcGx5IiwiaW5pdCIsImV4dGVuZCIsIm5leHQiLCJhZnRlciIsIiRwYXJhbXMiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsIl90eXBlb2YiLCJmaWxsIiwic2VsIiwiYmVmb3JlIiwidGhpc09iaiIsIlJBQVNfZmlsbFNlbGVjdCIsIm5vdCIsIm11bHRpc2VsZWN0IiwiYnV0dG9uVGV4dCIsInNlbGVjdCIsInNlbGVjdGVkIiwic3Vic3RyIiwibWF4SGVpZ2h0IiwiY2xvc2VzdCIsImZpbmQiLCJzaG93bkxldmVsIiwiaGlkZVVMIiwiYWRkUGx1c2VzIiwicHJlcGVuZCIsInVuZm9sZCIsInNsb3dseSIsImNoaWxkcmVuIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNsaWRlRG93biIsImZvbGQiLCJzbGlkZVVwIiwiY2xpY2tQbHVzIiwiY2xpY2tNaW51cyIsImFsZXJ0IiwiY2hhbmdlX3F1ZXJ5IiwiaW5jbHVkZV9kaXJzIiwiaW5pdGlhbF9wYXRoIiwicXVlcnlfZGlyIiwicXVlcnlfc3RyIiwib2xkX3F1ZXJ5IiwiY2hhbmdlIiwicXVlcnkiLCJ0ZW1wIiwibmV3X3F1ZXJ5Iiwiam9pbiIsIm9uQmVmb3JlQWRkIiwib25BZnRlckFkZCIsIm9uQmVmb3JlRGVsZXRlIiwib25BZnRlckRlbGV0ZSIsIiRyZXBvQmxvY2siLCIkcmVwb0NvbnRhaW5lciIsInJlcG9Db250YWluZXIiLCIkcmVwbyIsInJlcG8iLCJjaGVja1JlcXVpcmVkIiwiJHJlcG9FbGVtZW50IiwicmVwb0VsZW1lbnQiLCJyZXBvRGVsZXRlIiwicmVwb01vdmUiLCJyZXBvQWRkIiwiY2xvbmUiLCJyZXBvRWxlbWVudENoYW5nZXMiLCJSQUFTSW5pdElucHV0cyIsInJlbW92ZSIsImF4aXMiLCJzb3J0YWJsZSIsImNvbnRhaW5tZW50IiwiY2xpY2tDaGVja2JveCIsImdyb3VwIiwiJGxpIiwiZmlsdGVyIiwiaW5kZXgiLCJpcyIsInByb3AiLCJjbGlja0NoZWNrYm94QWNjdXJhdGUiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsImNsaWNrQ2hlY2tib3hBY2N1cmF0ZUxhYmVsIiwiUkFBU190cmVlIiwiUkFBU19hdXRvY29tcGxldGVyIiwiUkFBU19tZW51VHJlZSIsIlJBQVNfZ2V0U2VsZWN0IiwiUkFBU19yZXBvIiwiUkFBU19xdWVyeVN0cmluZyIsImZuIiwiYXBwIiwidnVlUm9vdCIsIlZ1ZSIsImNyZWF0ZUFwcCIsInJlZ2lzdGVyZWRSQUFTQ29tcG9uZW50cyIsImtleXMiLCJyYWFzQ29tcG9uZW50cyIsImZvckVhY2giLCJjb21wb25lbnRVUk4iLCJjb21wb25lbnQiLCJyZWFkeSIsIm1vdW50IiwidGFiIiwiY29sbGFwc2UiLCJmb2N1cyIsInJlbG9hZCIsInBvcG92ZXIiXSwic291cmNlUm9vdCI6IiJ9