<style lang="scss">
.raas-field-radio {
    $self: &;
    @include center-alignment(16px);
    display: inline-flex;
    overflow: hidden;
    border-radius: 50%;
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
        @include size(8px);
        content: '';
        border-radius: 50%;
        display: none;
        background: $primary;
    }
    input {
        opacity: 0;
        position: absolute;
        cursor: pointer;
        &:checked + #{$self}__marker {
            display: block;
        }
    }
}

</style>

<template>
  <checkbox-tree v-if="source" v-bind="$attrs" @input="$emit('input', $event)" class="checkbox-tree checkbox-tree_radio" :class="{ 'checkbox-tree_flat': !multilevel && (flatSource.length <= 5) }" :type="type" :name="name" :value="value" :source="source"></checkbox-tree>
  <span v-else class="raas-field-radio" :class="{ 'raas-field-radio_active': !!checked }">
    <input type="radio" v-bind="$attrs" :name="name" :value="defval" :checked="checked" @click="$emit('input', defval)">
  </span>
</template>

<script>
import RAASFieldRadio from 'cms/application/fields/raas-field-radio.vue.js';

export default {
    mixins: [RAASFieldRadio],
}
</script>