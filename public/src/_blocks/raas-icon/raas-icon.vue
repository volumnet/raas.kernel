<style lang="scss">
.raas-icon {
    font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands";
}
</style>

<template>
  <span :class="cssClass"></span>
</template>

<script>
/**
 * Иконка
 */
export default {
    props: {
        icon: {
            type: String,
            required: true,
        },
    },
    computed: {
        /**
         * Реальная иконка Font Awesome
         * @return {String}
         */
        realIcon() {
            switch (this.icon) {
                case 'off':
                    return 'power-off';
                    break;
                case 'ok':
                    return 'check';
                    break;
                case 'eye-open':
                    return 'eye';
                    break;
                case 'eye-close':
                    return 'eye-slash';
                    break;
                case 'pencil-square-o':
                    return 'pen-to-square';
                    break;
                default:
                    return this.icon;
                    break;
            }
        },
        /**
         * CSS-класс
         * @return {Object}
         */
        cssClass() {
            const result = { 'raas-icon': true, 'fa-solid': true };
            if (this.realIcon) {
                result['fa-' + this.realIcon] = true;
            }
            return result;
        }
    },
};
</script>