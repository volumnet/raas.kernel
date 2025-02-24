<template>
  <input 
    type="url" 
    class="form-control" 
    v-bind="$attrs" 
    :value="pValue" 
    @input="$emit('update:modelValue', pValue = $event.target.value)"
  >
</template>

<script>
import RAASFieldUrl from 'cms/application/fields/raas-field-url.vue.js';
export default {
    mixins: [RAASFieldUrl],
}
</script>