<style lang="scss">
@import 'bootstrap/scss/_button-group.scss';
@import 'bootstrap/scss/_dropdown.scss';

.raas-field-select {
    display: block;
    & + .btn-group {
        display: block;
        .form-control {
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .caret, &:after {
                display: none;
            }
        }
        .multiselect-container {
            width: 100%;
            .active, :hover {
                background: $primary;
                color: white;
            }
        }
        label {
            display: block;
            padding: 3px 1rem !important;
        }
        input[type="checkbox"], input[type="radio"] {
            display: none;
        }
    }
}
</style>

<template>
  <select v-bind="$attrs" v-on="inputListeners" :multiple="multiple" class="raas-field-select">
    <option :value="option.value" v-for="option in flatSource" :selected="multiple ? ((value || []).indexOf(option.value) != -1) : (option.value == value)">
      <template v-for="n in option.level">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </template>
      {{option.name}}
    </option>
  </select>
</template>

<script>
import RAASFieldSelect from 'cms/application/fields/raas-field-select.vue.js';

import 'bootstrap-multiselect/dist/css/bootstrap-multiselect.css'
import 'bootstrap-multiselect'
import 'bootstrap/js/src/util'
import 'bootstrap/js/src/dropdown.js'
export default {
    mixins: [RAASFieldSelect],
}
</script>