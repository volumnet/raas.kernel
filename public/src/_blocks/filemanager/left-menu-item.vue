<style lang="scss">
.raas-filemanager-left-menu__item {
  --raas-tree-link-default-padding: 0.5rem;

  padding-left: 0 !important;
  &_level_0 {
    border-radius: 5px;
  }
  .raas-tree__children-trigger {
    left: var(--raas-tree-link-default-padding);
  }
}
</style>

<template>
  <raas-tree-item
    :class="liClasses"
    :foldable="!!((item?.children?.length || item?.hasSubfolders) && level)"
    :active="unfolded[item.path]"
    @fold="$emit('toggleFold', [item.path, $event])"
  >
    <left-menu-link
      :item="item"
      :level="level"
      :is-active="item.path == currentPath"
      @open="$emit('open', $event)"
    ></left-menu-link>
    <raas-filemanager-left-menu-list
      v-if="item?.children?.length"
      :menu="item.children"
      :level="level + 1"
      :current-path="currentPath"
      :unfolded="unfolded"
      @toggleFold="$emit('toggleFold', $event)"
      @open="$emit('open', $event)"
    />
  </raas-tree-item>
</template>

<script>
import LeftMenuLink from "./left-menu-link.vue";

export default {
  props: {
    /**
     * Объекты меню
     * @type {Object}
     */
    item: {
      type: Object,
      required: true,
    },
    /**
     * Уровень вложенности
     * @type {Number}
     */
    level: {
      type: Number,
      default: 0,
    },
    /**
     * Текущий путь
     * @type {string}
     */
    currentPath: {
      type: String,
      required: true,
    },
    /**
     * Список раскрытых путей
     * @type {Object} <pre><code>Record<string Путь, boolean Раскрыт ли путь></code></pre>
     */
    unfolded: {
      type: Object,
      required: true,
    },
  },
  $emits: ["open", "toggleFold"],
  components: {
    "left-menu-link": LeftMenuLink,
  },
  computed: {
    /**
     * CSS-класс списка
     * @return {Object}
     */
    liClasses() {
      const result = { "raas-filemanager-left-menu__item": true };
      if (this.level) {
        result["raas-filemanager-left-menu__item_inner"] = true;
      } else {
        result["raas-filemanager-left-menu__item_main"] = true;
      }
      result["raas-filemanager-left-menu__item_level_" + this.level] = true;
      return result;
    },
  },
};
</script>
