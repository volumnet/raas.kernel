<style lang="scss" scoped>
.left-menu__link {
  $self: &;

  --raas-tree-padding: 20px;

  cursor: pointer;
  display: flex;
  gap: 4px;
  padding-inline: var(--raas-tree-link-default-padding);
  text-decoration: none !important;
  // margin-left: calc(var(--raas-tree-padding) * -1);
  // padding-left: var(--raas-tree-padding);
  &#{$self}_active {
    color: black !important;
    background-color: var(--selected-color) !important;
  }
  &_level_0 {
    font-size: 16px;
    line-height: 24px;
  }
  &_inner {
    font-size: 12px;
    line-height: 20px;
  }
  &_level_1 {
    font-size: 14px;
    line-height: 22px;
  }
  @for $i from 1 through 10 {
    &_level_#{$i} {
      padding-left: calc(
        var(--raas-tree-link-default-padding) + var(--raas-tree-padding) * #{$i}
      );
    }
  }
  &:before {
    @include fa("folder");
    color: color-mix(in srgb, var(--yellow), transparent 25%);
  }
}
</style>

<template>
  <a :class="aClasses" @click="$emit('open', item.path)">
    {{ item.name }}
  </a>
</template>

<script>
/**
 * Пункт левого меню
 */
export default {
  props: {
    /**
     * Объекты меню
     * @type {object}
     */
    item: {
      type: Object,
      required: true,
    },
    /**
     * Уровень вложенности
     * @type {number}
     */
    level: {
      type: Number,
      default: 0,
    },
    /**
     * Активен ли пункт меню
     * @type {boolean}
     */
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * CSS-класс списка
     * @return {Object}
     */
    aClasses() {
      const result = { "left-menu__link": true };
      if (this.level) {
        result["left-menu__link_inner"] = true;
      } else {
        result["left-menu__link_main"] = true;
      }
      if (this.isActive) {
        result["left-menu__link_active"] = true;
      }
      result["left-menu__link_level_" + this.level] = true;
      return result;
    },
  },
};
</script>
