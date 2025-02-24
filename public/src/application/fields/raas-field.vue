<template>
  <component 
    v-if="typeof type == 'object'" 
    :is="resolvedAttrs.is" 
    v-bind="resolvedAttrs" 
    :model-value="pValue" 
    @update:model-value="$emit('update:modelValue', pValue = $event)"
  ></component>
  <component 
    v-else 
    :type="type" 
    :is="currentComponent" 
    v-bind="$attrs" 
    :model-value="pValue" 
    :source="source"
    @update:model-value="$emit('update:modelValue', pValue = $event)"
  ></component>
</template>

<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';

export default {
    mixins: [RAASField],
};
</script>