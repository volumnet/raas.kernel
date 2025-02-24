<template>
  <input 
    type="month" 
    class="form-control raas-field-month__input"
    v-bind="$attrs" 
    :value="pValue" 
    @input="$emit('update:modelValue', pValue = $event.target.value)"
  >
</template>

<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';

export default {
    mixins: [RAASField],
}
</script>