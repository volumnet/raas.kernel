/**
 * Поле с автокомплитом
 */
export default {
    mounted() {
        if (this.source) {
            const source = this.source.map(x => ({ label: x.caption, value: x.value}));
            $(this.$el).autocomplete({ source })
        }
    },
};