<style lang="scss">

.raas-field-color {
    display: flex;
    align-items: stretch;
    position: relative;
    &__input {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
        border-right: none !important;
        height: 30px;
        .is-invalid & {
            background: none;
        }
    }
    .sp-replacer {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        padding: 0 4px;
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
  <div class="raas-field-color">
    <input type="text" v-bind="$attrs" v-on="inputListeners" :value="pValue" pattern="^#[0-9a-fA-F]{6}$" class="form-control raas-field-color__input">
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
        check1() {
            alert('aaa')
        }
    }
}
</script>