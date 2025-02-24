
<template>
  <checkbox-tree 
    v-if="source" 
    v-bind="$attrs" 
    class="checkbox-tree checkbox-tree_radio" 
    :flat-max-counter="flatMaxCounter"
    :is-flat="!multilevel" 
    :data-options-counter="flatSource.length" 
    :type="type" 
    :name="name" 
    :model-value="pValue" 
    :source="source"
    @update:model-value="$emit('update:modelValue', pValue = $event)" 
  ></checkbox-tree>
  <span v-else class="raas-field-radio" :class="{ 'raas-field-radio_active': !!checked }">
    <input 
      type="radio" 
      v-bind="$attrs" 
      :name="name" 
      :value="defval" 
      :checked="checked" 
      @click="$emit('update:modelValue', pValue = defval)"
    >
  </span>
</template>

<script>
import RAASFieldRadio from 'cms/application/fields/raas-field-radio.vue.js';

export default {
    mixins: [RAASFieldRadio],
}
</script>