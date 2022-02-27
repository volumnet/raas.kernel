/**
 * Выпадающее меню
 */
export default {
    data() {
        return {
            active: false, // Активно ли меню
        };
    },
    mounted() {
        $('body').on('click', () => {
            this.active = false;
        });
        $(this.$el).on('click', (e) => {
            e.stopPropagation();
        }).on('click', 'a[href]', () => {
            this.active = false;
        });
    },
}