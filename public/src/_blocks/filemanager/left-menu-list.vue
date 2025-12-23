<template>
  <raas-tree-list :class="ulClasses">
    <template v-for="(menuItem, index) of menu">
      <left-menu-item
        :item="menuItem"
        :level="level"
        :current-path="currentPath"
        :unfolded="unfolded"
        @open="$emit('open', $event)"
        @toggleFold="$emit('toggleFold', $event)"
      />
    </template>
  </raas-tree-list>
</template>

<script>
import LeftMenuItem from "./left-menu-item.vue";

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
    "left-menu-item": LeftMenuItem,
  },
  computed: {
    /**
     * CSS-класс списка
     * @return {Object}
     */
    ulClasses() {
      const result = { "left-menu__list": true };
      if (this.level) {
        result["left-menu__list_inner"] = true;
      } else {
        result["left-menu__list_main"] = true;
      }
      result["left-menu__list_level_" + this.level] = true;
      return result;
    },
  },
};
</script>
