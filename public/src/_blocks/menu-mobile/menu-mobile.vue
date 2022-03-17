<style lang="scss" scoped>
.menu-mobile {
    $self: &;
    position: relative;
    &__title {
        @include center-alignment(40px, 24px)
        width: auto;
        padding: 0 1rem;
        background: transparent;
        border: none;
        color: #999;
        &:after {
            @include fa('bars');
        }
        #{$self}_active & {
            color: white;
            &:after {
                @include fa('close');
            }
        }
    }
}
</style>

<template>
  <nav class="menu-mobile" :class="{ 'menu-mobile_active': active }">
    <button type="button" class="menu-mobile__title" @click="toggle($event)"></button>
    <menu-mobile-list :item="rootItem" :active="active" @close="active = false" @back="active = false"></menu-mobile-list>
  </nav>
</template>

<script>
import MenuDropdownMixin from 'app/_blocks/menu-dropdown/menu-dropdown.mixin.vue.js';

/**
 * Мобильное меню
 */
export default {
    mixins: [MenuDropdownMixin],
    props: {
        /**
         * Объекты основного меню
         * @type {Object[]}
         */
        mainMenu: {
            type: Array,
            required: true,
        },
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
        },
        /**
         * Объекты левого меню
         * @type {Object[]}
         */
        leftMenu: {
            type: Array,
            required: false,
        },
        /**
         * Объекты меню пакетов
         * @type {Object[]}
         */
        packagesMenu: {
            type: Array,
            required: true,
        },
    },
    methods: {
        toggle(e) {
            if (!this.active) {
                this.active = true;
                e.stopPropagation();
            } else {
                this.active = false;
            }
        },
    },
    computed: {
        /**
         * Корневой элемент
         * @return {Object}
         */
        rootItem() {
            const activePackages = this.packagesMenu.filter(x => x.active);
            // const activeMainMenuItems = this.mainMenu.filter(x => x.active);
            const activePackageName = activePackages.length 
                ? ('RAAS.' + activePackages[0].name) 
                : 'RAAS';
            const result = {
                name: activePackageName,
            };
            const packagesItem = {
                name: activePackageName,
                icon: 'cubes',
                system: true,
            };
            if (this.packagesMenu.length) {
                packagesItem.submenu = this.packagesMenu;
            }
            let submenu = [
                packagesItem,
            ];
            if (this.user.login) {
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
                submenu.push({
                    name: this.user.full_name || this.user.login,
                    icon: 'user',
                    system: true,
                    submenu: [
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
                    ],
                });
            }
            if (this.mainMenu.length) {
                submenu = submenu.concat(this.mainMenu.map(x => {
                    const y = { ...x };
                    y.system = true;
                    return y;
                }));
                // submenu.push({
                //     name: activeMainMenuItems.length ? activeMainMenuItems[0].name : this.$root.title,
                //     icon: 'bars',
                //     system: true,
                //     submenu: this.mainMenu,
                // });
            }
            if (this.leftMenu && this.leftMenu.length) {
                submenu = submenu.concat(this.leftMenu);
                if ((this.leftMenu.length == 1) && 
                    this.leftMenu[0].submenu && 
                    this.leftMenu[0].submenu.length
                ) {
                    submenu = submenu.concat(this.leftMenu[0].submenu);
                }
            }
            result.submenu = submenu;

            return result;

        }
    }
}
</script>