<style lang="scss" scoped>
.breadcrumbs {
    display: block;
    margin: 0;
    background: $gray-100;
    border-radius: $border-radius;
    padding: 0.5rem 1rem;
    &__list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
    }
    &__item {
        display: flex;
        align-items: center;
        @include viewport-up('md') {
            &:after {
                content: '/';
                display: block;
                margin: 0 5px;
                color: silver;
            }
        }
        @include viewport-down('sm') {
            display: none;
            &:last-child {
                display: flex;
            }
            &:before {
                @include fa('angle-left');
                display: block;
                margin-right: 1rem;
                color: silver;
            }
        }
    }
}
</style>

<template>
  <nav class="breadcrumbs">
    <ul class="breadcrumbs__list">
      <li class="breadcrumbs__item" v-for="menuItem of menu">
        <a :href="menuItem.href" class="breadcrumbs__link">
          {{menuItem.name}}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
/**
 * Хлебные крошки
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