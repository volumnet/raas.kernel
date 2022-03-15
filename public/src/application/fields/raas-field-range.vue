<style lang="scss">
.raas-field-range {
    display: flex;
    align-items: center;
    margin: -.5rem;
    &__slider-outer, &__input-outer {
        padding: .5rem;
    }
    &__slider-outer {
        flex-grow: 1;
        padding-left: 1rem;
    }
    &__input-outer {
        width: 6em;
    }
    &__slider {
        width: 100%;
        .ui-slider-handle {
            background: $primary;
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
      <input type="number" v-bind="$attrs" v-on="inputListeners" :value="value" @input="checkValue();" class="form-control raas-field-range__input" :min="min" :max="max" :step="step">
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