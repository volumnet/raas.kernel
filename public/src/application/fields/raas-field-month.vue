<style lang="scss">

.raas-field-month {
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
    &__datepicker {
        .ui-datepicker-calendar {
            display: none;
        }
    }
}
</style>

<template>
  <div class="raas-field-month input-group">
    <input type="text" v-bind="$attrs" :value="localValue" :pattern="pattern" ref="field" class="form-control raas-field-month__input">
    <input type="hidden" ref="valueField" :name="name" :value="pValue"  v-on="inputListeners">
    <button type="button" class="btn btn-outline-secondary raas-field-month__picker" ref="picker" @click="togglePicker()"></button>
  </div>
</template>

<script>
    import 'jquery-ui/themes/base/datepicker.css';
import 'jquery-ui/themes/base/theme.css';

// import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css';
import RAASFieldMonth from 'cms/application/fields/raas-field-month.vue.js';
import 'jquery-ui/ui/widgets/datepicker.js';
import 'jquery-ui/ui/i18n/datepicker-ru.js';
import moment from 'moment/min/moment.min.js';

window.moment = moment;

export default {
    mixins: [RAASFieldMonth],
}
</script>