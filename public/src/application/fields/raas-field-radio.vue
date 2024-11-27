
<template>
  <checkbox-tree 
    v-if="source" 
    class="checkbox-tree checkbox-tree_radio" 
    v-bind="$attrs" 
    :flat-max-counter="flatMaxCounter"
    :is-flat="!multilevel" 
    :data-options-counter="flatSource.length" 
    :type="type" 
    :name="name" 
    :value="pValue" 
    :source="source"
    @input="pValue = $event; $emit('input', pValue)" 
  ></checkbox-tree>
  <span v-else class="raas-field-radio" :class="{ 'raas-field-radio_active': !!checked }">
    <input type="radio" v-bind="$attrs" :name="name" :value="defval" :checked="checked" @click="pValue = defval; $emit('input', pValue)">
  </span>
</template>

<script>
import RAASFieldRadio from 'cms/application/fields/raas-field-radio.vue.js';

export default {
    mixins: [RAASFieldRadio],
    methods: {
        alert(x) {
            alert(x)
        }
    }
}
</script>