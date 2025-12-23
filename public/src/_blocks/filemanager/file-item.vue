<style lang="scss" scoped>
@use "cms/_shared/mixins/filetype.scss" as *;

.file-item {
  $self: &;
  &:not(#{$self}_selected):hover {
    @include viewport(">lg") {
      background-color: var(--hover-color) !important;
    }
  }
  &_selected {
    background-color: var(--selected-color) !important;
  }
  &__title {
    @include filetype();
    &:before {
      display: inline-block;
      size: relMin(16px, $min: 14px);
      color: var(--gray-8);
      margin-right: relMin(5px, $min: 2px);
    }
    &_folder:before {
      @include fa("folder");
      color: var(--folder-color);
    }
  }
}
</style>

<template>
  <tr
    :title="item.name"
    :class="className"
    @click="handleSelect($event)"
    @dblclick="$emit('open')"
  >
    <td :class="titleClassName">
      {{ nameWithoutExt }}
    </td>
    <td>
      {{ extension }}
    </td>
    <td>
      {{ item.type == "dir" ? "Папка" : formatNumber(item.size) }}
    </td>
    <td>
      {{ item.datetimeFormatted }}
    </td>
  </tr>
</template>

<script>
import EntryItem from "./entry-item.vue";

export default {
  mixins: [EntryItem],
  computed: {
    /**
     * CSS-класс
     * @return {Object}
     */
    className() {
      const result = { "file-item": true };
      if (this.item.type == "dir") {
        result["file-item_folder"] = true;
      } else {
        result["file-item_file"] = true;
      }
      if (this.selected) {
        result["file-item_selected"] = true;
      }
      return result;
    },
    /**
     * CSS-класс заголовка
     * @return {Object}
     */
    titleClassName() {
      const result = { "file-item__title": true };
      if (this.item.type == "dir") {
        result["file-item__title_folder"] = true;
      } else {
        result["file-item__title_file"] = true;
        result["file-item__title_" + this.extension] = true;
      }
      return result;
    },
  },
};
</script>
