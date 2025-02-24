<template>
  <input 
    type="text" 
    class="form-control" 
    v-bind="$attrs" 
    :value="pValue" 
    @input="$emit('update:modelValue', pValue = $event.target.value)"
  >
</template>

<script>
import RAASFieldText from 'cms/application/fields/raas-field-text.vue.js';
export default {
    mixins: [RAASFieldText],
}
</script>