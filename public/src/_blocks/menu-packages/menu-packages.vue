<style lang="scss" scoped>
@use 'app/_shared/mixins/top-menu-trigger.scss' as *;

.menu-packages {
    $self: &;
    position: relative;
    height: 100%;
    &__title {
        @include top-menu-trigger($self);
        font-size: 20px;
    }
}
</style>

<template>
  <nav class="menu-packages" :class="{ 'menu-packages_active': active }">
    <button type="button" class="menu-packages__title" @click.stop="active = !active">
      RAAS.{{activeItemTitle}}
    </button>
    <menu-dropdown-list v-if="active" :menu="menuWithoutCurrent"></menu-dropdown-list>
  </nav>
</template>

<script>
import MenuDropdownMixin from 'app/_blocks/menu-dropdown/menu-dropdown.mixin.vue.js';

/**
 * Меню выбора пакета
 */
export default {
    mixins: [MenuDropdownMixin],
    props: {
        /**
         * Объекты меню
         * @type {Array} <pre><code>array<{
         *     href: String Ссылка,
         *     name: String Заголовок,
         *     active: Boolean Активен ли пункт меню
         * }></code></pre>
         */
        menu: {
            type: Array,
            required: true,
        },
    },
    computed: {
        /**
         * Возвращает заголовок активного пункта меню
         * @return {String}
         */
        activeItemTitle() {
            for (let i = 0; i < this.menu.length; i++) {
                if (this.menu[i].active) {
                    return this.menu[i].name;
                }
            }
            return '';
        },
        /**
         * Меню без текущего элемента
         * @return {Array}
         */
        menuWithoutCurrent() {
            return this.menu.filter(x => !x.active);
        },
    },
}
</script>