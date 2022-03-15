<template>
  <textarea v-bind="$attrs" v-on="inputListeners" :value="value"></textarea>
</template>

<script>
import RAASFieldTextArea from 'cms/application/fields/raas-field-textarea.vue.js';
export default {
    mixins: [RAASFieldTextArea],
}
</script>