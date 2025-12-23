<style lang="scss" scoped>
.current-path {
  display: flex;
  align-items: stretch;
  gap: 0.25rem;
  padding-inline: 0.5rem;
  color: var(--gray-5);
  &__button,
  &__path {
    height: 32px;
  }
  &__button {
    width: 32px;
    padding: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-5);
    &:before-c {
      font-size: 16px;
      --color: var(--body-color);
    }
    &:not([disabled]):hover {
      color: var(--body-color);
      &:before {
        color: var(--color);
      }
    }
    &_refresh:before {
      @include fa("arrows-rotate");
    }
    &_parent:before {
      @include fa("arrow-up");
    }
  }
  &__path {
    flex-grow: 1;
    margin-bottom: 0;
  }
}
</style>

<template>
  <div class="current-path">
    <button
      type="button"
      class="btn current-path__button current-path__button_refresh"
      title="Обновить"
      @click="$emit('refresh')"
    ></button>
    <button
      type="button"
      class="btn current-path__button current-path__button_parent"
      title="Наверх"
      :disabled="!parentAvailable"
      @click="$emit('parent')"
    ></button>
    <input
      type="text"
      readonly
      class="current-path__path"
      :value="currentUrl"
    />
  </div>
</template>

<script>
export default {
  props: {
    /**
     * Текущий URL
     * @type {string}
     */
    currentUrl: {
      type: String,
      required: true,
    },
    /**
     * Доступен ли переход в родительский раздел
     * @type {boolean}
     */
    parentAvailable: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["refresh", "parent"],
};
</script>
