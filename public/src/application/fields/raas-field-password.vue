<style lang="scss">
@import 'bootstrap/scss/forms/_input-group.scss';

.raas-field-password {
    position: relative;
    $field: &;
    &_visible {
        #{$field}__show {
            &:after {
                @include fa('eye-slash');
            }
        }
    }
    &__show {
        width: 45px;
        &:after {
            @include fa('eye');
            font-weight: normal;
        }
    }
}
</style>

<template>
  <div class="raas-field-password input-group" :class="{ 'raas-field-password_visible': visible }">
    <input :type="currentType" v-bind="$attrs" class="form-control raas-field-password__input" v-on="inputListeners" :value="value">
    <button type="button" class="btn btn-outline-secondary raas-field-password__show" @click="visible = !visible"></button>
  </div>
</template>

<script>
import RAASFieldPassword from 'cms/application/fields/raas-field-password.vue.js';
export default {
    mixins: [RAASFieldPassword],
}
</script>