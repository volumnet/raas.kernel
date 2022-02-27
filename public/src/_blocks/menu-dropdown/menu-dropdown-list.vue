<style lang="scss" scoped>
.menu-dropdown__list {
    $self: &;
    background: white;
    box-shadow: 0 5px 10px rgba(black, .2);
    border-radius: $border-radius;
    border: 1px solid silver;
    padding: 0.25rem 0;
    min-width: 200px;
    margin: 0;
    position: absolute;
    z-index: 1;
    &_main {
        margin-top: 2px;
        left: 0;
        &#{$self}_align_right {
            left: auto;
            right: 0;
        }
    }
    &_inner {
        left: 100%;
        top: -.25rem;
        display: none;
        #{$self}_align_right & {
            left: auto;
            right: 100%;
        }
    }
}
.menu-dropdown__title {
    display: block;
    position: relative;
    font-weight: bold;
    color: $body-color;
    padding: .5rem 1rem;
    margin-top: -0.25rem;
    white-space: nowrap;
    background: $gray-100;
    border-bottom: 1px solid #ddd;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
} 
</style>

<template>
  <ul :class="ulClasses">
    <li class="menu-dropdown__title" v-if="title">
      {{ title }}
    </li>
    <menu-dropdown-item v-for="(menuItem, index) of menu" :key="index" :item="menuItem" :level="level"></menu-dropdown-item>
  </ul>
</template>

<script>
/**
 * Список выпадающего меню
 */
export default {
    props: {
        /**
         * Объекты меню
         * @type {Object[]}
         */
        menu: {
            type: Array,
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
         * Расположение
         * @type {String} <pre><code>'left'|'right'</code></pre>
         */
        align: {
            type: String,
            default: 'left',
        },
        /**
         * Заголовок
         * @type {String}
         */
        title: {
            type: String,
        },
    },
    computed: {
        /**
         * CSS-класс списка
         * @return {Object}
         */
        ulClasses() {
            const result = { 'menu-dropdown__list': true };
            if (this.level) {
                result['menu-dropdown__list_inner'] = true;
            } else {
                result['menu-dropdown__list_main'] = true;
            }
            result['menu-dropdown__list_align_' + this.align] = true;
            result['menu-dropdown__list_level_' + this.level] = true;
            return result;
        }
    }
}
</script>