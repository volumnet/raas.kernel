<style lang="scss">
.checkbox-tree {
    padding-left: 0;
    &_flat {
        display: flex;
        flex-wrap: wrap;
        margin: -.5rem;
        li {
            padding: .5rem;
        }
    }
    li {
        display: block;
    }
}
</style>

<template>
  <ul>
    <li v-for="option in source">
      <label>
        <raas-field-checkbox v-if="type == 'checkbox'" @input="$emit('input', { value: option.value, checked: !!$event })" :type="type" :required="!!$attrs.required && !arrayValue.length" :name="/\[/.test(name) ? name : (name + '[]')" :value="(arrayValue && arrayValue.indexOf(option.value) != -1) ? option.value : ''" :defval="option.value"></raas-field-checkbox>
        <raas-field-radio v-else-if="type == 'radio'" @input="$emit('input', $event)" :type="type" :name="name" :value="value" :defval="option.value" :required="!!$attrs.required && !value"></raas-field-radio>
        {{option.name}}
      </label>
      <checkbox-tree v-if="option.children && option.children.length" @input="$emit('input', $event)" :type="type" :name="name" :value="value" :defval="defval" :source="option.children"></checkbox-tree>
    </li>
  </ul>
</template>

<script>
import CheckboxTree from 'cms/application/fields/checkbox-tree.vue.js';

export default {
    mixins: [CheckboxTree],
    
}
</script>