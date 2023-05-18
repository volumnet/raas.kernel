<style lang="scss" scoped>
.menu-mobile {
    $menu: &;
    &__item {
        display: flex;
        align-items: stretch;
        position: relative;
        margin: 0;
        padding: 0;
        border-bottom: 1px solid #ddd;
        &_active, &_semiactive {
            background: $gray-200;
        }
        &_system {
            border-bottom-color: $gray-700;
            &, &_active, &_semiactive {
                background: $gray-800;
            }
        }
    }
    &__children-trigger {
        @include center-alignment(41px, 24px);
        border: none;
        background: transparent;
        color: $gray-900;
        flex-shrink: 0;
        &:after {
            @include fa('angle-right');
        }
        #{$menu}__item_system & {
            color: silver;
        }
    }
}
</style>

<template>
  <div :class="liClasses">
    <menu-mobile-link :item="realItem" :level="level" @open="listActive = true"></menu-mobile-link>
    <button type="button" class="menu-mobile__children-trigger" v-if="realItem.submenu && realItem.submenu.length" @click="clickActivate()"></button>
    <menu-mobile-list v-if="realItem.submenu && realItem.submenu.length" :item="realItem" :level="level + 1" :active="listActive" @back="listActive = false" @close="listActive = false; $emit('close')"></menu-mobile-list>
  </div>
</template>

<script>
/**
 * Пункт меню управления
 */
export default {
    props: {
        /**
         * Объекты меню
         * @type {Object}
         */
        item: {
            type: Object,
            required: true,
        },
        /**
         * Уровень вложенности
         * @type {Number}
         */
        level: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            realItem: JSON.parse(JSON.stringify(this.item)), // Реальный пункт (чтобы можно было менять)
            listActive: false, // Список активен
        };
    },
    methods: {
        /**
         * Клик внутрь элемента
         * @return {[type]} [description]
         */
        clickActivate() {
            this.listActive = true;
            if (this.realItem['data-ajax-submenu-url']) {
                const url = '/admin/ajax.php' + this.realItem['data-ajax-submenu-url'];
                this.$root.api(url).then((response) => {
                    // console.log(JSON.stringify(this.realItem));
                    delete this.realItem['data-ajax-submenu-url'];
                    if (response.menu) {
                        this.realItem.submenu = response.menu;
                    }
                    // console.log(JSON.stringify(this.realItem));
                });
            }
        },
    },
    computed: {
        /**
         * CSS-класс списка
         * @return {Object}
         */
        liClasses() {
            const result = { 'menu-mobile__item': true };
            if (this.level) {
                result['menu-mobile__item_inner'] = true;
            } else {
                result['menu-mobile__item_main'] = true;
            }
            result['menu-mobile__item_level_' + this.level] = true;
            if (this.item.system) {
                result['menu-mobile__item_system'] = true;
            } else if (this.item.active) {
                result['menu-mobile__item_active'] = true;
            }
            if (this.item.submenu && this.item.submenu.length) {
                result['menu-mobile__item_has-children'] = true;
            }
            return result;
        }
    },
    watch: {
        item() { // 2023-04-12, AVS: чтобы подразделы обновлялись динамически
            this.realItem = this.item;
        },
    },
}
</script>