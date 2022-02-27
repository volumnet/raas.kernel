<style lang="scss" scoped>
.errors {
    position: relative;
    padding: $alert-padding-y $alert-dismissible-padding-r $alert-padding-y $alert-padding-x;
    margin-bottom: $alert-margin-bottom;
    border: $alert-border-width solid transparent;
    @include border-radius($alert-border-radius);
    $alert-background: shift-color($danger, $alert-bg-scale);
    $alert-border: shift-color($danger, $alert-border-scale);
    $alert-color: shift-color($danger, $alert-color-scale);
    @if (contrast-ratio($alert-background, $alert-color) < $min-contrast-ratio) {
        $alert-color: mix($danger, color-contrast($alert-background), abs($alert-color-scale));
    }
    @include alert-variant($alert-background, $alert-border, $alert-color);
    text-shadow: 0 1px 0 rgba(white, .5);
    &__title {
        font-size: 18px;
        font-weight: bold;
    }
    &__close {
        float: right;
        font-size: 20px;
        font-weight: bold;
        line-height: 20px;
        color: black;
        text-shadow: 0 1px 0 white;
        opacity: 0.2;
        position: absolute;
        top: $alert-padding-y;
        right: ($alert-dismissible-padding-r / 2);
        transform: translate(50%, 0);
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;
        &:hover {
            opacity: 0.4;
        }
        &:after {
            content: '×';
        }
    }
    &__list {
        margin-bottom: 0;
    }
}
</style>

<template>
  <div class="errors">
    <button type="button" class="errors__close" @click="$emit('close')"></button>
    <div class="errors__title">
      {{ $root.translations.FOLLOWING_ERRORS_FOUND }}:
    </div>
    <ul class="errors__list">
      <li v-for="error of errors">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * Блок ошибок
 */
export default {
    props: {
        /**
         * Список ошибок
         * @type {Array}
         */
        errors: {
            type: Array,
            default() {
                return [];
            },
        },
    },
};
</script>