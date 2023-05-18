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
        padding: .33rem .75rem .33rem 1rem;
    }
    &_inner {
        font-size: 12px;
        padding-left: 20px;
        line-height: 20px; 
    }
    &_level_1 {
        font-size: 14px;
        line-height: 22px;
    }
}
.menu-left__children-trigger {
    position: absolute;
    left: 1px;
    margin-top: 6px;
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
    <button v-if="(realItem.submenu && realItem.submenu.length && (level >= $root.config.shownLevel))" class="menu-left__children-trigger" :class="{ 'menu-left__children-trigger_unfolded': unfolded }" @click="clickFold()"></button>
    <menu-left-link :item="realItem" :level="level"></menu-left-link>
    <menu-left-list v-if="realItem.submenu && realItem.submenu.length" :menu="realItem.submenu" :level="level + 1" :unfolded="(level < $root.config.shownLevel) || unfolded"></menu-left-list>
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
            realItem: JSON.parse(JSON.stringify(this.item)), // Реальный пункт (чтобы можно было менять)
            unfolded: this.item.active, // Пункт развернут
        }
    },
    methods: {
        /**
         * Клик по плюсу-минусу
         * @return {[type]} [description]
         */
        clickFold() {
            this.unfolded = !this.unfolded;
            if (this.realItem['data-ajax-submenu-url']) {
                const url = '/admin/ajax.php' + this.realItem['data-ajax-submenu-url'];
                this.$root.api(url).then((response) => {
                    // console.log(JSON.stringify(this.realItem));
                    delete this.realItem['data-ajax-submenu-url'];
                    if (response.menu) {
                        this.realItem.submenu = response.menu;
                    }
                    // console.log(JSON.stringify(this.realItem));
                });
            }
        },
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
    },
    watch: {
        item() { // 2023-04-12, AVS: чтобы подразделы обновлялись динамически
            this.realItem = this.item;
        },
    },
}
</script>