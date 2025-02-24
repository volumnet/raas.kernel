<template>
  <input 
    type="tel" 
    class="form-control" 
    v-bind="$attrs" 
    :pattern="pattern" 
    :value="pValue" 
    @input="$emit('update:modelValue', pValue = $event.target.value)"
  >
</template>

<script>
import RAASFieldTel from 'cms/application/fields/raas-field-tel.vue.js';
export default {
    mixins: [RAASFieldTel],
}
</script>