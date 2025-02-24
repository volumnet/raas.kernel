<style lang="scss" scoped>
.menu-left__item {
    &_active {
        color: black;
    }
    &_level_0 {
        background: linear-gradient(to bottom, var(--gray-e), transparent);
        border-radius: 5px;
        padding: .33rem .75rem .33rem 1rem;
    }
    &_inner {
        padding-left: 20px;
    }
}
</style>

<template>
  <raas-tree-item 
    :class="liClasses" 
    :foldable="!!(realItem.submenu && realItem.submenu.length && (level >= $root.config.shownLevel))" 
    :active="unfolded"
    @fold="clickFold()"
  >
    <menu-left-link :item="realItem" :level="level"></menu-left-link>
    <menu-left-list v-if="realItem.submenu && realItem.submenu.length" :menu="realItem.submenu" :level="level + 1" :unfolded="(level < $root.config.shownLevel) || unfolded"></menu-left-list>
  </raas-tree-item>
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
            // this.unfolded = !this.unfolded;
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