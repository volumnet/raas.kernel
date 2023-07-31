<style lang="scss">
.menu-context {
    position: absolute;
    top: var(--top);
    left: var(--left);
    .menu-dropdown__list_main {
        position: relative;
        margin-top: 0;
    }
}
</style>


<template>
  <div class="menu-context" v-if="active && menu" :style="cssStyle">
    <menu-dropdown-list :menu="menu"></menu-dropdown-list>
  </div>
</template>


<script>
import MenuDropdownMixin from 'app/_blocks/menu-dropdown/menu-dropdown.mixin.vue.js';

export default {
    mixins: [MenuDropdownMixin],
    data() {
        return {
            menu: null,
            left: 0,
            top: 0,
        };
    },
    mounted() {
        $('body').on('raas.contextmenu', (e, data) => {
            this.left = data.event.pageX;
            this.top = data.event.pageY;
            this.show(data.menu, e);
        });
    },
    methods: {
        /**
         * Отображает меню
         * @param {Array} menu Список пунктов
         * @param {Event} event Событие
         */
        show(menu, event) {
            if (menu && menu.length) {
                this.menu = menu;
                this.active = true;
            } else {
                this.menu = null;
                this.active = false;
            }
        },
    },
    computed: {
        cssStyle() {
            return {
                '--left': this.left + 'px',
                '--top': this.top + 'px',
            }
        },
    }
};
</script>