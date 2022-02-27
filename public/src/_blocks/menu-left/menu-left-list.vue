<style lang="scss" scoped>
.menu-left__list {
    display: block;
    margin: 0;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    &_unfolded {
        max-height: 20000px;
    }
}
  
</style>

<template>
  <ul :class="ulClasses">
    <menu-left-item v-for="(menuItem, index) of menu" :key="index" :item="menuItem" :level="level"></menu-left-item>
  </ul>
</template>

<script>
/**
 * Список левого меню
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
         * Меню раскрыто
         * @type {Boolean}
         */
        unfolded: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        /**
         * CSS-класс списка
         * @return {Object}
         */
        ulClasses() {
            const result = { 'menu-left__list': true };
            if (this.level) {
                result['menu-left__list_inner'] = true;
            } else {
                result['menu-left__list_main'] = true;
            }
            if (this.unfolded) {
                result['menu-left__list_unfolded'] = true;
            }
            result['menu-left__list_level_' + this.level] = true;
            return result;
        }
    }
}
</script>