<template>
  <codemirror
    class="code codearea fullscreen"
    v-bind="$attrs" 
    :model-value="pValue" 
    :required="false" 
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="codeAreaConfig"
    @change="$emit('update:modelValue', pValue = $event)" 
  />
</template>

<script>
import { Codemirror } from 'vue-codemirror'

import { xml } from '@codemirror/lang-xml'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { php } from '@codemirror/lang-php'

import RAASFieldTextArea from 'cms/application/fields/raas-field-textarea.vue.js';
export default {
    mixins: [RAASFieldTextArea],
    components: {
        Codemirror
    },
    props: {
        dataMime: {
            type: String,
            required: false,
        }
    },
    mounted() {
        const cm = new EditorViewCodeMirror.fromTextArea(this.$el, this.codeAreaConfig);
        cm.on('change', () => {
            this.pValue = cm.getValue();
            this.$emit('input', this.pValue);
        });
    },
    computed: {
        extensions() {
            const result = [];
            switch (this.dataMime) {
                case 'javascript':
                    result.push(javascript);
                    break;
                case 'html':
                    result.push(html);
                    break;
                case 'css':
                    result.push(css);
                    break;
                case 'php':
                    result.push(php);
                    break;
                case 'xml':
                    result.push(xml);
                    break;
            }
            return result;
        }
    },
}
</script>