<template>
  <input 
    type="number" 
    class="form-control" 
    v-bind="$attrs" 
    :value="pValue" 
    :min="min" 
    :max="max" 
    :step="step"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="$emit('update:modelValue', checkValue(pValue))" 
  >
</template>

<script>
import RAASFieldNumber from 'cms/application/fields/raas-field-number.vue.js';
export default {
    mixins: [RAASFieldNumber],
}
</script>