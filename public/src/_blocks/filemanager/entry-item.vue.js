/**
 * Миксин для записи файловой системы
 */
export default {
  props: {
    /**
     * Запись (файл или папка)
     */
    item: {
      type: Object,
      required: true,
    },
    /**
     * Пункт выбран
     */
    selected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["select", "open"],
  methods: {
    formatNumber(x) {
      return window.formatPrice(x);
    },
    /**
     * Управляет выбором
     * @param {MouseEvent} event Событие клика
     */
    handleSelect(event) {
      if (event.shiftKey) {
        this.$emit("select", 2);
      } else if (event.ctrlKey) {
        this.$emit("select", 1);
      } else {
        this.$emit("select", 0);
      }
    },
  },
  computed: {
    /**
     * Расширение файла (в нижнем регистре)
     * @return {string}
     */
    extension() {
      const arr = this.item.name.split(".");
      if (arr.length > 1) {
        const lastChunk = arr[arr.length - 1];
        return lastChunk.toLowerCase();
      }
      return "";
    },
    /**
     * Имя файла без расширения
     * @return {string}
     */
    nameWithoutExt() {
      let arr = this.item.name.split(".");
      if (arr.length > 1) {
        arr = arr.slice(0, arr.length - 1);
      }
      return arr.join(".");
    },
    /**
     * Является ли запись изображением
     * @return {boolean}
     */ isImage() {
      return [
        "jpg",
        "jpeg",
        "jfif",
        "gif",
        "png",
        "swg",
        "webp",
        "bmp",
        "svg",
      ].includes(this.extension);
    },
  },
};
