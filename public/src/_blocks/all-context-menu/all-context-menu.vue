<style lang="scss" scoped>
.all-context-menu {
    $self: &;
    position: relative;
    &__title {
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        &:after {
            @include fa('caret-down');
            font-size: 12px;
            margin-left: 0.25rem;
            #{$self}_active & {
                transform: rotate(180deg);
            }
        }
    }
}
</style>

<template>
  <nav class="all-context-menu" :class="{ 'all-context-menu_active': active }">
    <button type="button" class="btn btn-mini all-context-menu__title" @click.stop="active = !active">
      {{ $root.translations.WITH_SELECTED }}
    </button>
    <menu-dropdown-list v-show="active" :menu="menu"></menu-dropdown-list>
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