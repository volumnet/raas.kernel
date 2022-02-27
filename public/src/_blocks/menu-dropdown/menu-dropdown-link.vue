<style lang="scss" scoped>
.menu-dropdown__link {
    display: block;
    padding: .25rem 1rem;
    font-size: 14px;
    color: $body-color;
    white-space: nowrap;
    &, &:hover, &:focus {
        text-decoration: none;
    }
    &:hover {
        background: $primary;
        color: white;
    }
}
.menu-dropdown__counter {
    &-inner {
        font-weight: bold;
    }
}
</style>

<template>
  <a :class="aClasses" :href="item.href" v-bind="attrs">
    <raas-icon v-if="item.icon" :icon="item.icon"></raas-icon>
    {{item.name}}
    <span class="menu-dropdown__counter" v-if="item.counter">
      (<span class="menu-dropdown__counter-inner">{{ item.counter }}</span>)
    </span>
  </a>
</template>

<script>
/**
 * Пункт меню управления (ссылка)
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
    computed: {
        /**
         * Дополнительные атрибуты
         */
        attrs() {
            let result = JSON.parse(JSON.stringify(this.item));
            for (let key of [
                'name',
                'href',
                'submenu',
                'counter',
                'active',
                'icon',
                'class',
            ]) {
                delete result[key];
            }
            return result;
        },
        /**
         * CSS-класс списка
         * @return {Object}
         */
        aClasses() {
            const result = { 'menu-dropdown__link': true };
            if (this.level) {
                result['menu-dropdown__link_inner'] = true;
            } else {
                result['menu-dropdown__link_main'] = true;
            }
            result['menu-dropdown__link_level_' + this.level] = true;
            if (this.item.active) {
                result['menu-dropdown__link_active'] = true;
            }
            if (this.item.submenu && this.item.submenu.length) {
                result['menu-dropdown__link_has-children'] = true;
            }
            if (this.item.class) {
                let classNames = this.item.class
                    .trim()
                    .split(' ')
                    .map(x => x.trim())
                    .filter(x => x.length > 0);
                for (let key of classNames) {
                    result[key] = true;
                }
            }
            return result;
        }
    }
}
</script>