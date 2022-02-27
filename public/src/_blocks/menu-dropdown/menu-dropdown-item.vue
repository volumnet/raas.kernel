<style lang="scss" scoped>
.menu-dropdown__item {
    $self: &;
    display: block;
    position: relative;
    &:hover {
        > .menu-dropdown__list {
            display: block;
        }
    }
}
</style>

<template>
  <li :class="liClasses">
    <menu-dropdown-link :item="item" :level="level"></menu-dropdown-link>
    <menu-dropdown-list v-if="item.submenu && item.submenu.length" :menu="item.submenu" :level="level + 1"></menu-dropdown-list>
  </li>
</template>

<script>
/**
 * Пункт меню управления
 */
export default {
    props: {
        /**
         * Объекты меню
         * @type {Object}
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
    },
    computed: {
        /**
         * CSS-класс списка
         * @return {Object}
         */
        liClasses() {
            const result = { 'menu-dropdown__item': true };
            if (this.level) {
                result['menu-dropdown__item_inner'] = true;
            } else {
                result['menu-dropdown__item_main'] = true;
            }
            result['menu-dropdown__item_level_' + this.level] = true;
            if (this.item.active) {
                result['menu-dropdown__item_active'] = true;
            }
            if (this.item.submenu && this.item.submenu.length) {
                result['menu-dropdown__item_has-children'] = true;
            }
            return result;
        }
    }
}
</script>