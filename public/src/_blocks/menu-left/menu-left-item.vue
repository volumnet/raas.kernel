<style lang="scss" scoped>
.menu-left__item {
    display: block;
    padding: 0;
    margin: 0;
    position: relative;
    &_active {
        color: black;
    }
    &_level_0 {
        font-size: 16px;
        line-height: 24px;
        @include gradient-y($gray-200, transparent);
        border-radius: 5px;
        padding: .33rem .75rem;
    }
    &_inner {
        font-size: 12px;
        padding-left: 22px;
        line-height: 20px; 
    }
    &_level_1 {
        font-size: 14px;
        line-height: 22px;
    }
}
.menu-left__children-trigger {
    position: absolute;
    left: 2px;
    top: 6px;
    @include center-alignment(10px, 10px);
    border: none;
    color: #aaa;
    line-height: 1;
    background: white;
    border-radius: 2px;
    &:after {
        @include fa('plus-square-o');
    }
    &_unfolded {
        &:after {
            @include fa('minus-square-o');
        }
    }
}
</style>

<template>
  <li :class="liClasses">
    <button v-if="item.submenu && item.submenu.length && (level >= $root.config.shownLevel)" class="menu-left__children-trigger" :class="{ 'menu-left__children-trigger_unfolded': unfolded }" @click="unfolded = !unfolded"></button>
    <menu-left-link :item="item" :level="level"></menu-left-link>
    <menu-left-list v-if="item.submenu && item.submenu.length" :menu="item.submenu" :level="level + 1" :unfolded="(level < $root.config.shownLevel) || unfolded"></menu-left-list>
  </li>
</template>

<script>
/**
 * Пункт левого меню
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
    data() {
        return {
            unfolded: this.item.active,
        }
    },
    computed: {
        /**
         * CSS-класс списка
         * @return {Object}
         */
        liClasses() {
            const result = { 'menu-left__item': true };
            if (this.level) {
                result['menu-left__item_inner'] = true;
            } else {
                result['menu-left__item_main'] = true;
            }
            if (this.unfolded) {
                result['menu-left__item_unfolded'] = true;
            }
            result['menu-left__item_level_' + this.level] = true;
            return result;
        }
    }
}
</script>