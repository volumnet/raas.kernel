<style lang="scss">
.raas-field-codearea {
    .cm-editor {
        max-height: 320px;
    }
}
</style>

<template>
  <codemirror
    class="raas-field-codearea"
    v-bind="$attrs" 
    :model-value="pValue" 
    :required="false" 
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
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
    computed: {
        extensions() {
            const mimeArr = (this.dataMime || '').split('/');
            const result = [];
            switch (mimeArr[1] || '') {
                case 'javascript':
                case 'json':
                    result.push(javascript());
                    break;
                case 'html':
                    result.push(html());
                    break;
                case 'css':
                    result.push(css());
                    break;
                case 'xml':
                    result.push(xml());
                    break;
                default:
                    result.push(php());
                    break;
            }
            console.log(mimeArr[1], result);
            return result;
        }
    },
}
</script>