<style lang="scss">
// @import "bootstrap/scss/bootstrap.scss"; 
@import 'app/application/bootstrap.scss';
@import 'app/application/bootstrap-fix.scss';
@import 'app/application/fa-fix.scss';

// @import "bootstrap/scss/_reboot.scss"; 
// @import "bootstrap/scss/_root.scss";
// @import "bootstrap/scss/_grid.scss";  
// @import "bootstrap/scss/_type.scss";  
// @import 'bootstrap/scss/_buttons.scss';
// @import 'bootstrap/scss/_forms.scss';

// p {
//     margin-bottom: 10px;
// }
// .form-horizontal {
//     .control-group {
//         display: flex;
//         align-items: center;
//         margin: -1rem -.5rem;
//         > * {
//             padding: 1rem .5rem;
//         }
//     }
//     .control-label {
//         width: 200px;
//         text-align: right;
//     }
//     .controls {
//         > * {
//             display: inline-block;
//             vertical-align: middle;
//         }
//         .form-control, select {
//             width: auto;
//         }
//         &:first-child {
//             margin-left: 200px;
//         }
//     }
// }
// textarea:not([class]), 
// input[type="text"]:not([class]), 
// input[type="password"]:not([class]), 
// input[type="datetime"]:not([class]), 
// input[type="datetime-local"]:not([class]), 
// input[type="date"]:not([class]), 
// input[type="month"]:not([class]), 
// input[type="time"]:not([class]), 
// input[type="week"]:not([class]), 
// input[type="number"]:not([class]), 
// input[type="email"]:not([class]), 
// input[type="url"]:not([class]), 
// input[type="search"]:not([class]), 
// input[type="tel"]:not([class]), 
// input[type="color"]:not([class]), 
// .uneditable-input {
//     @extend .form-control;
// }
// select:not([class]) {
//     @extend .form-select;
// }
// .btn {
//     &:not(.btn-primary):not(.btn-secondary):not(.btn-info):not(.btn-warning):not(.btn-danger):not(.btn-error) {
//         @extend .btn-outline-secondary;
//     }
// }
// .text-error {
//     @extend .text-danger;
// }
.body {
    $self: &;
    &__background-holder {
        @include gradient-y(#08f, #8cf);
        min-height: 100vh;
        width: 100%;
        display: block;
        position: relative;
        overflow: hidden;
    }
    &__row {
        width: 100%;
        position: relative;
        box-sizing: border-box;
    }
    &__container {
        box-sizing: border-box;
        display: flex;
        margin: 0 auto;
        width: 100%;
        > * {
            box-sizing: border-box;
            @include viewport-up('lg') {
                padding: 0 1rem;
            }
            @include viewport-down('md') {
                padding: 0 1rem;
            }
        }
    }
    &__header-outer {
        @media screen {
            min-height: 41px;
        }
    }
    &__header {
        $header: &;
        z-index: 2;
        background: darken($gray-900, 10%);
        color: white;
        // @media screen {
        //     @include viewport-down('md') {
        //         display: flex;
        //         align-items: center;
        //         margin: 0 auto;
        //         position: relative;
        //     }
        // }
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
        @media print {
            display: none;
        }
    }
    &__container_header {
        justify-content: space-between;
        @include viewport-up('md') {
            padding: 0 1rem;
        }
        @include viewport-down('sm') {
            padding: 0;
            > * {
                padding: 0;
            }
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
    &__main {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        @include viewport-up('md') {
            padding: 0 1rem;
        }
    }
    &__row_content {
        flex-grow: 1;
    }
    &__container_content {
        min-height: 250px;
        @include viewport-up('md') {
            padding: 2rem 1rem;
            background: white;
        }
        @include viewport-down('sm') {
            padding: 1rem 0;
            background: rgba(white, .975);
        }
    }
    &__left, &__right {
        $width: 320px;
        width: $width;
        flex-shrink: 0;
        @include viewport-up('lg') {
            // width: 25%;
            & + #{$self}__content {
                width: calc(100% - #{$width});
            }
        }
        @include viewport-down('md') {
            display: none;
        }
        @media print {
            display: none;
        }
    }
    &__content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 100%;
        padding: 0 1rem;
        overflow: hidden;
        &-inner {
            width: 100%;
            overflow: auto;
        }
    }
    &__content-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        flex-shrink: 0;
    }
    &__breadcrumb {
        flex-grow: 1;
        flex-shrink: 0;
    }
    &__menu-management {
        flex-shrink: 0;
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
        margin: 0 0 1rem;
        flex-shrink: 0;
    }
    &__content-inner {
        flex-grow: 1;
    }
    &__footer {
        background: white;
        border-top: 1px solid #ddd;
        padding: 1rem;
        font-size: 9px;
        text-align: center;
        flex-shrink: 0;
    }
    &__container_footer {
        flex-direction: column;
        > * {
            padding: .25rem 0;
        }
    }
}
</style>

<template>
  <div class="body__background-holder">
    <div class="body__header-outer" v-if="hasActivePackage">
      <header class="body__header" :class="{ 'body__header_fixed': fixedHeader, 'body__header_active': fixedHeaderActive }">
        <div class="body__row body__row_header">
          <div class="body__container body__container_header">
            <div class="body__menu-packages">
              <menu-packages :menu="packagesMenu"></menu-packages>
            </div>
            <div class="body__menu-main">
              <menu-main :menu="mainMenu"></menu-main>
            </div>
            <div class="body__menu-user">
              <menu-user :user="user" :available-languages="availableLanguages" v-if="user"></menu-user>
            </div>
            <div class="body__menu-mobile">
              <menu-mobile :main-menu="mainMenu" :left-menu="leftMenu" :user="user" :available-languages="availableLanguages" :packages-menu="packagesMenu"></menu-mobile>
            </div>
          </div>
        </div>
      </header>
    </div>
    <div class="body__main">
      <main class="body__row body__row_content">
        <div class="body__container body__container_content">
          <aside class="body__left" v-if="leftMenu">
            <menu-left :menu="leftMenu"></menu-left>
          </aside>
          <article class="body__content">
            <div class="body__breadcrumbs" v-if="breadcrumbs && breadcrumbs.length">
              <raas-breadcrumbs :menu="breadcrumbs"></raas-breadcrumbs>
            </div>
            <div class="body__content-header">
              <h1 class="body__title">{{ title }}</h1>
              <div class="body__menu-management" v-if="managementMenu && managementMenu.length">
                <menu-management :menu="managementMenu"></menu-management>
              </div>
            </div>
            <div class="body__subtitle" v-if="subtitle" v-html="subtitle"></div>
            <div class="body__errors" v-if="errors && errors.length">
              <raas-errors :errors="errors" @close="errors = []"></raas-errors>
            </div>
            <div class="body__content-inner">
              <slot></slot>
            </div>
          </article>
        </div>
      </main>
      <footer class="body__footer">
        <div class="body__row body__row_footer">
          <div class="body__container body__container_footer">
            <div class="body__version">
              {{ versionName }}:
              {{ translations.CORPORATE_RESOURCE_MANAGEMENT }}
            </div>
            <div class="body__copyrights">
              {{ translations.COPYRIGHT }} Ⓒ
              <a href="https://www.volumnet.ru/" target="_blank">
                Volume Networks
              </a>,
              {{ year }}. {{ translations.ALL_RIGHTS_RESERVED }}.
            </div>
          </div>
        </div>
      </footer>
    </div>
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
    }
}
</script>