<template>
  <input type="hidden" v-bind="$attrs" :value="pValue">
</template>

<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';
export default {
    mixins: [RAASField],
}
</script>