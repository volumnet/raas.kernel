<style lang="scss">

.raas-field-password {
    display: inline-flex;
    position: relative;
    $field: &;
    &_visible {
        #{$field}__show {
            &:after {
                @include fa('eye-slash');
            }
        }
    }
    &__input {
        padding-right: var(--control-height) !important;
    }
    &__show {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        aspect-ratio: 1/1;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        padding: 0;
        &:after {
            @include fa('eye');
            font-weight: normal;
        }
    }
}
</style>

<template>
  <div class="raas-field-password" :class="{ 'raas-field-password_visible': visible }">
    <input 
      class="form-control raas-field-password__input"
      v-bind="$attrs" 
      :type="currentType" 
      :value="pValue"
      @input="$emit('update:modelValue', pValue = $event.target.value)"
    >
    <button type="button" class="raas-field-password__show" @click="visible = !visible"></button>
  </div>
</template>

<script>
import RAASFieldPassword from 'cms/application/fields/raas-field-password.vue.js';
export default {
    mixins: [RAASFieldPassword],
}
</script>