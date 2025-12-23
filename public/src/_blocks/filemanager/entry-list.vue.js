/**
 * Миксин для списка файловой системы
 */
export default {
  props: {
    /**
     * Список дочерних файлов/папок
     * @type {object[]}
     */
    items: {
      type: Array,
      required: true,
    },
    /**
     * Список выбранных файлов/папок (пути)
     * @type {string[]}
     */
    selection: {
      type: Array,
      required: true,
    },
  },
  emits: ["select", "open"],
};
