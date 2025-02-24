<style lang="scss">
.raas-field-range {
    display: flex;
    align-items: center;
    margin: -.5rem;
    &__slider-outer, &__input-outer {
        padding: .5rem;
    }
    &__slider-outer {
        padding-left: 1rem;
    }
    &__input-outer {
        width: 6em;
    }
    &__slider {
        width: 218px;
        .ui-slider-handle {
            background: var(--primary);
        }
    }
    &__input {
        width: 8rem;
    }
}
</style>

<template>
  <div class="raas-field-range">
    <div class="raas-field-range__slider-outer">
      <div class="raas-field-range__slider" ref="slider"></div>
    </div>
    <div class="raas-field-range__input-outer">
      <input 
        type="number" 
        class="form-control raas-field-range__input" 
        v-bind="$attrs" 
        :value="pValue" 
        :min="min" 
        :max="max" 
        :step="step"
        @input="$emit('update:modelValue', checkValue(pValue = $event.target.value));" 
      >
    </div>
  </div>
</template>

<script>
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/slider.js';
import RAASFieldRange from 'cms/application/fields/raas-field-range.vue.js';

export default {
    mixins: [RAASFieldRange],
}
</script>