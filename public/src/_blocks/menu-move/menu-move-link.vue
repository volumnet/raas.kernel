<style lang="scss" scoped>
.menu-move__link {
    $self: &;
    display: block;
    line-height: 1.5;
    &_active {
        color: $body-color;
    }
    &_current {
        font-weight: bold;
    }
    &_level_0 {
        font-size: 15px;
    }
    &_inner {
        font-size: 12px;
    }
    &_level_1 {
        font-size: 14px;
    }
}
</style>

<template>
  <a v-if="item.href" :class="aClasses" :href="item.href" v-bind="attrs">
    {{ item.name }}
  </a>
  <span :class="aClasses" v-else>
    {{ item.name }}
  </span>
</template>

<script>
/**
 * Пункт левого меню
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
            const result = { 'menu-move__link': true };
            if (this.level) {
                result['menu-move__link_inner'] = true;
            } else {
                result['menu-move__link_main'] = true;
            }
            if (this.item.active) {
                result['menu-move__link_active'] = true;
            }
            if (this.item.isCurrent) {
                result['menu-move__link_current'] = true;
            }
            result['menu-move__link_level_' + this.level] = true;
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