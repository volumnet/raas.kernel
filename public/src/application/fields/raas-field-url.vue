<template>
  <input type="url" v-bind="$attrs" v-on="inputListeners" :value="pValue" @input="pValue = $event.target.value">
</template>

<script>
import RAASFieldUrl from 'cms/application/fields/raas-field-url.vue.js';
export default {
    mixins: [RAASFieldUrl],
}
</script>