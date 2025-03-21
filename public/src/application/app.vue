<script>
import App from 'cms/application/app.vue.js';
import FixedHeader from 'cms/application/mixins/fixed-header.vue.js';

export default {
    mixins: [App, FixedHeader],
    el: '#raas-app',
    data() {
        let result = {
            fixedHeaderActive: false,
            lastScrollTop: 0,
            config: window.raasConfig,
        };
        if (window.raasApplicationData) {
            Object.assign(result, window.raasApplicationData);
        }
        return result;
    },
    methods: {
        lightBoxInit(options = {}) {
        },
        /**
         * Для отладки
         */
        alert(x) {
            alert(JSON.stringify(x));
        },
    }
};
</script>