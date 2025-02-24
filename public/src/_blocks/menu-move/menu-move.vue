<template>
  <raas-tree class="menu-move">
    <menu-move-list :menu="menu" :unfolded="true" :folded-level="foldedLevel"></menu-move-list>
  </raas-tree>
</template>


<script>
/**
 * Меню перемещения
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
         * Уровень, на котором начинается сворачивание
         * @type {Number}
         */
        foldedLevel: {
            type: Number,
            default: 2
        },
    },
    computed: {
        self() {
            return {
                menu: this.menu,
                foldedLevel: this.foldedLevel,
            };
        },
    },
};
</script>