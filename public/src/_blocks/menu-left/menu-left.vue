<template>
  <nav class="menu-left">
    <menu-left-list :menu="menu" :unfolded="true"></menu-left-list>
  </nav>
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