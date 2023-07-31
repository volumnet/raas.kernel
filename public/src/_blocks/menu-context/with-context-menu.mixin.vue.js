/**
 * Миксин для объекта с контекстным меню
 * @requires Требует наличия свойства (любого типа) contextMenu
 */
export default {
    mounted() {
        if (this.contextMenu) {
            this.$el.addEventListener('contextmenu', (e) => {
                $('body').trigger('raas.contextmenu', { menu: this.contextMenu, event: e });
                e.stopPropagation();
                e.preventDefault();
            });
        }
    }
}