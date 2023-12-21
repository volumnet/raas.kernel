<style lang="scss" scoped>
.menu-left__link {
    $self: &;
    display: block;
    #{$self}&_active {
        color: black !important;
    }
}
.menu-left__counter {
    &-inner {
        font-weight: bold;
    }
}
</style>

<template>
  <a :class="aClasses" :href="item.href" v-bind="attrs">
    <span v-html="item.name"></span>
    <span class="menu-left__counter" v-if="item.counter">
      (<span class="menu-left__counter-inner">{{ item.counter }}</span>)
    </span>
  </a>
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
            const result = { 'menu-left__link': true };
            if (this.level) {
                result['menu-left__link_inner'] = true;
            } else {
                result['menu-left__link_main'] = true;
            }
            if (this.item.active) {
                result['menu-left__link_active'] = true;
            }
            result['menu-left__link_level_' + this.level] = true;
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