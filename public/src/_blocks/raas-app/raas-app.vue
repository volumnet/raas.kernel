<style lang="scss">
// @import "bootstrap/scss/bootstrap.scss"; 
@import 'app/application/bootstrap.scss';
@import 'app/application/bootstrap-fix.scss';
@import 'app/application/fa-fix.scss';

.body {
    &__background-holder {
        @include gradient-y(#08f, #8cf);
        min-height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
        overflow: hidden;
    }
    &__row {
        display: flex;
        gap: 2rem;
        padding-inline: 1rem;
        box-sizing: border-box;
    }
    
    &__header-outer {
        @media screen {
            min-height: 41px;
        }
        @media print {
            display: none;
        }
    }
    &__header {
        $header: &;
        padding-inline: 2rem;
        z-index: 2;
        background: darken($gray-900, 10%);
        color: white;
        align-items: center;
        justify-content: space-between;
        &_fixed {
            @media screen {
                position: fixed;
                top: -400px;
                left: 0;
                right: 0;
                z-index: 3;
                box-shadow: 0 .5rem .5rem rgba(black, .25);
                transition: all .25s;
                &#{$header}_active {
                    top: 0px;
                }
            }
        }
        * {
          box-sizing: border-box;
        }
    }
    &__menu-packages {
        flex-shrink: 0;
        padding-right: 0;
    }
    &__menu-main {
        flex-grow: 1;
        padding: 0;
        @include viewport-down('md') {
            display: none;
        }
    }
    &__menu-user {
        flex-shrink: 0;
        @include viewport-down('md') {
            display: none;
        }
    }
    &__menu-mobile {
        flex-shrink: 0;
        @include viewport-up('lg') {
            display: none;
        }
    }

    &__row_main {
        padding-bottom: 1rem;
        // flex-grow: 1;
    }
    &__main {
        display: grid;
        overflow: hidden;
        padding: 2rem;
        gap: 1rem;
        flex-grow: 1;
        background: white;
        @media screen {
            @include viewport-up('lg') {
                grid-template-columns: 320px 1fr;
            }
        }
    }
    &__left {
        box-sizing: border-box;
        @include print-or-down('md') {
            display: none;
        }
    }
    &__menu-left {
        box-sizing: border-box;
    }
    &__content {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        overflow: hidden;
        &:not(&_sided) {
            @include viewport-up('lg') {
                grid-column: span 2;
            }
        }
        &-inner {
            overflow: auto;
        }
    }
    &__content-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &__title {
        text-shadow: 1px 1px 0 silver;
        font-weight: bold;
        line-height: $headings-line-height;
        margin: 0;
        @include viewport-up('lg') {
            font-size: 38px;
        }
        @include viewport('md') {
            font-size: 32px;
        }
        @include viewport('sm') {
            font-size: 28px;
        }
        @include viewport-down('xs') {
            font-size: 24px;
        }
    }
    &__subtitle {
        color: $gray-500;
        font-size: 12px;
    }
    &__footer {
        border-top: 1px solid #ddd;
        padding-top: 1rem;
        font-size: 9px;
        text-align: center;
        @include viewport-up('lg') {
            grid-column: span 2;
        }
    }
}
</style>

<template>
  <div class="body__background-holder">
    <div class="body__header-outer" v-if="hasActivePackage">
      <header class="body__header body__row body__row_header" ref="header" :class="{ 'body__header_fixed': fixedHeader, 'body__header_active': fixedHeaderActive }">
        <menu-packages class="body__menu-packages" :menu="packagesMenu"></menu-packages>
        <menu-main class="body__menu-main" :menu="mainMenu"></menu-main>
        <menu-user class="body__menu-user" :user="user" :available-languages="availableLanguages" v-if="user"></menu-user>
        <menu-mobile class="body__menu-mobile" :main-menu="mainMenu" :left-menu="leftMenu" :user="user" :available-languages="availableLanguages" :packages-menu="packagesMenu"></menu-mobile>
      </header>
    </div>
    <div class="body__row body__row_main">
      <main class="body__main">
        <aside class="body__left" ref="leftPane">
          <menu-left class="body__menu-left" ref="leftPaneFloat" v-if="leftMenu" :menu="leftMenu" :style="{ marginTop: floatingMenuMargin + 'px' }"></menu-left>
        </aside>
        <article class="body__content" :class="{ 'body__content_sided': !!leftMenu }">
          <raas-breadcrumbs class="body__breadcrumbs" v-if="breadcrumbs && breadcrumbs.length" :menu="breadcrumbs"></raas-breadcrumbs>
          <div class="body__content-header">
            <h1 class="body__title">{{ title }}</h1>
            <menu-management class="body__menu-management" v-if="managementMenu && managementMenu.length" :menu="managementMenu"></menu-management>
          </div>
          <div class="body__subtitle" v-if="$slots.subtitle">
            <slot name="subtitle"></slot>
          </div>
          <raas-errors class="body__errors" v-if="errors && errors.length" :errors="errors" @close="errors = []"></raas-errors>
          <div class="body__content-inner">
            <slot name="default"></slot>
          </div>
        </article>
        <footer class="body__footer">
          <div class="body__version">
            {{ versionName + ': ' + translations.CORPORATE_RESOURCE_MANAGEMENT }}
          </div>
          <div class="body__copyrights">
            {{ translations.COPYRIGHT }} Ⓒ
            <a href="https://www.volumnet.ru/" target="_blank">
              Volume Networks
            </a>,
            {{ year }}. {{ translations.ALL_RIGHTS_RESERVED }}.
          </div>
        </footer>
      </main>
    </div>
    <menu-context></menu-context>
  </div>  
