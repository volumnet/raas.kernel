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

/***/ "./node_modules/@ckeditor/ckeditor5-integrations-common/dist/index.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-integrations-common/dist/index.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CKBOX_CDN_URL: () => (/* binding */ CKBOX_CDN_URL),
/* harmony export */   CK_CDN_URL: () => (/* binding */ CK_CDN_URL),
/* harmony export */   INJECTED_SCRIPTS: () => (/* binding */ INJECTED_SCRIPTS),
/* harmony export */   INJECTED_STYLESHEETS: () => (/* binding */ INJECTED_STYLESHEETS),
/* harmony export */   appendExtraPluginsToEditorConfig: () => (/* binding */ appendExtraPluginsToEditorConfig),
/* harmony export */   createCKBoxCdnUrl: () => (/* binding */ createCKBoxCdnUrl),
/* harmony export */   createCKCdnUrl: () => (/* binding */ createCKCdnUrl),
/* harmony export */   createDefer: () => (/* binding */ createDefer),
/* harmony export */   createIntegrationUsageDataPlugin: () => (/* binding */ createIntegrationUsageDataPlugin),
/* harmony export */   filterBlankObjectValues: () => (/* binding */ filterBlankObjectValues),
/* harmony export */   filterObjectValues: () => (/* binding */ filterObjectValues),
/* harmony export */   injectScript: () => (/* binding */ injectScript),
/* harmony export */   injectScriptsInParallel: () => (/* binding */ injectScriptsInParallel),
/* harmony export */   injectStylesheet: () => (/* binding */ injectStylesheet),
/* harmony export */   isCKEditorFreeLicense: () => (/* binding */ isCKEditorFreeLicense),
/* harmony export */   isSSR: () => (/* binding */ isSSR),
/* harmony export */   loadCKEditorCloud: () => (/* binding */ loadCKEditorCloud),
/* harmony export */   mapObjectValues: () => (/* binding */ mapObjectValues),
/* harmony export */   once: () => (/* binding */ once),
/* harmony export */   overwriteArray: () => (/* binding */ overwriteArray),
/* harmony export */   overwriteObject: () => (/* binding */ overwriteObject),
/* harmony export */   preloadResource: () => (/* binding */ preloadResource),
/* harmony export */   shallowCompareArrays: () => (/* binding */ shallowCompareArrays),
/* harmony export */   uid: () => (/* binding */ uid),
/* harmony export */   uniq: () => (/* binding */ uniq),
/* harmony export */   waitFor: () => (/* binding */ waitFor),
/* harmony export */   waitForWindowEntry: () => (/* binding */ waitForWindowEntry),
/* harmony export */   without: () => (/* binding */ without)
/* harmony export */ });
/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function createDefer() {
  const deferred = {
    resolve: null,
    promise: null
  };
  deferred.promise = new Promise((resolve) => {
    deferred.resolve = resolve;
  });
  return deferred;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function waitFor(callback, {
  timeOutAfter = 500,
  retryAfter = 100
} = {}) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let lastError = null;
    const timeoutTimerId = setTimeout(() => {
      reject(lastError ?? new Error("Timeout"));
    }, timeOutAfter);
    const tick = async () => {
      try {
        const result = await callback();
        clearTimeout(timeoutTimerId);
        resolve(result);
      } catch (err) {
        lastError = err;
        if (Date.now() - startTime > timeOutAfter) {
          reject(err);
        } else {
          setTimeout(tick, retryAfter);
        }
      }
    };
    tick();
  });
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
const INJECTED_SCRIPTS = /* @__PURE__ */ new Map();
function injectScript(src, { attributes } = {}) {
  if (INJECTED_SCRIPTS.has(src)) {
    return INJECTED_SCRIPTS.get(src);
  }
  const maybePrevScript = document.querySelector(`script[src="${src}"]`);
  if (maybePrevScript) {
    console.warn(`Script with "${src}" src is already present in DOM!`);
    maybePrevScript.remove();
  }
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.onerror = reject;
    script.onload = () => {
      resolve();
    };
    for (const [key, value] of Object.entries(attributes || {})) {
      script.setAttribute(key, value);
    }
    script.setAttribute("data-injected-by", "ckeditor-integration");
    script.type = "text/javascript";
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
    const observer = new MutationObserver((mutations) => {
      const removedNodes = mutations.flatMap((mutation) => Array.from(mutation.removedNodes));
      if (removedNodes.includes(script)) {
        INJECTED_SCRIPTS.delete(src);
        observer.disconnect();
      }
    });
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
  });
  INJECTED_SCRIPTS.set(src, promise);
  return promise;
}
async function injectScriptsInParallel(sources, props) {
  await Promise.all(
    sources.map((src) => injectScript(src, props))
  );
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
const INJECTED_STYLESHEETS = /* @__PURE__ */ new Map();
function injectStylesheet({
  href,
  placementInHead = "start",
  attributes = {}
}) {
  if (INJECTED_STYLESHEETS.has(href)) {
    return INJECTED_STYLESHEETS.get(href);
  }
  const maybePrevStylesheet = document.querySelector(`link[href="${href}"][rel="stylesheet"]`);
  if (maybePrevStylesheet) {
    console.warn(`Stylesheet with "${href}" href is already present in DOM!`);
    maybePrevStylesheet.remove();
  }
  const appendLinkTagToHead = (link) => {
    const previouslyInjectedLinks = Array.from(
      document.head.querySelectorAll('link[data-injected-by="ckeditor-integration"]')
    );
    switch (placementInHead) {
      case "start":
        if (previouslyInjectedLinks.length) {
          previouslyInjectedLinks.slice(-1)[0].after(link);
        } else {
          document.head.insertBefore(link, document.head.firstChild);
        }
        break;
      case "end":
        document.head.appendChild(link);
        break;
    }
  };
  const promise = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    for (const [key, value] of Object.entries(attributes || {})) {
      link.setAttribute(key, value);
    }
    link.setAttribute("data-injected-by", "ckeditor-integration");
    link.rel = "stylesheet";
    link.href = href;
    link.onerror = reject;
    link.onload = () => {
      resolve();
    };
    appendLinkTagToHead(link);
    const observer = new MutationObserver((mutations) => {
      const removedNodes = mutations.flatMap((mutation) => Array.from(mutation.removedNodes));
      if (removedNodes.includes(link)) {
        INJECTED_STYLESHEETS.delete(href);
        observer.disconnect();
      }
    });
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
  });
  INJECTED_STYLESHEETS.set(href, promise);
  return promise;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function isSSR() {
  return typeof window === "undefined";
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function once(fn) {
  let lastResult = null;
  return (...args) => {
    if (!lastResult) {
      lastResult = {
        current: fn(...args)
      };
    }
    return lastResult.current;
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function overwriteArray(source, destination) {
  destination.length = 0;
  destination.push(...source);
  return destination;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function overwriteObject(source, destination) {
  for (const prop of Object.getOwnPropertyNames(destination)) {
    delete destination[prop];
  }
  for (const [key, value] of Object.entries(source)) {
    if (value !== destination && key !== "prototype" && key !== "__proto__") {
      destination[key] = value;
    }
  }
  return destination;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function preloadResource(url, { attributes } = {}) {
  if (document.head.querySelector(`link[href="${url}"][rel="preload"]`)) {
    return;
  }
  const link = document.createElement("link");
  for (const [key, value] of Object.entries(attributes || {})) {
    link.setAttribute(key, value);
  }
  link.setAttribute("data-injected-by", "ckeditor-integration");
  link.rel = "preload";
  link.as = detectTypeOfResource(url);
  link.href = url;
  document.head.insertBefore(link, document.head.firstChild);
}
function detectTypeOfResource(url) {
  switch (true) {
    case /\.css$/.test(url):
      return "style";
    case /\.js$/.test(url):
      return "script";
    default:
      return "fetch";
  }
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function shallowCompareArrays(a, b) {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
const HEX_NUMBERS = new Array(256).fill("").map((_, index) => ("0" + index.toString(16)).slice(-2));
function uid() {
  const [r1, r2, r3, r4] = crypto.getRandomValues(new Uint32Array(4));
  return "e" + HEX_NUMBERS[r1 >> 0 & 255] + HEX_NUMBERS[r1 >> 8 & 255] + HEX_NUMBERS[r1 >> 16 & 255] + HEX_NUMBERS[r1 >> 24 & 255] + HEX_NUMBERS[r2 >> 0 & 255] + HEX_NUMBERS[r2 >> 8 & 255] + HEX_NUMBERS[r2 >> 16 & 255] + HEX_NUMBERS[r2 >> 24 & 255] + HEX_NUMBERS[r3 >> 0 & 255] + HEX_NUMBERS[r3 >> 8 & 255] + HEX_NUMBERS[r3 >> 16 & 255] + HEX_NUMBERS[r3 >> 24 & 255] + HEX_NUMBERS[r4 >> 0 & 255] + HEX_NUMBERS[r4 >> 8 & 255] + HEX_NUMBERS[r4 >> 16 & 255] + HEX_NUMBERS[r4 >> 24 & 255];
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function uniq(source) {
  return Array.from(new Set(source));
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
async function waitForWindowEntry(entryNames, config) {
  const tryPickBundle = () => entryNames.map((name) => window[name]).filter(Boolean)[0];
  return waitFor(
    () => {
      const result = tryPickBundle();
      if (!result) {
        throw new Error(`Window entry "${entryNames.join(",")}" not found.`);
      }
      return result;
    },
    config
  );
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function filterObjectValues(obj, filter) {
  const filteredEntries = Object.entries(obj).filter(([key, value]) => filter(value, key));
  return Object.fromEntries(filteredEntries);
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function filterBlankObjectValues(obj) {
  return filterObjectValues(
    obj,
    (value) => value !== null && value !== void 0
  );
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function mapObjectValues(obj, mapper) {
  const mappedEntries = Object.entries(obj).map(([key, value]) => [key, mapper(value, key)]);
  return Object.fromEntries(mappedEntries);
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function without(itemsToRemove, items) {
  return items.filter((item) => !itemsToRemove.includes(item));
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function appendExtraPluginsToEditorConfig(config, plugins) {
  const extraPlugins = config.extraPlugins || [];
  return {
    ...config,
    extraPlugins: [
      ...extraPlugins,
      ...plugins.filter((item) => !extraPlugins.includes(item))
    ]
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function isSemanticVersion(version) {
  return !!version && /^\d+\.\d+\.\d+/.test(version);
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function isCKCdnTestingVersion(version) {
  if (!version) {
    return false;
  }
  return ["nightly", "alpha", "internal", "nightly-", "staging"].some((testVersion) => version.includes(testVersion));
}
function isCKCdnVersion(version) {
  return isSemanticVersion(version) || isCKCdnTestingVersion(version);
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function destructureSemanticVersion(version) {
  if (!isSemanticVersion(version)) {
    throw new Error(`Invalid semantic version: ${version || "<blank>"}.`);
  }
  const [major, minor, patch] = version.split(".");
  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10)
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function getLicenseVersionFromEditorVersion(version) {
  if (isCKCdnTestingVersion(version)) {
    return 3;
  }
  const { major } = destructureSemanticVersion(version);
  switch (true) {
    case major >= 44:
      return 3;
    case major >= 38:
      return 2;
    default:
      return 1;
  }
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function getCKBaseBundleInstallationInfo() {
  const { CKEDITOR_VERSION, CKEDITOR } = window;
  if (!isCKCdnVersion(CKEDITOR_VERSION)) {
    return null;
  }
  return {
    source: CKEDITOR ? "cdn" : "npm",
    version: CKEDITOR_VERSION
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function getSupportedLicenseVersionInstallationInfo() {
  const installationInfo = getCKBaseBundleInstallationInfo();
  if (!installationInfo) {
    return null;
  }
  return getLicenseVersionFromEditorVersion(installationInfo.version);
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function isCKEditorFreeLicense(licenseKey, licenseVersion) {
  licenseVersion ||= getSupportedLicenseVersionInstallationInfo() || void 0;
  switch (licenseVersion) {
    case 1:
    case 2:
      return licenseKey === void 0;
    case 3:
      return licenseKey === "GPL";
    default: {
      return false;
    }
  }
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function createIntegrationUsageDataPlugin(integrationName, usageData) {
  return function IntegrationUsageDataPlugin(editor) {
    if (isCKEditorFreeLicense(editor.config.get("licenseKey"))) {
      return;
    }
    editor.on("collectUsageData", (source, { setUsageData }) => {
      setUsageData(`integration.${integrationName}`, usageData);
    });
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
const CK_CDN_URL = "https://cdn.ckeditor.com";
function createCKCdnUrl(bundle, file, version) {
  return `${CK_CDN_URL}/${bundle}/${version}/${file}`;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
const CKBOX_CDN_URL = "https://cdn.ckbox.io";
function createCKBoxCdnUrl(bundle, file, version) {
  return `${CKBOX_CDN_URL}/${bundle}/${version}/${file}`;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
const CK_DOCS_URL = "https://ckeditor.com/docs/ckeditor5";
function createCKDocsUrl(path, version = "latest") {
  return `${CK_DOCS_URL}/${version}/${path}`;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function createCKCdnBaseBundlePack({
  version,
  translations,
  createCustomCdnUrl = createCKCdnUrl
}) {
  const urls = {
    scripts: [
      // Load the main script of the base features.
      createCustomCdnUrl("ckeditor5", "ckeditor5.umd.js", version),
      // Load all JavaScript files from the base features.
      // EN bundle is prebuilt into the main script, so we don't need to load it separately.
      ...without(["en"], translations || []).map(
        (translation) => createCustomCdnUrl("ckeditor5", `translations/${translation}.umd.js`, version)
      )
    ],
    stylesheets: [
      createCustomCdnUrl("ckeditor5", "ckeditor5.css", version)
    ]
  };
  return {
    // Preload resources specified in the pack, before loading the main script.
    preload: [
      ...urls.stylesheets,
      ...urls.scripts
    ],
    scripts: [
      // It's safe to load translations and the main script in parallel.
      async (attributes) => injectScriptsInParallel(urls.scripts, attributes)
    ],
    // Load all stylesheets of the base features.
    stylesheets: urls.stylesheets,
    // Pick the exported global variables from the window object.
    checkPluginLoaded: async () => waitForWindowEntry(["CKEDITOR"]),
    // Check if the CKEditor base bundle is already loaded and throw an error if it is.
    beforeInject: () => {
      const installationInfo = getCKBaseBundleInstallationInfo();
      switch (installationInfo?.source) {
        case "npm":
          throw new Error(
            "CKEditor 5 is already loaded from npm. Check the migration guide for more details: " + createCKDocsUrl("updating/migration-to-cdn/vanilla-js.html")
          );
        case "cdn":
          if (installationInfo.version !== version) {
            throw new Error(
              `CKEditor 5 is already loaded from CDN in version ${installationInfo.version}. Remove the old <script> and <link> tags loading CKEditor 5 to allow loading the ${version} version.`
            );
          }
          break;
      }
    }
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function createCKCdnPremiumBundlePack({
  version,
  translations,
  createCustomCdnUrl = createCKCdnUrl
}) {
  const urls = {
    scripts: [
      // Load the main script of the premium features.
      createCustomCdnUrl("ckeditor5-premium-features", "ckeditor5-premium-features.umd.js", version),
      // Load all JavaScript files from the premium features.
      // EN bundle is prebuilt into the main script, so we don't need to load it separately.
      ...without(["en"], translations || []).map(
        (translation) => createCustomCdnUrl("ckeditor5-premium-features", `translations/${translation}.umd.js`, version)
      )
    ],
    stylesheets: [
      createCustomCdnUrl("ckeditor5-premium-features", "ckeditor5-premium-features.css", version)
    ]
  };
  return {
    // Preload resources specified in the pack, before loading the main script.
    preload: [
      ...urls.stylesheets,
      ...urls.scripts
    ],
    scripts: [
      // It's safe to load translations and the main script in parallel.
      async (attributes) => injectScriptsInParallel(urls.scripts, attributes)
    ],
    // Load all stylesheets of the premium features.
    stylesheets: urls.stylesheets,
    // Pick the exported global variables from the window object.
    checkPluginLoaded: async () => waitForWindowEntry(["CKEDITOR_PREMIUM_FEATURES"])
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
async function loadCKCdnResourcesPack(pack) {
  let {
    htmlAttributes = {},
    scripts = [],
    stylesheets = [],
    preload,
    beforeInject,
    checkPluginLoaded
  } = normalizeCKCdnResourcesPack(pack);
  beforeInject?.();
  if (!preload) {
    preload = uniq([
      ...stylesheets.filter((item) => typeof item === "string"),
      ...scripts.filter((item) => typeof item === "string")
    ]);
  }
  for (const url of preload) {
    preloadResource(url, {
      attributes: htmlAttributes
    });
  }
  await Promise.all(
    uniq(stylesheets).map((href) => injectStylesheet({
      href,
      attributes: htmlAttributes,
      placementInHead: "start"
    }))
  );
  for (const script of uniq(scripts)) {
    const injectorProps = {
      attributes: htmlAttributes
    };
    if (typeof script === "string") {
      await injectScript(script, injectorProps);
    } else {
      await script(injectorProps);
    }
  }
  return checkPluginLoaded?.();
}
function normalizeCKCdnResourcesPack(pack) {
  if (Array.isArray(pack)) {
    return {
      scripts: pack.filter(
        (item) => typeof item === "function" || item.endsWith(".js")
      ),
      stylesheets: pack.filter(
        (item) => item.endsWith(".css")
      )
    };
  }
  if (typeof pack === "function") {
    return {
      checkPluginLoaded: pack
    };
  }
  return pack;
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function combineCKCdnBundlesPacks(packs) {
  const normalizedPacks = mapObjectValues(
    filterBlankObjectValues(packs),
    normalizeCKCdnResourcesPack
  );
  const mergedPacks = Object.values(normalizedPacks).reduce(
    (acc, pack) => {
      acc.scripts.push(...pack.scripts ?? []);
      acc.stylesheets.push(...pack.stylesheets ?? []);
      acc.preload.push(...pack.preload ?? []);
      return acc;
    },
    {
      preload: [],
      scripts: [],
      stylesheets: []
    }
  );
  const checkPluginLoaded = async () => {
    const exportedGlobalVariables = /* @__PURE__ */ Object.create(null);
    for (const [name, pack] of Object.entries(normalizedPacks)) {
      exportedGlobalVariables[name] = await pack?.checkPluginLoaded?.();
    }
    return exportedGlobalVariables;
  };
  const beforeInject = () => {
    for (const pack of Object.values(normalizedPacks)) {
      pack.beforeInject?.();
    }
  };
  return {
    ...mergedPacks,
    beforeInject,
    checkPluginLoaded
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function getCKBoxInstallationInfo() {
  const version = window.CKBox?.version;
  if (!isSemanticVersion(version)) {
    return null;
  }
  return {
    source: "cdn",
    version
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function createCKBoxBundlePack({
  version,
  theme = "lark",
  translations,
  createCustomCdnUrl = createCKBoxCdnUrl
}) {
  return {
    // Load the main script of the base features.
    scripts: [
      createCustomCdnUrl("ckbox", "ckbox.js", version),
      // EN bundle is prebuilt into the main script, so we don't need to load it separately.
      ...without(["en"], translations || []).map(
        (translation) => createCustomCdnUrl("ckbox", `translations/${translation}.js`, version)
      )
    ],
    // Load optional theme, if provided. It's not required but recommended because it improves the look and feel.
    ...theme && {
      stylesheets: [
        createCustomCdnUrl("ckbox", `styles/themes/${theme}.css`, version)
      ]
    },
    // Pick the exported global variables from the window object.
    checkPluginLoaded: async () => waitForWindowEntry(["CKBox"]),
    // Check if the CKBox bundle is already loaded and throw an error if it is.
    beforeInject: () => {
      const installationInfo = getCKBoxInstallationInfo();
      if (installationInfo && installationInfo.version !== version) {
        throw new Error(
          `CKBox is already loaded from CDN in version ${installationInfo.version}. Remove the old <script> and <link> tags loading CKBox to allow loading the ${version} version.`
        );
      }
    }
  };
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function isCKCdnSupportedByEditorVersion(version) {
  if (isCKCdnTestingVersion(version)) {
    return true;
  }
  const { major } = destructureSemanticVersion(version);
  const licenseVersion = getLicenseVersionFromEditorVersion(version);
  switch (licenseVersion) {
    case 3:
      return true;
    default:
      return major === 43;
  }
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function combineCdnPluginsPacks(pluginsPacks) {
  const normalizedPluginsPacks = mapObjectValues(pluginsPacks, (pluginPack, pluginName) => {
    if (!pluginPack) {
      return void 0;
    }
    const normalizedPluginPack = normalizeCKCdnResourcesPack(pluginPack);
    return {
      // Provide default window accessor object if the plugin pack does not define it.
      checkPluginLoaded: async () => waitForWindowEntry([pluginName]),
      // Transform the plugin pack to a normalized advanced pack.
      ...normalizedPluginPack
    };
  });
  return combineCKCdnBundlesPacks(
    normalizedPluginsPacks
  );
}

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
function loadCKEditorCloud(config) {
  const {
    version,
    translations,
    plugins,
    premium,
    ckbox,
    createCustomCdnUrl,
    injectedHtmlElementsAttributes = {
      crossorigin: "anonymous"
    }
  } = config;
  validateCKEditorVersion(version);
  const pack = combineCKCdnBundlesPacks({
    CKEditor: createCKCdnBaseBundlePack({
      version,
      translations,
      createCustomCdnUrl
    }),
    ...premium && {
      CKEditorPremiumFeatures: createCKCdnPremiumBundlePack({
        version,
        translations,
        createCustomCdnUrl
      })
    },
    ...ckbox && {
      CKBox: createCKBoxBundlePack(ckbox)
    },
    loadedPlugins: combineCdnPluginsPacks(plugins ?? {})
  });
  return loadCKCdnResourcesPack(
    {
      ...pack,
      htmlAttributes: injectedHtmlElementsAttributes
    }
  );
}
function validateCKEditorVersion(version) {
  if (isCKCdnTestingVersion(version)) {
    console.warn(
      "You are using a testing version of CKEditor 5. Please remember that it is not suitable for production environments."
    );
  }
  if (!isCKCdnSupportedByEditorVersion(version)) {
    throw new Error(
      `The CKEditor 5 CDN can't be used with the given editor version: ${version}. Please make sure you are using at least the CKEditor 5 version 44.`
    );
  }
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@ckeditor/ckeditor5-vue/dist/ckeditor.js":
/*!***************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-vue/dist/ckeditor.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ckeditor: () => (/* binding */ _sfc_main),
/* harmony export */   CkeditorPlugin: () => (/* binding */ CkeditorPlugin),
/* harmony export */   loadCKEditorCloud: () => (/* reexport safe */ _ckeditor_ckeditor5_integrations_common__WEBPACK_IMPORTED_MODULE_1__.loadCKEditorCloud),
/* harmony export */   useCKEditorCloud: () => (/* binding */ useCKEditorCloud)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/debounce.js");
/* harmony import */ var _ckeditor_ckeditor5_integrations_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ckeditor/ckeditor5-integrations-common */ "./node_modules/@ckeditor/ckeditor5-integrations-common/dist/index.js");





/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
const VueIntegrationUsageDataPlugin = (0,_ckeditor_ckeditor5_integrations_common__WEBPACK_IMPORTED_MODULE_1__.createIntegrationUsageDataPlugin)(
  "vue",
  {
    version: "7.3.0",
    frameworkVersion: vue__WEBPACK_IMPORTED_MODULE_0__.version
  }
);
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
function appendAllIntegrationPluginsToConfig(editorConfig) {
  if ((0,_ckeditor_ckeditor5_integrations_common__WEBPACK_IMPORTED_MODULE_1__.isCKEditorFreeLicense)(editorConfig.licenseKey)) {
    return editorConfig;
  }
  return (0,_ckeditor_ckeditor5_integrations_common__WEBPACK_IMPORTED_MODULE_1__.appendExtraPluginsToEditorConfig)(editorConfig, [
    /**
     * This part of the code is not executed in open-source implementations using a GPL key.
     * It only runs when a specific license key is provided. If you are uncertain whether
     * this applies to your installation, please contact our support team.
     */
    VueIntegrationUsageDataPlugin
  ]);
}
const VUE_INTEGRATION_READ_ONLY_LOCK_ID = "Lock from Vue integration (@ckeditor/ckeditor5-vue)";
const INPUT_EVENT_DEBOUNCE_WAIT = 300;
const _sfc_main = /* @__PURE__ */ (0,vue__WEBPACK_IMPORTED_MODULE_0__.defineComponent)({
  ...{
    name: "CKEditor"
  },
  __name: "ckeditor",
  props: /* @__PURE__ */ (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeModels)({
    editor: {},
    config: { default: () => ({}) },
    tagName: { default: "div" },
    disabled: { type: Boolean, default: false },
    disableTwoWayDataBinding: { type: Boolean, default: false }
  }, {
    "modelValue": { type: String, default: "" },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeModels)(["ready", "destroy", "blur", "focus", "input", "update:modelValue"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const model = (0,vue__WEBPACK_IMPORTED_MODULE_0__.useModel)(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const element = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)();
    const instance = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)();
    const lastEditorData = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)();
    __expose({
      instance,
      lastEditorData
    });
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(model, (newModel) => {
      if (instance.value && newModel !== lastEditorData.value) {
        instance.value.data.set(newModel);
      }
    });
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(() => props.disabled, (readOnlyMode) => {
      if (readOnlyMode) {
        instance.value.enableReadOnlyMode(VUE_INTEGRATION_READ_ONLY_LOCK_ID);
      } else {
        instance.value.disableReadOnlyMode(VUE_INTEGRATION_READ_ONLY_LOCK_ID);
      }
    });
    function checkVersion() {
      const version2 = window.CKEDITOR_VERSION;
      if (!version2) {
        return console.warn('Cannot find the "CKEDITOR_VERSION" in the "window" scope.');
      }
      const [major] = version2.split(".").map(Number);
      if (major >= 42 || version2.startsWith("0.0.0")) {
        return;
      }
      console.warn("The <CKEditor> component requires using CKEditor 5 in version 42+ or nightly build.");
    }
    function setUpEditorEvents(editor) {
      const emitDebouncedInputEvent = (0,lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"])((evt) => {
        if (props.disableTwoWayDataBinding) {
          return;
        }
        const data = lastEditorData.value = editor.data.get();
        emit("update:modelValue", data, evt, editor);
        emit("input", data, evt, editor);
      }, INPUT_EVENT_DEBOUNCE_WAIT, { leading: true });
      editor.model.document.on("change:data", emitDebouncedInputEvent);
      editor.editing.view.document.on("focus", (evt) => {
        emit("focus", evt, editor);
      });
      editor.editing.view.document.on("blur", (evt) => {
        emit("blur", evt, editor);
      });
    }
    checkVersion();
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onMounted)(() => {
      const editorConfig = appendAllIntegrationPluginsToConfig(
        Object.assign({}, props.config)
      );
      if (model.value) {
        editorConfig.initialData = model.value;
      }
      props.editor.create(element.value, editorConfig).then((editor) => {
        instance.value = (0,vue__WEBPACK_IMPORTED_MODULE_0__.markRaw)(editor);
        setUpEditorEvents(editor);
        if (model.value !== editorConfig.initialData) {
          editor.data.set(model.value);
        }
        if (props.disabled) {
          editor.enableReadOnlyMode(VUE_INTEGRATION_READ_ONLY_LOCK_ID);
        }
        emit("ready", editor);
      }).catch((error) => {
        console.error(error);
      });
    });
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount)(() => {
      if (instance.value) {
        instance.value.destroy();
        instance.value = void 0;
      }
      emit("destroy");
    });
    return (_ctx, _cache) => {
      return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)((0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent)(_ctx.tagName), {
        ref_key: "element",
        ref: element
      }, null, 512);
    };
  }
});
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
const useAsync = (asyncFunc) => {
  const lastQueryUUID = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null);
  const error = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null);
  const data = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(null);
  const loading = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => lastQueryUUID.value !== null);
  (0,vue__WEBPACK_IMPORTED_MODULE_0__.watchEffect)(async () => {
    const currentQueryUID = (0,_ckeditor_ckeditor5_integrations_common__WEBPACK_IMPORTED_MODULE_1__.uid)();
    lastQueryUUID.value = currentQueryUID;
    data.value = null;
    error.value = null;
    const shouldDiscardQuery = () => lastQueryUUID.value !== currentQueryUID;
    try {
      const result = await asyncFunc();
      if (!shouldDiscardQuery()) {
        data.value = result;
      }
    } catch (err) {
      if (!shouldDiscardQuery()) {
        error.value = err;
      }
    } finally {
      if (!shouldDiscardQuery()) {
        lastQueryUUID.value = null;
      }
    }
  });
  return {
    loading: (0,vue__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly)(loading),
    data: (0,vue__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly)(data),
    error: (0,vue__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly)(error)
  };
};
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
function useCKEditorCloud(config) {
  return useAsync(
    () => (0,_ckeditor_ckeditor5_integrations_common__WEBPACK_IMPORTED_MODULE_1__.loadCKEditorCloud)(
      (0,vue__WEBPACK_IMPORTED_MODULE_0__.toValue)(config)
    )
  );
}
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
/* istanbul ignore if -- @preserve */
if (!vue__WEBPACK_IMPORTED_MODULE_0__.version || !vue__WEBPACK_IMPORTED_MODULE_0__.version.startsWith("3.")) {
  throw new Error(
    "The CKEditor plugin works only with Vue 3+. For more information, please refer to https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/vuejs-v3.html"
  );
}
const CkeditorPlugin = {
  /**
   * Installs the plugin, registering the `<ckeditor>` component.
   *
   * @param app The application instance.
   */
  install(app) {
    app.component("Ckeditor", _sfc_main);
  }
};

//# sourceMappingURL=ckeditor.js.map


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

/***/ "./node_modules/lodash-es/_Symbol.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_Symbol.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Built-in value references. */
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Symbol;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Symbol);


/***/ }),

/***/ "./node_modules/lodash-es/_baseGetTag.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseGetTag.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getRawTag.js */ "./node_modules/lodash-es/_getRawTag.js");
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_objectToString.js */ "./node_modules/lodash-es/_objectToString.js");




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? (0,_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)
    : (0,_objectToString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetTag);


/***/ }),

/***/ "./node_modules/lodash-es/_baseTrim.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseTrim.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _trimmedEndIndex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_trimmedEndIndex.js */ "./node_modules/lodash-es/_trimmedEndIndex.js");


/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, (0,_trimmedEndIndex_js__WEBPACK_IMPORTED_MODULE_0__["default"])(string) + 1).replace(reTrimStart, '')
    : string;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseTrim);


/***/ }),

/***/ "./node_modules/lodash-es/_freeGlobal.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_freeGlobal.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (freeGlobal);


/***/ }),

/***/ "./node_modules/lodash-es/_getRawTag.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getRawTag.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRawTag);


/***/ }),

/***/ "./node_modules/lodash-es/_objectToString.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_objectToString.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (objectToString);


/***/ }),

/***/ "./node_modules/lodash-es/_root.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_root.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "./node_modules/lodash-es/_freeGlobal.js");


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"] || freeSelf || Function('return this')();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (root);


/***/ }),

/***/ "./node_modules/lodash-es/_trimmedEndIndex.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_trimmedEndIndex.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (trimmedEndIndex);


/***/ }),

/***/ "./node_modules/lodash-es/debounce.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/debounce.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./now.js */ "./node_modules/lodash-es/now.js");
/* harmony import */ var _toNumber_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toNumber.js */ "./node_modules/lodash-es/toNumber.js");




/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = (0,_toNumber_js__WEBPACK_IMPORTED_MODULE_0__["default"])(wait) || 0;
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax((0,_toNumber_js__WEBPACK_IMPORTED_MODULE_0__["default"])(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = (0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge((0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  }

  function debounced() {
    var time = (0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (debounce);


/***/ }),

/***/ "./node_modules/lodash-es/isObject.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isObject.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObject);


/***/ }),

/***/ "./node_modules/lodash-es/isObjectLike.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/isObjectLike.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObjectLike);


/***/ }),

/***/ "./node_modules/lodash-es/isSymbol.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isSymbol.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    ((0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == symbolTag);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSymbol);


/***/ }),

/***/ "./node_modules/lodash-es/now.js":
/*!***************************************!*\
  !*** ./node_modules/lodash-es/now.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Date.now();
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (now);


/***/ }),

/***/ "./node_modules/lodash-es/toNumber.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/toNumber.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseTrim_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseTrim.js */ "./node_modules/lodash-es/_baseTrim.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/lodash-es/isSymbol.js");




/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if ((0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return NAN;
  }
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = (0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = (0,_baseTrim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toNumber);


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

/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = Vue;

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
/* harmony import */ var _ckeditor_ckeditor5_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ckeditor/ckeditor5-vue */ "./node_modules/@ckeditor/ckeditor5-vue/dist/ckeditor.js");












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
    RAASInitInputs: _libs_raas_init_inputs_js__WEBPACK_IMPORTED_MODULE_8__["default"]
  });
  $.extend({
    RAAS_queryString: _libs_raas_query_string_js__WEBPACK_IMPORTED_MODULE_9__["default"]
  });
});
var app, vueRoot;
vueRoot = app = Vue.createApp(_application_app_vue__WEBPACK_IMPORTED_MODULE_0__["default"]);
vueRoot.use(_ckeditor_ckeditor5_vue__WEBPACK_IMPORTED_MODULE_10__.Ckeditor);
window.registeredRAASComponents = {};
Object.keys(window.raasComponents).forEach(function (componentURN) {
  window.registeredRAASComponents[componentURN] = vueRoot.component(componentURN, raasComponents[componentURN]);
});
jQuery(document).ready(function ($) {
  window.app = app.mount('#top');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRSxZQUFZO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsTUFBTTtBQUMzRDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCx5QkFBeUIsK0VBQStFLFNBQVM7QUFDMUs7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxRQUFRO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMLHVEQUF1RDtBQUN2RCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFLFFBQVE7QUFDakY7QUFDQTtBQUNBOztBQUV3ZTtBQUN4ZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3owQjJCO0FBQzhMO0FBQ3BMO0FBQ3VJO0FBQzFFO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLHlHQUFnQztBQUN0RTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isd0NBQU87QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDhGQUFxQjtBQUMzQjtBQUNBO0FBQ0EsU0FBUyx5R0FBZ0M7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0Msb0RBQWU7QUFDakQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLHlCQUF5QixnREFBVztBQUNwQyxjQUFjO0FBQ2QsY0FBYyxrQkFBa0IsR0FBRztBQUNuQyxlQUFlLGdCQUFnQjtBQUMvQixnQkFBZ0IsK0JBQStCO0FBQy9DLGdDQUFnQztBQUNoQyxHQUFHO0FBQ0gsb0JBQW9CLDJCQUEyQjtBQUMvQztBQUNBLEdBQUc7QUFDSCx5QkFBeUIsZ0RBQVc7QUFDcEMsbUJBQW1CLGdDQUFnQztBQUNuRCxrQkFBa0IsNkNBQVE7QUFDMUI7QUFDQTtBQUNBLG9CQUFvQix3Q0FBRztBQUN2QixxQkFBcUIsd0NBQUc7QUFDeEIsMkJBQTJCLHdDQUFHO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJLDBDQUFLO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUksMENBQUs7QUFDVDtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLHFEQUFRO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sK0JBQStCLGVBQWU7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLElBQUksOENBQVM7QUFDYjtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLDRDQUFPO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksb0RBQWU7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGFBQWEsOENBQVMsSUFBSSxnREFBVyxDQUFDLDREQUF1QjtBQUM3RDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix3Q0FBRztBQUMzQixnQkFBZ0Isd0NBQUc7QUFDbkIsZUFBZSx3Q0FBRztBQUNsQixrQkFBa0IsNkNBQVE7QUFDMUIsRUFBRSxnREFBVztBQUNiLDRCQUE0Qiw0RUFBRztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsYUFBYSxvREFBZTtBQUM1QixVQUFVLG9EQUFlO0FBQ3pCLFdBQVcsb0RBQWU7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsMEZBQWlCO0FBQzNCLE1BQU0sNENBQU87QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyx3Q0FBVyxLQUFLLHdDQUFXO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNRTtBQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuTjZDO0FBQ3dCO0FBRXJFLGlFQUFlO0VBQ1hLLE1BQU0sRUFBRSxDQUFDRixrRUFBRyxFQUFFQyxrRkFBVyxDQUFDO0VBQzFCRSxFQUFFLEVBQUUsV0FBVztFQUNmL0ksSUFBSSxXQUFKQSxJQUFJQSxDQUFBLEVBQUc7SUFDSCxJQUFJc0UsTUFBSyxHQUFJO01BQ1RtRSxpQkFBaUIsRUFBRSxLQUFLO01BQ3hCTyxhQUFhLEVBQUUsQ0FBQztNQUNoQkMsTUFBTSxFQUFFM0gsTUFBTSxDQUFDNEg7SUFDbkIsQ0FBQztJQUNELElBQUk1SCxNQUFNLENBQUM2SCxtQkFBbUIsRUFBRTtNQUM1QnRELE1BQU0sQ0FBQ0MsTUFBTSxDQUFDeEIsTUFBTSxFQUFFaEQsTUFBTSxDQUFDNkgsbUJBQW1CLENBQUM7SUFDckQ7SUFDQSxPQUFPN0UsTUFBTTtFQUNqQixDQUFDO0VBQ0QzQixPQUFPLEVBQUU7SUFDTHZCLFlBQVksV0FBWkEsWUFBWUEsQ0FBQSxFQUFlO01BQUEsSUFBZGtFLE9BQU0sR0FBQThELFNBQUEsQ0FBQXZFLE1BQUEsUUFBQXVFLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUksQ0FBQyxDQUFDO0lBQ3pCO0VBQ0o7QUFDSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0QkQseUJBQXlCLEVBQUU7QUFDM0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsa0JBQWtCLG1CQUFtQjtBQUNyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekZPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsS0FBSyxJQUEwQztBQUMvQztBQUNBLEVBQUUsaUNBQU8sQ0FBQywyQ0FBUSxDQUFDLG9DQUFFLE9BQU87QUFBQTtBQUFBO0FBQUEsa0dBQUM7QUFDN0IsR0FBRyxLQUFLLEVBTU47QUFDRixDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwyREFBMkQ7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdE42Qjs7QUFFOUI7QUFDQSxhQUFhLGdEQUFJOztBQUVqQixpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMWTtBQUNNO0FBQ1U7O0FBRWxEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixrREFBTSxHQUFHLGtEQUFNOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLHlEQUFTO0FBQ2YsTUFBTSw4REFBYztBQUNwQjs7QUFFQSxpRUFBZSxVQUFVLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0IwQjs7QUFFcEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLCtEQUFlO0FBQ3JDO0FBQ0E7O0FBRUEsaUVBQWUsUUFBUSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbEJ4QjtBQUNBOztBQUVBLGlFQUFlLFVBQVUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIUTs7QUFFbEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixrREFBTSxHQUFHLGtEQUFNOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0N6QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxjQUFjLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckJZOztBQUUxQztBQUNBOztBQUVBO0FBQ0EsV0FBVyxzREFBVTs7QUFFckIsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDUnBCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxlQUFlLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQk07QUFDVjtBQUNVOztBQUVyQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRLFdBQVc7QUFDOUIsV0FBVyxTQUFTO0FBQ3BCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsK0NBQStDLGlCQUFpQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsd0RBQVE7QUFDakIsTUFBTSx3REFBUTtBQUNkO0FBQ0E7QUFDQSxpQ0FBaUMsd0RBQVE7QUFDekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLG1EQUFHO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5REFBeUQsbURBQUc7QUFDNUQ7O0FBRUE7QUFDQSxlQUFlLG1EQUFHO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFFBQVEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzlMeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFFBQVEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzlCeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsWUFBWSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QmM7QUFDRzs7QUFFN0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssNERBQVksV0FBVywwREFBVTtBQUN0Qzs7QUFFQSxpRUFBZSxRQUFRLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUJNOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLFNBQVMsZ0RBQUk7QUFDYjs7QUFFQSxpRUFBZSxHQUFHLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Qm1CO0FBQ0Q7QUFDQTs7QUFFckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sd0RBQVE7QUFDZDtBQUNBO0FBQ0EsTUFBTSx3REFBUTtBQUNkO0FBQ0EsWUFBWSx3REFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsd0RBQVE7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxRQUFRLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvRDJCO0FBQ1o7QUFDRzs7QUFFMUM7O0FBRUE7QUFDQSw2RkFBNkYsMkNBQTJDOztBQUV4STs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsZ0VBQWU7QUFDeEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFCQUFxQiwwREFBWTs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQiwwREFBWTs7QUFFaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCwyQ0FBMkMsSUFBSTtBQUMzRztBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFXO0lBQUUsT0FBTyxLQUFLO0VBQUUsQ0FBQyxDQUFDO0VBRXBFL0QsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUMyTyxTQUFTLENBQUMsQ0FBQztFQUMxQzNPLENBQUMsQ0FBQyx1RUFBdUUsQ0FBQyxDQUNyRStLLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUN6Q3BCLEtBQUssQ0FBQywwRUFBMEUsQ0FBQztFQUN0RjNKLENBQUMsQ0FBQywwSUFBMEksQ0FBQyxDQUN4SXlDLE1BQU0sQ0FBQyw0RUFBNEUsQ0FBQztFQUN6RnpDLENBQUMsQ0FBQyw0SUFBNEksQ0FBQyxDQUMxSXlDLE1BQU0sQ0FBQyxzRkFBc0YsQ0FBQztFQUNuR3pDLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDMEUsSUFBSSxDQUFDLFlBQVc7SUFBRTFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQytPLFNBQVMsQ0FBQyxDQUFDO0VBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4uL3JhYXMuY21zL3Jlc291cmNlcy9qcy52dWUzL2FwcGxpY2F0aW9uL2FwcC52dWUuanMiLCJ3ZWJwYWNrOi8vLy4uL3JhYXMuY21zL3Jlc291cmNlcy9qcy52dWUzL2FwcGxpY2F0aW9uL21peGlucy9maXhlZC1oZWFkZXIudnVlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AY2tlZGl0b3IvY2tlZGl0b3I1LWludGVncmF0aW9ucy1jb21tb24vZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGNrZWRpdG9yL2NrZWRpdG9yNS12dWUvZGlzdC9ja2VkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uL2FwcC52dWUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2RlY29kZS11cmktY29tcG9uZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWx0ZXItb2JqL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcXVlcnkuc2Nyb2xsdG8vanF1ZXJ5LnNjcm9sbFRvLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlR2V0VGFnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VUcmltLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2ZyZWVHbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0UmF3VGFnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX29iamVjdFRvU3RyaW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3Jvb3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fdHJpbW1lZEVuZEluZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0TGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzU3ltYm9sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbm93LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvdG9OdW1iZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3F1ZXJ5LXN0cmluZy9iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9xdWVyeS1zdHJpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NwbGl0LW9uLWZpcnN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvZXhwb3J0SGVscGVyLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvYXBwbGljYXRpb24vYXBwLnZ1ZT85ZjgxIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvYXBwbGljYXRpb24vYXBwLnZ1ZT9iNDBlIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLmF1dG9jb21wbGV0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMuZmlsbC1zZWxlY3QuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMuZ2V0LXNlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5pbml0LWlucHV0cy5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2xpYnMvcmFhcy5tZW51LXRyZWUuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMucXVlcnktc3RyaW5nLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvbGlicy9yYWFzLnJlcG8uanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9saWJzL3JhYXMudHJlZS5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgdmFyIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHZhciBcIlZ1ZVwiIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL2FwcGxpY2F0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDQmtCw0YDQutCw0YEg0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCo0LjRgNC40L3QsCDRjdC60YDQsNC90LBcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoOiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCo0LjRgNC40L3QsCBib2R5XHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBib2R5V2lkdGg6IDAsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0JLRi9GB0L7RgtCwINGN0LrRgNCw0L3QsFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgd2luZG93SGVpZ2h0OiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCh0LzQtdGJ0LXQvdC40LUg0L/QviDQstC10YDRgtC40LrQsNC70LhcclxuICAgICAgICAgICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjcm9sbFRvcDogMCxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQodGC0LDRgNC+0LUg0YHQvNC10YnQtdC90LjQtSDQv9C+INCy0LXRgNGC0LjQutCw0LvQuFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgb2xkU2Nyb2xsVG9wOiAwLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCf0YDQvtC40YHRhdC+0LTQuNGCINC70Lgg0YHQtdC50YfQsNGBINGB0LrRgNC+0LvQu9C40L3Qs1xyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlzU2Nyb2xsaW5nTm93OiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQn9GA0L7QuNGB0YXQvtC00LjRgiDQu9C4INGB0LXQudGH0LDRgSDRgdC60YDQvtC70LvQuNC90LMgKElEIyDRgtCw0LnQvNCw0YPRgtCwKVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQ6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCe0LbQuNC00LDQvdC40LUg0L7QutC+0L3Rh9Cw0L3QuNGPINGB0LrRgNC+0LvQu9C40L3Qs9CwLCDQvNGBXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpc1Njcm9sbGluZ05vd0RlbGF5OiAyNTAsXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0J/QvtCz0YDQtdGI0L3QvtGB0YLRjCDRgdC60YDQvtC70LvQuNC90LPQsFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2Nyb2xsaW5nSW5hY2N1cmFjeTogNSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQodC10LvQtdC60YLQvtGAINGB0YHRi9C70L7QuiDQtNC70Y8gc2Nyb2xsVG9cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjcm9sbFRvU2VsZWN0b3I6ICdhW2hyZWYqPVwibW9kYWxcIl1baHJlZio9XCIjXCJdLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnYS5zY3JvbGxUb1tocmVmKj1cIiNcIl0sICcgKyBcclxuICAgICAgICAgICAgICAgICdhW2hyZWZePVwiI1wiXTpub3QoW2hyZWY9XCIjXCJdKTpub3QoW2RhdGEtdG9nZ2xlXSk6bm90KFtkYXRhLWJzLXRvZ2dsZV0pLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnLm1lbnUtdG9wX19saW5rW2hyZWYqPVwiI1wiXSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJy5tZW51LW1haW5fX2xpbmtbaHJlZio9XCIjXCJdLCAnICsgXHJcbiAgICAgICAgICAgICAgICAnLm1lbnUtYm90dG9tX19saW5rW2hyZWYqPVwiI1wiXSwgJyArIFxyXG4gICAgICAgICAgICAgICAgJy5tZW51LW1vYmlsZV9fbGlua1tocmVmKj1cIiNcIl0nLFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0JzQtdC00LjQsC3RgtC40L/RiyAo0YjQuNGA0LjQvdCwINCyIHB4KVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWVkaWFUeXBlczoge1xyXG4gICAgICAgICAgICAgICAgeHhsOiAxNDAwLFxyXG4gICAgICAgICAgICAgICAgeGw6IDEyMDAsXHJcbiAgICAgICAgICAgICAgICBsZzogOTkyLFxyXG4gICAgICAgICAgICAgICAgbWQ6IDc2OCxcclxuICAgICAgICAgICAgICAgIHNtOiA1NzYsXHJcbiAgICAgICAgICAgICAgICB4czogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgbW91bnRlZCgpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5saWdodEJveEluaXQoKTtcclxuICAgICAgICB0aGlzLndpbmRvd1dpZHRoID0gJCh3aW5kb3cpLmlubmVyV2lkdGgoKTtcclxuICAgICAgICB0aGlzLndpbmRvd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgIHRoaXMuYm9keVdpZHRoID0gJCgnYm9keScpLm91dGVyV2lkdGgoKTtcclxuICAgICAgICB0aGlzLmZpeEh0bWwoKTtcclxuICAgICAgICAkKHdpbmRvdylcclxuICAgICAgICAgICAgLm9uKCdyZXNpemUnLCBzZWxmLmZpeEh0bWwpXHJcbiAgICAgICAgICAgIC5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dXaWR0aCA9ICQod2luZG93KS5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2R5V2lkdGggPSAkKCdib2R5Jykub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ3Njcm9sbCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBvbGRTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2Nyb2xsaW5nTm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1Njcm9sbGluZ05vdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2Nyb2xsaW5nTm93VGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2xkU2Nyb2xsVG9wID0gb2xkU2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmdOb3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuaXNTY3JvbGxpbmdOb3dEZWxheSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNjcm9sbFRvU2VsZWN0b3IsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJykuc3BsaXQoJyMnKVswXTtcclxuICAgICAgICAgICAgLy8gaWYgKHVybCkge1xyXG4gICAgICAgICAgICAvLyAgICAgdXJsID0gJyMnICsgdXJsO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmICghdXJsIHx8ICh1cmwgPT0gY3VycmVudFVybCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHJvY2Vzc0hhc2hMaW5rKHRoaXMuaGFzaCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignc2hvdy5icy50YWInLCAnYScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgJCh0aGlzKS5hdHRyKCdocmVmJykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIYXNoTGluayh3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjcm9sbFRvcCA9IHRoaXMub2xkU2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICAvLyAkKCcubWVudS10cmlnZ2VyJykuYXBwZW5kVG8oJy5ib2R5X19tZW51LW1vYmlsZScpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLmNvbmZpcm0gPSB0aGlzLnJlZnMuY29uZmlybTtcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7RgtC/0YDQsNCy0LvRj9C10YIg0LfQsNC/0YDQvtGBINC6IEFQSVxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIFVSTCDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuFxyXG4gICAgICAgICAqIEBwYXJhbSAge21peGVkfSBwb3N0RGF0YSBQT1NULdC00LDQvdC90YvQtSDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuCAo0LXRgdC70LggbnVsbCwg0YLQviBHRVQt0LfQsNC/0YDQvtGBKVxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcn0gYmxvY2tJZCBJRCMg0LHQu9C+0LrQsCDQtNC70Y8g0LTQvtCx0LDQstC70LXQvdC40Y8gQUpBWD17YmxvY2tJZH0g0Lgg0LfQsNCz0L7Qu9C+0LLQutCwIFgtUkFBUy1CbG9jay1JZFxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVzcG9uc2VUeXBlIE1JTUUt0YLQuNC/INC/0L7Qu9GD0YfQsNC10LzQvtCz0L4g0L7RgtCy0LXRgtCwICjQtdGB0LvQuCDQv9GA0LjRgdGD0YLRgdGC0LLRg9C10YIg0YHQu9GN0YggLywg0YLQviDQvtGC0L/RgNCw0LLQu9GP0LXRgtGB0Y8g0YLQsNC60LbQtSDQt9Cw0LPQvtC70L7QstC+0LogQWNjZXB0KVxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVxdWVzdFR5cGUgTUlNRS3RgtC40L8g0LfQsNC/0YDQvtGB0LAgKNC10YHQu9C4INC/0YDQuNGB0YPRgtGB0YLQstGD0LXRgiDRgdC70Y3RiCAvLCDRgtC+INC+0YLQv9GA0LDQstC70Y/QtdGC0YHRjyDRgtCw0LrQttC1INC30LDQs9C+0LvQvtCy0L7QuiBDb250ZW50LVR5cGUpXHJcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBhZGRpdGlvbmFsSGVhZGVycyDQlNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC30LDQs9C+0LvQvtCy0LrQuFxyXG4gICAgICAgICAqIEBwYXJhbSB7QWJvcnRDb250cm9sbGVyfG51bGx9IGFib3J0Q29udHJvbGxlciDQmtC+0L3RgtGA0L7Qu9C70LXRgCDQv9GA0LXRgNGL0LLQsNC90LjRj1xyXG4gICAgICAgICAqIEByZXR1cm4ge21peGVkfSDQoNC10LfRg9C70YzRgtCw0YIg0LfQsNC/0YDQvtGB0LBcclxuICAgICAgICAgKi9cclxuICAgICAgICBhc3luYyBhcGkoXHJcbiAgICAgICAgICAgIHVybCwgXHJcbiAgICAgICAgICAgIHBvc3REYXRhID0gbnVsbCwgXHJcbiAgICAgICAgICAgIGJsb2NrSWQgPSBudWxsLCBcclxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlID0gJ2FwcGxpY2F0aW9uL2pzb24nLCBcclxuICAgICAgICAgICAgcmVxdWVzdFR5cGUgPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcclxuICAgICAgICAgICAgYWRkaXRpb25hbEhlYWRlcnMgPSB7fSxcclxuICAgICAgICAgICAgYWJvcnRDb250cm9sbGVyID0gbnVsbCxcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8gMjAyMy0xMS0wOSwgQVZTOiDQtNC+0LHQsNCy0LjQuyDQtNC10LvQtdC90LjQtSDQv9C+ICMsINGCLtC6LiDRhdGN0YjRgtC10LPQuCDQtNC70Y8g0YHQtdGA0LLQtdGA0LAg0YHQvNGL0YHQu9CwINC90LUg0LjQvNC10Y7RglxyXG4gICAgICAgICAgICBsZXQgcmVhbFVybCA9IHVybC5zcGxpdCgnIycpWzBdO1xyXG4gICAgICAgICAgICBpZiAoIS9cXC9cXC8vZ2kudGVzdChyZWFsVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlYWxVcmxbMF0gIT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbFVybCA9ICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHJlYWxVcmw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxVcmwgPSAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyByZWFsVXJsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7Li4uYWRkaXRpb25hbEhlYWRlcnN9O1xyXG4gICAgICAgICAgICBsZXQgcng7XHJcbiAgICAgICAgICAgIGlmIChibG9ja0lkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIS8oXFw/fCYpQUpBWD0vZ2kudGVzdChyZWFsVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxVcmwgKz0gKC9cXD8vZ2kudGVzdChyZWFsVXJsKSA/ICcmJyA6ICc/JykgKyAnQUpBWD0nICsgYmxvY2tJZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ1gtUkFBUy1CbG9jay1JZCddID0gYmxvY2tJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoL1xcLy9naS50ZXN0KHJlc3BvbnNlVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gcmVzcG9uc2VUeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgvXFwvL2dpLnRlc3QocmVxdWVzdFR5cGUpICYmICEhcG9zdERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gcmVxdWVzdFR5cGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZmV0Y2hPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGFib3J0Q29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLnNpZ25hbCA9IGFib3J0Q29udHJvbGxlci5zaWduYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEhcG9zdERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5tZXRob2QgPSAnUE9TVCc7XHJcbiAgICAgICAgICAgICAgICBpZiAoL2Zvcm0vZ2kudGVzdChyZXF1ZXN0VHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoL211bHRpcGFydC9naS50ZXN0KHJlcXVlc3RUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm9ybURhdGEgID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3N0RGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YSA9IHBvc3REYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBwb3N0RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChuYW1lLCBwb3N0RGF0YVtuYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLmJvZHkgPSBmb3JtRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyDQotCw0Lwg0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60LggYm91bmRhcnkg0YHRgtCw0LLQuNGC0YHRjywg0LHQtdC3INC90LXQs9C+INGE0LjQs9C90Y8g0L/QvtC70YPRh9Cw0LXRgtGB0Y9cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMuYm9keSA9IHdpbmRvdy5xdWVyeVN0cmluZy5zdHJpbmdpZnkocG9zdERhdGEsIHsgYXJyYXlGb3JtYXQ6ICdicmFja2V0JyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgcG9zdERhdGEpID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2hPcHRpb25zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoT3B0aW9ucy5ib2R5ID0gcG9zdERhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmZXRjaE9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZmV0Y2hPcHRpb25zKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZWFsVXJsLCBmZXRjaE9wdGlvbnMpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAoL2pzb24vZ2kudGVzdChyZXNwb25zZVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINGB0LzQtdGJ0LXQvdC40LUg0L/QviDQstC10YDRgtC40LrQsNC70Lgg0LTQu9GPIHNjcm9sbFRvIFxyXG4gICAgICAgICAqICjQtNC70Y8g0YHQu9GD0YfQsNGPINGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC5INGI0LDQv9C60LgpXHJcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlc3RZINCi0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y9cclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0U2Nyb2xsT2Zmc2V0KGRlc3RZID0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0L7QsdGK0LXQutGC0LAg0L/QviDRhdGN0Ygt0YLQtdCz0YNcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaGFzaCDRhdGN0Ygt0YLQtdCzICjQv9C10YDQstGL0Lkg0YHQuNC80LLQvtC7ICMpXHJcbiAgICAgICAgICogQHJldHVybiB7alF1ZXJ5fG51bGx9IG51bGwsINC10YHQu9C4INC90LUg0L3QsNC50LTQtdC9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0T2JqRnJvbUhhc2goaGFzaCkge1xyXG4gICAgICAgICAgICBpZiAoaGFzaFswXSAhPSAnIycpIHtcclxuICAgICAgICAgICAgICAgIGhhc2ggPSAnIycgKyBoYXNoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCAkb2JqID0gJChoYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRvYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG9iajtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgJG9iaiA9ICQoJ1tuYW1lPVwiJyArIGhhc2gucmVwbGFjZSgnIycsICcnKSArICdcIl0nKTtcclxuICAgICAgICAgICAgaWYgKCRvYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG9iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQntCx0YDQsNCx0LDRgtGL0LLQsNC10YIg0YXRjdGILdGB0YHRi9C70LrRg1xyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBoYXNoINGF0Y3RiC3RgtC10LMgKNC/0LXRgNCy0YvQuSDRgdC40LzQstC+0LsgIylcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm9jZXNzSGFzaExpbmsoaGFzaCkge1xyXG4gICAgICAgICAgICB0aGlzLmpxRW1pdCgncHJvY2Vzc0hhc2hMaW5rJywgaGFzaCk7XHJcbiAgICAgICAgICAgIGxldCAkb2JqID0gdGhpcy5nZXRPYmpGcm9tSGFzaChoYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRvYmogJiYgJG9iai5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkb2JqLmhhc0NsYXNzKCdtb2RhbCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG9iai5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkb2JqLmhhc0NsYXNzKCd0YWItcGFuZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0ICRoYXNoTGluayA9ICQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhW2hyZWY9XCInICsgaGFzaCArICdcIl0sICcgKyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FbaHJlZj1cIicgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoICsgaGFzaCArICdcIl0sICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYVtocmVmPVwiJyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgJ1wiXSdcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkaGFzaExpbmsubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRoYXNoTGlua1swXS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUbygkb2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPIGxpZ2h0Qm94J9CwXHJcbiAgICAgICAgICogKNC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyBsaWdodENhc2UpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGlnaHRCb3hJbml0KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgICAgICBsZXQgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzQWxsSW1hZ2VMaW5rczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN3aXBlOiB0cnVlLCBcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdzY3JvbGxIb3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAgIHR5cGVNYXBwaW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2ltYWdlJzogJ2pwZyxqcGVnLGdpZixwbmcsYm1wLHdlYnAsc3ZnJywgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIGxldCByeCA9IC9cXC4oanBnfGpwZWd8cGpwZWd8cG5nfGdpZnx3ZWJwfHN2ZykkL2k7XHJcbiAgICAgICAgICAgICQoJ2E6bm90KFtkYXRhLXJlbF49bGlnaHRjYXNlXSk6bm90KFtkYXRhLW5vLWxpZ2h0Ym94XSknKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMucHJvY2Vzc0FsbEltYWdlTGlua3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocngudGVzdCgkKHRoaXMpLmF0dHIoJ2hyZWYnKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdkYXRhLWxpZ2h0Ym94JywgJ3RydWUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgZyA9ICQodGhpcykuYXR0cignZGF0YS1saWdodGJveC1nYWxsZXJ5Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZyB8fCAkKHRoaXMpLmF0dHIoJ2RhdGEtbGlnaHRib3gnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignZGF0YS1yZWwnLCAnbGlnaHRjYXNlJyArIChnID8gJzonICsgZyA6ICcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdkYXRhLWxpZ2h0Ym94LWdhbGxlcnknKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoJ2RhdGEtbGlnaHRib3gnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJ2FbZGF0YS1yZWxePWxpZ2h0Y2FzZV0nKS5saWdodGNhc2UocGFyYW1zKTtcclxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljay5saWdodGNhc2UnLCAnYScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoL3lvdXR1L2dpLnRlc3QoJCh0aGlzKS5hdHRyKCdocmVmJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JrQvtGB0YLRi9C70YwsINGH0YLQvtCx0Ysg0L3QtSDQtNC+0LbQuNC00LDRgtGM0YHRjyDQv9C+0LvQvdC+0Lkg0LfQsNCz0YDRg9C30LrQuCBZb3V0dWJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMjAyMy0wOS0xMywgQVZTOiDQtNC+0LHQsNCy0LjQu9C4INC/0LDRgNCw0LzQtdGC0YAgcmFhcy1saWdodGNhc2UtbG9hZGVkINGH0YLQvtCx0Ysg0L7QsdGA0LDQsdCw0YLRi9Cy0LDRgtGMINCz0LDQu9C10YDQtdGOINCy0LjQtNC10L5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2xpZ2h0Y2FzZS1jYXNlIGlmcmFtZTpub3QoW3JhYXMtbGlnaHRjYXNlLWxvYWRlZF0pJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjbGlnaHRjYXNlLWNhc2UgaWZyYW1lOm5vdChbcmFhcy1saWdodGNhc2UtbG9hZGVkXSknKS5hdHRyKCdyYWFzLWxpZ2h0Y2FzZS1sb2FkZWQnLCAnMScpLnRyaWdnZXIoJ2xvYWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC40LrRgdCw0YbQuNGPIEhUTUwgKNGF0LXQu9C/0LXRgCDQtNC70Y8g0LzQvtC00LjRhNC40LrQsNGG0LjQuCDQstC10YDRgdGC0LrQuClcclxuICAgICAgICAgKiAo0LDQsdGB0YLRgNCw0LrRgtC90YvQuSwg0LTQu9GPINC/0LXRgNC10L7Qv9GA0LXQtNC10LvQtdC90LjRjylcclxuICAgICAgICAgKi9cclxuICAgICAgICBmaXhIdG1sKCkge1xyXG4gICAgICAgICAgICAvLyAuLi5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0L7RgtC+0LHRgNCw0LbQtdC90LjRjyDQvtC60L3QsCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRj1xyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGV4dCAgICAgICDQotC10LrRgdGCINC30LDQv9GA0L7RgdCwXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBva1RleHQgICAgINCi0LXQutGB0YIg0LrQvdC+0L/QutC4IFwi0J7QmlwiXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBjYW5jZWxUZXh0INCi0LXQutGB0YIg0LrQvdC+0L/QutC4IFwi0J7RgtC80LXQvdCwXCJcclxuICAgICAgICAgKiBAcmV0dXJuIHtqUXVlcnkuUHJvbWlzZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25maXJtKHRleHQsIG9rVGV4dCwgY2FuY2VsVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kcmVmcy5jb25maXJtLmNvbmZpcm0odGV4dCwgb2tUZXh0LCBjYW5jZWxUZXh0KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INGG0LXQvdGLXHJcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSB4INCm0LXQvdCwXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvcm1hdFByaWNlKHByaWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZm9ybWF0UHJpY2UocHJpY2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0YfQuNGB0LvQuNGC0LXQu9GM0L3Ri9GFXHJcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSB4INCn0LjRgdC70L5cclxuICAgICAgICAgKiBAcGFyYW0gIHtBcnJheX0gZm9ybXMgPHByZT48Y29kZT5bXHJcbiAgICAgICAgICogICAgICfRgtC+0LLQsNGA0L7QsicsIFxyXG4gICAgICAgICAqICAgICAn0YLQvtCy0LDRgCcsIFxyXG4gICAgICAgICAqICAgICAn0YLQvtCy0LDRgNCwJ1xyXG4gICAgICAgICAqIF08L2NvZGU+PC9wcmU+INCh0LvQvtCy0L7RhNC+0YDQvNGLXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG51bVR4dCh4LCBmb3Jtcykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm51bVR4dCh4LCBmb3Jtcyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JPQtdC90LXRgNC40YDRg9C10YIgalF1ZXJ5LdGB0L7QsdGL0YLQuNC1INGD0YDQvtCy0L3RjyDQtNC+0LrRg9C80LXQvdGC0LBcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgICAqIEBwYXJhbSB7bWl4ZWR9IGRhdGEg0JTQsNC90L3Ri9C1INC00LvRjyDQv9C10YDQtdC00LDRh9C4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAganFFbWl0KGV2ZW50TmFtZSwgZGF0YSA9IG51bGwsIG9yaWdpbmFsRXZlbnQgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSAkKGRvY3VtZW50KS50cmlnZ2VyKGV2ZW50TmFtZSwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0sIDEwKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQodC60YDQvtC70LvQuNGCINC/0L4g0LLQtdGA0YLQuNC60LDQu9C4INC6INC30LDQtNCw0L3QvdC+0LzRgyDQvtCx0YrQtdC60YLRgy/Qv9C+0LfQuNGG0LjQuFxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcnxIVE1MRWxlbWVudHxqUXVlcnl9IGRlc3RpbmF0aW9uINCd0LDQt9C90LDRh9C10L3QuNC1ICjRgtC+0YfQtdC6INC/0L4gWSwg0LvQuNCx0L4g0Y3Qu9C10LzQtdC90YIpXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpbnN0YW50INCd0LXQvNC10LTQu9C10L3QvdGL0Lkg0YHQutGA0L7Qu9C7ICjQv9C70LDQstC90YvQuSwg0LXRgdC70LggZmFsc2UpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2Nyb2xsVG8oZGVzdGluYXRpb24sIGluc3RhbnQgPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBsZXQgZGVzdFkgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mKGRlc3RpbmF0aW9uKSA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoZGVzdGluYXRpb24pID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICQoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSBkZXN0aW5hdGlvbi5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdGluYXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgZGVzdFkgPSAkKGRlc3RpbmF0aW9uKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzdGluYXRpb24gaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RZID0gZGVzdGluYXRpb24ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkZXN0WSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGVzdFkpXHJcbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChkZXN0WSArIHRoaXMuZ2V0U2Nyb2xsT2Zmc2V0KGRlc3RZKSkpO1xyXG4gICAgICAgICAgICAgICAgdG9wID0gTWF0aC5taW4odG9wLCAkKCcuYm9keScpLm91dGVySGVpZ2h0KCkgLSB0aGlzLndpbmRvd0hlaWdodCAtIDEpOyAvLyAyMDI0LTAxLTE1LCBBVlM6INCf0L7Qv9GA0LDQstC60LAg0L3QsCDQvdC40LbQvdC40Lkg0LrRgNCw0Lkg0LTQvtC60YPQvNC10L3RgtCwXHJcbiAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsVG9EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcCxcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogaW5zdGFudCA/ICdpbnN0YW50JyA6ICdzbW9vdGgnLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbFRvRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oc2Nyb2xsVG9EYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vIDIwMjMtMDktMTksIEFWUzog0YHQtNC10LvQsNC10Lwg0LfQsNGJ0LjRgtGDINGB0LrRgNC+0LvQu9C40L3Qs9CwXHJcbiAgICAgICAgICAgICAgICBpZiAoIWluc3RhbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvdGVjdFNjcm9sbGluZyA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvZHlPdXRlckhlaWdodCA9IHBhcnNlSW50KCQoJy5ib2R5Jykub3V0ZXJIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLmFicyhNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsVG9wKSAtIE1hdGgucm91bmQoc2Nyb2xsVG9EYXRhLnRvcCkpIDwgdGhpcy5zY3JvbGxpbmdJbmFjY3VyYWN5KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzY3JvbGxUb0RhdGEudG9wID4gdGhpcy5zY3JvbGxUb3ApICYmIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLnNjcm9sbFRvcCArIHRoaXMud2luZG93SGVpZ2h0ID49IGJvZHlPdXRlckhlaWdodCAtIHRoaXMuc2Nyb2xsaW5nSW5hY2N1cmFjeSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgfHwgLy8g0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10LwsINC10YHQu9C4INC00LLQuNC20LXQvNGB0Y8g0LLQvdC40LcsINC90L4g0LTQvtGB0YLQuNCz0LvQuCDQvdC40LfQsCDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNjcm9sbFRvRGF0YS50b3AgPCB0aGlzLnNjcm9sbFRvcCkgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuc2Nyb2xsVG9wIDw9IHRoaXMuc2Nyb2xsaW5nSW5hY2N1cmFjeSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgLy8g0J7RgdGC0LDQvdCw0LLQu9C40LLQsNC10LwsINC10YHQu9C4INC00LLQuNC20LXQvNGB0Y8g0LLQstC10YDRhSwg0L3QviDQtNC+0YHRgtC40LPQu9C4INCy0LXRgNGF0LAg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdG9wIHNjcm9sbGluZyB0byAnICsgc2Nyb2xsVG9EYXRhLnRvcCArICcgb24gJyArIHRoaXMuc2Nyb2xsVG9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHByb3RlY3RTY3JvbGxpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdGVjdFNjcm9sbGluZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTY3JvbGxpbmdOb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxUb0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbnRpbnVlIHNjcm9sbGluZyBmcm9tICcgKyB0aGlzLnNjcm9sbFRvcCArICcgdG8gJyArIHNjcm9sbFRvRGF0YS50b3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcy5pc1Njcm9sbGluZ05vd0RlbGF5KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gJC5zY3JvbGxUbyhzY3JvbGxUb0RhdGEudG9wLCBpbnN0YW50ID8gdGhpcy5pc1Njcm9sbGluZ05vd0RlbGF5IDogMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JrQvtC+0YDQtNC40L3QsNGC0Ysg0L3QuNC20L3QtdC5INCz0YDQsNC90LjRhtGLINC+0LrQvdCwXHJcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd2luZG93Qm90dG9tUG9zaXRpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjcm9sbFRvcCArIHRoaXMud2luZG93SGVpZ2h0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J/QvtGB0LvQtdC00L3QtdC1INGB0LzQtdGJ0LXQvdC40LUg0L/QviDRgdC60YDQvtC70LvQuNC90LPRg1xyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBzY3JvbGxEZWx0YSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9wIC0gdGhpcy5vbGRTY3JvbGxUb3A7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0iLCIvKipcclxuICog0KTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LUg0LzQtdC90Y5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZml4ZWRIZWFkZXJBY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQpNC40LrRgdC40YDQvtCy0LDQvdC90LDRjyDQu9C4INGI0LDQv9C60LBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZpeGVkSGVhZGVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2Nyb2xsVG9wID4gTWF0aC5tYXgoJCgnLmJvZHlfX2hlYWRlci1vdXRlcicpLm91dGVySGVpZ2h0KCksICQoJy5ib2R5X19oZWFkZXInKS5vdXRlckhlaWdodCgpKSk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICAgIHNjcm9sbFRvcCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZml4ZWRIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbERlbHRhID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXhlZEhlYWRlckFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNjcm9sbERlbHRhIDwgLTYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXhlZEhlYWRlckFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpeGVkSGVhZGVyQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfVxyXG59IiwiLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBjcmVhdGVEZWZlcigpIHtcbiAgY29uc3QgZGVmZXJyZWQgPSB7XG4gICAgcmVzb2x2ZTogbnVsbCxcbiAgICBwcm9taXNlOiBudWxsXG4gIH07XG4gIGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGRlZmVycmVkLnJlc29sdmUgPSByZXNvbHZlO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHdhaXRGb3IoY2FsbGJhY2ssIHtcbiAgdGltZU91dEFmdGVyID0gNTAwLFxuICByZXRyeUFmdGVyID0gMTAwXG59ID0ge30pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGxldCBsYXN0RXJyb3IgPSBudWxsO1xuICAgIGNvbnN0IHRpbWVvdXRUaW1lcklkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZWplY3QobGFzdEVycm9yID8/IG5ldyBFcnJvcihcIlRpbWVvdXRcIikpO1xuICAgIH0sIHRpbWVPdXRBZnRlcik7XG4gICAgY29uc3QgdGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXJJZCk7XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBsYXN0RXJyb3IgPSBlcnI7XG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gc3RhcnRUaW1lID4gdGltZU91dEFmdGVyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0VGltZW91dCh0aWNrLCByZXRyeUFmdGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdGljaygpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5jb25zdCBJTkpFQ1RFRF9TQ1JJUFRTID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGluamVjdFNjcmlwdChzcmMsIHsgYXR0cmlidXRlcyB9ID0ge30pIHtcbiAgaWYgKElOSkVDVEVEX1NDUklQVFMuaGFzKHNyYykpIHtcbiAgICByZXR1cm4gSU5KRUNURURfU0NSSVBUUy5nZXQoc3JjKTtcbiAgfVxuICBjb25zdCBtYXliZVByZXZTY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzY3JpcHRbc3JjPVwiJHtzcmN9XCJdYCk7XG4gIGlmIChtYXliZVByZXZTY3JpcHQpIHtcbiAgICBjb25zb2xlLndhcm4oYFNjcmlwdCB3aXRoIFwiJHtzcmN9XCIgc3JjIGlzIGFscmVhZHkgcHJlc2VudCBpbiBET00hYCk7XG4gICAgbWF5YmVQcmV2U2NyaXB0LnJlbW92ZSgpO1xuICB9XG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHQub25lcnJvciA9IHJlamVjdDtcbiAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH07XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcyB8fCB7fSkpIHtcbiAgICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluamVjdGVkLWJ5XCIsIFwiY2tlZGl0b3ItaW50ZWdyYXRpb25cIik7XG4gICAgc2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgc2NyaXB0LnNyYyA9IHNyYztcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICBjb25zdCByZW1vdmVkTm9kZXMgPSBtdXRhdGlvbnMuZmxhdE1hcCgobXV0YXRpb24pID0+IEFycmF5LmZyb20obXV0YXRpb24ucmVtb3ZlZE5vZGVzKSk7XG4gICAgICBpZiAocmVtb3ZlZE5vZGVzLmluY2x1ZGVzKHNjcmlwdCkpIHtcbiAgICAgICAgSU5KRUNURURfU0NSSVBUUy5kZWxldGUoc3JjKTtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuaGVhZCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZVxuICAgIH0pO1xuICB9KTtcbiAgSU5KRUNURURfU0NSSVBUUy5zZXQoc3JjLCBwcm9taXNlKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5hc3luYyBmdW5jdGlvbiBpbmplY3RTY3JpcHRzSW5QYXJhbGxlbChzb3VyY2VzLCBwcm9wcykge1xuICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBzb3VyY2VzLm1hcCgoc3JjKSA9PiBpbmplY3RTY3JpcHQoc3JjLCBwcm9wcykpXG4gICk7XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuY29uc3QgSU5KRUNURURfU1RZTEVTSEVFVFMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuZnVuY3Rpb24gaW5qZWN0U3R5bGVzaGVldCh7XG4gIGhyZWYsXG4gIHBsYWNlbWVudEluSGVhZCA9IFwic3RhcnRcIixcbiAgYXR0cmlidXRlcyA9IHt9XG59KSB7XG4gIGlmIChJTkpFQ1RFRF9TVFlMRVNIRUVUUy5oYXMoaHJlZikpIHtcbiAgICByZXR1cm4gSU5KRUNURURfU1RZTEVTSEVFVFMuZ2V0KGhyZWYpO1xuICB9XG4gIGNvbnN0IG1heWJlUHJldlN0eWxlc2hlZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsaW5rW2hyZWY9XCIke2hyZWZ9XCJdW3JlbD1cInN0eWxlc2hlZXRcIl1gKTtcbiAgaWYgKG1heWJlUHJldlN0eWxlc2hlZXQpIHtcbiAgICBjb25zb2xlLndhcm4oYFN0eWxlc2hlZXQgd2l0aCBcIiR7aHJlZn1cIiBocmVmIGlzIGFscmVhZHkgcHJlc2VudCBpbiBET00hYCk7XG4gICAgbWF5YmVQcmV2U3R5bGVzaGVldC5yZW1vdmUoKTtcbiAgfVxuICBjb25zdCBhcHBlbmRMaW5rVGFnVG9IZWFkID0gKGxpbmspID0+IHtcbiAgICBjb25zdCBwcmV2aW91c2x5SW5qZWN0ZWRMaW5rcyA9IEFycmF5LmZyb20oXG4gICAgICBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbZGF0YS1pbmplY3RlZC1ieT1cImNrZWRpdG9yLWludGVncmF0aW9uXCJdJylcbiAgICApO1xuICAgIHN3aXRjaCAocGxhY2VtZW50SW5IZWFkKSB7XG4gICAgICBjYXNlIFwic3RhcnRcIjpcbiAgICAgICAgaWYgKHByZXZpb3VzbHlJbmplY3RlZExpbmtzLmxlbmd0aCkge1xuICAgICAgICAgIHByZXZpb3VzbHlJbmplY3RlZExpbmtzLnNsaWNlKC0xKVswXS5hZnRlcihsaW5rKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShsaW5rLCBkb2N1bWVudC5oZWFkLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMgfHwge30pKSB7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgbGluay5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluamVjdGVkLWJ5XCIsIFwiY2tlZGl0b3ItaW50ZWdyYXRpb25cIik7XG4gICAgbGluay5yZWwgPSBcInN0eWxlc2hlZXRcIjtcbiAgICBsaW5rLmhyZWYgPSBocmVmO1xuICAgIGxpbmsub25lcnJvciA9IHJlamVjdDtcbiAgICBsaW5rLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9O1xuICAgIGFwcGVuZExpbmtUYWdUb0hlYWQobGluayk7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICBjb25zdCByZW1vdmVkTm9kZXMgPSBtdXRhdGlvbnMuZmxhdE1hcCgobXV0YXRpb24pID0+IEFycmF5LmZyb20obXV0YXRpb24ucmVtb3ZlZE5vZGVzKSk7XG4gICAgICBpZiAocmVtb3ZlZE5vZGVzLmluY2x1ZGVzKGxpbmspKSB7XG4gICAgICAgIElOSkVDVEVEX1NUWUxFU0hFRVRTLmRlbGV0ZShocmVmKTtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuaGVhZCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZVxuICAgIH0pO1xuICB9KTtcbiAgSU5KRUNURURfU1RZTEVTSEVFVFMuc2V0KGhyZWYsIHByb21pc2UpO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBpc1NTUigpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCI7XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gb25jZShmbikge1xuICBsZXQgbGFzdFJlc3VsdCA9IG51bGw7XG4gIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgIGlmICghbGFzdFJlc3VsdCkge1xuICAgICAgbGFzdFJlc3VsdCA9IHtcbiAgICAgICAgY3VycmVudDogZm4oLi4uYXJncylcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBsYXN0UmVzdWx0LmN1cnJlbnQ7XG4gIH07XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gb3ZlcndyaXRlQXJyYXkoc291cmNlLCBkZXN0aW5hdGlvbikge1xuICBkZXN0aW5hdGlvbi5sZW5ndGggPSAwO1xuICBkZXN0aW5hdGlvbi5wdXNoKC4uLnNvdXJjZSk7XG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBvdmVyd3JpdGVPYmplY3Qoc291cmNlLCBkZXN0aW5hdGlvbikge1xuICBmb3IgKGNvbnN0IHByb3Agb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZGVzdGluYXRpb24pKSB7XG4gICAgZGVsZXRlIGRlc3RpbmF0aW9uW3Byb3BdO1xuICB9XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpIHtcbiAgICBpZiAodmFsdWUgIT09IGRlc3RpbmF0aW9uICYmIGtleSAhPT0gXCJwcm90b3R5cGVcIiAmJiBrZXkgIT09IFwiX19wcm90b19fXCIpIHtcbiAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHByZWxvYWRSZXNvdXJjZSh1cmwsIHsgYXR0cmlidXRlcyB9ID0ge30pIHtcbiAgaWYgKGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvcihgbGlua1tocmVmPVwiJHt1cmx9XCJdW3JlbD1cInByZWxvYWRcIl1gKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMgfHwge30pKSB7XG4gICAgbGluay5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gIH1cbiAgbGluay5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluamVjdGVkLWJ5XCIsIFwiY2tlZGl0b3ItaW50ZWdyYXRpb25cIik7XG4gIGxpbmsucmVsID0gXCJwcmVsb2FkXCI7XG4gIGxpbmsuYXMgPSBkZXRlY3RUeXBlT2ZSZXNvdXJjZSh1cmwpO1xuICBsaW5rLmhyZWYgPSB1cmw7XG4gIGRvY3VtZW50LmhlYWQuaW5zZXJ0QmVmb3JlKGxpbmssIGRvY3VtZW50LmhlYWQuZmlyc3RDaGlsZCk7XG59XG5mdW5jdGlvbiBkZXRlY3RUeXBlT2ZSZXNvdXJjZSh1cmwpIHtcbiAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSAvXFwuY3NzJC8udGVzdCh1cmwpOlxuICAgICAgcmV0dXJuIFwic3R5bGVcIjtcbiAgICBjYXNlIC9cXC5qcyQvLnRlc3QodXJsKTpcbiAgICAgIHJldHVybiBcInNjcmlwdFwiO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gXCJmZXRjaFwiO1xuICB9XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gc2hhbGxvd0NvbXBhcmVBcnJheXMoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICghYSB8fCAhYikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGEubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5jb25zdCBIRVhfTlVNQkVSUyA9IG5ldyBBcnJheSgyNTYpLmZpbGwoXCJcIikubWFwKChfLCBpbmRleCkgPT4gKFwiMFwiICsgaW5kZXgudG9TdHJpbmcoMTYpKS5zbGljZSgtMikpO1xuZnVuY3Rpb24gdWlkKCkge1xuICBjb25zdCBbcjEsIHIyLCByMywgcjRdID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoNCkpO1xuICByZXR1cm4gXCJlXCIgKyBIRVhfTlVNQkVSU1tyMSA+PiAwICYgMjU1XSArIEhFWF9OVU1CRVJTW3IxID4+IDggJiAyNTVdICsgSEVYX05VTUJFUlNbcjEgPj4gMTYgJiAyNTVdICsgSEVYX05VTUJFUlNbcjEgPj4gMjQgJiAyNTVdICsgSEVYX05VTUJFUlNbcjIgPj4gMCAmIDI1NV0gKyBIRVhfTlVNQkVSU1tyMiA+PiA4ICYgMjU1XSArIEhFWF9OVU1CRVJTW3IyID4+IDE2ICYgMjU1XSArIEhFWF9OVU1CRVJTW3IyID4+IDI0ICYgMjU1XSArIEhFWF9OVU1CRVJTW3IzID4+IDAgJiAyNTVdICsgSEVYX05VTUJFUlNbcjMgPj4gOCAmIDI1NV0gKyBIRVhfTlVNQkVSU1tyMyA+PiAxNiAmIDI1NV0gKyBIRVhfTlVNQkVSU1tyMyA+PiAyNCAmIDI1NV0gKyBIRVhfTlVNQkVSU1tyNCA+PiAwICYgMjU1XSArIEhFWF9OVU1CRVJTW3I0ID4+IDggJiAyNTVdICsgSEVYX05VTUJFUlNbcjQgPj4gMTYgJiAyNTVdICsgSEVYX05VTUJFUlNbcjQgPj4gMjQgJiAyNTVdO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHVuaXEoc291cmNlKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoc291cmNlKSk7XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gd2FpdEZvcldpbmRvd0VudHJ5KGVudHJ5TmFtZXMsIGNvbmZpZykge1xuICBjb25zdCB0cnlQaWNrQnVuZGxlID0gKCkgPT4gZW50cnlOYW1lcy5tYXAoKG5hbWUpID0+IHdpbmRvd1tuYW1lXSkuZmlsdGVyKEJvb2xlYW4pWzBdO1xuICByZXR1cm4gd2FpdEZvcihcbiAgICAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cnlQaWNrQnVuZGxlKCk7XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdpbmRvdyBlbnRyeSBcIiR7ZW50cnlOYW1lcy5qb2luKFwiLFwiKX1cIiBub3QgZm91bmQuYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgY29uZmlnXG4gICk7XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gZmlsdGVyT2JqZWN0VmFsdWVzKG9iaiwgZmlsdGVyKSB7XG4gIGNvbnN0IGZpbHRlcmVkRW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iaikuZmlsdGVyKChba2V5LCB2YWx1ZV0pID0+IGZpbHRlcih2YWx1ZSwga2V5KSk7XG4gIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoZmlsdGVyZWRFbnRyaWVzKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBmaWx0ZXJCbGFua09iamVjdFZhbHVlcyhvYmopIHtcbiAgcmV0dXJuIGZpbHRlck9iamVjdFZhbHVlcyhcbiAgICBvYmosXG4gICAgKHZhbHVlKSA9PiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwXG4gICk7XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gbWFwT2JqZWN0VmFsdWVzKG9iaiwgbWFwcGVyKSB7XG4gIGNvbnN0IG1hcHBlZEVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvYmopLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBtYXBwZXIodmFsdWUsIGtleSldKTtcbiAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhtYXBwZWRFbnRyaWVzKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiB3aXRob3V0KGl0ZW1zVG9SZW1vdmUsIGl0ZW1zKSB7XG4gIHJldHVybiBpdGVtcy5maWx0ZXIoKGl0ZW0pID0+ICFpdGVtc1RvUmVtb3ZlLmluY2x1ZGVzKGl0ZW0pKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBhcHBlbmRFeHRyYVBsdWdpbnNUb0VkaXRvckNvbmZpZyhjb25maWcsIHBsdWdpbnMpIHtcbiAgY29uc3QgZXh0cmFQbHVnaW5zID0gY29uZmlnLmV4dHJhUGx1Z2lucyB8fCBbXTtcbiAgcmV0dXJuIHtcbiAgICAuLi5jb25maWcsXG4gICAgZXh0cmFQbHVnaW5zOiBbXG4gICAgICAuLi5leHRyYVBsdWdpbnMsXG4gICAgICAuLi5wbHVnaW5zLmZpbHRlcigoaXRlbSkgPT4gIWV4dHJhUGx1Z2lucy5pbmNsdWRlcyhpdGVtKSlcbiAgICBdXG4gIH07XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gaXNTZW1hbnRpY1ZlcnNpb24odmVyc2lvbikge1xuICByZXR1cm4gISF2ZXJzaW9uICYmIC9eXFxkK1xcLlxcZCtcXC5cXGQrLy50ZXN0KHZlcnNpb24pO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGlzQ0tDZG5UZXN0aW5nVmVyc2lvbih2ZXJzaW9uKSB7XG4gIGlmICghdmVyc2lvbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gW1wibmlnaHRseVwiLCBcImFscGhhXCIsIFwiaW50ZXJuYWxcIiwgXCJuaWdodGx5LVwiLCBcInN0YWdpbmdcIl0uc29tZSgodGVzdFZlcnNpb24pID0+IHZlcnNpb24uaW5jbHVkZXModGVzdFZlcnNpb24pKTtcbn1cbmZ1bmN0aW9uIGlzQ0tDZG5WZXJzaW9uKHZlcnNpb24pIHtcbiAgcmV0dXJuIGlzU2VtYW50aWNWZXJzaW9uKHZlcnNpb24pIHx8IGlzQ0tDZG5UZXN0aW5nVmVyc2lvbih2ZXJzaW9uKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBkZXN0cnVjdHVyZVNlbWFudGljVmVyc2lvbih2ZXJzaW9uKSB7XG4gIGlmICghaXNTZW1hbnRpY1ZlcnNpb24odmVyc2lvbikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2VtYW50aWMgdmVyc2lvbjogJHt2ZXJzaW9uIHx8IFwiPGJsYW5rPlwifS5gKTtcbiAgfVxuICBjb25zdCBbbWFqb3IsIG1pbm9yLCBwYXRjaF0gPSB2ZXJzaW9uLnNwbGl0KFwiLlwiKTtcbiAgcmV0dXJuIHtcbiAgICBtYWpvcjogTnVtYmVyLnBhcnNlSW50KG1ham9yLCAxMCksXG4gICAgbWlub3I6IE51bWJlci5wYXJzZUludChtaW5vciwgMTApLFxuICAgIHBhdGNoOiBOdW1iZXIucGFyc2VJbnQocGF0Y2gsIDEwKVxuICB9O1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGdldExpY2Vuc2VWZXJzaW9uRnJvbUVkaXRvclZlcnNpb24odmVyc2lvbikge1xuICBpZiAoaXNDS0NkblRlc3RpbmdWZXJzaW9uKHZlcnNpb24pKSB7XG4gICAgcmV0dXJuIDM7XG4gIH1cbiAgY29uc3QgeyBtYWpvciB9ID0gZGVzdHJ1Y3R1cmVTZW1hbnRpY1ZlcnNpb24odmVyc2lvbik7XG4gIHN3aXRjaCAodHJ1ZSkge1xuICAgIGNhc2UgbWFqb3IgPj0gNDQ6XG4gICAgICByZXR1cm4gMztcbiAgICBjYXNlIG1ham9yID49IDM4OlxuICAgICAgcmV0dXJuIDI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAxO1xuICB9XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0Q0tCYXNlQnVuZGxlSW5zdGFsbGF0aW9uSW5mbygpIHtcbiAgY29uc3QgeyBDS0VESVRPUl9WRVJTSU9OLCBDS0VESVRPUiB9ID0gd2luZG93O1xuICBpZiAoIWlzQ0tDZG5WZXJzaW9uKENLRURJVE9SX1ZFUlNJT04pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzb3VyY2U6IENLRURJVE9SID8gXCJjZG5cIiA6IFwibnBtXCIsXG4gICAgdmVyc2lvbjogQ0tFRElUT1JfVkVSU0lPTlxuICB9O1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGdldFN1cHBvcnRlZExpY2Vuc2VWZXJzaW9uSW5zdGFsbGF0aW9uSW5mbygpIHtcbiAgY29uc3QgaW5zdGFsbGF0aW9uSW5mbyA9IGdldENLQmFzZUJ1bmRsZUluc3RhbGxhdGlvbkluZm8oKTtcbiAgaWYgKCFpbnN0YWxsYXRpb25JbmZvKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGdldExpY2Vuc2VWZXJzaW9uRnJvbUVkaXRvclZlcnNpb24oaW5zdGFsbGF0aW9uSW5mby52ZXJzaW9uKTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBpc0NLRWRpdG9yRnJlZUxpY2Vuc2UobGljZW5zZUtleSwgbGljZW5zZVZlcnNpb24pIHtcbiAgbGljZW5zZVZlcnNpb24gfHw9IGdldFN1cHBvcnRlZExpY2Vuc2VWZXJzaW9uSW5zdGFsbGF0aW9uSW5mbygpIHx8IHZvaWQgMDtcbiAgc3dpdGNoIChsaWNlbnNlVmVyc2lvbikge1xuICAgIGNhc2UgMTpcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gbGljZW5zZUtleSA9PT0gdm9pZCAwO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBsaWNlbnNlS2V5ID09PSBcIkdQTFwiO1xuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnRlZ3JhdGlvblVzYWdlRGF0YVBsdWdpbihpbnRlZ3JhdGlvbk5hbWUsIHVzYWdlRGF0YSkge1xuICByZXR1cm4gZnVuY3Rpb24gSW50ZWdyYXRpb25Vc2FnZURhdGFQbHVnaW4oZWRpdG9yKSB7XG4gICAgaWYgKGlzQ0tFZGl0b3JGcmVlTGljZW5zZShlZGl0b3IuY29uZmlnLmdldChcImxpY2Vuc2VLZXlcIikpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVkaXRvci5vbihcImNvbGxlY3RVc2FnZURhdGFcIiwgKHNvdXJjZSwgeyBzZXRVc2FnZURhdGEgfSkgPT4ge1xuICAgICAgc2V0VXNhZ2VEYXRhKGBpbnRlZ3JhdGlvbi4ke2ludGVncmF0aW9uTmFtZX1gLCB1c2FnZURhdGEpO1xuICAgIH0pO1xuICB9O1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmNvbnN0IENLX0NETl9VUkwgPSBcImh0dHBzOi8vY2RuLmNrZWRpdG9yLmNvbVwiO1xuZnVuY3Rpb24gY3JlYXRlQ0tDZG5VcmwoYnVuZGxlLCBmaWxlLCB2ZXJzaW9uKSB7XG4gIHJldHVybiBgJHtDS19DRE5fVVJMfS8ke2J1bmRsZX0vJHt2ZXJzaW9ufS8ke2ZpbGV9YDtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5jb25zdCBDS0JPWF9DRE5fVVJMID0gXCJodHRwczovL2Nkbi5ja2JveC5pb1wiO1xuZnVuY3Rpb24gY3JlYXRlQ0tCb3hDZG5VcmwoYnVuZGxlLCBmaWxlLCB2ZXJzaW9uKSB7XG4gIHJldHVybiBgJHtDS0JPWF9DRE5fVVJMfS8ke2J1bmRsZX0vJHt2ZXJzaW9ufS8ke2ZpbGV9YDtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5jb25zdCBDS19ET0NTX1VSTCA9IFwiaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjVcIjtcbmZ1bmN0aW9uIGNyZWF0ZUNLRG9jc1VybChwYXRoLCB2ZXJzaW9uID0gXCJsYXRlc3RcIikge1xuICByZXR1cm4gYCR7Q0tfRE9DU19VUkx9LyR7dmVyc2lvbn0vJHtwYXRofWA7XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ0tDZG5CYXNlQnVuZGxlUGFjayh7XG4gIHZlcnNpb24sXG4gIHRyYW5zbGF0aW9ucyxcbiAgY3JlYXRlQ3VzdG9tQ2RuVXJsID0gY3JlYXRlQ0tDZG5Vcmxcbn0pIHtcbiAgY29uc3QgdXJscyA9IHtcbiAgICBzY3JpcHRzOiBbXG4gICAgICAvLyBMb2FkIHRoZSBtYWluIHNjcmlwdCBvZiB0aGUgYmFzZSBmZWF0dXJlcy5cbiAgICAgIGNyZWF0ZUN1c3RvbUNkblVybChcImNrZWRpdG9yNVwiLCBcImNrZWRpdG9yNS51bWQuanNcIiwgdmVyc2lvbiksXG4gICAgICAvLyBMb2FkIGFsbCBKYXZhU2NyaXB0IGZpbGVzIGZyb20gdGhlIGJhc2UgZmVhdHVyZXMuXG4gICAgICAvLyBFTiBidW5kbGUgaXMgcHJlYnVpbHQgaW50byB0aGUgbWFpbiBzY3JpcHQsIHNvIHdlIGRvbid0IG5lZWQgdG8gbG9hZCBpdCBzZXBhcmF0ZWx5LlxuICAgICAgLi4ud2l0aG91dChbXCJlblwiXSwgdHJhbnNsYXRpb25zIHx8IFtdKS5tYXAoXG4gICAgICAgICh0cmFuc2xhdGlvbikgPT4gY3JlYXRlQ3VzdG9tQ2RuVXJsKFwiY2tlZGl0b3I1XCIsIGB0cmFuc2xhdGlvbnMvJHt0cmFuc2xhdGlvbn0udW1kLmpzYCwgdmVyc2lvbilcbiAgICAgIClcbiAgICBdLFxuICAgIHN0eWxlc2hlZXRzOiBbXG4gICAgICBjcmVhdGVDdXN0b21DZG5VcmwoXCJja2VkaXRvcjVcIiwgXCJja2VkaXRvcjUuY3NzXCIsIHZlcnNpb24pXG4gICAgXVxuICB9O1xuICByZXR1cm4ge1xuICAgIC8vIFByZWxvYWQgcmVzb3VyY2VzIHNwZWNpZmllZCBpbiB0aGUgcGFjaywgYmVmb3JlIGxvYWRpbmcgdGhlIG1haW4gc2NyaXB0LlxuICAgIHByZWxvYWQ6IFtcbiAgICAgIC4uLnVybHMuc3R5bGVzaGVldHMsXG4gICAgICAuLi51cmxzLnNjcmlwdHNcbiAgICBdLFxuICAgIHNjcmlwdHM6IFtcbiAgICAgIC8vIEl0J3Mgc2FmZSB0byBsb2FkIHRyYW5zbGF0aW9ucyBhbmQgdGhlIG1haW4gc2NyaXB0IGluIHBhcmFsbGVsLlxuICAgICAgYXN5bmMgKGF0dHJpYnV0ZXMpID0+IGluamVjdFNjcmlwdHNJblBhcmFsbGVsKHVybHMuc2NyaXB0cywgYXR0cmlidXRlcylcbiAgICBdLFxuICAgIC8vIExvYWQgYWxsIHN0eWxlc2hlZXRzIG9mIHRoZSBiYXNlIGZlYXR1cmVzLlxuICAgIHN0eWxlc2hlZXRzOiB1cmxzLnN0eWxlc2hlZXRzLFxuICAgIC8vIFBpY2sgdGhlIGV4cG9ydGVkIGdsb2JhbCB2YXJpYWJsZXMgZnJvbSB0aGUgd2luZG93IG9iamVjdC5cbiAgICBjaGVja1BsdWdpbkxvYWRlZDogYXN5bmMgKCkgPT4gd2FpdEZvcldpbmRvd0VudHJ5KFtcIkNLRURJVE9SXCJdKSxcbiAgICAvLyBDaGVjayBpZiB0aGUgQ0tFZGl0b3IgYmFzZSBidW5kbGUgaXMgYWxyZWFkeSBsb2FkZWQgYW5kIHRocm93IGFuIGVycm9yIGlmIGl0IGlzLlxuICAgIGJlZm9yZUluamVjdDogKCkgPT4ge1xuICAgICAgY29uc3QgaW5zdGFsbGF0aW9uSW5mbyA9IGdldENLQmFzZUJ1bmRsZUluc3RhbGxhdGlvbkluZm8oKTtcbiAgICAgIHN3aXRjaCAoaW5zdGFsbGF0aW9uSW5mbz8uc291cmNlKSB7XG4gICAgICAgIGNhc2UgXCJucG1cIjpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBcIkNLRWRpdG9yIDUgaXMgYWxyZWFkeSBsb2FkZWQgZnJvbSBucG0uIENoZWNrIHRoZSBtaWdyYXRpb24gZ3VpZGUgZm9yIG1vcmUgZGV0YWlsczogXCIgKyBjcmVhdGVDS0RvY3NVcmwoXCJ1cGRhdGluZy9taWdyYXRpb24tdG8tY2RuL3ZhbmlsbGEtanMuaHRtbFwiKVxuICAgICAgICAgICk7XG4gICAgICAgIGNhc2UgXCJjZG5cIjpcbiAgICAgICAgICBpZiAoaW5zdGFsbGF0aW9uSW5mby52ZXJzaW9uICE9PSB2ZXJzaW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBDS0VkaXRvciA1IGlzIGFscmVhZHkgbG9hZGVkIGZyb20gQ0ROIGluIHZlcnNpb24gJHtpbnN0YWxsYXRpb25JbmZvLnZlcnNpb259LiBSZW1vdmUgdGhlIG9sZCA8c2NyaXB0PiBhbmQgPGxpbms+IHRhZ3MgbG9hZGluZyBDS0VkaXRvciA1IHRvIGFsbG93IGxvYWRpbmcgdGhlICR7dmVyc2lvbn0gdmVyc2lvbi5gXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ0tDZG5QcmVtaXVtQnVuZGxlUGFjayh7XG4gIHZlcnNpb24sXG4gIHRyYW5zbGF0aW9ucyxcbiAgY3JlYXRlQ3VzdG9tQ2RuVXJsID0gY3JlYXRlQ0tDZG5Vcmxcbn0pIHtcbiAgY29uc3QgdXJscyA9IHtcbiAgICBzY3JpcHRzOiBbXG4gICAgICAvLyBMb2FkIHRoZSBtYWluIHNjcmlwdCBvZiB0aGUgcHJlbWl1bSBmZWF0dXJlcy5cbiAgICAgIGNyZWF0ZUN1c3RvbUNkblVybChcImNrZWRpdG9yNS1wcmVtaXVtLWZlYXR1cmVzXCIsIFwiY2tlZGl0b3I1LXByZW1pdW0tZmVhdHVyZXMudW1kLmpzXCIsIHZlcnNpb24pLFxuICAgICAgLy8gTG9hZCBhbGwgSmF2YVNjcmlwdCBmaWxlcyBmcm9tIHRoZSBwcmVtaXVtIGZlYXR1cmVzLlxuICAgICAgLy8gRU4gYnVuZGxlIGlzIHByZWJ1aWx0IGludG8gdGhlIG1haW4gc2NyaXB0LCBzbyB3ZSBkb24ndCBuZWVkIHRvIGxvYWQgaXQgc2VwYXJhdGVseS5cbiAgICAgIC4uLndpdGhvdXQoW1wiZW5cIl0sIHRyYW5zbGF0aW9ucyB8fCBbXSkubWFwKFxuICAgICAgICAodHJhbnNsYXRpb24pID0+IGNyZWF0ZUN1c3RvbUNkblVybChcImNrZWRpdG9yNS1wcmVtaXVtLWZlYXR1cmVzXCIsIGB0cmFuc2xhdGlvbnMvJHt0cmFuc2xhdGlvbn0udW1kLmpzYCwgdmVyc2lvbilcbiAgICAgIClcbiAgICBdLFxuICAgIHN0eWxlc2hlZXRzOiBbXG4gICAgICBjcmVhdGVDdXN0b21DZG5VcmwoXCJja2VkaXRvcjUtcHJlbWl1bS1mZWF0dXJlc1wiLCBcImNrZWRpdG9yNS1wcmVtaXVtLWZlYXR1cmVzLmNzc1wiLCB2ZXJzaW9uKVxuICAgIF1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICAvLyBQcmVsb2FkIHJlc291cmNlcyBzcGVjaWZpZWQgaW4gdGhlIHBhY2ssIGJlZm9yZSBsb2FkaW5nIHRoZSBtYWluIHNjcmlwdC5cbiAgICBwcmVsb2FkOiBbXG4gICAgICAuLi51cmxzLnN0eWxlc2hlZXRzLFxuICAgICAgLi4udXJscy5zY3JpcHRzXG4gICAgXSxcbiAgICBzY3JpcHRzOiBbXG4gICAgICAvLyBJdCdzIHNhZmUgdG8gbG9hZCB0cmFuc2xhdGlvbnMgYW5kIHRoZSBtYWluIHNjcmlwdCBpbiBwYXJhbGxlbC5cbiAgICAgIGFzeW5jIChhdHRyaWJ1dGVzKSA9PiBpbmplY3RTY3JpcHRzSW5QYXJhbGxlbCh1cmxzLnNjcmlwdHMsIGF0dHJpYnV0ZXMpXG4gICAgXSxcbiAgICAvLyBMb2FkIGFsbCBzdHlsZXNoZWV0cyBvZiB0aGUgcHJlbWl1bSBmZWF0dXJlcy5cbiAgICBzdHlsZXNoZWV0czogdXJscy5zdHlsZXNoZWV0cyxcbiAgICAvLyBQaWNrIHRoZSBleHBvcnRlZCBnbG9iYWwgdmFyaWFibGVzIGZyb20gdGhlIHdpbmRvdyBvYmplY3QuXG4gICAgY2hlY2tQbHVnaW5Mb2FkZWQ6IGFzeW5jICgpID0+IHdhaXRGb3JXaW5kb3dFbnRyeShbXCJDS0VESVRPUl9QUkVNSVVNX0ZFQVRVUkVTXCJdKVxuICB9O1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGxvYWRDS0NkblJlc291cmNlc1BhY2socGFjaykge1xuICBsZXQge1xuICAgIGh0bWxBdHRyaWJ1dGVzID0ge30sXG4gICAgc2NyaXB0cyA9IFtdLFxuICAgIHN0eWxlc2hlZXRzID0gW10sXG4gICAgcHJlbG9hZCxcbiAgICBiZWZvcmVJbmplY3QsXG4gICAgY2hlY2tQbHVnaW5Mb2FkZWRcbiAgfSA9IG5vcm1hbGl6ZUNLQ2RuUmVzb3VyY2VzUGFjayhwYWNrKTtcbiAgYmVmb3JlSW5qZWN0Py4oKTtcbiAgaWYgKCFwcmVsb2FkKSB7XG4gICAgcHJlbG9hZCA9IHVuaXEoW1xuICAgICAgLi4uc3R5bGVzaGVldHMuZmlsdGVyKChpdGVtKSA9PiB0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiksXG4gICAgICAuLi5zY3JpcHRzLmZpbHRlcigoaXRlbSkgPT4gdHlwZW9mIGl0ZW0gPT09IFwic3RyaW5nXCIpXG4gICAgXSk7XG4gIH1cbiAgZm9yIChjb25zdCB1cmwgb2YgcHJlbG9hZCkge1xuICAgIHByZWxvYWRSZXNvdXJjZSh1cmwsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IGh0bWxBdHRyaWJ1dGVzXG4gICAgfSk7XG4gIH1cbiAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgdW5pcShzdHlsZXNoZWV0cykubWFwKChocmVmKSA9PiBpbmplY3RTdHlsZXNoZWV0KHtcbiAgICAgIGhyZWYsXG4gICAgICBhdHRyaWJ1dGVzOiBodG1sQXR0cmlidXRlcyxcbiAgICAgIHBsYWNlbWVudEluSGVhZDogXCJzdGFydFwiXG4gICAgfSkpXG4gICk7XG4gIGZvciAoY29uc3Qgc2NyaXB0IG9mIHVuaXEoc2NyaXB0cykpIHtcbiAgICBjb25zdCBpbmplY3RvclByb3BzID0ge1xuICAgICAgYXR0cmlidXRlczogaHRtbEF0dHJpYnV0ZXNcbiAgICB9O1xuICAgIGlmICh0eXBlb2Ygc2NyaXB0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBhd2FpdCBpbmplY3RTY3JpcHQoc2NyaXB0LCBpbmplY3RvclByb3BzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgc2NyaXB0KGluamVjdG9yUHJvcHMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY2hlY2tQbHVnaW5Mb2FkZWQ/LigpO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplQ0tDZG5SZXNvdXJjZXNQYWNrKHBhY2spIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocGFjaykpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2NyaXB0czogcGFjay5maWx0ZXIoXG4gICAgICAgIChpdGVtKSA9PiB0eXBlb2YgaXRlbSA9PT0gXCJmdW5jdGlvblwiIHx8IGl0ZW0uZW5kc1dpdGgoXCIuanNcIilcbiAgICAgICksXG4gICAgICBzdHlsZXNoZWV0czogcGFjay5maWx0ZXIoXG4gICAgICAgIChpdGVtKSA9PiBpdGVtLmVuZHNXaXRoKFwiLmNzc1wiKVxuICAgICAgKVxuICAgIH07XG4gIH1cbiAgaWYgKHR5cGVvZiBwYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hlY2tQbHVnaW5Mb2FkZWQ6IHBhY2tcbiAgICB9O1xuICB9XG4gIHJldHVybiBwYWNrO1xufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGNvbWJpbmVDS0NkbkJ1bmRsZXNQYWNrcyhwYWNrcykge1xuICBjb25zdCBub3JtYWxpemVkUGFja3MgPSBtYXBPYmplY3RWYWx1ZXMoXG4gICAgZmlsdGVyQmxhbmtPYmplY3RWYWx1ZXMocGFja3MpLFxuICAgIG5vcm1hbGl6ZUNLQ2RuUmVzb3VyY2VzUGFja1xuICApO1xuICBjb25zdCBtZXJnZWRQYWNrcyA9IE9iamVjdC52YWx1ZXMobm9ybWFsaXplZFBhY2tzKS5yZWR1Y2UoXG4gICAgKGFjYywgcGFjaykgPT4ge1xuICAgICAgYWNjLnNjcmlwdHMucHVzaCguLi5wYWNrLnNjcmlwdHMgPz8gW10pO1xuICAgICAgYWNjLnN0eWxlc2hlZXRzLnB1c2goLi4ucGFjay5zdHlsZXNoZWV0cyA/PyBbXSk7XG4gICAgICBhY2MucHJlbG9hZC5wdXNoKC4uLnBhY2sucHJlbG9hZCA/PyBbXSk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sXG4gICAge1xuICAgICAgcHJlbG9hZDogW10sXG4gICAgICBzY3JpcHRzOiBbXSxcbiAgICAgIHN0eWxlc2hlZXRzOiBbXVxuICAgIH1cbiAgKTtcbiAgY29uc3QgY2hlY2tQbHVnaW5Mb2FkZWQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZXhwb3J0ZWRHbG9iYWxWYXJpYWJsZXMgPSAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBwYWNrXSBvZiBPYmplY3QuZW50cmllcyhub3JtYWxpemVkUGFja3MpKSB7XG4gICAgICBleHBvcnRlZEdsb2JhbFZhcmlhYmxlc1tuYW1lXSA9IGF3YWl0IHBhY2s/LmNoZWNrUGx1Z2luTG9hZGVkPy4oKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydGVkR2xvYmFsVmFyaWFibGVzO1xuICB9O1xuICBjb25zdCBiZWZvcmVJbmplY3QgPSAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBwYWNrIG9mIE9iamVjdC52YWx1ZXMobm9ybWFsaXplZFBhY2tzKSkge1xuICAgICAgcGFjay5iZWZvcmVJbmplY3Q/LigpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICAuLi5tZXJnZWRQYWNrcyxcbiAgICBiZWZvcmVJbmplY3QsXG4gICAgY2hlY2tQbHVnaW5Mb2FkZWRcbiAgfTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRDS0JveEluc3RhbGxhdGlvbkluZm8oKSB7XG4gIGNvbnN0IHZlcnNpb24gPSB3aW5kb3cuQ0tCb3g/LnZlcnNpb247XG4gIGlmICghaXNTZW1hbnRpY1ZlcnNpb24odmVyc2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHNvdXJjZTogXCJjZG5cIixcbiAgICB2ZXJzaW9uXG4gIH07XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ0tCb3hCdW5kbGVQYWNrKHtcbiAgdmVyc2lvbixcbiAgdGhlbWUgPSBcImxhcmtcIixcbiAgdHJhbnNsYXRpb25zLFxuICBjcmVhdGVDdXN0b21DZG5VcmwgPSBjcmVhdGVDS0JveENkblVybFxufSkge1xuICByZXR1cm4ge1xuICAgIC8vIExvYWQgdGhlIG1haW4gc2NyaXB0IG9mIHRoZSBiYXNlIGZlYXR1cmVzLlxuICAgIHNjcmlwdHM6IFtcbiAgICAgIGNyZWF0ZUN1c3RvbUNkblVybChcImNrYm94XCIsIFwiY2tib3guanNcIiwgdmVyc2lvbiksXG4gICAgICAvLyBFTiBidW5kbGUgaXMgcHJlYnVpbHQgaW50byB0aGUgbWFpbiBzY3JpcHQsIHNvIHdlIGRvbid0IG5lZWQgdG8gbG9hZCBpdCBzZXBhcmF0ZWx5LlxuICAgICAgLi4ud2l0aG91dChbXCJlblwiXSwgdHJhbnNsYXRpb25zIHx8IFtdKS5tYXAoXG4gICAgICAgICh0cmFuc2xhdGlvbikgPT4gY3JlYXRlQ3VzdG9tQ2RuVXJsKFwiY2tib3hcIiwgYHRyYW5zbGF0aW9ucy8ke3RyYW5zbGF0aW9ufS5qc2AsIHZlcnNpb24pXG4gICAgICApXG4gICAgXSxcbiAgICAvLyBMb2FkIG9wdGlvbmFsIHRoZW1lLCBpZiBwcm92aWRlZC4gSXQncyBub3QgcmVxdWlyZWQgYnV0IHJlY29tbWVuZGVkIGJlY2F1c2UgaXQgaW1wcm92ZXMgdGhlIGxvb2sgYW5kIGZlZWwuXG4gICAgLi4udGhlbWUgJiYge1xuICAgICAgc3R5bGVzaGVldHM6IFtcbiAgICAgICAgY3JlYXRlQ3VzdG9tQ2RuVXJsKFwiY2tib3hcIiwgYHN0eWxlcy90aGVtZXMvJHt0aGVtZX0uY3NzYCwgdmVyc2lvbilcbiAgICAgIF1cbiAgICB9LFxuICAgIC8vIFBpY2sgdGhlIGV4cG9ydGVkIGdsb2JhbCB2YXJpYWJsZXMgZnJvbSB0aGUgd2luZG93IG9iamVjdC5cbiAgICBjaGVja1BsdWdpbkxvYWRlZDogYXN5bmMgKCkgPT4gd2FpdEZvcldpbmRvd0VudHJ5KFtcIkNLQm94XCJdKSxcbiAgICAvLyBDaGVjayBpZiB0aGUgQ0tCb3ggYnVuZGxlIGlzIGFscmVhZHkgbG9hZGVkIGFuZCB0aHJvdyBhbiBlcnJvciBpZiBpdCBpcy5cbiAgICBiZWZvcmVJbmplY3Q6ICgpID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbGxhdGlvbkluZm8gPSBnZXRDS0JveEluc3RhbGxhdGlvbkluZm8oKTtcbiAgICAgIGlmIChpbnN0YWxsYXRpb25JbmZvICYmIGluc3RhbGxhdGlvbkluZm8udmVyc2lvbiAhPT0gdmVyc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYENLQm94IGlzIGFscmVhZHkgbG9hZGVkIGZyb20gQ0ROIGluIHZlcnNpb24gJHtpbnN0YWxsYXRpb25JbmZvLnZlcnNpb259LiBSZW1vdmUgdGhlIG9sZCA8c2NyaXB0PiBhbmQgPGxpbms+IHRhZ3MgbG9hZGluZyBDS0JveCB0byBhbGxvdyBsb2FkaW5nIHRoZSAke3ZlcnNpb259IHZlcnNpb24uYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNSwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZCBvciBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1saWNlbnNpbmctb3B0aW9uc1xuICovXG5mdW5jdGlvbiBpc0NLQ2RuU3VwcG9ydGVkQnlFZGl0b3JWZXJzaW9uKHZlcnNpb24pIHtcbiAgaWYgKGlzQ0tDZG5UZXN0aW5nVmVyc2lvbih2ZXJzaW9uKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGNvbnN0IHsgbWFqb3IgfSA9IGRlc3RydWN0dXJlU2VtYW50aWNWZXJzaW9uKHZlcnNpb24pO1xuICBjb25zdCBsaWNlbnNlVmVyc2lvbiA9IGdldExpY2Vuc2VWZXJzaW9uRnJvbUVkaXRvclZlcnNpb24odmVyc2lvbik7XG4gIHN3aXRjaCAobGljZW5zZVZlcnNpb24pIHtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG1ham9yID09PSA0MztcbiAgfVxufVxuXG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI1LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kIG9yIGh0dHBzOi8vY2tlZGl0b3IuY29tL2xlZ2FsL2NrZWRpdG9yLWxpY2Vuc2luZy1vcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGNvbWJpbmVDZG5QbHVnaW5zUGFja3MocGx1Z2luc1BhY2tzKSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRQbHVnaW5zUGFja3MgPSBtYXBPYmplY3RWYWx1ZXMocGx1Z2luc1BhY2tzLCAocGx1Z2luUGFjaywgcGx1Z2luTmFtZSkgPT4ge1xuICAgIGlmICghcGx1Z2luUGFjaykge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgY29uc3Qgbm9ybWFsaXplZFBsdWdpblBhY2sgPSBub3JtYWxpemVDS0NkblJlc291cmNlc1BhY2socGx1Z2luUGFjayk7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFByb3ZpZGUgZGVmYXVsdCB3aW5kb3cgYWNjZXNzb3Igb2JqZWN0IGlmIHRoZSBwbHVnaW4gcGFjayBkb2VzIG5vdCBkZWZpbmUgaXQuXG4gICAgICBjaGVja1BsdWdpbkxvYWRlZDogYXN5bmMgKCkgPT4gd2FpdEZvcldpbmRvd0VudHJ5KFtwbHVnaW5OYW1lXSksXG4gICAgICAvLyBUcmFuc2Zvcm0gdGhlIHBsdWdpbiBwYWNrIHRvIGEgbm9ybWFsaXplZCBhZHZhbmNlZCBwYWNrLlxuICAgICAgLi4ubm9ybWFsaXplZFBsdWdpblBhY2tcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIGNvbWJpbmVDS0NkbkJ1bmRsZXNQYWNrcyhcbiAgICBub3JtYWxpemVkUGx1Z2luc1BhY2tzXG4gICk7XG59XG5cbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjUsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQgb3IgaHR0cHM6Ly9ja2VkaXRvci5jb20vbGVnYWwvY2tlZGl0b3ItbGljZW5zaW5nLW9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gbG9hZENLRWRpdG9yQ2xvdWQoY29uZmlnKSB7XG4gIGNvbnN0IHtcbiAgICB2ZXJzaW9uLFxuICAgIHRyYW5zbGF0aW9ucyxcbiAgICBwbHVnaW5zLFxuICAgIHByZW1pdW0sXG4gICAgY2tib3gsXG4gICAgY3JlYXRlQ3VzdG9tQ2RuVXJsLFxuICAgIGluamVjdGVkSHRtbEVsZW1lbnRzQXR0cmlidXRlcyA9IHtcbiAgICAgIGNyb3Nzb3JpZ2luOiBcImFub255bW91c1wiXG4gICAgfVxuICB9ID0gY29uZmlnO1xuICB2YWxpZGF0ZUNLRWRpdG9yVmVyc2lvbih2ZXJzaW9uKTtcbiAgY29uc3QgcGFjayA9IGNvbWJpbmVDS0NkbkJ1bmRsZXNQYWNrcyh7XG4gICAgQ0tFZGl0b3I6IGNyZWF0ZUNLQ2RuQmFzZUJ1bmRsZVBhY2soe1xuICAgICAgdmVyc2lvbixcbiAgICAgIHRyYW5zbGF0aW9ucyxcbiAgICAgIGNyZWF0ZUN1c3RvbUNkblVybFxuICAgIH0pLFxuICAgIC4uLnByZW1pdW0gJiYge1xuICAgICAgQ0tFZGl0b3JQcmVtaXVtRmVhdHVyZXM6IGNyZWF0ZUNLQ2RuUHJlbWl1bUJ1bmRsZVBhY2soe1xuICAgICAgICB2ZXJzaW9uLFxuICAgICAgICB0cmFuc2xhdGlvbnMsXG4gICAgICAgIGNyZWF0ZUN1c3RvbUNkblVybFxuICAgICAgfSlcbiAgICB9LFxuICAgIC4uLmNrYm94ICYmIHtcbiAgICAgIENLQm94OiBjcmVhdGVDS0JveEJ1bmRsZVBhY2soY2tib3gpXG4gICAgfSxcbiAgICBsb2FkZWRQbHVnaW5zOiBjb21iaW5lQ2RuUGx1Z2luc1BhY2tzKHBsdWdpbnMgPz8ge30pXG4gIH0pO1xuICByZXR1cm4gbG9hZENLQ2RuUmVzb3VyY2VzUGFjayhcbiAgICB7XG4gICAgICAuLi5wYWNrLFxuICAgICAgaHRtbEF0dHJpYnV0ZXM6IGluamVjdGVkSHRtbEVsZW1lbnRzQXR0cmlidXRlc1xuICAgIH1cbiAgKTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlQ0tFZGl0b3JWZXJzaW9uKHZlcnNpb24pIHtcbiAgaWYgKGlzQ0tDZG5UZXN0aW5nVmVyc2lvbih2ZXJzaW9uKSkge1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgIFwiWW91IGFyZSB1c2luZyBhIHRlc3RpbmcgdmVyc2lvbiBvZiBDS0VkaXRvciA1LiBQbGVhc2UgcmVtZW1iZXIgdGhhdCBpdCBpcyBub3Qgc3VpdGFibGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzLlwiXG4gICAgKTtcbiAgfVxuICBpZiAoIWlzQ0tDZG5TdXBwb3J0ZWRCeUVkaXRvclZlcnNpb24odmVyc2lvbikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgVGhlIENLRWRpdG9yIDUgQ0ROIGNhbid0IGJlIHVzZWQgd2l0aCB0aGUgZ2l2ZW4gZWRpdG9yIHZlcnNpb246ICR7dmVyc2lvbn0uIFBsZWFzZSBtYWtlIHN1cmUgeW91IGFyZSB1c2luZyBhdCBsZWFzdCB0aGUgQ0tFZGl0b3IgNSB2ZXJzaW9uIDQ0LmBcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCB7IENLQk9YX0NETl9VUkwsIENLX0NETl9VUkwsIElOSkVDVEVEX1NDUklQVFMsIElOSkVDVEVEX1NUWUxFU0hFRVRTLCBhcHBlbmRFeHRyYVBsdWdpbnNUb0VkaXRvckNvbmZpZywgY3JlYXRlQ0tCb3hDZG5VcmwsIGNyZWF0ZUNLQ2RuVXJsLCBjcmVhdGVEZWZlciwgY3JlYXRlSW50ZWdyYXRpb25Vc2FnZURhdGFQbHVnaW4sIGZpbHRlckJsYW5rT2JqZWN0VmFsdWVzLCBmaWx0ZXJPYmplY3RWYWx1ZXMsIGluamVjdFNjcmlwdCwgaW5qZWN0U2NyaXB0c0luUGFyYWxsZWwsIGluamVjdFN0eWxlc2hlZXQsIGlzQ0tFZGl0b3JGcmVlTGljZW5zZSwgaXNTU1IsIGxvYWRDS0VkaXRvckNsb3VkLCBtYXBPYmplY3RWYWx1ZXMsIG9uY2UsIG92ZXJ3cml0ZUFycmF5LCBvdmVyd3JpdGVPYmplY3QsIHByZWxvYWRSZXNvdXJjZSwgc2hhbGxvd0NvbXBhcmVBcnJheXMsIHVpZCwgdW5pcSwgd2FpdEZvciwgd2FpdEZvcldpbmRvd0VudHJ5LCB3aXRob3V0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcbiIsImltcG9ydCAqIGFzIFZ1ZSBmcm9tIFwidnVlXCI7XG5pbXBvcnQgeyB2ZXJzaW9uLCBkZWZpbmVDb21wb25lbnQsIG1lcmdlTW9kZWxzLCB1c2VNb2RlbCwgcmVmLCB3YXRjaCwgb25Nb3VudGVkLCBtYXJrUmF3LCBvbkJlZm9yZVVubW91bnQsIG9wZW5CbG9jaywgY3JlYXRlQmxvY2ssIHJlc29sdmVEeW5hbWljQ29tcG9uZW50LCBjb21wdXRlZCwgd2F0Y2hFZmZlY3QsIHNoYWxsb3dSZWFkb25seSwgdG9WYWx1ZSB9IGZyb20gXCJ2dWVcIjtcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSBcImxvZGFzaC1lc1wiO1xuaW1wb3J0IHsgY3JlYXRlSW50ZWdyYXRpb25Vc2FnZURhdGFQbHVnaW4sIGlzQ0tFZGl0b3JGcmVlTGljZW5zZSwgYXBwZW5kRXh0cmFQbHVnaW5zVG9FZGl0b3JDb25maWcsIHVpZCwgbG9hZENLRWRpdG9yQ2xvdWQgfSBmcm9tIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1pbnRlZ3JhdGlvbnMtY29tbW9uXCI7XG5pbXBvcnQgeyBsb2FkQ0tFZGl0b3JDbG91ZCBhcyBsb2FkQ0tFZGl0b3JDbG91ZDIgfSBmcm9tIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1pbnRlZ3JhdGlvbnMtY29tbW9uXCI7XG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI0LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxuICovXG5jb25zdCBWdWVJbnRlZ3JhdGlvblVzYWdlRGF0YVBsdWdpbiA9IGNyZWF0ZUludGVncmF0aW9uVXNhZ2VEYXRhUGx1Z2luKFxuICBcInZ1ZVwiLFxuICB7XG4gICAgdmVyc2lvbjogXCI3LjMuMFwiLFxuICAgIGZyYW1ld29ya1ZlcnNpb246IHZlcnNpb25cbiAgfVxuKTtcbi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjQsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQuXG4gKi9cbmZ1bmN0aW9uIGFwcGVuZEFsbEludGVncmF0aW9uUGx1Z2luc1RvQ29uZmlnKGVkaXRvckNvbmZpZykge1xuICBpZiAoaXNDS0VkaXRvckZyZWVMaWNlbnNlKGVkaXRvckNvbmZpZy5saWNlbnNlS2V5KSkge1xuICAgIHJldHVybiBlZGl0b3JDb25maWc7XG4gIH1cbiAgcmV0dXJuIGFwcGVuZEV4dHJhUGx1Z2luc1RvRWRpdG9yQ29uZmlnKGVkaXRvckNvbmZpZywgW1xuICAgIC8qKlxuICAgICAqIFRoaXMgcGFydCBvZiB0aGUgY29kZSBpcyBub3QgZXhlY3V0ZWQgaW4gb3Blbi1zb3VyY2UgaW1wbGVtZW50YXRpb25zIHVzaW5nIGEgR1BMIGtleS5cbiAgICAgKiBJdCBvbmx5IHJ1bnMgd2hlbiBhIHNwZWNpZmljIGxpY2Vuc2Uga2V5IGlzIHByb3ZpZGVkLiBJZiB5b3UgYXJlIHVuY2VydGFpbiB3aGV0aGVyXG4gICAgICogdGhpcyBhcHBsaWVzIHRvIHlvdXIgaW5zdGFsbGF0aW9uLCBwbGVhc2UgY29udGFjdCBvdXIgc3VwcG9ydCB0ZWFtLlxuICAgICAqL1xuICAgIFZ1ZUludGVncmF0aW9uVXNhZ2VEYXRhUGx1Z2luXG4gIF0pO1xufVxuY29uc3QgVlVFX0lOVEVHUkFUSU9OX1JFQURfT05MWV9MT0NLX0lEID0gXCJMb2NrIGZyb20gVnVlIGludGVncmF0aW9uIChAY2tlZGl0b3IvY2tlZGl0b3I1LXZ1ZSlcIjtcbmNvbnN0IElOUFVUX0VWRU5UX0RFQk9VTkNFX1dBSVQgPSAzMDA7XG5jb25zdCBfc2ZjX21haW4gPSAvKiBAX19QVVJFX18gKi8gZGVmaW5lQ29tcG9uZW50KHtcbiAgLi4ue1xuICAgIG5hbWU6IFwiQ0tFZGl0b3JcIlxuICB9LFxuICBfX25hbWU6IFwiY2tlZGl0b3JcIixcbiAgcHJvcHM6IC8qIEBfX1BVUkVfXyAqLyBtZXJnZU1vZGVscyh7XG4gICAgZWRpdG9yOiB7fSxcbiAgICBjb25maWc6IHsgZGVmYXVsdDogKCkgPT4gKHt9KSB9LFxuICAgIHRhZ05hbWU6IHsgZGVmYXVsdDogXCJkaXZcIiB9LFxuICAgIGRpc2FibGVkOiB7IHR5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IGZhbHNlIH0sXG4gICAgZGlzYWJsZVR3b1dheURhdGFCaW5kaW5nOiB7IHR5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IGZhbHNlIH1cbiAgfSwge1xuICAgIFwibW9kZWxWYWx1ZVwiOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogXCJcIiB9LFxuICAgIFwibW9kZWxNb2RpZmllcnNcIjoge31cbiAgfSksXG4gIGVtaXRzOiAvKiBAX19QVVJFX18gKi8gbWVyZ2VNb2RlbHMoW1wicmVhZHlcIiwgXCJkZXN0cm95XCIsIFwiYmx1clwiLCBcImZvY3VzXCIsIFwiaW5wdXRcIiwgXCJ1cGRhdGU6bW9kZWxWYWx1ZVwiXSwgW1widXBkYXRlOm1vZGVsVmFsdWVcIl0pLFxuICBzZXR1cChfX3Byb3BzLCB7IGV4cG9zZTogX19leHBvc2UsIGVtaXQ6IF9fZW1pdCB9KSB7XG4gICAgY29uc3QgbW9kZWwgPSB1c2VNb2RlbChfX3Byb3BzLCBcIm1vZGVsVmFsdWVcIik7XG4gICAgY29uc3QgcHJvcHMgPSBfX3Byb3BzO1xuICAgIGNvbnN0IGVtaXQgPSBfX2VtaXQ7XG4gICAgY29uc3QgZWxlbWVudCA9IHJlZigpO1xuICAgIGNvbnN0IGluc3RhbmNlID0gcmVmKCk7XG4gICAgY29uc3QgbGFzdEVkaXRvckRhdGEgPSByZWYoKTtcbiAgICBfX2V4cG9zZSh7XG4gICAgICBpbnN0YW5jZSxcbiAgICAgIGxhc3RFZGl0b3JEYXRhXG4gICAgfSk7XG4gICAgd2F0Y2gobW9kZWwsIChuZXdNb2RlbCkgPT4ge1xuICAgICAgaWYgKGluc3RhbmNlLnZhbHVlICYmIG5ld01vZGVsICE9PSBsYXN0RWRpdG9yRGF0YS52YWx1ZSkge1xuICAgICAgICBpbnN0YW5jZS52YWx1ZS5kYXRhLnNldChuZXdNb2RlbCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgd2F0Y2goKCkgPT4gcHJvcHMuZGlzYWJsZWQsIChyZWFkT25seU1vZGUpID0+IHtcbiAgICAgIGlmIChyZWFkT25seU1vZGUpIHtcbiAgICAgICAgaW5zdGFuY2UudmFsdWUuZW5hYmxlUmVhZE9ubHlNb2RlKFZVRV9JTlRFR1JBVElPTl9SRUFEX09OTFlfTE9DS19JRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS52YWx1ZS5kaXNhYmxlUmVhZE9ubHlNb2RlKFZVRV9JTlRFR1JBVElPTl9SRUFEX09OTFlfTE9DS19JRCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gY2hlY2tWZXJzaW9uKCkge1xuICAgICAgY29uc3QgdmVyc2lvbjIgPSB3aW5kb3cuQ0tFRElUT1JfVkVSU0lPTjtcbiAgICAgIGlmICghdmVyc2lvbjIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignQ2Fubm90IGZpbmQgdGhlIFwiQ0tFRElUT1JfVkVSU0lPTlwiIGluIHRoZSBcIndpbmRvd1wiIHNjb3BlLicpO1xuICAgICAgfVxuICAgICAgY29uc3QgW21ham9yXSA9IHZlcnNpb24yLnNwbGl0KFwiLlwiKS5tYXAoTnVtYmVyKTtcbiAgICAgIGlmIChtYWpvciA+PSA0MiB8fCB2ZXJzaW9uMi5zdGFydHNXaXRoKFwiMC4wLjBcIikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc29sZS53YXJuKFwiVGhlIDxDS0VkaXRvcj4gY29tcG9uZW50IHJlcXVpcmVzIHVzaW5nIENLRWRpdG9yIDUgaW4gdmVyc2lvbiA0Misgb3IgbmlnaHRseSBidWlsZC5cIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldFVwRWRpdG9yRXZlbnRzKGVkaXRvcikge1xuICAgICAgY29uc3QgZW1pdERlYm91bmNlZElucHV0RXZlbnQgPSBkZWJvdW5jZSgoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChwcm9wcy5kaXNhYmxlVHdvV2F5RGF0YUJpbmRpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IGxhc3RFZGl0b3JEYXRhLnZhbHVlID0gZWRpdG9yLmRhdGEuZ2V0KCk7XG4gICAgICAgIGVtaXQoXCJ1cGRhdGU6bW9kZWxWYWx1ZVwiLCBkYXRhLCBldnQsIGVkaXRvcik7XG4gICAgICAgIGVtaXQoXCJpbnB1dFwiLCBkYXRhLCBldnQsIGVkaXRvcik7XG4gICAgICB9LCBJTlBVVF9FVkVOVF9ERUJPVU5DRV9XQUlULCB7IGxlYWRpbmc6IHRydWUgfSk7XG4gICAgICBlZGl0b3IubW9kZWwuZG9jdW1lbnQub24oXCJjaGFuZ2U6ZGF0YVwiLCBlbWl0RGVib3VuY2VkSW5wdXRFdmVudCk7XG4gICAgICBlZGl0b3IuZWRpdGluZy52aWV3LmRvY3VtZW50Lm9uKFwiZm9jdXNcIiwgKGV2dCkgPT4ge1xuICAgICAgICBlbWl0KFwiZm9jdXNcIiwgZXZ0LCBlZGl0b3IpO1xuICAgICAgfSk7XG4gICAgICBlZGl0b3IuZWRpdGluZy52aWV3LmRvY3VtZW50Lm9uKFwiYmx1clwiLCAoZXZ0KSA9PiB7XG4gICAgICAgIGVtaXQoXCJibHVyXCIsIGV2dCwgZWRpdG9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjaGVja1ZlcnNpb24oKTtcbiAgICBvbk1vdW50ZWQoKCkgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yQ29uZmlnID0gYXBwZW5kQWxsSW50ZWdyYXRpb25QbHVnaW5zVG9Db25maWcoXG4gICAgICAgIE9iamVjdC5hc3NpZ24oe30sIHByb3BzLmNvbmZpZylcbiAgICAgICk7XG4gICAgICBpZiAobW9kZWwudmFsdWUpIHtcbiAgICAgICAgZWRpdG9yQ29uZmlnLmluaXRpYWxEYXRhID0gbW9kZWwudmFsdWU7XG4gICAgICB9XG4gICAgICBwcm9wcy5lZGl0b3IuY3JlYXRlKGVsZW1lbnQudmFsdWUsIGVkaXRvckNvbmZpZykudGhlbigoZWRpdG9yKSA9PiB7XG4gICAgICAgIGluc3RhbmNlLnZhbHVlID0gbWFya1JhdyhlZGl0b3IpO1xuICAgICAgICBzZXRVcEVkaXRvckV2ZW50cyhlZGl0b3IpO1xuICAgICAgICBpZiAobW9kZWwudmFsdWUgIT09IGVkaXRvckNvbmZpZy5pbml0aWFsRGF0YSkge1xuICAgICAgICAgIGVkaXRvci5kYXRhLnNldChtb2RlbC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BzLmRpc2FibGVkKSB7XG4gICAgICAgICAgZWRpdG9yLmVuYWJsZVJlYWRPbmx5TW9kZShWVUVfSU5URUdSQVRJT05fUkVBRF9PTkxZX0xPQ0tfSUQpO1xuICAgICAgICB9XG4gICAgICAgIGVtaXQoXCJyZWFkeVwiLCBlZGl0b3IpO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgb25CZWZvcmVVbm1vdW50KCgpID0+IHtcbiAgICAgIGlmIChpbnN0YW5jZS52YWx1ZSkge1xuICAgICAgICBpbnN0YW5jZS52YWx1ZS5kZXN0cm95KCk7XG4gICAgICAgIGluc3RhbmNlLnZhbHVlID0gdm9pZCAwO1xuICAgICAgfVxuICAgICAgZW1pdChcImRlc3Ryb3lcIik7XG4gICAgfSk7XG4gICAgcmV0dXJuIChfY3R4LCBfY2FjaGUpID0+IHtcbiAgICAgIHJldHVybiBvcGVuQmxvY2soKSwgY3JlYXRlQmxvY2socmVzb2x2ZUR5bmFtaWNDb21wb25lbnQoX2N0eC50YWdOYW1lKSwge1xuICAgICAgICByZWZfa2V5OiBcImVsZW1lbnRcIixcbiAgICAgICAgcmVmOiBlbGVtZW50XG4gICAgICB9LCBudWxsLCA1MTIpO1xuICAgIH07XG4gIH1cbn0pO1xuLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyNCwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZC5cbiAqL1xuY29uc3QgdXNlQXN5bmMgPSAoYXN5bmNGdW5jKSA9PiB7XG4gIGNvbnN0IGxhc3RRdWVyeVVVSUQgPSByZWYobnVsbCk7XG4gIGNvbnN0IGVycm9yID0gcmVmKG51bGwpO1xuICBjb25zdCBkYXRhID0gcmVmKG51bGwpO1xuICBjb25zdCBsb2FkaW5nID0gY29tcHV0ZWQoKCkgPT4gbGFzdFF1ZXJ5VVVJRC52YWx1ZSAhPT0gbnVsbCk7XG4gIHdhdGNoRWZmZWN0KGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50UXVlcnlVSUQgPSB1aWQoKTtcbiAgICBsYXN0UXVlcnlVVUlELnZhbHVlID0gY3VycmVudFF1ZXJ5VUlEO1xuICAgIGRhdGEudmFsdWUgPSBudWxsO1xuICAgIGVycm9yLnZhbHVlID0gbnVsbDtcbiAgICBjb25zdCBzaG91bGREaXNjYXJkUXVlcnkgPSAoKSA9PiBsYXN0UXVlcnlVVUlELnZhbHVlICE9PSBjdXJyZW50UXVlcnlVSUQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFzeW5jRnVuYygpO1xuICAgICAgaWYgKCFzaG91bGREaXNjYXJkUXVlcnkoKSkge1xuICAgICAgICBkYXRhLnZhbHVlID0gcmVzdWx0O1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKCFzaG91bGREaXNjYXJkUXVlcnkoKSkge1xuICAgICAgICBlcnJvci52YWx1ZSA9IGVycjtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKCFzaG91bGREaXNjYXJkUXVlcnkoKSkge1xuICAgICAgICBsYXN0UXVlcnlVVUlELnZhbHVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGxvYWRpbmc6IHNoYWxsb3dSZWFkb25seShsb2FkaW5nKSxcbiAgICBkYXRhOiBzaGFsbG93UmVhZG9ubHkoZGF0YSksXG4gICAgZXJyb3I6IHNoYWxsb3dSZWFkb25seShlcnJvcilcbiAgfTtcbn07XG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI0LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxuICovXG5mdW5jdGlvbiB1c2VDS0VkaXRvckNsb3VkKGNvbmZpZykge1xuICByZXR1cm4gdXNlQXN5bmMoXG4gICAgKCkgPT4gbG9hZENLRWRpdG9yQ2xvdWQoXG4gICAgICB0b1ZhbHVlKGNvbmZpZylcbiAgICApXG4gICk7XG59XG4vKipcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwMy0yMDI0LCBDS1NvdXJjZSBIb2xkaW5nIHNwLiB6IG8uby4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxuICovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgaWYgLS0gQHByZXNlcnZlICovXG5pZiAoIVZ1ZS52ZXJzaW9uIHx8ICFWdWUudmVyc2lvbi5zdGFydHNXaXRoKFwiMy5cIikpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgIFwiVGhlIENLRWRpdG9yIHBsdWdpbiB3b3JrcyBvbmx5IHdpdGggVnVlIDMrLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHJlZmVyIHRvIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I1L2xhdGVzdC9idWlsZHMvZ3VpZGVzL2ludGVncmF0aW9uL2ZyYW1ld29ya3MvdnVlanMtdjMuaHRtbFwiXG4gICk7XG59XG5jb25zdCBDa2VkaXRvclBsdWdpbiA9IHtcbiAgLyoqXG4gICAqIEluc3RhbGxzIHRoZSBwbHVnaW4sIHJlZ2lzdGVyaW5nIHRoZSBgPGNrZWRpdG9yPmAgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0gYXBwIFRoZSBhcHBsaWNhdGlvbiBpbnN0YW5jZS5cbiAgICovXG4gIGluc3RhbGwoYXBwKSB7XG4gICAgYXBwLmNvbXBvbmVudChcIkNrZWRpdG9yXCIsIF9zZmNfbWFpbik7XG4gIH1cbn07XG5leHBvcnQge1xuICBfc2ZjX21haW4gYXMgQ2tlZGl0b3IsXG4gIENrZWRpdG9yUGx1Z2luLFxuICBsb2FkQ0tFZGl0b3JDbG91ZDIgYXMgbG9hZENLRWRpdG9yQ2xvdWQsXG4gIHVzZUNLRWRpdG9yQ2xvdWRcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ja2VkaXRvci5qcy5tYXBcbiIsIjxzY3JpcHQ+XHJcbmltcG9ydCBBcHAgZnJvbSAnY21zL2FwcGxpY2F0aW9uL2FwcC52dWUuanMnO1xyXG5pbXBvcnQgRml4ZWRIZWFkZXIgZnJvbSAnY21zL2FwcGxpY2F0aW9uL21peGlucy9maXhlZC1oZWFkZXIudnVlLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1peGluczogW0FwcCwgRml4ZWRIZWFkZXJdLFxyXG4gICAgZWw6ICcjcmFhcy1hcHAnLFxyXG4gICAgZGF0YSgpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICBmaXhlZEhlYWRlckFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGxhc3RTY3JvbGxUb3A6IDAsXHJcbiAgICAgICAgICAgIGNvbmZpZzogd2luZG93LnJhYXNDb25maWcsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAod2luZG93LnJhYXNBcHBsaWNhdGlvbkRhdGEpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihyZXN1bHQsIHdpbmRvdy5yYWFzQXBwbGljYXRpb25EYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgbGlnaHRCb3hJbml0KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuPC9zY3JpcHQ+IiwiY29uc3QgdG9rZW4gPSAnJVthLWYwLTldezJ9JztcbmNvbnN0IHNpbmdsZU1hdGNoZXIgPSBuZXcgUmVnRXhwKCcoJyArIHRva2VuICsgJyl8KFteJV0rPyknLCAnZ2knKTtcbmNvbnN0IG11bHRpTWF0Y2hlciA9IG5ldyBSZWdFeHAoJygnICsgdG9rZW4gKyAnKSsnLCAnZ2knKTtcblxuZnVuY3Rpb24gZGVjb2RlQ29tcG9uZW50cyhjb21wb25lbnRzLCBzcGxpdCkge1xuXHR0cnkge1xuXHRcdC8vIFRyeSB0byBkZWNvZGUgdGhlIGVudGlyZSBzdHJpbmcgZmlyc3Rcblx0XHRyZXR1cm4gW2RlY29kZVVSSUNvbXBvbmVudChjb21wb25lbnRzLmpvaW4oJycpKV07XG5cdH0gY2F0Y2gge1xuXHRcdC8vIERvIG5vdGhpbmdcblx0fVxuXG5cdGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9XG5cblx0c3BsaXQgPSBzcGxpdCB8fCAxO1xuXG5cdC8vIFNwbGl0IHRoZSBhcnJheSBpbiAyIHBhcnRzXG5cdGNvbnN0IGxlZnQgPSBjb21wb25lbnRzLnNsaWNlKDAsIHNwbGl0KTtcblx0Y29uc3QgcmlnaHQgPSBjb21wb25lbnRzLnNsaWNlKHNwbGl0KTtcblxuXHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5jYWxsKFtdLCBkZWNvZGVDb21wb25lbnRzKGxlZnQpLCBkZWNvZGVDb21wb25lbnRzKHJpZ2h0KSk7XG59XG5cbmZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuXHR0cnkge1xuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoaW5wdXQpO1xuXHR9IGNhdGNoIHtcblx0XHRsZXQgdG9rZW5zID0gaW5wdXQubWF0Y2goc2luZ2xlTWF0Y2hlcikgfHwgW107XG5cblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aW5wdXQgPSBkZWNvZGVDb21wb25lbnRzKHRva2VucywgaSkuam9pbignJyk7XG5cblx0XHRcdHRva2VucyA9IGlucHV0Lm1hdGNoKHNpbmdsZU1hdGNoZXIpIHx8IFtdO1xuXHRcdH1cblxuXHRcdHJldHVybiBpbnB1dDtcblx0fVxufVxuXG5mdW5jdGlvbiBjdXN0b21EZWNvZGVVUklDb21wb25lbnQoaW5wdXQpIHtcblx0Ly8gS2VlcCB0cmFjayBvZiBhbGwgdGhlIHJlcGxhY2VtZW50cyBhbmQgcHJlZmlsbCB0aGUgbWFwIHdpdGggdGhlIGBCT01gXG5cdGNvbnN0IHJlcGxhY2VNYXAgPSB7XG5cdFx0JyVGRSVGRic6ICdcXHVGRkZEXFx1RkZGRCcsXG5cdFx0JyVGRiVGRSc6ICdcXHVGRkZEXFx1RkZGRCcsXG5cdH07XG5cblx0bGV0IG1hdGNoID0gbXVsdGlNYXRjaGVyLmV4ZWMoaW5wdXQpO1xuXHR3aGlsZSAobWF0Y2gpIHtcblx0XHR0cnkge1xuXHRcdFx0Ly8gRGVjb2RlIGFzIGJpZyBjaHVua3MgYXMgcG9zc2libGVcblx0XHRcdHJlcGxhY2VNYXBbbWF0Y2hbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzBdKTtcblx0XHR9IGNhdGNoIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGRlY29kZShtYXRjaFswXSk7XG5cblx0XHRcdGlmIChyZXN1bHQgIT09IG1hdGNoWzBdKSB7XG5cdFx0XHRcdHJlcGxhY2VNYXBbbWF0Y2hbMF1dID0gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG1hdGNoID0gbXVsdGlNYXRjaGVyLmV4ZWMoaW5wdXQpO1xuXHR9XG5cblx0Ly8gQWRkIGAlQzJgIGF0IHRoZSBlbmQgb2YgdGhlIG1hcCB0byBtYWtlIHN1cmUgaXQgZG9lcyBub3QgcmVwbGFjZSB0aGUgY29tYmluYXRvciBiZWZvcmUgZXZlcnl0aGluZyBlbHNlXG5cdHJlcGxhY2VNYXBbJyVDMiddID0gJ1xcdUZGRkQnO1xuXG5cdGNvbnN0IGVudHJpZXMgPSBPYmplY3Qua2V5cyhyZXBsYWNlTWFwKTtcblxuXHRmb3IgKGNvbnN0IGtleSBvZiBlbnRyaWVzKSB7XG5cdFx0Ly8gUmVwbGFjZSBhbGwgZGVjb2RlZCBjb21wb25lbnRzXG5cdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoa2V5LCAnZycpLCByZXBsYWNlTWFwW2tleV0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWNvZGVVcmlDb21wb25lbnQoZW5jb2RlZFVSSSkge1xuXHRpZiAodHlwZW9mIGVuY29kZWRVUkkgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYGVuY29kZWRVUklgIHRvIGJlIG9mIHR5cGUgYHN0cmluZ2AsIGdvdCBgJyArIHR5cGVvZiBlbmNvZGVkVVJJICsgJ2AnKTtcblx0fVxuXG5cdHRyeSB7XG5cdFx0Ly8gVHJ5IHRoZSBidWlsdCBpbiBkZWNvZGVyIGZpcnN0XG5cdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkVVJJKTtcblx0fSBjYXRjaCB7XG5cdFx0Ly8gRmFsbGJhY2sgdG8gYSBtb3JlIGFkdmFuY2VkIGRlY29kZXJcblx0XHRyZXR1cm4gY3VzdG9tRGVjb2RlVVJJQ29tcG9uZW50KGVuY29kZWRVUkkpO1xuXHR9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaW5jbHVkZUtleXMob2JqZWN0LCBwcmVkaWNhdGUpIHtcblx0Y29uc3QgcmVzdWx0ID0ge307XG5cblx0aWYgKEFycmF5LmlzQXJyYXkocHJlZGljYXRlKSkge1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIHByZWRpY2F0ZSkge1xuXHRcdFx0Y29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuXHRcdFx0aWYgKGRlc2NyaXB0b3I/LmVudW1lcmFibGUpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjcmlwdG9yKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gYFJlZmxlY3Qub3duS2V5cygpYCBpcyByZXF1aXJlZCB0byByZXRyaWV2ZSBzeW1ib2wgcHJvcGVydGllc1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhvYmplY3QpKSB7XG5cdFx0XHRjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG5cdFx0XHRpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG5cdFx0XHRcdGlmIChwcmVkaWNhdGUoa2V5LCB2YWx1ZSwgb2JqZWN0KSkge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzY3JpcHRvcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhjbHVkZUtleXMob2JqZWN0LCBwcmVkaWNhdGUpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkocHJlZGljYXRlKSkge1xuXHRcdGNvbnN0IHNldCA9IG5ldyBTZXQocHJlZGljYXRlKTtcblx0XHRyZXR1cm4gaW5jbHVkZUtleXMob2JqZWN0LCBrZXkgPT4gIXNldC5oYXMoa2V5KSk7XG5cdH1cblxuXHRyZXR1cm4gaW5jbHVkZUtleXMob2JqZWN0LCAoa2V5LCB2YWx1ZSwgb2JqZWN0KSA9PiAhcHJlZGljYXRlKGtleSwgdmFsdWUsIG9iamVjdCkpO1xufVxuIiwiLyohXG4gKiBqUXVlcnkuc2Nyb2xsVG9cbiAqIENvcHlyaWdodCAoYykgMjAwNyBBcmllbCBGbGVzbGVyIC0gYWZsZXNsZXIg4peLIGdtYWlsIOKAoiBjb20gfCBodHRwczovL2dpdGh1Yi5jb20vZmxlc2xlclxuICogTGljZW5zZWQgdW5kZXIgTUlUXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmxlc2xlci9qcXVlcnkuc2Nyb2xsVG9cbiAqIEBwcm9qZWN0RGVzY3JpcHRpb24gTGlnaHR3ZWlnaHQsIGNyb3NzLWJyb3dzZXIgYW5kIGhpZ2hseSBjdXN0b21pemFibGUgYW5pbWF0ZWQgc2Nyb2xsaW5nIHdpdGggalF1ZXJ5XG4gKiBAYXV0aG9yIEFyaWVsIEZsZXNsZXJcbiAqIEB2ZXJzaW9uIDIuMS4zXG4gKi9cbjsoZnVuY3Rpb24oZmFjdG9yeSkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gR2xvYmFsXG5cdFx0ZmFjdG9yeShqUXVlcnkpO1xuXHR9XG59KShmdW5jdGlvbigkKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgJHNjcm9sbFRvID0gJC5zY3JvbGxUbyA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHNldHRpbmdzKSB7XG5cdFx0cmV0dXJuICQod2luZG93KS5zY3JvbGxUbyh0YXJnZXQsIGR1cmF0aW9uLCBzZXR0aW5ncyk7XG5cdH07XG5cblx0JHNjcm9sbFRvLmRlZmF1bHRzID0ge1xuXHRcdGF4aXM6J3h5Jyxcblx0XHRkdXJhdGlvbjogMCxcblx0XHRsaW1pdDp0cnVlXG5cdH07XG5cblx0ZnVuY3Rpb24gaXNXaW4oZWxlbSkge1xuXHRcdHJldHVybiAhZWxlbS5ub2RlTmFtZSB8fFxuXHRcdFx0JC5pbkFycmF5KGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSwgWydpZnJhbWUnLCcjZG9jdW1lbnQnLCdodG1sJywnYm9keSddKSAhPT0gLTE7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuXHRcdC8vIEJyb3VnaHQgZnJvbSBqUXVlcnkgc2luY2UgaXQncyBkZXByZWNhdGVkXG5cdFx0cmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbidcblx0fVxuXG5cdCQuZm4uc2Nyb2xsVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBzZXR0aW5ncykge1xuXHRcdGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRzZXR0aW5ncyA9IGR1cmF0aW9uO1xuXHRcdFx0ZHVyYXRpb24gPSAwO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHNldHRpbmdzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRzZXR0aW5ncyA9IHsgb25BZnRlcjpzZXR0aW5ncyB9O1xuXHRcdH1cblx0XHRpZiAodGFyZ2V0ID09PSAnbWF4Jykge1xuXHRcdFx0dGFyZ2V0ID0gOWU5O1xuXHRcdH1cblxuXHRcdHNldHRpbmdzID0gJC5leHRlbmQoe30sICRzY3JvbGxUby5kZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRcdC8vIFNwZWVkIGlzIHN0aWxsIHJlY29nbml6ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5cdFx0ZHVyYXRpb24gPSBkdXJhdGlvbiB8fCBzZXR0aW5ncy5kdXJhdGlvbjtcblx0XHQvLyBNYWtlIHN1cmUgdGhlIHNldHRpbmdzIGFyZSBnaXZlbiByaWdodFxuXHRcdHZhciBxdWV1ZSA9IHNldHRpbmdzLnF1ZXVlICYmIHNldHRpbmdzLmF4aXMubGVuZ3RoID4gMTtcblx0XHRpZiAocXVldWUpIHtcblx0XHRcdC8vIExldCdzIGtlZXAgdGhlIG92ZXJhbGwgZHVyYXRpb25cblx0XHRcdGR1cmF0aW9uIC89IDI7XG5cdFx0fVxuXHRcdHNldHRpbmdzLm9mZnNldCA9IGJvdGgoc2V0dGluZ3Mub2Zmc2V0KTtcblx0XHRzZXR0aW5ncy5vdmVyID0gYm90aChzZXR0aW5ncy5vdmVyKTtcblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBOdWxsIHRhcmdldCB5aWVsZHMgbm90aGluZywganVzdCBsaWtlIGpRdWVyeSBkb2VzXG5cdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSByZXR1cm47XG5cblx0XHRcdHZhciB3aW4gPSBpc1dpbih0aGlzKSxcblx0XHRcdFx0ZWxlbSA9IHdpbiA/IHRoaXMuY29udGVudFdpbmRvdyB8fCB3aW5kb3cgOiB0aGlzLFxuXHRcdFx0XHQkZWxlbSA9ICQoZWxlbSksXG5cdFx0XHRcdHRhcmcgPSB0YXJnZXQsXG5cdFx0XHRcdGF0dHIgPSB7fSxcblx0XHRcdFx0dG9mZjtcblxuXHRcdFx0c3dpdGNoICh0eXBlb2YgdGFyZykge1xuXHRcdFx0XHQvLyBBIG51bWJlciB3aWxsIHBhc3MgdGhlIHJlZ2V4XG5cdFx0XHRcdGNhc2UgJ251bWJlcic6XG5cdFx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdFx0aWYgKC9eKFsrLV09Pyk/XFxkKyhcXC5cXGQrKT8ocHh8JSk/JC8udGVzdCh0YXJnKSkge1xuXHRcdFx0XHRcdFx0dGFyZyA9IGJvdGgodGFyZyk7XG5cdFx0XHRcdFx0XHQvLyBXZSBhcmUgZG9uZVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIFJlbGF0aXZlL0Fic29sdXRlIHNlbGVjdG9yXG5cdFx0XHRcdFx0dGFyZyA9IHdpbiA/ICQodGFyZykgOiAkKHRhcmcsIGVsZW0pO1xuXHRcdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdFx0Y2FzZSAnb2JqZWN0Jzpcblx0XHRcdFx0XHRpZiAodGFyZy5sZW5ndGggPT09IDApIHJldHVybjtcblx0XHRcdFx0XHQvLyBET01FbGVtZW50IC8galF1ZXJ5XG5cdFx0XHRcdFx0aWYgKHRhcmcuaXMgfHwgdGFyZy5zdHlsZSkge1xuXHRcdFx0XHRcdFx0Ly8gR2V0IHRoZSByZWFsIHBvc2l0aW9uIG9mIHRoZSB0YXJnZXRcblx0XHRcdFx0XHRcdHRvZmYgPSAodGFyZyA9ICQodGFyZykpLm9mZnNldCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIG9mZnNldCA9IGlzRnVuY3Rpb24oc2V0dGluZ3Mub2Zmc2V0KSAmJiBzZXR0aW5ncy5vZmZzZXQoZWxlbSwgdGFyZykgfHwgc2V0dGluZ3Mub2Zmc2V0O1xuXG5cdFx0XHQkLmVhY2goc2V0dGluZ3MuYXhpcy5zcGxpdCgnJyksIGZ1bmN0aW9uKGksIGF4aXMpIHtcblx0XHRcdFx0dmFyIFBvc1x0PSBheGlzID09PSAneCcgPyAnTGVmdCcgOiAnVG9wJyxcblx0XHRcdFx0XHRwb3MgPSBQb3MudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRrZXkgPSAnc2Nyb2xsJyArIFBvcyxcblx0XHRcdFx0XHRwcmV2ID0gJGVsZW1ba2V5XSgpLFxuXHRcdFx0XHRcdG1heCA9ICRzY3JvbGxUby5tYXgoZWxlbSwgYXhpcyk7XG5cblx0XHRcdFx0aWYgKHRvZmYpIHsvLyBqUXVlcnkgLyBET01FbGVtZW50XG5cdFx0XHRcdFx0YXR0cltrZXldID0gdG9mZltwb3NdICsgKHdpbiA/IDAgOiBwcmV2IC0gJGVsZW0ub2Zmc2V0KClbcG9zXSk7XG5cblx0XHRcdFx0XHQvLyBJZiBpdCdzIGEgZG9tIGVsZW1lbnQsIHJlZHVjZSB0aGUgbWFyZ2luXG5cdFx0XHRcdFx0aWYgKHNldHRpbmdzLm1hcmdpbikge1xuXHRcdFx0XHRcdFx0YXR0cltrZXldIC09IHBhcnNlSW50KHRhcmcuY3NzKCdtYXJnaW4nK1BvcyksIDEwKSB8fCAwO1xuXHRcdFx0XHRcdFx0YXR0cltrZXldIC09IHBhcnNlSW50KHRhcmcuY3NzKCdib3JkZXInK1BvcysnV2lkdGgnKSwgMTApIHx8IDA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YXR0cltrZXldICs9IG9mZnNldFtwb3NdIHx8IDA7XG5cblx0XHRcdFx0XHRpZiAoc2V0dGluZ3Mub3Zlcltwb3NdKSB7XG5cdFx0XHRcdFx0XHQvLyBTY3JvbGwgdG8gYSBmcmFjdGlvbiBvZiBpdHMgd2lkdGgvaGVpZ2h0XG5cdFx0XHRcdFx0XHRhdHRyW2tleV0gKz0gdGFyZ1theGlzID09PSAneCc/J3dpZHRoJzonaGVpZ2h0J10oKSAqIHNldHRpbmdzLm92ZXJbcG9zXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHZhbCA9IHRhcmdbcG9zXTtcblx0XHRcdFx0XHQvLyBIYW5kbGUgcGVyY2VudGFnZSB2YWx1ZXNcblx0XHRcdFx0XHRhdHRyW2tleV0gPSB2YWwuc2xpY2UgJiYgdmFsLnNsaWNlKC0xKSA9PT0gJyUnID9cblx0XHRcdFx0XHRcdHBhcnNlRmxvYXQodmFsKSAvIDEwMCAqIG1heFxuXHRcdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBOdW1iZXIgb3IgJ251bWJlcidcblx0XHRcdFx0aWYgKHNldHRpbmdzLmxpbWl0ICYmIC9eXFxkKyQvLnRlc3QoYXR0cltrZXldKSkge1xuXHRcdFx0XHRcdC8vIENoZWNrIHRoZSBsaW1pdHNcblx0XHRcdFx0XHRhdHRyW2tleV0gPSBhdHRyW2tleV0gPD0gMCA/IDAgOiBNYXRoLm1pbihhdHRyW2tleV0sIG1heCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEb24ndCB3YXN0ZSB0aW1lIGFuaW1hdGluZywgaWYgdGhlcmUncyBubyBuZWVkLlxuXHRcdFx0XHRpZiAoIWkgJiYgc2V0dGluZ3MuYXhpcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0aWYgKHByZXYgPT09IGF0dHJba2V5XSkge1xuXHRcdFx0XHRcdFx0Ly8gTm8gYW5pbWF0aW9uIG5lZWRlZFxuXHRcdFx0XHRcdFx0YXR0ciA9IHt9O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocXVldWUpIHtcblx0XHRcdFx0XHRcdC8vIEludGVybWVkaWF0ZSBhbmltYXRpb25cblx0XHRcdFx0XHRcdGFuaW1hdGUoc2V0dGluZ3Mub25BZnRlckZpcnN0KTtcblx0XHRcdFx0XHRcdC8vIERvbid0IGFuaW1hdGUgdGhpcyBheGlzIGFnYWluIGluIHRoZSBuZXh0IGl0ZXJhdGlvbi5cblx0XHRcdFx0XHRcdGF0dHIgPSB7fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRhbmltYXRlKHNldHRpbmdzLm9uQWZ0ZXIpO1xuXG5cdFx0XHRmdW5jdGlvbiBhbmltYXRlKGNhbGxiYWNrKSB7XG5cdFx0XHRcdHZhciBvcHRzID0gJC5leHRlbmQoe30sIHNldHRpbmdzLCB7XG5cdFx0XHRcdFx0Ly8gVGhlIHF1ZXVlIHNldHRpbmcgY29uZmxpY3RzIHdpdGggYW5pbWF0ZSgpXG5cdFx0XHRcdFx0Ly8gRm9yY2UgaXQgdG8gYWx3YXlzIGJlIHRydWVcblx0XHRcdFx0XHRxdWV1ZTogdHJ1ZSxcblx0XHRcdFx0XHRkdXJhdGlvbjogZHVyYXRpb24sXG5cdFx0XHRcdFx0Y29tcGxldGU6IGNhbGxiYWNrICYmIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChlbGVtLCB0YXJnLCBzZXR0aW5ncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JGVsZW0uYW5pbWF0ZShhdHRyLCBvcHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHQvLyBNYXggc2Nyb2xsaW5nIHBvc2l0aW9uLCB3b3JrcyBvbiBxdWlya3MgbW9kZVxuXHQvLyBJdCBvbmx5IGZhaWxzIChub3QgdG9vIGJhZGx5KSBvbiBJRSwgcXVpcmtzIG1vZGUuXG5cdCRzY3JvbGxUby5tYXggPSBmdW5jdGlvbihlbGVtLCBheGlzKSB7XG5cdFx0dmFyIERpbSA9IGF4aXMgPT09ICd4JyA/ICdXaWR0aCcgOiAnSGVpZ2h0Jyxcblx0XHRcdHNjcm9sbCA9ICdzY3JvbGwnK0RpbTtcblxuXHRcdGlmICghaXNXaW4oZWxlbSkpXG5cdFx0XHRyZXR1cm4gZWxlbVtzY3JvbGxdIC0gJChlbGVtKVtEaW0udG9Mb3dlckNhc2UoKV0oKTtcblxuXHRcdHZhciBzaXplID0gJ2NsaWVudCcgKyBEaW0sXG5cdFx0XHRkb2MgPSBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbS5kb2N1bWVudCxcblx0XHRcdGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50LFxuXHRcdFx0Ym9keSA9IGRvYy5ib2R5O1xuXG5cdFx0cmV0dXJuIE1hdGgubWF4KGh0bWxbc2Nyb2xsXSwgYm9keVtzY3JvbGxdKSAtIE1hdGgubWluKGh0bWxbc2l6ZV0sIGJvZHlbc2l6ZV0pO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGJvdGgodmFsKSB7XG5cdFx0cmV0dXJuIGlzRnVuY3Rpb24odmFsKSB8fCAkLmlzUGxhaW5PYmplY3QodmFsKSA/IHZhbCA6IHsgdG9wOnZhbCwgbGVmdDp2YWwgfTtcblx0fVxuXG5cdC8vIEFkZCBzcGVjaWFsIGhvb2tzIHNvIHRoYXQgd2luZG93IHNjcm9sbCBwcm9wZXJ0aWVzIGNhbiBiZSBhbmltYXRlZFxuXHQkLlR3ZWVuLnByb3BIb29rcy5zY3JvbGxMZWZ0ID1cblx0JC5Ud2Vlbi5wcm9wSG9va3Muc2Nyb2xsVG9wID0ge1xuXHRcdGdldDogZnVuY3Rpb24odCkge1xuXHRcdFx0cmV0dXJuICQodC5lbGVtKVt0LnByb3BdKCk7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRcdHZhciBjdXJyID0gdGhpcy5nZXQodCk7XG5cdFx0XHQvLyBJZiBpbnRlcnJ1cHQgaXMgdHJ1ZSBhbmQgdXNlciBzY3JvbGxlZCwgc3RvcCBhbmltYXRpbmdcblx0XHRcdGlmICh0Lm9wdGlvbnMuaW50ZXJydXB0ICYmIHQuX2xhc3QgJiYgdC5fbGFzdCAhPT0gY3Vycikge1xuXHRcdFx0XHRyZXR1cm4gJCh0LmVsZW0pLnN0b3AoKTtcblx0XHRcdH1cblx0XHRcdHZhciBuZXh0ID0gTWF0aC5yb3VuZCh0Lm5vdyk7XG5cdFx0XHQvLyBEb24ndCB3YXN0ZSBDUFVcblx0XHRcdC8vIEJyb3dzZXJzIGRvbid0IHJlbmRlciBmbG9hdGluZyBwb2ludCBzY3JvbGxcblx0XHRcdGlmIChjdXJyICE9PSBuZXh0KSB7XG5cdFx0XHRcdCQodC5lbGVtKVt0LnByb3BdKG5leHQpO1xuXHRcdFx0XHR0Ll9sYXN0ID0gdGhpcy5nZXQodCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEFNRCByZXF1aXJlbWVudFxuXHRyZXR1cm4gJHNjcm9sbFRvO1xufSk7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcbmltcG9ydCBnZXRSYXdUYWcgZnJvbSAnLi9fZ2V0UmF3VGFnLmpzJztcbmltcG9ydCBvYmplY3RUb1N0cmluZyBmcm9tICcuL19vYmplY3RUb1N0cmluZy5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlR2V0VGFnO1xuIiwiaW1wb3J0IHRyaW1tZWRFbmRJbmRleCBmcm9tICcuL190cmltbWVkRW5kSW5kZXguanMnO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltU3RhcnQgPSAvXlxccysvO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRyaW1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRyaW1tZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVHJpbShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZ1xuICAgID8gc3RyaW5nLnNsaWNlKDAsIHRyaW1tZWRFbmRJbmRleChzdHJpbmcpICsgMSkucmVwbGFjZShyZVRyaW1TdGFydCwgJycpXG4gICAgOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VUcmltO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuZXhwb3J0IGRlZmF1bHQgZnJlZUdsb2JhbDtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYXdUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb2JqZWN0VG9TdHJpbmc7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5leHBvcnQgZGVmYXVsdCByb290O1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYSBzaW5nbGUgd2hpdGVzcGFjZSBjaGFyYWN0ZXIuICovXG52YXIgcmVXaGl0ZXNwYWNlID0gL1xccy87XG5cbi8qKlxuICogVXNlZCBieSBgXy50cmltYCBhbmQgYF8udHJpbUVuZGAgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZVxuICogY2hhcmFjdGVyIG9mIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3Rlci5cbiAqL1xuZnVuY3Rpb24gdHJpbW1lZEVuZEluZGV4KHN0cmluZykge1xuICB2YXIgaW5kZXggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIHdoaWxlIChpbmRleC0tICYmIHJlV2hpdGVzcGFjZS50ZXN0KHN0cmluZy5jaGFyQXQoaW5kZXgpKSkge31cbiAgcmV0dXJuIGluZGV4O1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmltbWVkRW5kSW5kZXg7XG4iLCJpbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgbm93IGZyb20gJy4vbm93LmpzJztcbmltcG9ydCB0b051bWJlciBmcm9tICcuL3RvTnVtYmVyLmpzJztcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHRpbWVXYWl0aW5nID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZ1xuICAgICAgPyBuYXRpdmVNaW4odGltZVdhaXRpbmcsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKVxuICAgICAgOiB0aW1lV2FpdGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlYm91bmNlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0TGlrZTtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNTeW1ib2w7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbm93O1xuIiwiaW1wb3J0IGJhc2VUcmltIGZyb20gJy4vX2Jhc2VUcmltLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCBpc1N5bWJvbCBmcm9tICcuL2lzU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IGJhc2VUcmltKHZhbHVlKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvTnVtYmVyO1xuIiwiaW1wb3J0IGRlY29kZUNvbXBvbmVudCBmcm9tICdkZWNvZGUtdXJpLWNvbXBvbmVudCc7XG5pbXBvcnQge2luY2x1ZGVLZXlzfSBmcm9tICdmaWx0ZXItb2JqJztcbmltcG9ydCBzcGxpdE9uRmlyc3QgZnJvbSAnc3BsaXQtb24tZmlyc3QnO1xuXG5jb25zdCBpc051bGxPclVuZGVmaW5lZCA9IHZhbHVlID0+IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL3ByZWZlci1jb2RlLXBvaW50XG5jb25zdCBzdHJpY3RVcmlFbmNvZGUgPSBzdHJpbmcgPT4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZykucmVwbGFjZUFsbCgvWyEnKCkqXS9nLCB4ID0+IGAlJHt4LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCl9YCk7XG5cbmNvbnN0IGVuY29kZUZyYWdtZW50SWRlbnRpZmllciA9IFN5bWJvbCgnZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyJyk7XG5cbmZ1bmN0aW9uIGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKSB7XG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzoge1xuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHJlc3VsdC5sZW5ndGg7XG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHRcdC4uLnJlc3VsdCwgW2VuY29kZShrZXksIG9wdGlvbnMpLCAnWycsIGluZGV4LCAnXSddLmpvaW4oJycpLFxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbJywgZW5jb2RlKGluZGV4LCBvcHRpb25zKSwgJ109JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyksXG5cdFx0XHRcdF07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2JyYWNrZXQnOiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXSddLmpvaW4oJycpLFxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXT0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKSxcblx0XHRcdFx0XTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29sb24tbGlzdC1zZXBhcmF0b3InOiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICc6bGlzdD0nXS5qb2luKCcnKSxcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnOmxpc3Q9JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyksXG5cdFx0XHRcdF07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2NvbW1hJzpcblx0XHRjYXNlICdzZXBhcmF0b3InOlxuXHRcdGNhc2UgJ2JyYWNrZXQtc2VwYXJhdG9yJzoge1xuXHRcdFx0Y29uc3Qga2V5VmFsdWVTZXBhcmF0b3IgPSBvcHRpb25zLmFycmF5Rm9ybWF0ID09PSAnYnJhY2tldC1zZXBhcmF0b3InXG5cdFx0XHRcdD8gJ1tdPSdcblx0XHRcdFx0OiAnPSc7XG5cblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhbnNsYXRlIG51bGwgdG8gYW4gZW1wdHkgc3RyaW5nIHNvIHRoYXQgaXQgZG9lc24ndCBzZXJpYWxpemUgYXMgJ251bGwnXG5cdFx0XHRcdHZhbHVlID0gdmFsdWUgPT09IG51bGwgPyAnJyA6IHZhbHVlO1xuXG5cdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtbZW5jb2RlKGtleSwgb3B0aW9ucyksIGtleVZhbHVlU2VwYXJhdG9yLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1tyZXN1bHQsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4ob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcildO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkZWZhdWx0OiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRpb25zKSxcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpLFxuXHRcdFx0XHRdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucykge1xuXHRsZXQgcmVzdWx0O1xuXG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRyZXN1bHQgPSAvXFxbKFxcZCopXSQvLmV4ZWMoa2V5KTtcblxuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXFxkKl0kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0ge307XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldW3Jlc3VsdFsxXV0gPSB2YWx1ZTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnYnJhY2tldCc6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0cmVzdWx0ID0gLyhcXFtdKSQvLmV4ZWMoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW10kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW3ZhbHVlXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIHZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29sb24tbGlzdC1zZXBhcmF0b3InOiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdHJlc3VsdCA9IC8oOmxpc3QpJC8uZXhlYyhrZXkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvOmxpc3QkLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW3ZhbHVlXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIHZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29tbWEnOlxuXHRcdGNhc2UgJ3NlcGFyYXRvcic6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0Y29uc3QgaXNBcnJheSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuaW5jbHVkZXMob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cdFx0XHRcdGNvbnN0IGlzRW5jb2RlZEFycmF5ID0gKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIWlzQXJyYXkgJiYgZGVjb2RlKHZhbHVlLCBvcHRpb25zKS5pbmNsdWRlcyhvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKSk7XG5cdFx0XHRcdHZhbHVlID0gaXNFbmNvZGVkQXJyYXkgPyBkZWNvZGUodmFsdWUsIG9wdGlvbnMpIDogdmFsdWU7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gaXNBcnJheSB8fCBpc0VuY29kZWRBcnJheSA/IHZhbHVlLnNwbGl0KG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpLm1hcChpdGVtID0+IGRlY29kZShpdGVtLCBvcHRpb25zKSkgOiAodmFsdWUgPT09IG51bGwgPyB2YWx1ZSA6IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykpO1xuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gbmV3VmFsdWU7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2JyYWNrZXQtc2VwYXJhdG9yJzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRjb25zdCBpc0FycmF5ID0gLyhcXFtdKSQvLnRlc3Qoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW10kLywgJycpO1xuXG5cdFx0XHRcdGlmICghaXNBcnJheSkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZSA/IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykgOiB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBhcnJheVZhbHVlID0gdmFsdWUgPT09IG51bGxcblx0XHRcdFx0XHQ/IFtdXG5cdFx0XHRcdFx0OiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpLnNwbGl0KG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpO1xuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gYXJyYXlWYWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIC4uLmFycmF5VmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkZWZhdWx0OiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFsuLi5bYWNjdW11bGF0b3Jba2V5XV0uZmxhdCgpLCB2YWx1ZV07XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUFycmF5Rm9ybWF0U2VwYXJhdG9yKHZhbHVlKSB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnIHx8IHZhbHVlLmxlbmd0aCAhPT0gMSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2FycmF5Rm9ybWF0U2VwYXJhdG9yIG11c3QgYmUgc2luZ2xlIGNoYXJhY3RlciBzdHJpbmcnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBlbmNvZGUodmFsdWUsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMuZW5jb2RlKSB7XG5cdFx0cmV0dXJuIG9wdGlvbnMuc3RyaWN0ID8gc3RyaWN0VXJpRW5jb2RlKHZhbHVlKSA6IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRlY29kZSh2YWx1ZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5kZWNvZGUpIHtcblx0XHRyZXR1cm4gZGVjb2RlQ29tcG9uZW50KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24ga2V5c1NvcnRlcihpbnB1dCkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcblx0XHRyZXR1cm4gaW5wdXQuc29ydCgpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4ga2V5c1NvcnRlcihPYmplY3Qua2V5cyhpbnB1dCkpXG5cdFx0XHQuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEpIC0gTnVtYmVyKGIpKVxuXHRcdFx0Lm1hcChrZXkgPT4gaW5wdXRba2V5XSk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUhhc2goaW5wdXQpIHtcblx0Y29uc3QgaGFzaFN0YXJ0ID0gaW5wdXQuaW5kZXhPZignIycpO1xuXHRpZiAoaGFzaFN0YXJ0ICE9PSAtMSkge1xuXHRcdGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgaGFzaFN0YXJ0KTtcblx0fVxuXG5cdHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gZ2V0SGFzaCh1cmwpIHtcblx0bGV0IGhhc2ggPSAnJztcblx0Y29uc3QgaGFzaFN0YXJ0ID0gdXJsLmluZGV4T2YoJyMnKTtcblx0aWYgKGhhc2hTdGFydCAhPT0gLTEpIHtcblx0XHRoYXNoID0gdXJsLnNsaWNlKGhhc2hTdGFydCk7XG5cdH1cblxuXHRyZXR1cm4gaGFzaDtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucywgdHlwZSkge1xuXHRpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHR5cGUodmFsdWUpO1xuXHR9XG5cblx0aWYgKG9wdGlvbnMucGFyc2VCb29sZWFucyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnIHx8IHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICdmYWxzZScpKSB7XG5cdFx0cmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJztcblx0fVxuXG5cdGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhTnVtYmVyLmlzTmFOKE51bWJlcih2YWx1ZSkpICYmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKSAhPT0gJycpKSB7XG5cdFx0cmV0dXJuIE51bWJlcih2YWx1ZSk7XG5cdH1cblxuXHRpZiAob3B0aW9ucy5wYXJzZU51bWJlcnMgJiYgIU51bWJlci5pc05hTihOdW1iZXIodmFsdWUpKSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgIT09ICcnKSkge1xuXHRcdHJldHVybiBOdW1iZXIodmFsdWUpO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdChpbnB1dCkge1xuXHRpbnB1dCA9IHJlbW92ZUhhc2goaW5wdXQpO1xuXHRjb25zdCBxdWVyeVN0YXJ0ID0gaW5wdXQuaW5kZXhPZignPycpO1xuXHRpZiAocXVlcnlTdGFydCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQuc2xpY2UocXVlcnlTdGFydCArIDEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2UocXVlcnksIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IHtcblx0XHRkZWNvZGU6IHRydWUsXG5cdFx0c29ydDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnLFxuXHRcdGFycmF5Rm9ybWF0U2VwYXJhdG9yOiAnLCcsXG5cdFx0cGFyc2VOdW1iZXJzOiBmYWxzZSxcblx0XHRwYXJzZUJvb2xlYW5zOiBmYWxzZSxcblx0XHR0eXBlczogT2JqZWN0LmNyZWF0ZShudWxsKSxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdHZhbGlkYXRlQXJyYXlGb3JtYXRTZXBhcmF0b3Iob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cblx0Y29uc3QgZm9ybWF0dGVyID0gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucyk7XG5cblx0Ly8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIG5vIHByb3RvdHlwZVxuXHRjb25zdCByZXR1cm5WYWx1ZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0aWYgKHR5cGVvZiBxdWVyeSAhPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gcmV0dXJuVmFsdWU7XG5cdH1cblxuXHRxdWVyeSA9IHF1ZXJ5LnRyaW0oKS5yZXBsYWNlKC9eWz8jJl0vLCAnJyk7XG5cblx0aWYgKCFxdWVyeSkge1xuXHRcdHJldHVybiByZXR1cm5WYWx1ZTtcblx0fVxuXG5cdGZvciAoY29uc3QgcGFyYW1ldGVyIG9mIHF1ZXJ5LnNwbGl0KCcmJykpIHtcblx0XHRpZiAocGFyYW1ldGVyID09PSAnJykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGFyYW1ldGVyXyA9IG9wdGlvbnMuZGVjb2RlID8gcGFyYW1ldGVyLnJlcGxhY2VBbGwoJysnLCAnICcpIDogcGFyYW1ldGVyO1xuXG5cdFx0bGV0IFtrZXksIHZhbHVlXSA9IHNwbGl0T25GaXJzdChwYXJhbWV0ZXJfLCAnPScpO1xuXG5cdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRrZXkgPSBwYXJhbWV0ZXJfO1xuXHRcdH1cblxuXHRcdC8vIE1pc3NpbmcgYD1gIHNob3VsZCBiZSBgbnVsbGA6XG5cdFx0Ly8gaHR0cDovL3czLm9yZy9UUi8yMDEyL1dELXVybC0yMDEyMDUyNC8jY29sbGVjdC11cmwtcGFyYW1ldGVyc1xuXHRcdHZhbHVlID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiAoWydjb21tYScsICdzZXBhcmF0b3InLCAnYnJhY2tldC1zZXBhcmF0b3InXS5pbmNsdWRlcyhvcHRpb25zLmFycmF5Rm9ybWF0KSA/IHZhbHVlIDogZGVjb2RlKHZhbHVlLCBvcHRpb25zKSk7XG5cdFx0Zm9ybWF0dGVyKGRlY29kZShrZXksIG9wdGlvbnMpLCB2YWx1ZSwgcmV0dXJuVmFsdWUpO1xuXHR9XG5cblx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocmV0dXJuVmFsdWUpKSB7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgb3B0aW9ucy50eXBlc1trZXldICE9PSAnc3RyaW5nJykge1xuXHRcdFx0Zm9yIChjb25zdCBba2V5MiwgdmFsdWUyXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZSkpIHtcblx0XHRcdFx0Y29uc3QgdHlwZSA9IG9wdGlvbnMudHlwZXNba2V5XSA/IG9wdGlvbnMudHlwZXNba2V5XS5yZXBsYWNlKCdbXScsICcnKSA6IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFsdWVba2V5Ml0gPSBwYXJzZVZhbHVlKHZhbHVlMiwgb3B0aW9ucywgdHlwZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmIG9wdGlvbnMudHlwZXNba2V5XSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVyblZhbHVlW2tleV0gPSBPYmplY3QudmFsdWVzKHZhbHVlKS5qb2luKG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm5WYWx1ZVtrZXldID0gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucywgb3B0aW9ucy50eXBlc1trZXldKTtcblx0XHR9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zb3J0ID09PSBmYWxzZSkge1xuXHRcdHJldHVybiByZXR1cm5WYWx1ZTtcblx0fVxuXG5cdC8vIFRPRE86IFJlbW92ZSB0aGUgdXNlIG9mIGByZWR1Y2VgLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1yZWR1Y2Vcblx0cmV0dXJuIChvcHRpb25zLnNvcnQgPT09IHRydWUgPyBPYmplY3Qua2V5cyhyZXR1cm5WYWx1ZSkuc29ydCgpIDogT2JqZWN0LmtleXMocmV0dXJuVmFsdWUpLnNvcnQob3B0aW9ucy5zb3J0KSkucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuXHRcdGNvbnN0IHZhbHVlID0gcmV0dXJuVmFsdWVba2V5XTtcblx0XHRyZXN1bHRba2V5XSA9IEJvb2xlYW4odmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpID8ga2V5c1NvcnRlcih2YWx1ZSkgOiB2YWx1ZTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LCBPYmplY3QuY3JlYXRlKG51bGwpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeShvYmplY3QsIG9wdGlvbnMpIHtcblx0aWYgKCFvYmplY3QpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRvcHRpb25zID0ge1xuXHRcdGVuY29kZTogdHJ1ZSxcblx0XHRzdHJpY3Q6IHRydWUsXG5cdFx0YXJyYXlGb3JtYXQ6ICdub25lJyxcblx0XHRhcnJheUZvcm1hdFNlcGFyYXRvcjogJywnLFxuXHRcdC4uLm9wdGlvbnMsXG5cdH07XG5cblx0dmFsaWRhdGVBcnJheUZvcm1hdFNlcGFyYXRvcihvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKTtcblxuXHRjb25zdCBzaG91bGRGaWx0ZXIgPSBrZXkgPT4gKFxuXHRcdChvcHRpb25zLnNraXBOdWxsICYmIGlzTnVsbE9yVW5kZWZpbmVkKG9iamVjdFtrZXldKSlcblx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgb2JqZWN0W2tleV0gPT09ICcnKVxuXHQpO1xuXG5cdGNvbnN0IGZvcm1hdHRlciA9IGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKTtcblxuXHRjb25zdCBvYmplY3RDb3B5ID0ge307XG5cblx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xuXHRcdGlmICghc2hvdWxkRmlsdGVyKGtleSkpIHtcblx0XHRcdG9iamVjdENvcHlba2V5XSA9IHZhbHVlO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3RDb3B5KTtcblxuXHRpZiAob3B0aW9ucy5zb3J0ICE9PSBmYWxzZSkge1xuXHRcdGtleXMuc29ydChvcHRpb25zLnNvcnQpO1xuXHR9XG5cblx0cmV0dXJuIGtleXMubWFwKGtleSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRpZiAodmFsdWUubGVuZ3RoID09PSAwICYmIG9wdGlvbnMuYXJyYXlGb3JtYXQgPT09ICdicmFja2V0LXNlcGFyYXRvcicpIHtcblx0XHRcdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdGlvbnMpICsgJ1tdJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHZhbHVlXG5cdFx0XHRcdC5yZWR1Y2UoZm9ybWF0dGVyKGtleSksIFtdKVxuXHRcdFx0XHQuam9pbignJicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRpb25zKSArICc9JyArIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyk7XG5cdH0pLmZpbHRlcih4ID0+IHgubGVuZ3RoID4gMCkuam9pbignJicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVcmwodXJsLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0ZGVjb2RlOiB0cnVlLFxuXHRcdC4uLm9wdGlvbnMsXG5cdH07XG5cblx0bGV0IFt1cmxfLCBoYXNoXSA9IHNwbGl0T25GaXJzdCh1cmwsICcjJyk7XG5cblx0aWYgKHVybF8gPT09IHVuZGVmaW5lZCkge1xuXHRcdHVybF8gPSB1cmw7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHVybDogdXJsXz8uc3BsaXQoJz8nKT8uWzBdID8/ICcnLFxuXHRcdHF1ZXJ5OiBwYXJzZShleHRyYWN0KHVybCksIG9wdGlvbnMpLFxuXHRcdC4uLihvcHRpb25zICYmIG9wdGlvbnMucGFyc2VGcmFnbWVudElkZW50aWZpZXIgJiYgaGFzaCA/IHtmcmFnbWVudElkZW50aWZpZXI6IGRlY29kZShoYXNoLCBvcHRpb25zKX0gOiB7fSksXG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlVcmwob2JqZWN0LCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0ZW5jb2RlOiB0cnVlLFxuXHRcdHN0cmljdDogdHJ1ZSxcblx0XHRbZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyXTogdHJ1ZSxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdGNvbnN0IHVybCA9IHJlbW92ZUhhc2gob2JqZWN0LnVybCkuc3BsaXQoJz8nKVswXSB8fCAnJztcblx0Y29uc3QgcXVlcnlGcm9tVXJsID0gZXh0cmFjdChvYmplY3QudXJsKTtcblxuXHRjb25zdCBxdWVyeSA9IHtcblx0XHQuLi5wYXJzZShxdWVyeUZyb21VcmwsIHtzb3J0OiBmYWxzZX0pLFxuXHRcdC4uLm9iamVjdC5xdWVyeSxcblx0fTtcblxuXHRsZXQgcXVlcnlTdHJpbmcgPSBzdHJpbmdpZnkocXVlcnksIG9wdGlvbnMpO1xuXHRxdWVyeVN0cmluZyAmJj0gYD8ke3F1ZXJ5U3RyaW5nfWA7XG5cblx0bGV0IGhhc2ggPSBnZXRIYXNoKG9iamVjdC51cmwpO1xuXHRpZiAodHlwZW9mIG9iamVjdC5mcmFnbWVudElkZW50aWZpZXIgPT09ICdzdHJpbmcnKSB7XG5cdFx0Y29uc3QgdXJsT2JqZWN0Rm9yRnJhZ21lbnRFbmNvZGUgPSBuZXcgVVJMKHVybCk7XG5cdFx0dXJsT2JqZWN0Rm9yRnJhZ21lbnRFbmNvZGUuaGFzaCA9IG9iamVjdC5mcmFnbWVudElkZW50aWZpZXI7XG5cdFx0aGFzaCA9IG9wdGlvbnNbZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyXSA/IHVybE9iamVjdEZvckZyYWdtZW50RW5jb2RlLmhhc2ggOiBgIyR7b2JqZWN0LmZyYWdtZW50SWRlbnRpZmllcn1gO1xuXHR9XG5cblx0cmV0dXJuIGAke3VybH0ke3F1ZXJ5U3RyaW5nfSR7aGFzaH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGljayhpbnB1dCwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0cGFyc2VGcmFnbWVudElkZW50aWZpZXI6IHRydWUsXG5cdFx0W2VuY29kZUZyYWdtZW50SWRlbnRpZmllcl06IGZhbHNlLFxuXHRcdC4uLm9wdGlvbnMsXG5cdH07XG5cblx0Y29uc3Qge3VybCwgcXVlcnksIGZyYWdtZW50SWRlbnRpZmllcn0gPSBwYXJzZVVybChpbnB1dCwgb3B0aW9ucyk7XG5cblx0cmV0dXJuIHN0cmluZ2lmeVVybCh7XG5cdFx0dXJsLFxuXHRcdHF1ZXJ5OiBpbmNsdWRlS2V5cyhxdWVyeSwgZmlsdGVyKSxcblx0XHRmcmFnbWVudElkZW50aWZpZXIsXG5cdH0sIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhjbHVkZShpbnB1dCwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdGNvbnN0IGV4Y2x1c2lvbkZpbHRlciA9IEFycmF5LmlzQXJyYXkoZmlsdGVyKSA/IGtleSA9PiAhZmlsdGVyLmluY2x1ZGVzKGtleSkgOiAoa2V5LCB2YWx1ZSkgPT4gIWZpbHRlcihrZXksIHZhbHVlKTtcblxuXHRyZXR1cm4gcGljayhpbnB1dCwgZXhjbHVzaW9uRmlsdGVyLCBvcHRpb25zKTtcbn1cbiIsImltcG9ydCAqIGFzIHF1ZXJ5U3RyaW5nIGZyb20gJy4vYmFzZS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXJ5U3RyaW5nO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3BsaXRPbkZpcnN0KHN0cmluZywgc2VwYXJhdG9yKSB7XG5cdGlmICghKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBzZXBhcmF0b3IgPT09ICdzdHJpbmcnKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZSBhcmd1bWVudHMgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCcpO1xuXHR9XG5cblx0aWYgKHN0cmluZyA9PT0gJycgfHwgc2VwYXJhdG9yID09PSAnJykge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdGNvbnN0IHNlcGFyYXRvckluZGV4ID0gc3RyaW5nLmluZGV4T2Yoc2VwYXJhdG9yKTtcblxuXHRpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0cmV0dXJuIFtcblx0XHRzdHJpbmcuc2xpY2UoMCwgc2VwYXJhdG9ySW5kZXgpLFxuXHRcdHN0cmluZy5zbGljZShzZXBhcmF0b3JJbmRleCArIHNlcGFyYXRvci5sZW5ndGgpXG5cdF07XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8vIHJ1bnRpbWUgaGVscGVyIGZvciBzZXR0aW5nIHByb3BlcnRpZXMgb24gY29tcG9uZW50c1xuLy8gaW4gYSB0cmVlLXNoYWthYmxlIHdheVxuZXhwb3J0cy5kZWZhdWx0ID0gKHNmYywgcHJvcHMpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBzZmMuX192Y2NPcHRzIHx8IHNmYztcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgcHJvcHMpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWw7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiaW1wb3J0IHNjcmlwdCBmcm9tIFwiLi9hcHAudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzXCJcbmV4cG9ydCAqIGZyb20gXCIuL2FwcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anNcIlxuXG5pbXBvcnQgZXhwb3J0Q29tcG9uZW50IGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2V4cG9ydEhlbHBlci5qc1wiXG5jb25zdCBfX2V4cG9ydHNfXyA9IC8qI19fUFVSRV9fKi9leHBvcnRDb21wb25lbnQoc2NyaXB0LCBbWydfX2ZpbGUnLFwicHVibGljL3NyYy9hcHBsaWNhdGlvbi9hcHAudnVlXCJdXSlcbi8qIGhvdCByZWxvYWQgKi9cbmlmIChtb2R1bGUuaG90KSB7XG4gIF9fZXhwb3J0c19fLl9faG1ySWQgPSBcIjJhYzlhMTlmXCJcbiAgY29uc3QgYXBpID0gX19WVUVfSE1SX1JVTlRJTUVfX1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmICghYXBpLmNyZWF0ZVJlY29yZCgnMmFjOWExOWYnLCBfX2V4cG9ydHNfXykpIHtcbiAgICBhcGkucmVsb2FkKCcyYWM5YTE5ZicsIF9fZXhwb3J0c19fKVxuICB9XG4gIFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IF9fZXhwb3J0c19fIiwiZXhwb3J0IHsgZGVmYXVsdCB9IGZyb20gXCItIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3J1bGVTZXRbMV0ucnVsZXNbMTddLnVzZVswXSEuL2FwcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anNcIjsgZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cnVsZVNldFsxXS5ydWxlc1sxN10udXNlWzBdIS4vYXBwLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWV0aG9kKSB7XHJcbiAgICB2YXIgJHRoaXNPYmo7XHJcbiAgICB2YXIgJGF1dG90ZXh0O1xyXG4gICAgdmFyIGRlZmF1bHRQYXJhbXMgPSB7XHJcbiAgICAgICAgc2hvd0ludGVydmFsOiAxMDAwXHJcbiAgICB9O1xyXG4gICAgdmFyIHBhcmFtcztcclxuICAgIHZhciB0aW1lb3V0X2lkID0gMDtcclxuICAgIFxyXG4gICAgdmFyIG1ldGhvZHMgPSB7XHJcbiAgICAgICAgZ2V0Q29tcGxldGlvbjogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgU2V0ID0gZGF0YS5TZXQ7XHJcbiAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICAkYXV0b3RleHQuZW1wdHkoKTtcclxuICAgICAgICAgICAgaWYgKFNldCAmJiAoU2V0Lmxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgU2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSAnPGxpPic7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCAgICArPSAnICA8YSBocmVmPVwiI1wiIGRhdGEtaWQ9XCInICsgU2V0W2ldLmlkICsgJ1wiJztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gU2V0W2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoa2V5LCBbJ2lkJywgJ25hbWUnLCAnZGVzY3JpcHRpb24nLCAnaW1nJ10pID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9ICcgZGF0YS0nICsga2V5ICsgJz1cIicgKyBTZXRbaV1ba2V5XS50b1N0cmluZygpICsgJ1wiJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9ICc+JztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoU2V0W2ldLmltZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9ICcgICA8aW1nIHNyYz1cIicgKyBTZXRbaV0uaW1nICsgJ1wiIC8+JztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCAgICArPSAnICAgIDxzcGFuIGNsYXNzPVwicmFhcy1hdXRvdGV4dF9fbmFtZVwiPicgKyBTZXRbaV0ubmFtZSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICAgICs9ICcgICAgPHNwYW4gY2xhc3M9XCJyYWFzLWF1dG90ZXh0X19kZXNjcmlwdGlvblwiPicgKyBTZXRbaV0uZGVzY3JpcHRpb24gKyAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCAgICArPSAnICA8L2E+JztcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICAgICs9ICc8L2xpPic7XHJcbiAgICAgICAgICAgICAgICAgICAgJGF1dG90ZXh0LmFwcGVuZCh0ZXh0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRhdXRvdGV4dC5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkYXV0b3RleHQuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0T25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkYXV0b3RleHQudHJpZ2dlcignUkFBU19hdXRvY29tcGxldGVyLmNoYW5nZScpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9ICR0aGlzT2JqLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gcGFyYW1zLnVybDtcclxuICAgICAgICAgICAgaWYgKC9cXCovLnRlc3QodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IHVybC5yZXBsYWNlKC9cXCovLCB0ZXh0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSB1cmwgKyB0ZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dF9pZCk7XHJcbiAgICAgICAgICAgIHRpbWVvdXRfaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgJC5nZXRKU09OKHVybCwgbWV0aG9kcy5nZXRDb21wbGV0aW9uKSB9LCBwYXJhbXMuc2hvd0ludGVydmFsKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgJGF1dG90ZXh0LnRyaWdnZXIoJ1JBQVNfYXV0b2NvbXBsZXRlci5jbGljaycpO1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuY2FsbGJhY2suYXBwbHkodGhpcywgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJGF1dG90ZXh0LmhpZGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucykgeyBcclxuICAgICAgICAgICAgJGF1dG90ZXh0LnBhcmFtcyA9IHBhcmFtcyA9ICQuZXh0ZW5kKGRlZmF1bHRQYXJhbXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkdGhpc09iai5vbigna2V5dXAnLCBtZXRob2RzLnRleHRPbkNoYW5nZSk7XHJcbiAgICAgICAgICAgIC8vIDIwMTUtMDUtMDQsIEFWUzog0LfQsNC80LXQvdC40LsgJGF1dG90ZXh0LmhpZGUg0L3QsCBmdW5jdGlvbigpIHsgJGF1dG90ZXh0LmhpZGUoKSB9LCDQuNCx0L4g0LPQu9GO0YfQuNGCXHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHsgJGF1dG90ZXh0LmhpZGUoKSB9KTtcclxuICAgICAgICAgICAgJGF1dG90ZXh0Lm9uKCdjbGljaycsICdhJywgbWV0aG9kcy5vbkNsaWNrKTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICAkdGhpc09iaiA9ICQodGhpcyk7XHJcbiAgICAkYXV0b3RleHQgPSAkdGhpc09iai5uZXh0KCdbZGF0YS1yb2xlPVwicmFhcy1hdXRvdGV4dFwiXScpO1xyXG4gICAgaWYgKCEkYXV0b3RleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgJGF1dG90ZXh0ID0gJCgnPHVsIGNsYXNzPVwicmFhcy1hdXRvdGV4dFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIGRhdGEtcm9sZT1cInJhYXMtYXV0b3RleHRcIj48L3VsPicpXHJcbiAgICAgICAgJHRoaXNPYmouYWZ0ZXIoJGF1dG90ZXh0KTtcclxuICAgIH1cclxuICAgIGlmICgkYXV0b3RleHQucGFyYW1zKSB7XHJcbiAgICAgICAgJHBhcmFtcyA9ICRhdXRvdGV4dC5wYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LvQvtCz0LjQutCwINCy0YvQt9C+0LLQsCDQvNC10YLQvtC00LBcclxuICAgIGlmICggbWV0aG9kc1ttZXRob2RdICkge1xyXG4gICAgICAgIHJldHVybiBtZXRob2RzWyBtZXRob2QgXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ29iamVjdCcgfHwgIW1ldGhvZCkge1xyXG4gICAgICAgIHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH1cclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihmaWxsKSB7XHJcbiAgICB2YXIgdGV4dDtcclxuICAgICQodGhpcykuZW1wdHkoKTtcclxuICAgIGZvciAodmFyIGkgaW4gZmlsbCkge1xyXG4gICAgICAgIHRleHQgPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyBmaWxsW2ldLnZhbCArICdcIicgKyAoZmlsbFtpXS5zZWwgPyAnIHNlbGVjdGVkPVwic2VsZWN0ZWRcIicgOiAnJyk7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbGxbaV0pIHtcclxuICAgICAgICAgICAgaWYgKCQuaW5BcnJheShrZXksIFsndmFsJywgJ3NlbCcsICd0ZXh0J10pID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9ICcgZGF0YS0nICsga2V5ICsgJz1cIicgKyBmaWxsW2ldW2tleV0gKyAnXCInO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRleHQgKz0gJz4nICsgZmlsbFtpXS50ZXh0ICsgJzwvb3B0aW9uPic7XHJcbiAgICAgICAgJCh0aGlzKS5hcHBlbmQoJCh0ZXh0KSk7XHJcbiAgICB9XHJcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odXJsLCBwYXJhbXMpIHtcclxuICAgIHZhciBkZWZhdWx0UGFyYW1zID0ge1xyXG4gICAgICAgICdiZWZvcmUnOiBmdW5jdGlvbihkYXRhKSB7IHJldHVybiBkYXRhOyB9LFxyXG4gICAgICAgICdhZnRlcic6IGZ1bmN0aW9uKGRhdGEpIHt9XHJcbiAgICB9XHJcbiAgICBwYXJhbXMgPSAkLmV4dGVuZChkZWZhdWx0UGFyYW1zLCBwYXJhbXMpO1xyXG4gICAgdmFyIHRoaXNPYmogPSB0aGlzO1xyXG4gICAgJC5nZXRKU09OKHVybCwgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHZhciBmaWxsID0gcGFyYW1zLmJlZm9yZS5jYWxsKHRoaXNPYmosIGRhdGEpO1xyXG4gICAgICAgICQodGhpc09iaikuUkFBU19maWxsU2VsZWN0KGZpbGwpO1xyXG4gICAgICAgIHBhcmFtcy5hZnRlci5jYWxsKHRoaXNPYmosIGRhdGEpO1xyXG4gICAgfSk7XHJcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgdGhpc09iaiA9IHRoaXM7XHJcbiAgICBcclxuICAgICQoJ3NlbGVjdFttdWx0aXBsZV0nKS5ub3QoJ1tkaXNhYmxlZF0nLCB0aGlzT2JqKS5tdWx0aXNlbGVjdCh7XHJcbiAgICAgICAgYnV0dG9uVGV4dDogZnVuY3Rpb24ob3B0aW9ucywgc2VsZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICctLSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gJyc7XHJcbiAgICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICAgIG9wdGlvbnMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGkgPCAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZCArPSAkKHRoaXMpLnRleHQoKSArICcsICc7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHNlbGVjdGVkID0gc2VsZWN0ZWQuc3Vic3RyKDAsIHNlbGVjdGVkLmxlbmd0aCAtMik7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkICsgKG9wdGlvbnMubGVuZ3RoID4gMyA/ICcuLi4nIDogJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtYXhIZWlnaHQ6IDIwMFxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgICQoJ2lucHV0W2RhdGEtaGludF0sIHRleHRhcmVhW2RhdGEtaGludF0sIHNlbGVjdFtkYXRhLWhpbnRdJywgdGhpc09iaikuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGV4dCA9ICc8YSBjbGFzcz1cImJ0blwiIGhyZWY9XCIjXCIgcmVsPVwicG9wb3ZlclwiIGRhdGEtY29udGVudD1cIicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaGludCcpICsgJ1wiPjxpIGNsYXNzPVwiaWNvbi1xdWVzdGlvbi1zaWduXCI+PC9pPjwvYT4nO1xyXG4gICAgICAgIGlmICghJCh0aGlzKS5jbG9zZXN0KCcuY29udHJvbC1ncm91cCcpLmZpbmQoJ2FbcmVsPVwicG9wb3ZlclwiXScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5jb250cm9sLWdyb3VwJykuZmluZCgnLmNvbnRyb2xzJykuYXBwZW5kKHRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59IiwiLyoqXHJcbiAqIEBkZXByZWNhdGVkINCU0LXRgNC10LLQviDQvNC10L3RjiDRgNC10LDQu9C40LfQvtCy0LDQvdC+INCyIFJBQVNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gICAgdmFyICR0aGlzT2JqO1xyXG4gICAgdmFyIGRlZmF1bHRQYXJhbXMgPSB7IHNob3duTGV2ZWw6IDIgfTtcclxuICAgIHZhciBwYXJhbXMgPSB7fTtcclxuICAgIHZhciBtZXRob2RzID0ge1xyXG4gICAgICAgIGhpZGVVTDogZnVuY3Rpb24oJG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICQoJ3VsJywgJG9iaikuaGlkZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkUGx1c2VzOiBmdW5jdGlvbigkb2JqKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJCgnbGk6aGFzKHVsKScsICRvYmopLnByZXBlbmQoJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJqc1RyZWVQbHVzXCIgZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCI+PC9hPicpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdW5mb2xkOiBmdW5jdGlvbigkb2JqLCBzbG93bHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkb2JqLmNoaWxkcmVuKCdbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJykucmVtb3ZlQ2xhc3MoJ2pzVHJlZVBsdXMnKS5hZGRDbGFzcygnanNUcmVlTWludXMnKTtcclxuICAgICAgICAgICAgaWYgKHNsb3dseSkge1xyXG4gICAgICAgICAgICAgICAgJG9iai5maW5kKCc+IHVsJykuc2xpZGVEb3duKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvbGQ6IGZ1bmN0aW9uKCRvYmosIHNsb3dseSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRvYmouY2hpbGRyZW4oJ1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nKS5yZW1vdmVDbGFzcygnanNUcmVlTWludXMnKS5hZGRDbGFzcygnanNUcmVlUGx1cycpO1xyXG4gICAgICAgICAgICBpZiAoc2xvd2x5KSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrUGx1czogZnVuY3Rpb24oKSBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICBtZXRob2RzLnVuZm9sZCgkKHRoaXMpLmNsb3Nlc3QoJ2xpJyksIHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja01pbnVzOiBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtZXRob2RzLmZvbGQoJCh0aGlzKS5jbG9zZXN0KCdsaScpLCB0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdCA6IGZ1bmN0aW9uKG9wdGlvbnMpIHsgXHJcbiAgICAgICAgICAgIHBhcmFtcyA9ICQuZXh0ZW5kKGRlZmF1bHRQYXJhbXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zLnNob3duTGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWwgPSAnJztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLnNob3duTGV2ZWw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbCArPSAndWwgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICR0aGlzT2JqID0gJChzZWwsIHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHRoaXNPYmogPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkdGhpc09iai5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfQpNGD0L3QutGG0LjRjyBqUXVlcnkubWVudVRyZWUg0YPRgdGC0LDRgNC10LvQsCDQuCDQsdGD0LTQtdGCINC+0YLQutC70Y7Rh9C10L3QsCAwMS4wMS4yMDI2LiDQn9C+0LbQsNC70YPQudGB0YLQsCwg0L7QsdGA0LDRgtC40YLQtdGB0Ywg0Log0YDQsNC30YDQsNCx0L7RgtGH0LjQutGDINC00LvRjyDQvtCx0L3QvtCy0LvQtdC90LjRjyDRgdC40YHRgtC10LzRiyEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXRob2RzLmhpZGVVTCgkdGhpc09iaik7XHJcbiAgICAgICAgICAgIG1ldGhvZHMuYWRkUGx1c2VzKCR0aGlzT2JqKTtcclxuICAgICAgICAgICAgbWV0aG9kcy51bmZvbGQoJCgnbGkuYWN0aXZlJywgJHRoaXNPYmopLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICR0aGlzT2JqLm9uKCdjbGljaycsICcuanNUcmVlUGx1c1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nLCBtZXRob2RzLmNsaWNrUGx1cyk7XHJcbiAgICAgICAgICAgICR0aGlzT2JqLm9uKCdjbGljaycsICcuanNUcmVlTWludXNbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJywgbWV0aG9kcy5jbGlja01pbnVzKTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQu9C+0LPQuNC60LAg0LLRi9C30L7QstCwINC80LXRgtC+0LTQsFxyXG4gICAgaWYgKCBtZXRob2RzW21ldGhvZF0gKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZHNbIG1ldGhvZCBdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0aG9kID09PSAnb2JqZWN0JyB8fCAhbWV0aG9kKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNoYW5nZV9xdWVyeSwgaW5jbHVkZV9kaXJzLCBpbml0aWFsX3BhdGgpIHtcclxuICAgIGlmICghaW5pdGlhbF9wYXRoKSB7XHJcbiAgICAgICAgaW5pdGlhbF9wYXRoID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZlxyXG4gICAgfVxyXG4gICAgaWYgKGNoYW5nZV9xdWVyeS5zdWJzdHIoMCwgMSkgPT0gJz8nKSB7XHJcbiAgICAgICAgY2hhbmdlX3F1ZXJ5ID0gY2hhbmdlX3F1ZXJ5LnN1YnN0cigxKTtcclxuICAgIH1cclxuICAgIHZhciBxdWVyeV9kaXIgPSBpbml0aWFsX3BhdGguc3BsaXQoJz8nKS5zbGljZSgwLCAxKS50b1N0cmluZygpO1xyXG4gICAgdmFyIHF1ZXJ5X3N0ciA9IGluaXRpYWxfcGF0aC5zcGxpdCgnPycpLnNsaWNlKDEpLnRvU3RyaW5nKCk7XHJcbiAgICBcclxuICAgIHZhciBvbGRfcXVlcnkgPSBxdWVyeV9zdHIuc3BsaXQoJyYnKTtcclxuICAgIHZhciBjaGFuZ2UgPSBjaGFuZ2VfcXVlcnkuc3BsaXQoJyYnKTtcclxuICAgIFxyXG4gICAgdmFyIHF1ZXJ5ID0ge307XHJcbiAgICB2YXIgdGVtcCA9IFtdO1xyXG4gICAgXHJcbiAgICB2YXIgbmV3X3F1ZXJ5ID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZF9xdWVyeS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRlbXAgPSBvbGRfcXVlcnlbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgICBpZiAodGVtcFswXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5W3RlbXBbMF1dID0gdGVtcFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYW5nZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRlbXAgPSBjaGFuZ2VbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgICBpZiAodGVtcFswXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5W3RlbXBbMF1dID0gdGVtcFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0ZW1wID0gW107XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gcXVlcnkpIHtcclxuICAgICAgICBpZiAocXVlcnlba2V5XSAmJiAocXVlcnlba2V5XS5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICB0ZW1wW3RlbXAubGVuZ3RoXSA9IGtleSArICc9JyArIHF1ZXJ5W2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcXVlcnkgPSB0ZW1wLmpvaW4oJyYnKTtcclxuICAgIHJldHVybiBxdWVyeTtcclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihwYXJhbXMpIHsgXHJcbiAgICB2YXIgZGVmYXVsdFBhcmFtcyA9IHtcclxuICAgICAgICAncmVwb0NvbnRhaW5lcic6ICdbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWNvbnRhaW5lclwiXScsXHJcbiAgICAgICAgJ3JlcG9FbGVtZW50JzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG8tZWxlbWVudFwiXScsXHJcbiAgICAgICAgJ3JlcG9FbGVtZW50Q2hhbmdlcyc6IHsnZGF0YS1yb2xlJzogJ3JhYXMtcmVwby1lbGVtZW50J30sXHJcbiAgICAgICAgJ3JlcG9BZGQnOiAnW2RhdGEtcm9sZT1cInJhYXMtcmVwby1hZGRcIl0nLFxyXG4gICAgICAgICdyZXBvTW92ZSc6ICdbZGF0YS1yb2xlPVwicmFhcy1yZXBvLW1vdmVcIl0nLFxyXG4gICAgICAgICdyZXBvRGVsZXRlJzogJ1tkYXRhLXJvbGU9XCJyYWFzLXJlcG8tZGVsXCJdJyxcclxuICAgICAgICAncmVwbyc6ICdbZGF0YS1yb2xlPVwicmFhcy1yZXBvXCJdJyxcclxuICAgICAgICAnb25CZWZvcmVBZGQnOiBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgICdvbkFmdGVyQWRkJzogZnVuY3Rpb24oKSB7ICQodGhpcykuZmluZCgnc2VsZWN0OmRpc2FibGVkLCBpbnB1dDpkaXNhYmxlZCwgdGV4dGFyZWE6ZGlzYWJsZWQnKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpOyB9LFxyXG4gICAgICAgICdvbkJlZm9yZURlbGV0ZSc6IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgJ29uQWZ0ZXJEZWxldGUnOiBmdW5jdGlvbigpIHt9XHJcbiAgICB9XHJcbiAgICBwYXJhbXMgPSAkLmV4dGVuZChkZWZhdWx0UGFyYW1zLCBwYXJhbXMpO1xyXG4gICAgdmFyICRyZXBvQmxvY2sgPSAkKHRoaXMpO1xyXG4gICAgXHJcbiAgICB2YXIgJHJlcG9Db250YWluZXI7XHJcbiAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLXJhYXMtcmVwby1jb250YWluZXInKSkge1xyXG4gICAgICAgICRyZXBvQ29udGFpbmVyID0gJCgkKHRoaXMpLmF0dHIoJ2RhdGEtcmFhcy1yZXBvLWNvbnRhaW5lcicpKTtcclxuICAgIH0gZWxzZSBpZiAoJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvQ29udGFpbmVyKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJHJlcG9Db250YWluZXIgPSAkcmVwb0Jsb2NrLmZpbmQocGFyYW1zLnJlcG9Db250YWluZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkcmVwb0NvbnRhaW5lciA9ICQocGFyYW1zLnJlcG9Db250YWluZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgJHJlcG87XHJcbiAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLXJhYXMtcmVwbycpKSB7XHJcbiAgICAgICAgJHJlcG8gPSAkKCQodGhpcykuYXR0cignZGF0YS1yYWFzLXJlcG8nKSk7XHJcbiAgICB9IGVsc2UgaWYgKCRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwbykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICRyZXBvID0gJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJHJlcG8gPSAkKHBhcmFtcy5yZXBvKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2hlY2tSZXF1aXJlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciAkcmVwb0VsZW1lbnQ7XHJcbiAgICAgICAgaWYgKCRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0VsZW1lbnQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50ID0gJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCArICc6aGFzKCpbZGF0YS1yZXF1aXJlZF0pJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50ID0gJChwYXJhbXMucmVwb0VsZW1lbnQgKyAnOmhhcygqW2RhdGEtcmVxdWlyZWRdKScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJHJlcG9FbGVtZW50Lmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50LmZpbmQocGFyYW1zLnJlcG9EZWxldGUpLnNob3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQuZmluZChwYXJhbXMucmVwb0RlbGV0ZSkuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0VsZW1lbnQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50ID0gJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50ID0gJChwYXJhbXMucmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJHJlcG9FbGVtZW50Lmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50LmZpbmQocGFyYW1zLnJlcG9Nb3ZlKS5zaG93KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50LmZpbmQocGFyYW1zLnJlcG9Nb3ZlKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkcmVwb0Jsb2NrLm9uKCdjbGljaycsIHBhcmFtcy5yZXBvQWRkLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBwYXJhbXMub25CZWZvcmVBZGQuY2FsbCgkcmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIHZhciAkcmVwb0VsZW1lbnQgPSAkcmVwby5jbG9uZSh0cnVlKTtcclxuICAgICAgICAkcmVwb0VsZW1lbnQuYXR0cihwYXJhbXMucmVwb0VsZW1lbnRDaGFuZ2VzKTtcclxuICAgICAgICAkcmVwb0NvbnRhaW5lci5hcHBlbmQoJHJlcG9FbGVtZW50KTtcclxuICAgICAgICAkcmVwb0VsZW1lbnQudHJpZ2dlcignUkFBU19yZXBvLmFkZCcpO1xyXG4gICAgICAgIHBhcmFtcy5vbkFmdGVyQWRkLmNhbGwoJHJlcG9FbGVtZW50KTtcclxuICAgICAgICBjaGVja1JlcXVpcmVkKCk7XHJcbiAgICAgICAgJHJlcG9FbGVtZW50LlJBQVNJbml0SW5wdXRzKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgICRyZXBvQmxvY2sub24oJ2NsaWNrJywgcGFyYW1zLnJlcG9EZWxldGUsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciAkcmVwb0VsZW1lbnQ7XHJcbiAgICAgICAgaWYgKCQodGhpcykuY2xvc2VzdChwYXJhbXMucmVwb0VsZW1lbnQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50ID0gJCh0aGlzKS5jbG9zZXN0KHBhcmFtcy5yZXBvRWxlbWVudCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtcmFhcy1yZXBvLWVsZW1lbnQnKSkge1xyXG4gICAgICAgICAgICAkcmVwb0VsZW1lbnQgPSAkKCQodGhpcykuYXR0cignZGF0YS1yYWFzLXJlcG8tZWxlbWVudCcpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCRyZXBvQmxvY2suZmluZChwYXJhbXMucmVwb0VsZW1lbnQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50ID0gJHJlcG9CbG9jay5maW5kKHBhcmFtcy5yZXBvRWxlbWVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHJlcG9FbGVtZW50ID0gJChwYXJhbXMucmVwb0VsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJhbXMub25CZWZvcmVEZWxldGUuY2FsbCgkcmVwb0VsZW1lbnQpO1xyXG4gICAgICAgICRyZXBvRWxlbWVudC50cmlnZ2VyKCdSQUFTX3JlcG8uZGVsZXRlJyk7XHJcbiAgICAgICAgJHJlcG9FbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIHBhcmFtcy5vbkFmdGVyRGVsZXRlLmNhbGwoJHJlcG9FbGVtZW50KTtcclxuICAgICAgICBjaGVja1JlcXVpcmVkKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGF4aXMgPSAkcmVwb0NvbnRhaW5lci5hdHRyKCdkYXRhLWF4aXMnKTtcclxuICAgICRyZXBvQ29udGFpbmVyLnNvcnRhYmxlKHsgYXhpczogYXhpcyA/IChheGlzID09ICdib3RoJyA/ICcnIDogYXhpcykgOiAneScsICdoYW5kbGUnOiBwYXJhbXMucmVwb01vdmUsIGNvbnRhaW5tZW50OiAkKHRoaXMpIH0pO1xyXG5cclxuXHJcbiAgICBjaGVja1JlcXVpcmVkKCk7XHJcbn0iLCIvKipcclxuICogQGRlcHJlY2F0ZWQg0JTQtdGA0LXQstC+INGA0LXQsNC70LjQt9C+0LLQsNC90L4g0LIgUkFBUyAoY2hlY2tib3gtdHJlZSlcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gICAgdmFyICR0aGlzT2JqO1xyXG4gICAgdmFyIG1ldGhvZHMgPSB7XHJcbiAgICAgICAgaGlkZVVMOiBmdW5jdGlvbigkb2JqKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJCgndWwnLCAkb2JqKS5oaWRlKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRQbHVzZXM6IGZ1bmN0aW9uKCRvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkKCdsaTpoYXModWwpJywgJG9iaikucHJlcGVuZCgnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImpzVHJlZVBsdXNcIiBkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIj48L2E+Jyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1bmZvbGQ6IGZ1bmN0aW9uKCRvYmosIHNsb3dseSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRvYmouY2hpbGRyZW4oJ1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nKS5yZW1vdmVDbGFzcygnanNUcmVlUGx1cycpLmFkZENsYXNzKCdqc1RyZWVNaW51cycpO1xyXG4gICAgICAgICAgICBpZiAoc2xvd2x5KSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmZpbmQoJz4gdWwnKS5zbGlkZURvd24oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9sZDogZnVuY3Rpb24oJG9iaiwgc2xvd2x5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJG9iai5jaGlsZHJlbignW2RhdGEtcm9sZT1cImZvbGQtc3VidHJlZVwiXScpLnJlbW92ZUNsYXNzKCdqc1RyZWVNaW51cycpLmFkZENsYXNzKCdqc1RyZWVQbHVzJyk7XHJcbiAgICAgICAgICAgIGlmIChzbG93bHkpIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLnNsaWRlVXAoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRvYmouZmluZCgnPiB1bCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xpY2tQbHVzOiBmdW5jdGlvbigpIFxyXG4gICAgICAgIHsgXHJcbiAgICAgICAgICAgIG1ldGhvZHMudW5mb2xkKCQodGhpcykuY2xvc2VzdCgnbGknKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrTWludXM6IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1ldGhvZHMuZm9sZCgkKHRoaXMpLmNsb3Nlc3QoJ2xpJyksIHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja0NoZWNrYm94OiBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZ3JvdXA7XHJcbiAgICAgICAgICAgIHZhciAkbGkgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJyk7XHJcbiAgICAgICAgICAgIHZhciAkb2JqID0gJGxpLmZpbmQoJ3VsIGlucHV0OmNoZWNrYm94Jyk7XHJcbiAgICAgICAgICAgIGlmIChncm91cCA9ICRvYmouYXR0cignZGF0YS1ncm91cCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqID0gJG9iai5maWx0ZXIoZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCQodGhpcykuYXR0cignZGF0YS1ncm91cCcpID09IGdyb3VwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkb2JqLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRvYmoucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcsICRsaSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kcy51bmZvbGQoJGxpLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZHMuZm9sZCgkbGksIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja0NoZWNrYm94QWNjdXJhdGU6IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGlja0NoZWNrYm94QWNjdXJhdGVMYWJlbDogZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1ldGhvZHMuY2xpY2tDaGVja2JveEFjY3VyYXRlLmNhbGwoJCh0aGlzKS5maW5kKCc+IGlucHV0OmNoZWNrYm94JylbMF0sIGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0IDogZnVuY3Rpb24ob3B0aW9ucykgeyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcylcclxuICAgICAgICAgICAgJHRoaXNPYmogPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICBpZiAoJHRoaXNPYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgn0KTRg9C90LrRhtC40Y8galF1ZXJ5LnRyZWUg0YPRgdGC0LDRgNC10LvQsCDQuCDQsdGD0LTQtdGCINC+0YLQutC70Y7Rh9C10L3QsCAwMS4wMS4yMDI2LiDQn9C+0LbQsNC70YPQudGB0YLQsCwg0L7QsdGA0LDRgtC40YLQtdGB0Ywg0Log0YDQsNC30YDQsNCx0L7RgtGH0LjQutGDINC00LvRjyDQvtCx0L3QvtCy0LvQtdC90LjRjyDRgdC40YHRgtC10LzRiyEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXRob2RzLmhpZGVVTCgkdGhpc09iaik7XHJcbiAgICAgICAgICAgIG1ldGhvZHMuYWRkUGx1c2VzKCR0aGlzT2JqKTtcclxuICAgICAgICAgICAgbWV0aG9kcy51bmZvbGQoJCgnbGk6aGFzKGlucHV0OmNoZWNrZWQpJywgJHRoaXNPYmopLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICR0aGlzT2JqLm9uKCdjbGljaycsICcuanNUcmVlUGx1c1tkYXRhLXJvbGU9XCJmb2xkLXN1YnRyZWVcIl0nLCBtZXRob2RzLmNsaWNrUGx1cyk7XHJcbiAgICAgICAgICAgICR0aGlzT2JqLm9uKCdjbGljaycsICcuanNUcmVlTWludXNbZGF0YS1yb2xlPVwiZm9sZC1zdWJ0cmVlXCJdJywgbWV0aG9kcy5jbGlja01pbnVzKTtcclxuICAgICAgICAgICAgJCgnaW5wdXQ6Y2hlY2tib3gnLCAkdGhpc09iaikub24oJ2NsaWNrJywgbWV0aG9kcy5jbGlja0NoZWNrYm94KTtcclxuICAgICAgICAgICAgJCgnaW5wdXQ6Y2hlY2tib3gnLCAkdGhpc09iaikub24oJ2NvbnRleHRtZW51JywgbWV0aG9kcy5jbGlja0NoZWNrYm94QWNjdXJhdGUpXHJcbiAgICAgICAgICAgICQoJ2xhYmVsOmhhcyg+aW5wdXRbdHlwZT1cImNoZWNrYm94XCJdKScsICR0aGlzT2JqKS5vbignY29udGV4dG1lbnUnLCBtZXRob2RzLmNsaWNrQ2hlY2tib3hBY2N1cmF0ZUxhYmVsKVxyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINC70L7Qs9C40LrQsCDQstGL0LfQvtCy0LAg0LzQtdGC0L7QtNCwXHJcbiAgICBpZiAoIG1ldGhvZHNbbWV0aG9kXSApIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kc1sgbWV0aG9kIF0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdvYmplY3QnIHx8ICFtZXRob2QpIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5OyIsIm1vZHVsZS5leHBvcnRzID0gVnVlOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgQXBwIGZyb20gJy4vYXBwbGljYXRpb24vYXBwLnZ1ZSc7XHJcblxyXG5pbXBvcnQgcXVlcnlTdHJpbmcgZnJvbSAncXVlcnktc3RyaW5nJztcclxuaW1wb3J0ICdqcXVlcnkuc2Nyb2xsdG8nXHJcblxyXG5pbXBvcnQgUkFBU190cmVlIGZyb20gJy4vbGlicy9yYWFzLnRyZWUuanMnO1xyXG5pbXBvcnQgUkFBU19hdXRvY29tcGxldGVyIGZyb20gJy4vbGlicy9yYWFzLmF1dG9jb21wbGV0ZXIuanMnO1xyXG5pbXBvcnQgUkFBU19tZW51VHJlZSBmcm9tICcuL2xpYnMvcmFhcy5tZW51LXRyZWUuanMnO1xyXG5pbXBvcnQgUkFBU19maWxsU2VsZWN0IGZyb20gJy4vbGlicy9yYWFzLmZpbGwtc2VsZWN0LmpzJztcclxuaW1wb3J0IFJBQVNfZ2V0U2VsZWN0IGZyb20gJy4vbGlicy9yYWFzLmdldC1zZWxlY3QuanMnO1xyXG5pbXBvcnQgUkFBU19yZXBvIGZyb20gJy4vbGlicy9yYWFzLnJlcG8uanMnO1xyXG5pbXBvcnQgUkFBU0luaXRJbnB1dHMgZnJvbSAnLi9saWJzL3JhYXMuaW5pdC1pbnB1dHMuanMnO1xyXG5pbXBvcnQgUkFBU19xdWVyeVN0cmluZyBmcm9tICcuL2xpYnMvcmFhcy5xdWVyeS1zdHJpbmcuanMnO1xyXG5cclxuaW1wb3J0IHsgQ2tlZGl0b3IgfSBmcm9tICdAY2tlZGl0b3IvY2tlZGl0b3I1LXZ1ZSc7XHJcblxyXG5cclxud2luZG93LnF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmc7XHJcblxyXG4vLyBWdWUudXNlKFltYXBQbHVnaW4sIHdpbmRvdy55bWFwU2V0dGluZ3MpO1xyXG5cclxualF1ZXJ5KGZ1bmN0aW9uICgkKSB7XHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgUkFBU190cmVlLFxyXG4gICAgICAgIFJBQVNfYXV0b2NvbXBsZXRlcixcclxuICAgICAgICBSQUFTX21lbnVUcmVlLFxyXG4gICAgICAgIFJBQVNfZmlsbFNlbGVjdCxcclxuICAgICAgICBSQUFTX2dldFNlbGVjdCxcclxuICAgICAgICBSQUFTX3JlcG8sXHJcbiAgICAgICAgUkFBU0luaXRJbnB1dHMsXHJcbiAgICB9KTtcclxuICAgICQuZXh0ZW5kKHsgUkFBU19xdWVyeVN0cmluZyB9KTtcclxufSk7XHJcblxyXG5cclxubGV0IGFwcCwgdnVlUm9vdDtcclxudnVlUm9vdCA9IGFwcCA9IFZ1ZS5jcmVhdGVBcHAoQXBwKTtcclxudnVlUm9vdC51c2UoQ2tlZGl0b3IpO1xyXG5cclxud2luZG93LnJlZ2lzdGVyZWRSQUFTQ29tcG9uZW50cyA9IHt9O1xyXG5PYmplY3Qua2V5cyh3aW5kb3cucmFhc0NvbXBvbmVudHMpLmZvckVhY2goKGNvbXBvbmVudFVSTikgPT4ge1xyXG4gICAgd2luZG93LnJlZ2lzdGVyZWRSQUFTQ29tcG9uZW50c1tjb21wb25lbnRVUk5dID0gdnVlUm9vdC5jb21wb25lbnQoY29tcG9uZW50VVJOLCByYWFzQ29tcG9uZW50c1tjb21wb25lbnRVUk5dKTtcclxufSlcclxuXHJcbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oJCkge1xyXG4gICAgd2luZG93LmFwcCA9IGFwcC5tb3VudCgnI3RvcCcpO1xyXG5cclxuICAgIHZhciBoYXNoID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaDtcclxuICAgIGlmIChoYXNoKSB7XHJcbiAgICAgICAgaWYgKCQoJy50YWJiYWJsZSB1bC5uYXYtdGFicyBhW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICQoJy50YWJiYWJsZSB1bC5uYXYtdGFicyBhW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS50YWIoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJC5zY3JvbGxUbygwLCAwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCQoJy5hY2NvcmRpb24gYS5hY2NvcmRpb24tdG9nZ2xlW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICQoJy5hY2NvcmRpb24gYS5hY2NvcmRpb24tdG9nZ2xlW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5jbG9zZXN0KCcuYWNjb3JkaW9uJykuZmluZCgnLmNvbGxhcHNlJykucmVtb3ZlQ2xhc3MoJ2luJyk7XHJcbiAgICAgICAgICAgICQoJy5hY2NvcmRpb24gYS5hY2NvcmRpb24tdG9nZ2xlW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5jbG9zZXN0KCcuYWNjb3JkaW9uLWdyb3VwJykuZmluZCgnLmNvbGxhcHNlJykuY29sbGFwc2UoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJC5zY3JvbGxUbygkKCcuYWNjb3JkaW9uIGEuYWNjb3JkaW9uLXRvZ2dsZVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJylbMF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgJCgnKicpLmZvY3VzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoJy50YWJiYWJsZSAudGFiLXBhbmUnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNoPSAnIycgKyAkKHRoaXMpLmNsb3Nlc3QoJy50YWJiYWJsZSAudGFiLXBhbmUnKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy50YWJiYWJsZSB1bC5uYXYtdGFicyBhW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS50YWIoJ3Nob3cnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCQodGhpcykuY2xvc2VzdCgnLmFjY29yZGlvbiAuYWNjb3JkaW9uLWJvZHk6bm90KC5pbiknKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNoID0gJyMnICsgJCh0aGlzKS5jbG9zZXN0KCcuYWNjb3JkaW9uIC5hY2NvcmRpb24tYm9keScpLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgICAgIC8vJCh0aGlzKS5jbG9zZXN0KCcuYWNjb3JkaW9uJykuZmluZCgnLmNvbGxhcHNlLmluJykuY29sbGFwc2UoJ2hpZGUnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuYWNjb3JkaW9uJykuZmluZCgnYS5hY2NvcmRpb24tdG9nZ2xlW2hyZWY9XCInICsgaGFzaCArICdcIl0nKS5jbG9zZXN0KCcuYWNjb3JkaW9uLWdyb3VwJykuZmluZCgnLmNvbGxhcHNlJykuY29sbGFwc2UoJ3Nob3cnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdhW2RhdGEtdG9nZ2xlPVwidGFiXCJdJykub24oJ3Nob3duJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCB1cmwpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vICQuZGF0ZXBpY2tlci5zZXREZWZhdWx0cyh7IGRhdGVGb3JtYXQ6ICd5eS1tbS1kZCcgfSk7XHJcbiAgICAvLyAkLnRpbWVwaWNrZXIuc2V0RGVmYXVsdHMoeyBkYXRlRm9ybWF0OiAneXktbW0tZGQnLCB0aW1lRm9ybWF0OiAnaGg6bW0nLCBzZXBhcmF0b3I6ICcgJyB9KTtcclxuICAgIFxyXG4gICAgJCgnYm9keScpLlJBQVNJbml0SW5wdXRzKCk7XHJcbiAgICAkKCc6cmVzZXQnKS5jbGljayhmdW5jdGlvbigpIHsgZG9jdW1lbnQubG9jYXRpb24ucmVsb2FkKCk7IHJldHVybiBmYWxzZTsgfSk7XHJcbiAgICAkKCcqW3JlbCo9XCJwb3BvdmVyXCJdJykucG9wb3ZlcigpLmNsaWNrKGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH0pO1xyXG4gICAgXHJcbiAgICAkKCcqW2RhdGEtcmFhcy1yb2xlKj1cInRyZWVcIl0nKS5SQUFTX3RyZWUoKTtcclxuICAgICQoJypbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWJsb2NrXCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tYWRkXCJdKSknKVxyXG4gICAgICAgIC5maW5kKCdbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWNvbnRhaW5lclwiXScpXHJcbiAgICAgICAgLmFmdGVyKCc8YSBocmVmPVwiI1wiIGRhdGEtcm9sZT1cInJhYXMtcmVwby1hZGRcIj48aSBjbGFzcz1cImljb24gaWNvbi1wbHVzXCI+PC9pPjwvYT4nKTtcclxuICAgICQoJypbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWVsZW1lbnRcIl06bm90KDpoYXMoW2RhdGEtcm9sZT1cInJhYXMtcmVwby1kZWxcIl0pKSwgKltkYXRhLXJvbGU9XCJyYWFzLXJlcG9cIl06bm90KDpoYXMoW2RhdGEtcm9sZT1cInJhYXMtcmVwby1kZWxcIl0pKScpXHJcbiAgICAgICAgLmFwcGVuZCgnPGEgaHJlZj1cIiNcIiBkYXRhLXJvbGU9XCJyYWFzLXJlcG8tZGVsXCI+PGkgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCI+PC9pPjwvYT4nKTtcclxuICAgICQoJypbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWVsZW1lbnRcIl06bm90KDpoYXMoW2RhdGEtcm9sZT1cInJhYXMtcmVwby1tb3ZlXCJdKSksICpbZGF0YS1yb2xlPVwicmFhcy1yZXBvXCJdOm5vdCg6aGFzKFtkYXRhLXJvbGU9XCJyYWFzLXJlcG8tbW92ZVwiXSkpJylcclxuICAgICAgICAuYXBwZW5kKCc8YSBocmVmPVwiI1wiIGRhdGEtcm9sZT1cInJhYXMtcmVwby1tb3ZlXCI+PGkgY2xhc3M9XCJpY29uIGljb24tcmVzaXplLXZlcnRpY2FsXCI+PC9pPjwvYT4nKTtcclxuICAgICQoJypbZGF0YS1yb2xlPVwicmFhcy1yZXBvLWJsb2NrXCJdJykuZWFjaChmdW5jdGlvbigpIHsgJCh0aGlzKS5SQUFTX3JlcG8oKSB9KTtcclxufSk7Il0sIm5hbWVzIjpbImRhdGEiLCJ3aW5kb3dXaWR0aCIsImJvZHlXaWR0aCIsIndpbmRvd0hlaWdodCIsInNjcm9sbFRvcCIsIm9sZFNjcm9sbFRvcCIsImlzU2Nyb2xsaW5nTm93IiwiaXNTY3JvbGxpbmdOb3dUaW1lb3V0SWQiLCJpc1Njcm9sbGluZ05vd0RlbGF5Iiwic2Nyb2xsaW5nSW5hY2N1cmFjeSIsInNjcm9sbFRvU2VsZWN0b3IiLCJtZWRpYVR5cGVzIiwieHhsIiwieGwiLCJsZyIsIm1kIiwic20iLCJ4cyIsIm1vdW50ZWQiLCJzZWxmIiwibGlnaHRCb3hJbml0IiwiJCIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJvdXRlckhlaWdodCIsIm91dGVyV2lkdGgiLCJmaXhIdG1sIiwib24iLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZG9jdW1lbnQiLCJjdXJyZW50VXJsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInNlYXJjaCIsInVybCIsImF0dHIiLCJzcGxpdCIsInByb2Nlc3NIYXNoTGluayIsImhhc2giLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwidGl0bGUiLCJtZXRob2RzIiwiYXBpIiwicG9zdERhdGEiLCJibG9ja0lkIiwicmVzcG9uc2VUeXBlIiwicmVxdWVzdFR5cGUiLCJhZGRpdGlvbmFsSGVhZGVycyIsImFib3J0Q29udHJvbGxlciIsInJlYWxVcmwiLCJ0ZXN0IiwiaG9zdCIsImhlYWRlcnMiLCJyeCIsImZldGNoT3B0aW9ucyIsInNpZ25hbCIsIm1ldGhvZCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJuYW1lIiwiYXBwZW5kIiwiYm9keSIsInF1ZXJ5U3RyaW5nIiwic3RyaW5naWZ5IiwiYXJyYXlGb3JtYXQiLCJKU09OIiwicmVzcG9uc2UiLCJmZXRjaCIsInJlc3VsdCIsImpzb24iLCJ0ZXh0IiwiZ2V0U2Nyb2xsT2Zmc2V0IiwiZGVzdFkiLCJnZXRPYmpGcm9tSGFzaCIsIiRvYmoiLCJsZW5ndGgiLCJyZXBsYWNlIiwianFFbWl0IiwiaGFzQ2xhc3MiLCJtb2RhbCIsIiRoYXNoTGluayIsImhyZWYiLCJjbGljayIsInNjcm9sbFRvIiwib3B0aW9ucyIsImRlZmF1bHRzIiwicHJvY2Vzc0FsbEltYWdlTGlua3MiLCJzd2lwZSIsInRyYW5zaXRpb24iLCJ0eXBlTWFwcGluZyIsInBhcmFtcyIsIk9iamVjdCIsImFzc2lnbiIsImVhY2giLCJnIiwicmVtb3ZlQXR0ciIsImxpZ2h0Y2FzZSIsImUiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwidHJpZ2dlciIsImNsZWFySW50ZXJ2YWwiLCJjb25maXJtIiwib2tUZXh0IiwiY2FuY2VsVGV4dCIsIiRyZWZzIiwiZm9ybWF0UHJpY2UiLCJwcmljZSIsIm51bVR4dCIsIngiLCJmb3JtcyIsImV2ZW50TmFtZSIsIm9yaWdpbmFsRXZlbnQiLCJkZXN0aW5hdGlvbiIsImluc3RhbnQiLCJvZmZzZXQiLCJ0b3AiLCJIVE1MRWxlbWVudCIsImpRdWVyeSIsIk1hdGgiLCJtYXgiLCJyb3VuZCIsIm1pbiIsInNjcm9sbFRvRGF0YSIsImxlZnQiLCJiZWhhdmlvciIsInByb3RlY3RTY3JvbGxpbmciLCJib2R5T3V0ZXJIZWlnaHQiLCJwYXJzZUludCIsImFicyIsImNvbnNvbGUiLCJsb2ciLCJjb21wdXRlZCIsIndpbmRvd0JvdHRvbVBvc2l0aW9uIiwic2Nyb2xsRGVsdGEiLCJmaXhlZEhlYWRlckFjdGl2ZSIsImZpeGVkSGVhZGVyIiwid2F0Y2giLCJBcHAiLCJGaXhlZEhlYWRlciIsIm1peGlucyIsImVsIiwibGFzdFNjcm9sbFRvcCIsImNvbmZpZyIsInJhYXNDb25maWciLCJyYWFzQXBwbGljYXRpb25EYXRhIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiJHRoaXNPYmoiLCIkYXV0b3RleHQiLCJkZWZhdWx0UGFyYW1zIiwic2hvd0ludGVydmFsIiwidGltZW91dF9pZCIsImdldENvbXBsZXRpb24iLCJTZXQiLCJpIiwiZW1wdHkiLCJpZCIsImtleSIsImluQXJyYXkiLCJ0b1N0cmluZyIsImltZyIsImRlc2NyaXB0aW9uIiwic2hvdyIsImhpZGUiLCJ0ZXh0T25DaGFuZ2UiLCJ2YWwiLCJnZXRKU09OIiwib25DbGljayIsImNhbGxiYWNrIiwiYXBwbHkiLCJpbml0IiwiZXh0ZW5kIiwibmV4dCIsImFmdGVyIiwiJHBhcmFtcyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiX3R5cGVvZiIsImZpbGwiLCJzZWwiLCJiZWZvcmUiLCJ0aGlzT2JqIiwiUkFBU19maWxsU2VsZWN0Iiwibm90IiwibXVsdGlzZWxlY3QiLCJidXR0b25UZXh0Iiwic2VsZWN0Iiwic2VsZWN0ZWQiLCJzdWJzdHIiLCJtYXhIZWlnaHQiLCJjbG9zZXN0IiwiZmluZCIsInNob3duTGV2ZWwiLCJoaWRlVUwiLCJhZGRQbHVzZXMiLCJwcmVwZW5kIiwidW5mb2xkIiwic2xvd2x5IiwiY2hpbGRyZW4iLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwic2xpZGVEb3duIiwiZm9sZCIsInNsaWRlVXAiLCJjbGlja1BsdXMiLCJjbGlja01pbnVzIiwiYWxlcnQiLCJjaGFuZ2VfcXVlcnkiLCJpbmNsdWRlX2RpcnMiLCJpbml0aWFsX3BhdGgiLCJxdWVyeV9kaXIiLCJxdWVyeV9zdHIiLCJvbGRfcXVlcnkiLCJjaGFuZ2UiLCJxdWVyeSIsInRlbXAiLCJuZXdfcXVlcnkiLCJqb2luIiwib25CZWZvcmVBZGQiLCJvbkFmdGVyQWRkIiwib25CZWZvcmVEZWxldGUiLCJvbkFmdGVyRGVsZXRlIiwiJHJlcG9CbG9jayIsIiRyZXBvQ29udGFpbmVyIiwicmVwb0NvbnRhaW5lciIsIiRyZXBvIiwicmVwbyIsImNoZWNrUmVxdWlyZWQiLCIkcmVwb0VsZW1lbnQiLCJyZXBvRWxlbWVudCIsInJlcG9EZWxldGUiLCJyZXBvTW92ZSIsInJlcG9BZGQiLCJjbG9uZSIsInJlcG9FbGVtZW50Q2hhbmdlcyIsIlJBQVNJbml0SW5wdXRzIiwicmVtb3ZlIiwiYXhpcyIsInNvcnRhYmxlIiwiY29udGFpbm1lbnQiLCJjbGlja0NoZWNrYm94IiwiZ3JvdXAiLCIkbGkiLCJmaWx0ZXIiLCJpbmRleCIsImlzIiwicHJvcCIsImNsaWNrQ2hlY2tib3hBY2N1cmF0ZSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwiY2xpY2tDaGVja2JveEFjY3VyYXRlTGFiZWwiLCJSQUFTX3RyZWUiLCJSQUFTX2F1dG9jb21wbGV0ZXIiLCJSQUFTX21lbnVUcmVlIiwiUkFBU19nZXRTZWxlY3QiLCJSQUFTX3JlcG8iLCJSQUFTX3F1ZXJ5U3RyaW5nIiwiQ2tlZGl0b3IiLCJmbiIsImFwcCIsInZ1ZVJvb3QiLCJWdWUiLCJjcmVhdGVBcHAiLCJ1c2UiLCJyZWdpc3RlcmVkUkFBU0NvbXBvbmVudHMiLCJrZXlzIiwicmFhc0NvbXBvbmVudHMiLCJmb3JFYWNoIiwiY29tcG9uZW50VVJOIiwiY29tcG9uZW50IiwicmVhZHkiLCJtb3VudCIsInRhYiIsImNvbGxhcHNlIiwiZm9jdXMiLCJyZWxvYWQiLCJwb3BvdmVyIl0sInNvdXJjZVJvb3QiOiIifQ==