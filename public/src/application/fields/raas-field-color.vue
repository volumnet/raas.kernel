<style lang="scss">
@import 'bootstrap/scss/forms/_input-group.scss';

.raas-field-color {
    align-items: stretch;
    position: relative;
    &__picker {
        width: 45px;
        display: flex !important;
        align-items: center;
    }
    .sp-preview {
        margin-bottom: 0;
        margin-right: 0;
    }
    .sp-dd {
        display: none;
    }
}
</style>

<template>
  <div class="raas-field-color input-group">
    <input type="text" v-bind="$attrs" v-on="inputListeners" :value="value" pattern="^#[0-9a-f]{6}$" class="form-control raas-field-color__input">
    <input type="color" ref="picker" />
  </div>
</template>

<script>
import RAASFieldColor from 'cms/application/fields/raas-field-color.vue.js';
import 'spectrum-colorpicker/spectrum.css'
import 'spectrum-colorpicker'

export default {
    mixins: [RAASFieldColor],
}
</script>