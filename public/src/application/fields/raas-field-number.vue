<template>
  <input type="number" v-bind="$attrs" v-on="inputListeners" @blur="pValue = checkValue(pValue);" :value="pValue" @input="pValue = $event.target.value" :min="min" :max="max" :step="step">
</template>

<script>
import RAASFieldNumber from 'cms/application/fields/raas-field-number.vue.js';
export default {
    mixins: [RAASFieldNumber],
}
</script>