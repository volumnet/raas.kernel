<style lang="scss" scoped>
.left-menu {
  padding: 0;
  border-right: 1px solid var(--gray-d);
}
</style>

<template>
  <raas-tree class="left-menu">
    <left-menu-list
      :menu="menu"
      :current-path="currentPath"
      :unfolded="unfolded"
      @toggleFold="$emit('toggleFold', $event)"
      @open="$emit('open', $event)"
    />
  </raas-tree>
</template>

<script>
import LeftMenuList from "./left-menu-list.vue";

export default {
  props: {
    /**
     * Объекты меню
     * @type {Object[]}
     */
    menu: {
      type: Array,
      required: true,
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
    "left-menu-list": LeftMenuList,
  },
};
</script>
