<style lang="scss" scoped>
.control-button {
  padding: 0.5rem 0.25rem;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  line-height: 1.1;
  min-height: 32px;
  color: var(--gray-5);
  @include viewport("<sm") {
    font-size: 0;
    gap: 0;
  }

  &:before-c {
    --size: #{relMin(32px, $min: 16px)};
    font-size: var(--size);
    height: var(--size);
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    --color: var(--body-color);
  }
  &:not([disabled]):hover {
    color: var(--body-color);
    &:before {
      color: var(--color);
    }
  }

  &_upload:before {
    @include fa("upload");
  }
  &_new-folder:before {
    @include fa("folder-plus");
  }
  &_view:before {
    @include fa("magnifying-glass");
  }
  &_select:before {
    @include fa("check");
  }
  &_select-all:before {
    @include fa("list-check");
  }
  &_cut:before {
    @include fa("scissors");
  }
  &_paste:before {
    @include fa("clipboard");
  }
  &_rename:before {
    @include fa("i-cursor");
  }
  &_delete:before {
    @include fa("xmark");
    --color: var(--red);
  }
}
</style>

<template>
  <button
    type="button"
    :class="className"
    :title="title"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ title }}
  </button>
</template>

<script>
export default {
  props: {
    /**
     * Тип кнопки
     * @type {String}
     */
    type: {
      type: String,
      required: true,
    },
    /**
     * Заголовок
     * @type {String}
     */
    title: {
      type: String,
      required: true,
    },
    /**
     * Кнопка не актвна
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  computed: {
    /**
     * CSS-класс
     */
    className() {
      const result = { "control-button": true, btn: true };
      result["control-button_" + this.type] = true;
      if (this.disabled) {
        result["control-button_disabled"] = true;
      }
      return result;
    },
  },
};
</script>
