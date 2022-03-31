<template>
  <textarea v-bind="$attrs" v-on="inputListeners" :value="value" :required="false" class="htmlarea"></textarea>
</template>

<script>
import RAASFieldHTMLArea from 'cms/application/fields/raas-field-htmlarea.vue.js';
export default {
    mixins: [RAASFieldHTMLArea],
    computed: {
        ckEditorConfig() {
            return window.ckEditorConfig;
        },
    },
}
</script>