</template>

<script>
/**
 * Внутренняя часть приложения
 */
export default {
    props: {
        /**
         * Доступные языки
         * @type {Object}
         */
        availableLanguages: {
            type: Object,
            default() {
                return {};
            },
        },
        /**
         * Хлебные крошки
         * @type {Array}
         */
        breadcrumbs: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * Список ошибок
         * @type {Array}
         */
        errors: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * Используется ли фиксированная шапка
         * @type {Boolean}
         */
        fixedHeader: {
            type: Boolean,
            default: false,
        },
        /**
         * Фиксированная шапка активна
         * @type {Boolean}
         */
        fixedHeaderActive: {
            type: Boolean,
            default: false,
        },
        /**
         * Есть ли в данный момент активный пакет
         * @type {Boolean}
         */
        hasActivePackage: {
            type: Boolean,
            default: false,
        },
        /**
         * Левое меню
         * @type {Array}
         */
        leftMenu: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * Главное меню
         * @type {Array}
         */
        mainMenu: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * Меню управления
         * @type {Array}
         */
        managementMenu: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * Меню пакетов
         * @type {Array}
         */
        packagesMenu: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * Подзаголовок
         * @type {String}
         */
        subtitle: {
            type: String,
            required: false,
        },
        /**
         * Заголовок
         * @type {String}
         */
        title: {
            type: String,
            required: false,
        },
        /**
         * Переводы
         * @type {Object}
         */
        translations: {
            type: Object,
            default() {
                return {};
            },
        },
        /**
         * Данные пользователя
         * @type {Object}
         */
        user: {
            type: Object,
            default() {
                return {};
            },
        },
        /**
         * Имя версии
         * @type {String}
         */
        versionName: {
            type: String,
            required: false,
        },
        /**
         * Год
         * @type {Number}
         */
        year: {
            type: Number,
            required: false,
        },
    },
    data() {
        return {
            leftPaneTop: 0, // Вертикальное смещение левой колонки относительно верха документа
            floatingMenuMargin: 0, // Margin плавающего меню от верха
        };
    },
    mounted() {
        this.leftPaneTop = $(this.$refs.leftPane).offset() && $(this.$refs.leftPane).offset().top; // Здесь, потому что нужно задать до отображения для формирования CSS-классов
        this.setFloatingMenuMargin(); // Так, потому что требуется рекурсия от текущего положения
    },
    methods: {
        /**
         * Устанавливает отступ плавающего меню от верха левой колонки
         */
        setFloatingMenuMargin() {
            if (this.$root.windowWidth <= this.$root.mediaTypes.lg) {
                this.floatingMenuMargin = 0;
            }
            if (this.floatingMenuTopEdge < this.floatingMenuTop) { 
                this.floatingMenuMargin = this.floatingMenuMarginByTop;
            } else if (this.floatingMenuBottomEdge > this.floatingMenuBottom) {
                this.floatingMenuMargin = Math.min(this.floatingMenuMarginByTop, this.floatingMenuMarginByBottom);
            }
        },
    },
    computed: {
        /**
         * Высота левой колонки
         * @return {Number}
         */
        leftPaneHeight() {
            return (this.$root.scrollTop >= 0) && $(this.$refs.leftPane).height(); // scrollTop для привязки к скроллингу
        },
        /**
         * Высота плавающего меню
         * @return {Number}
         */
        floatingMenuHeight() {
            return (this.$root.scrollTop >= 0) && (this.$refs.leftPaneFloat ? $(this.$refs.leftPaneFloat.$el).outerHeight() : 0); // scrollTop для привязки к скроллингу
        },
        /**
         * Вертикальное смещение верха плавающего меню относительно верха документа
         * @return {Number}
         */
        floatingMenuTop() {
            return this.leftPaneTop + this.floatingMenuMargin;
        },
        /**
         * Вертикальное смещение низа плавающего меню относительно верха документа
         * @return {Number}
         */
        floatingMenuBottom() {
            return this.floatingMenuTop + this.floatingMenuHeight;
        },
        /**
         * Максимальное смещение плавающего меню в левой колонке (когда упрётся в низ колонки)
         * @return {Number} [description]
         */
        maxFloatingMenuMargin() {
            return this.leftPaneHeight - this.floatingMenuHeight;
        },
        /**
         * Отступ плавающего меню по его верхней границе
         * @return {Number}
         */
        floatingMenuMarginByTop() {
            let margin = this.floatingMenuTopEdge - this.leftPaneTop;
            margin = Math.max(0, margin);
            margin = Math.min(margin, this.maxFloatingMenuMargin);
            return margin;
        },
        /**
         * Верхняя граница экрана, от которой откладываем плавающее меню
         * @return {Number}
         */
        floatingMenuTopEdge() {
            let result = this.$root.scrollTop + 16;
            if (this.fixedHeaderActive) {
                result += $(this.$refs.header).outerHeight();
            }
            return result;
        },
        /**
         * Нижняя граница экрана, от которой откладываем плавающее меню
         * @return {Number}
         */
        floatingMenuBottomEdge() {
            return this.$root.windowBottomPosition - 32;
        },
        /**
         * Отступ плавающего меню по его верхней границе
         * @return {Number}
         */
        floatingMenuMarginByBottom() {
            let margin = this.floatingMenuBottomEdge - this.leftPaneTop - this.floatingMenuHeight;
            margin = Math.max(0, margin);
            margin = Math.min(margin, this.maxFloatingMenuMargin);
            return margin;
        },
    },
    watch: {
        '$root.scrollTop': function () {
            this.setFloatingMenuMargin();
        },
    },
}
</script>