<style lang="scss" scoped>
.menu-move__item {
    &_active {
        color: black;
    }
}
</style>

<template>
  <raas-tree-item 
    :class="liClasses" 
    :foldable="!!(realItem.submenu && realItem.submenu.length && (level >= foldedLevel))" 
    :active="unfolded"
    @fold="clickFold()"
  >
    <menu-move-link :item="realItem" :level="level"></menu-move-link>
    <menu-move-list 
      v-if="realItem.submenu && realItem.submenu.length" 
      :menu="realItem.submenu" 
      :level="level + 1" 
      :unfolded="(level < foldedLevel) || unfolded"
      :folded-level="foldedLevel"
    ></menu-move-list>
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
        /**
         * Уровень, на котором начинается сворачивание
         * @type {Number}
         */
        foldedLevel: {
            type: Number,
            default: 2
        },
    },
    data() {
        return {
            realItem: JSON.parse(JSON.stringify(this.item)), // Реальный пункт (чтобы можно было менять)
            unfolded: this.item.unfolded, // Пункт развернут
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
            const result = { 'menu-move__item': true };
            if (this.level) {
                result['menu-move__item_inner'] = true;
            } else {
                result['menu-move__item_main'] = true;
            }
            result['menu-move__item_level_' + this.level] = true;
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