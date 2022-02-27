<!-- убрали scoped, чтобы не конфликтовало с классами ссылок -->
<style lang="scss">
.menu-mobile__link {
    $link: &;
    display: flex;
    flex-grow: 1;
    align-items: center;
    position: relative;
    transition: background .5s, color .5s;
    padding: .5rem 1rem;
    height: 41px;
    font-size: 16px;
    overflow: hidden;
    &, &:hover, &:focus {
        color: $gray-900;
        text-decoration: none;
    }
    &:focus, &:active {
        outline: none;
    }
    &_system {
        &, &:hover, &:focus, &_active, &_semiactive {
            color: silver;
        }
    }
    .raas-icon {
        margin-right: 0.75rem;
    }
    &-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.menu-mobile__counter {
    &-inner {
        font-weight: bold;
    }
}
</style>

<template>
  <a :class="aClasses" :href="item.href" v-bind="attrs" @click="!item.href && item.submenu && item.submenu.length && $emit('open')">
    <raas-icon v-if="item.icon" :icon="item.icon"></raas-icon>
    <span class="menu-mobile__link-title">
      {{item.name}}
    </span>
    <span class="menu-mobile__counter" v-if="item.counter">
      (<span class="menu-mobile__counter-inner">{{ item.counter }}</span>)
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
    methods: {
      alert() {
        alert('aaa')
      }
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
            const result = { 'menu-mobile__link': true };
            if (this.level) {
                result['menu-mobile__link_inner'] = true;
            } else {
                result['menu-mobile__link_main'] = true;
            }
            result['menu-mobile__link_level_' + this.level] = true;
            if (this.item.system) {
                result['menu-mobile__link_system'] = true;
            } else if (this.item.active) {
                result['menu-mobile__link_active'] = true;
            }
            if (this.item.submenu && this.item.submenu.length) {
                result['menu-mobile__link_has-children'] = true;
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