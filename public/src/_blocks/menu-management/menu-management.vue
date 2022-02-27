<style lang="scss" scoped>
.menu-management {
    $self: &;
    position: relative;
    &__title {
        display: flex;
        align-items: center;
        border-radius: $border-radius-lg;
        @include viewport-up('md') {
            padding: 0.75rem 1.25rem;
        }
        @include viewport-down('sm') {
            padding: 0.5rem 1rem;
        }
        span {
            font-size: 17.5px;
            @include viewport-down('sm') {
                display: none;
            }
        }
        &:after {
            @include fa('caret-down');
            font-size: 12px;
            @include viewport-up('md') {
                margin-left: .5rem;
            }
            #{$self}_active & {
                transform: rotate(180deg);
            }
        }
    }
}
</style>

<template>
  <nav class="menu-management" :class="{ 'menu-management_active': active }">
    <button type="button" class="btn btn-info menu-management__title" @click.stop="active = !active">
      <span>
        {{ $root.translations.MANAGEMENT }}
      </span>
    </button>
    <menu-dropdown-list v-if="active" :menu="menu" align="right"></menu-dropdown-list>
  </nav>
</template>

<script>
import MenuDropdownMixin from 'app/_blocks/menu-dropdown/menu-dropdown.mixin.vue.js';

/**
 * Меню управления
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