<style lang="scss" scoped>
.errors {
    position: relative;
    padding: 1rem 3rem 1rem 1rem;
    border: 1px solid color-mix(in srgb, white 70%, var(--danger));
    border-radius: 0.25rem;
    color: var(--danger);
    background: color-mix(in srgb, white 80%, var(--danger));
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
        top: 1rem;
        right: 1.5rem;
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
    emits: ['close'],
};
</script>