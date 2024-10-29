<template>
  <raas-tree class="menu-left">
    <menu-left-list :menu="menu" :unfolded="true"></menu-left-list>
  </raas-tree>
</template>

<script>
/**
 * Левое меню
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
    },
    data() {
        return {
        };
    },
}
</script>