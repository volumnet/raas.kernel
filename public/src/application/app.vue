<script>
import App from "cms/application/app.vue.js";
import FixedHeader from "cms/application/mixins/fixed-header.vue.js";

export default {
  mixins: [App, FixedHeader],
  el: "#raas-app",
  data() {
    let result = {
      fixedHeaderActive: false,
      lastScrollTop: 0,
      config: window.raasConfig,
    };
    if (window.raasApplicationData) {
      Object.assign(result, window.raasApplicationData);
    }
    return result;
  },
  mounted() {
    // this.openFileManager("image");
  },
  methods: {
    lightBoxInit(options = {}) {},
    /**
     * Открывает файловый менеджер
     * @param {'file'|'image'} rootFolder Корневая папка
     * @param {boolean} withFileSelection Выбрать файл
     * @return {Promise<string>} Выбранный файл
     */
    openFileManager(rootFolder, withFileSelection) {
      return this.$refs.raasApp.$refs.filemanager.open(
        rootFolder,
        withFileSelection
      );
    },
    /**
     * Для отладки
     */
    alert(x) {
      alert(JSON.stringify(x));
    },
  },
};
</script>
