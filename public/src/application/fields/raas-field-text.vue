<template>
  <input type="text" v-on="inputListeners" v-bind="$attrs" :value="pValue" @input="pValue = $event.target.value">
</template>

<script>
import RAASFieldText from 'cms/application/fields/raas-field-text.vue.js';
export default {
    mixins: [RAASFieldText],
}
</script>