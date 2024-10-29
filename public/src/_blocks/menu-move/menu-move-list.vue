<style lang="scss">
.menu-move__list {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;
}
</style>

<template>
  <raas-tree-list :class="ulClasses">
    <menu-move-item 
      v-for="(menuItem, index) of menu" 
      :key="index" 
      :item="menuItem" 
      :level="level" 
      :folded-level="foldedLevel"
    ></menu-move-item>
  </raas-tree-list>
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
        },
        /**
         * Уровень, на котором начинается сворачивание
         * @type {Number}
         */
        foldedLevel: {
            type: Number,
            default: 2
        },
    },
    computed: {
        /**
         * CSS-класс списка
         * @return {Object}
         */
        ulClasses() {
            const result = { 'menu-move__list': true };
            if (this.level) {
                result['menu-move__list_inner'] = true;
            } else {
                result['menu-move__list_main'] = true;
            }
            result['menu-move__list_level_' + this.level] = true;
            return result;
        }
    }
}
</script>