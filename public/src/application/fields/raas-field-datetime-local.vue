<style lang="scss">

.raas-field-datetime-local {
    $self: &;
    position: relative;
    display: flex;
    &__picker {
        width: 45px;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        &:after {
            @include fa('calendar-alt');
        }
        #{$self} input[disabled] ~ & {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .is-invalid & {
            color: $danger;
        }
    }
    &__input {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
        border-right: none !important;
        .is-invalid & {
            background: none;
        }
    }
}
</style>

<template>
  <div class="raas-field-datetime-local input-group">
    <input type="text" v-bind="$attrs" :value="localValue" :pattern="pattern" v-on="inputListeners" ref="field" class="form-control raas-field-datetime-local__input">
    <input type="hidden" ref="valueField" :name="name" :value="pValue">
    <button type="button" class="btn btn-outline-secondary raas-field-datetime-local__picker" ref="picker" @click="togglePicker()"></button>
  </div>
</template>

<script>
import 'jquery-ui/themes/base/datepicker.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css'

import RAASFieldDatetimeLocal from 'cms/application/fields/raas-field-datetime-local.vue.js';
import 'jquery-ui/ui/widgets/datepicker.js';
import 'jquery-ui/ui/i18n/datepicker-ru.js';
import 'jquery-ui-timepicker-addon';
import 'jquery-ui-timepicker-addon/dist/i18n/jquery-ui-timepicker-ru.js';
import moment from 'moment/min/moment.min.js';

window.moment = moment;

export default {
    mixins: [RAASFieldDatetimeLocal],
}
</script>