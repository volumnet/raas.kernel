<style lang="scss" scoped>
@use 'app/_shared/mixins/top-menu-trigger.scss' as *;

.menu-user {
    $self: &;
    position: relative;
    height: 100%;
    &__title {
        @include top-menu-trigger($self);
        &:before {
            @include fa('user');
            margin-right: 0.25rem;
            color: white;
        }
    }
}
</style>

<template>
  <nav class="menu-user" :class="{ 'menu-user_active': active }">
    <button type="button" class="menu-user__title" @click.stop="active = !active">
      {{ user.login }}
    </button>
    <menu-dropdown-list v-if="active" :menu="menu" align="right" :title="user.full_name"></menu-dropdown-list>
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
         * Пользователь
         * @type {Object}
         */
        user: {
            type: Object,
            required: true,
        },
        /**
         * Доступные языки 
         * @type {Object} <pre><code>object<
         *     String[] код языка => String Наименование языка
         * ></code></pre>
         */
        availableLanguages: {
            type: Object,
            default() {
                return {};
            },
        }
    },
    computed: {
        /**
         * Пользовательское меню
         * @return {Array}
         */
        menu() {
            const langSubmenu = [];
            for (let languageCode of Object.keys(this.availableLanguages)) {
                if (languageCode === this.user.lang) {
                    continue;
                }
                langSubmenu.push({
                    name: this.availableLanguages[languageCode],
                    href: '?mode=set_language&lang=' + languageCode + '&back=1'
                });
            }
            const langItem = {
                icon: 'globe',
                name: (this.$root.translations.LANGUAGE + ': ' + this.availableLanguages[this.user.lang]),
            };
            if (langSubmenu.length) {
                langItem.submenu = langSubmenu;
            }
            const result = [
                langItem,
                {
                    icon: 'edit',
                    name: this.$root.translations.EDIT_YOUR_PROFILE,
                    href: '?p=/&action=edit',
                },
                {
                    icon: 'off',
                    name: this.$root.translations.EXIT,
                    href: '?mode=logout',
                }
            ];
            return result;
        }
    }
}
</script>