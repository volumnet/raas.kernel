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