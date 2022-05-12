<style lang="scss">
.raas-field-checkbox {
    $self: &;
    @include center-alignment(16px);
    display: inline-flex;
    overflow: hidden;
    border-radius: $border-radius;
    border: 1px solid #ddd;
    cursor: pointer;
    position: relative;
    vertical-align: middle;
    &_active {
        &:after {
            display: block !important;
        }
    }
    &_disabled {
        cursor: not-allowed;
        opacity: 0.5;
        input {
            pointer-events: none;
        }
    }
    &:after, &__marker {
        display: none;
        color: $primary;
    }
    &:after, &__marker:after {
        @include fa('check');
    }
    input {
        opacity: 0;
        pointer-events: none;
        position: absolute;
        cursor: pointer;
        &:checked + #{$self}__marker {
            display: block;
        }
    }
}

</style>

<template>
  <checkbox-tree v-if="multiple" v-bind="$attrs" @input="toggleOption($event)" class="checkbox-tree checkbox-tree_checkbox" :class="{ 'checkbox-tree_flat': !multilevel && (flatSource.length <= 5) }" :data-options-counter="flatSource.length" :type="type" :name="name" :value="pValue" @input="pValue = $event.target.value" :defval="defval" :source="source"></checkbox-tree>
  <span v-else class="raas-field-checkbox" :class="{ 'raas-field-checkbox_active': !!checked }">
    <input type="checkbox" v-bind="$attrs" :name="name" :value="defval" :checked="checked" @click="toggleCheckbox()">
    <input type="hidden" :name="name" v-if="(mask !== null) && !checked" :value="mask">
  </span>
</template>

<script>
import RAASFieldCheckbox from 'cms/application/fields/raas-field-checkbox.vue.js';

export default {
    mixins: [RAASFieldCheckbox],
}
</script>