<template>
  <input 
    type="text" 
    data-type="email" 
    class="form-control" 
    v-bind="$attrs" 
    :pattern="pattern" 
    :value="pValue"
    @input="$emit('update:modelValue', pValue = $event.target.value)"
  >
</template>

<script>
import RAASFieldEmail from 'cms/application/fields/raas-field-email.vue.js';
export default {
    mixins: [RAASFieldEmail],
}
</script>