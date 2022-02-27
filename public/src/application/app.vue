<script>
import App from 'cms/application/app.vue.js';
import FixedHeader from 'cms/application/mixins/fixed-header.vue.js';
import RaasApp from './raas-app.vue';

export default {
    mixins: [App, FixedHeader],
    el: '#raas-app',
    components: {
        RaasApp,
    },
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
        }
    }
};
</script>