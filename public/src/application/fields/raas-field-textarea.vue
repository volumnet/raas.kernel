<template>
  <textarea
    v-bind="$attrs" 
    class="form-control" 
    :value="pValue" 
    @input="$emit('update:modelValue', pValue = $event.target.value)"
  ></textarea>
</template>

<script>
import RAASFieldTextArea from 'cms/application/fields/raas-field-textarea.vue.js';
export default {
    mixins: [RAASFieldTextArea],
}
</script>