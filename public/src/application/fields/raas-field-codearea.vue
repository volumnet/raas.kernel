<template>
  <textarea v-bind="$attrs" v-on="inputListeners" :value="pValue" @input="pValue = $event.target.value" :required="false" class="code codearea fullscreen"></textarea>
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
        const cm = CodeMirror.fromTextArea(this.$el, this.codeAreaConfig);
        cm.on('change', () => {
            this.pValue = cm.getValue();
            this.$emit('input', this.pValue);
        });
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
                extraKeys: {
                    Tab: function (cm) {
                        var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                        cm.replaceSelection(spaces);
                    },
                },
            };
            if (this.dataMime) {
                result['mode'] = this.dataMime;
            }
            return result;
        },
    },
}
</script>