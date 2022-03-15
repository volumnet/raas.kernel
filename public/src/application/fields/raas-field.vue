<template>
  <component v-if="typeof type == 'object'" v-on="$listeners" v-bind="resolvedAttrs" v-model="pValue"></component>
  <component v-else :type="type" :is="currentComponent" v-on="$listeners" v-bind="$attrs" v-model="pValue" :source="source"></component>
</template>

<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';

export default {
    mixins: [RAASField],
};
</script>