<style lang="scss" scoped>
.menu-main {
    height: 100%;
    &__list {
        display: flex;
        height: 100%;
        align-items: stretch;
        margin: 0;
        padding: 0;
    }
    &__item {
        display: block;
        padding: 0;
        margin: 0;
    }
    &__link {
        padding: .65rem 1rem;
        display: flex;
        height: 100%;
        align-items: center;
        color: #999;
        line-height: 1;
        &, &:hover, &:focus {
            text-decoration: none; 
        }
        &:hover, &_active {
            color: white;
        }
        &_active {
            background: black;
        }
    }
    &__counter {
        &-inner {
            font-weight: bold;
        }
    }
}
</style>

<template>
  <nav class="menu-main">
    <ul class="menu-main__list">
      <li class="menu-main__item" :class="{ 'menu-main__item_active': menuItem.active }" v-for="menuItem of menu">
        <a :href="menuItem.href" class="menu-main__link" :class="{ 'menu-main__link_active': menuItem.active }">
          <span v-html="menuItem.name"></span>
          <span class="menu-main__counter" v-if="menuItem.counter">
            (<span class="menu-main__counter-inner">{{ menuItem.counter }}</span>)
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
/**
 * Основное меню
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