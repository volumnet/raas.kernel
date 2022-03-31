<template>
  <textarea v-bind="$attrs" v-on="inputListeners" :value="value" :required="false" class="code codearea fullscreen"></textarea>
</template>

<script>
import RAASFieldTextArea from 'cms/application/fields/raas-field-textarea.vue.js';
export default {
    mixins: [RAASFieldTextArea],
    props: {
        dataMime: {
            type: String,
            required: false,
        }
    },
    mounted() {
        CodeMirror.fromTextArea(this.$el, this.codeAreaConfig);
    },
    computed: {
        codeAreaConfig() {
            const result = {
                lineNumbers: true, 
                mode: "application/x-httpd-php", 
                indentUnit: 2, 
                indentWithTabs: false, 
                enterMode: "keep", 
                tabMode: "shift", 
                tabSize: 2,
            };
            if (this.dataMime) {
                result['mode'] = this.dataMime;
            }
            return result;
        },
    },
}
</script>