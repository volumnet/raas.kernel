<style lang="scss" scoped>
.row-context-menu {
    $self: &;
    float: right;
    position: relative;
    &__title {
        display: flex;
        align-items: center;
        justify-content: center;
        &:after {
            @include fa('caret-down');
            font-size: 12px;
            #{$self}_active & {
                transform: rotate(180deg);
            }
        }
    }
}
</style>

<template>
  <nav class="row-context-menu" :class="{ 'row-context-menu_active': active }">
    <button type="button" class="btn row-context-menu__title" @click.stop="active = !active"></button>
    <menu-dropdown-list v-if="active" :menu="menu" align="right"></menu-dropdown-list>
  </nav>
</template>

<script>
import MenuDropdownMixin from 'app/_blocks/menu-dropdown/menu-dropdown.mixin.vue.js';

/**
 * Контекстное меню табличной строки
 */
export default {
    mixins: [MenuDropdownMixin],
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
}
</script>