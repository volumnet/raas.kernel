<template>
  <input 
    type="datetime-local" 
    class="form-control"
    v-bind="$attrs" 
    :value="pValue" 
    @input="$emit('update:modelValue', pValue = $event.target.value)"
  >
</template>

<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';

export default {
    mixins: [RAASField],
    data: function () {
        return {
            pValue: this.modelValue && this.modelValue.replace(' ', 'T'),
        };
    },
    watch: {
        modelValue: function () {
            this.pValue = this.modelValue.replace(' ', 'T');
        },
    },
}
</script>