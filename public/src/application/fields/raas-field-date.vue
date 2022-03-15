<style lang="scss">

.raas-field-date {
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
  <div class="raas-field-date input-group">
    <input type="text" v-bind="$attrs" :value="localValue" :pattern="pattern" v-on="inputListeners" ref="field" class="form-control raas-field-date__input">
    <input type="hidden" ref="valueField" :name="name" :value="pValue">
    <button type="button" class="btn btn-outline-secondary raas-field-date__picker" ref="picker" @click="togglePicker()"></button>
  </div>
</template>

<script>
import 'jquery-ui/themes/base/datepicker.css';
import 'jquery-ui/themes/base/theme.css';

// import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import RAASFieldDate from 'cms/application/fields/raas-field-date.vue.js';
import 'jquery-ui/ui/widgets/datepicker.js';
import 'jquery-ui/ui/i18n/datepicker-ru.js';
import moment from 'moment/min/moment.min.js';

window.moment = moment;

export default {
    mixins: [RAASFieldDate],
}
</script>