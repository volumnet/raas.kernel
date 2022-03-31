<style lang="scss">

.raas-field-password {
    display: flex;
    position: relative;
    $field: &;
    &_visible {
        #{$field}__show {
            &:after {
                @include fa('eye-slash');
            }
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
    &__show {
        width: 45px;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        &:after {
            @include fa('eye');
            font-weight: normal;
        }
    }
}
</style>

<template>
  <div class="raas-field-password input-group" :class="{ 'raas-field-password_visible': visible }">
    <input :type="currentType" v-bind="$attrs" class="form-control raas-field-password__input" v-on="inputListeners">
    <button type="button" class="btn btn-outline-secondary raas-field-password__show" @click="visible = !visible"></button>
  </div>
</template>

<script>
import RAASFieldPassword from 'cms/application/fields/raas-field-password.vue.js';
export default {
    mixins: [RAASFieldPassword],
}
</script>