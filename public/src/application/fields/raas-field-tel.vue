<template>
  <input type="tel" v-bind="$attrs" v-on="inputListeners" :pattern="pattern" :value="pValue" @input="pValue = $event.target.value">
</template>

<script>
import RAASFieldTel from 'cms/application/fields/raas-field-tel.vue.js';
export default {
    mixins: [RAASFieldTel],
}
</script>