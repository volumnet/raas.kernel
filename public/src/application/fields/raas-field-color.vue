<style lang="scss">

.raas-field-color {
    $field: &;
    display: inline-flex;
    align-items: stretch;
    position: relative;
    &__input {
        padding-right: var(--control-height) !important;
    }
    &__picker {
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
        // &:after {
        //     @include fa('eye');
        //     font-weight: normal;
        // }
        // #{$field}_visible &:after {
        //     @include fa('eye-slash');
        // }
    }
    .sp-preview {
        display: contents;
        &-inner {
            inset: 1px;
        }
    }
    .sp-dd {
        display: none;
    }
}
</style>

<template>
  <div class="raas-field-color">
    <input 
      type="text" 
      class="form-control raas-field-color__input"
      pattern="^#[0-9a-fA-F]{6}$" 
      v-bind="$attrs" 
      :value="pValue" 
      @input="$emit('update:modelValue', pValue = $event.target.value)"
    >
    <input type="color" ref="picker" />
  </div>
</template>

<script>
import RAASFieldColor from 'cms/application/fields/raas-field-color.vue.js';
import 'spectrum-colorpicker/spectrum.css'
import 'spectrum-colorpicker'

export default {
    mixins: [RAASFieldColor],
    methods: {
        checkColorPicker() {
            var self = this;
            if (!$(this.$refs.picker).attr('data-colorpicker-applied')) {
                $(this.$refs.picker).spectrum({
                    color: this.modelValue,
                    showInput: true,
                    showInitial: true,
                    preferredFormat: 'hex',
                    replacerClassName: 'raas-field-color__picker',
                }).on('change', function () {
                    self.$emit('update:modelValue', self.pValue = $(this).val());
                }).attr('data-colorpicker-applied', 'true');
            } else {
                $(this.$refs.picker).spectrum('set', self.pValue);
            }
        },
    }
}
</script>