<style lang="scss" scoped>
.menu-mobile {
    &__list {
        $list: &;
        box-sizing: border-box;
        margin: 0;
        display: flex;
        flex-direction: column;
        background: rgba(white, .95);
        position: fixed;
        left: -100vw;
        width: 100vw;
        height: 100vh;
        max-width: 360px;
        top: 0;
        transition: all .25s;
        pointer-events: all;
        z-index: 9990;
        &_active {
            left: 0;
        }
        @for $i from 1 through 5 {
            &_level_#{$i} {
                z-index: (9990 + $i);
            }
        }
    }
    &__header {
        flex-shrink: 0;
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        padding: 0;
        height: 41px;
        background: color-mix(in srgb, var(--gray-2), black 10%);
        color: #ddd;
    }
    &__back, &__close {
        @include center-alignment(41px, 24px);
        box-sizing: border-box !important;
        border: none;
        background: transparent;
        padding: 0 !important;
        &, &:hover, &:focus {
            color: #999;
            text-decoration: none;
        }
        &:after {
            display: block;
            position: relative;
        }
    }
    &__back {
        &:after {
            @include fa('angle-left');
        }

    }
    &__close {
        &:after {
            @include fa('close');
        }
    }
    &__title {
        padding: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 20px;
        line-height: 1;
        color: #999;
        &:hover, &:focus {
            text-decoration: none;
        }
        &-inner {
            display: block;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    &__inner {
        flex-grow: 1;
        overflow: auto;
        padding: 0 0 60px;
     }
}

</style>

<template>
  <div :class="ulClasses">
    <div class="menu-mobile__header">
      <button class="menu-mobile__back" @click="$emit('back')"></button>
      <a class="menu-mobile__title" :href="item.href">
        <span class="menu-mobile__title-inner">
          {{ item.name }}
          <span class="menu-mobile__title-counter" v-if="item.counter">
            (<span class="menu-mobile__title-counter-inner">{{item.counter}}</span>)
          </span>
        </span>
      </a>
      <button class="menu-mobile__close" @click="$emit('close')"></button>
    </div>
    <div class="menu-mobile__inner">
      <menu-mobile-item v-for="(menuItem, index) of item.submenu" :key="index" :item="menuItem" :level="level" @close="$emit('close')"></menu-mobile-item>
    </div>
  </div>
</template>

<script>
/**
 * Список выпадающего меню
 */
export default {
    props: {
        /**
         * Пункт меню
         * @type {Object[]}
         */
        item: {
            type: Object,
            required: true,
        },
        /**
         * Уровень вложенности
         * @type {Number}
         */
        level: {
            type: Number,
            default: 0,
        },
        /**
         * Заголовок
         * @type {String}
         */
        title: {
            type: String,
        },
        /**
         * Меню раскрыто
         * @type {Boolean}
         */
        active: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['back', 'close'],
    computed: {
        /**
         * CSS-класс списка
         * @return {Object}
         */
        ulClasses() {
            const result = { 'menu-mobile__list': true };
            if (this.level) {
                result['menu-mobile__list_inner'] = true;
            } else {
                result['menu-mobile__list_main'] = true;
            }
            result['menu-mobile__list_level_' + this.level] = true;
            if (this.active) {
                result['menu-mobile__list_active'] = true;
            }
            return result;
        },
    },
}
</script>