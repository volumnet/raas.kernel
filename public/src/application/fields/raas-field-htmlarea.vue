<template>
  <textarea v-bind="$attrs" v-on="inputListeners" :value="value"></textarea>
</template>

<script>
import RAASFieldHTMLArea from 'cms/application/fields/raas-field-htmlarea.vue.js';
export default {
    mixins: [RAASFieldHTMLArea],
}
</script>