<style lang="scss" scoped>
.filemanager {
  --folder-color: color-mix(in srgb, var(--yellow), transparent 25%);
  --hover-color: color-mix(in srgb, var(--primary), transparent 90%);
  --selected-color: color-mix(in srgb, var(--primary), transparent 75%);

  display: contents;
  &__modal {
    width: calc(100vw - 2rem);
    top: 10%;
    bottom: 10%;
    max-width: 1024px;
    margin-left: 0;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  &__inner {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
    padding-top: 0.5rem;
    gap: 0.25rem;
  }
  &__inner2 {
    flex-grow: 1;
    display: grid;
    overflow: hidden;
    position: relative;
    grid-template-columns: 1fr 3fr;
    @include viewport("<sm") {
      grid-template-columns: 1fr;
    }
  }
  &__loader {
    z-index: 1;
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, white, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    &:after {
      @include fa("spinner");
      font-size: 2rem;
      animation: var(--rotate);
      color: var(--gray-8);
    }
  }
  &__menu,
  &__file-list {
    overflow: auto;
  }
  &__menu {
    flex-shrink: 0;
    @include viewport("<sm") {
      display: none;
    }
  }
  &__file-list {
    &_empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-8);
    }
  }
}
</style>

<template>
  <div class="filemanager" v-if="opened">
    <div class="modal-backdrop" @click="close()"></div>
    <div class="modal fade in filemanager__modal">
      <div class="modal-header">
        <button type="button" class="close" @click="close()">&times;</button>
        <h4>Файловый менеджер</h4>
      </div>
      <div class="filemanager__inner">
        <control-panel
          :current-path="currentPath"
          :selection="selection"
          :clipboard="clipboard"
          @createFolder="handleCreateFolder"
          @open="handleOpen(selection?.[0])"
          @cut="handleCut()"
          @paste="handlePaste()"
          @rename="handleRename(selection?.[0])"
        />
        <current-path
          :current-url="currentFolder?.url || ''"
          :parent-available="currentPath.includes('/')"
          @refresh="load(currentPath)"
          @parent="handleGoToParent()"
        />
        <div class="filemanager__inner2">
          <left-menu
            class="filemanager__menu"
            :menu="foldersGraph"
            :current-path="currentPath"
            :unfolded="unfolded"
            @open="load($event)"
            @toggleFold="handleFold($event)"
          />
          <template v-if="!currentFileList.length">
            <div class="filemanager__file-list filemanager__file-list_empty">
              <template v-if="!loading"> Эта папка пуста </template>
            </div>
          </template>
          <template v-else>
            <div class="filemanager__file-list">
              <image-list
                :items="currentFileList"
                :selection="selection"
                @select="handleSelect($event)"
                @open="handleOpen($event)"
              />
            </div>
          </template>
          <div v-if="loading" class="filemanager__loader"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" @click="close()">Закрыть</button>
        <button
          v-if="selection && selection.length == 1 && withFileSelection"
          type="button"
          class="btn btn-primary"
          @click="resolveEntry()"
        >
          Выбрать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ControlPanel from "./control-panel.vue";
import { formatFolder, replaceFolder, findFolder } from "./helpers";
import LeftMenu from "./left-menu.vue";
import ImageList from "./image-list.vue";
import FileList from "./file-list.vue";
import CurrentPath from "./current-path.vue";

export default {
  props: {},
  components: {
    "control-panel": ControlPanel,
    "left-menu": LeftMenu,
    "image-list": ImageList,
    "file-list": FileList,
    "current-path": CurrentPath,
  },
  data() {
    return {
      /**
       * Форма открыта
       * @type {boolean}
       */
      opened: false,
      /**
       * Текущая папка (путь)
       * @type {string}
       */
      currentPath: null,
      /**
       * Текущий список файлов
       * @type {object[]}
       */
      currentFileList: [],
      /**
       * Список раскрытых путей
       * @type {Object} <pre><code>Record<string Путь, boolean Раскрыт ли путь></code></pre>
       */
      unfolded: {},
      /**
       * Функция разрешения промиса именем файла
       * @type {(string|null) => void}
       */
      resolve: null,
      /**
       * С выбором файла
       */
      withFileSelection: false,
      /**
       * Выбранные файлы/папки (пути)
       * @type {string[]}
       */
      selection: [],
      /**
       * Текущая выбранная позиция (путь)
       */
      selectionCursor: null,
      /**
       * Файлы/папки в буфере обмена
       * @type {object|null} <pre><code>{ dir: string Папка, paths: string[] Пути }</code></pre>
       */
      clipboard: null,
      /**
       * Общая загрузка
       */
      loading: false,
      /**
       * Дерево файлов/папок
       * @type {object}
       */
      foldersGraph: [],
    };
  },
  mounted() {},
  methods: {
    /**
     * Открывает файловый менеджер
     * @param {'file'|'image'} rootPath Корневая папка
     * @param {boolean} withFileSelection Выбрать файл
     */
    async open(rootPath, withFileSelection) {
      this.clear(true);
      if (["file", "image"].indexOf(rootPath) == -1) {
        throw new Error("Корневая папка должна быть file или image");
      }
      const promise = new Promise((resolve) => {
        this.resolve = resolve;
      });
      this.currentPath = rootPath;
      const rootFolder = {
        type: "dir",
        name: rootPath,
        path: rootPath,
        datetime: "",
        datetimeFormatted: "",
        hasSubfolders: false,
        unfolded: true,
        children: [],
      };
      this.foldersGraph = [rootFolder];
      this.unfolded = {};
      this.unfolded[rootPath] = true;
      this.withFileSelection = withFileSelection;
      this.opened = true;
      await this.load(rootPath);

      return promise;
    },
    /**
     * Отправляет запрос к API
     * @param {string} path Путь для действий с API
     * @param  {string} urlSuffix суффикс URL для отправки
     * @param  {mixed} postData POST-данные для отправки (если null, то GET-запрос)
     * @param  {number} blockId ID# блока для добавления AJAX={blockId} и заголовка X-RAAS-Block-Id
     * @param  {string} responseType MIME-тип получаемого ответа (если присутствует слэш /, то отправляется также заголовок Accept)
     * @param  {string} requestType MIME-тип запроса (если присутствует слэш /, то отправляется также заголовок Content-Type)
     * @param  {object} additionalHeaders Дополнительные заголовки
     * @param {AbortController|null} abortController Контроллер прерывания
     * @return {mixed} Результат запроса
     */

    async api(path, urlSuffix, postData = null) {
      const url =
        "ajax.php?p=" +
        (this.$root.packageName || "/") +
        "&mode=files&path=" +
        path +
        (urlSuffix ? "&" + urlSuffix : "");
      try {
        const result = await this.$root.api(
          url,
          postData,
          null,
          "application/json"
        );
        if (result?.result) {
          return result.result;
        } else {
          alert(result?.error?.message || "Неизвестная ошибка");
        }
      } catch (e) {
        alert(e.message || "Неизвестная ошибка");
      }
    },
    /**
     * Загружает данные папки
     * @param {object} folder Папка
     * @param {boolean} setCurrent Установить текущей
     */
    async load(path, setCurrent = true) {
      this.loading = true;
      const result = await this.api(path);
      if (setCurrent) {
        this.currentPath = path;
        this.currentFileList = result?.children || [];
        this.selection = [];
        this.selectionCursor = null;
      }
      const folder = this.getFolder(path);
      const resultFormatted = formatFolder(result, folder || {});
      const newFoldersGraph = replaceFolder(
        this.foldersGraph,
        path,
        resultFormatted
      );
      // console.log(newFoldersGraph);
      this.foldersGraph = newFoldersGraph;
      this.handleUnfoldTree(path);
      // console.log(this.unfolded);
      this.loading = false;
    },
    /**
     * Обрабатывает раскрытие/скрытие элемента
     * @param {[string, boolean]} e <pre><code>Record<string Путь, boolean Открыто ли></code></pre>
     */
    handleFold(e) {
      const [path, isUnfolded] = e;
      this.unfolded[path] = isUnfolded;
      const folder = this.getFolder(path);
      if (!folder.children) {
        this.load(path, false);
      }
    },
    /**
     * Рекурсивно разворачивает дерево вверх к родителю
     * @param {string} path Путь
     */
    handleUnfoldTree(path) {
      const pathArr = path.trim().split("/");
      for (let i = 0; i < pathArr.length; i++) {
        const subpath = pathArr.slice(i).join("/");
        this.unfolded[subpath] = true;
      }
    },
    /**
     * Перейти к родительской папке
     */
    handleGoToParent() {
      const pathArr = this.currentPath.trim().split("/");
      if (pathArr.length > 1) {
        this.load(pathArr.slice(0, pathArr.length - 1).join("/"));
      }
    },
    /**
     * Запрашивает создание папки
     */
    async handleCreateFolder() {
      const newFolderName = window.prompt("Введите название папки");
      if (newFolderName) {
        this.loading = true;
        const result = await this.api(this.currentPath, "action=mkdir", {
          name: newFolderName,
        });
        if (result) {
          await this.load(this.currentPath);
        }
        this.loading = false;
      }
    },
    /**
     * Обрабатывает событие выделения
     * @param {[string, number]} selectionEvent <pre><code>[
     *     string Путь к выделяемому файлу,
     *     number Режим выделения - 0 - простой, 1 - с Ctrl, 2 - с Shift
     * ]</code></pre>
     */
    handleSelect(selectionEvent) {
      const [selectedPath, mode] = selectionEvent;
      switch (mode) {
        case 2:
          const oldCursorIndex = this.currentPathsList.indexOf(
            this.selectionCursor
          );
          const newCursorIndex = this.currentPathsList.indexOf(selectedPath);
          const minNewSelectionIndex = Math.min(oldCursorIndex, newCursorIndex);
          const maxNewSelectionIndex = Math.max(oldCursorIndex, newCursorIndex);
          let selectionIndexes = new Set(
            this.selection.map((selPath) =>
              this.currentPathsList.indexOf(selPath)
            )
          );
          for (let i = minNewSelectionIndex; i <= maxNewSelectionIndex; i++) {
            selectionIndexes.add(i);
          }
          selectionIndexes = [...selectionIndexes];
          selectionIndexes.sort();
          this.selection = this.selection = selectionIndexes.map(
            (i) => this.currentPathsList[i]
          );
          break;
        case 1:
          if (this.selection.includes(selectedPath)) {
            this.selection = this.selection.filter((x) => x != selectedPath);
          } else {
            this.selection = [...this.selection, selectedPath];
          }
          break;
        default:
          this.selection = [selectedPath];
          break;
      }
      this.selectionCursor = selectedPath;
    },
    /**
     * Открывает файл/папку
     * @param {string} path Путь
     */
    handleOpen(path) {
      const entry = this.currentFileList.find((x) => x.path == path);
      if (entry?.type == "dir") {
        this.load(path);
      } else if (entry?.type == "file") {
        window.open(entry.url, "_blank");
      }
    },
    /**
     * Переименовывает файл/папку
     * @param {string} oldPath Старый путь
     */
    async handleRename(oldPath) {
      const entry = this.currentFileList.find((x) => x.path == oldPath);
      if (!entry) {
        return;
      }
      const newName = window.prompt(
        "Введите новое название для " + entry.name,
        entry.name
      );
      if (newName && newName != entry.name) {
        this.loading = true;
        const result = await this.api(oldPath, "action=rename", {
          name: newName,
        });
        if (result) {
          await this.load(this.currentPath);
        }
        this.loading = false;
      }
    },
    /**
     * Вырезает в буфер обмена
     */
    handleCut() {
      if (this?.selection?.length) {
        this.clipboard = {
          dir: this.currentPath,
          paths: this.selection,
        };
      }
    },
    /**
     * Вставляет из буфера обмена
     */
    async handlePaste() {
      if (!this.clipboard) {
        return;
      }
      // if (this.currentPath.indexOf(this.clipboard?.dir) == 0) {
      //   return;
      // }
      if (this.clipboard?.dir == this.currentPath) {
        return;
      }
      // @todo
    },
    /**
     * Закрывает файловый менеджер
     */
    close() {
      this.opened = false;
      this.resolve(null);
      this.clear();
    },
    /**
     * Окончательно выбирает файл/папку
     */
    resolveEntry() {
      this.opened = false;
      this.resolve(this.selection);
      this.clear();
    },
    /**
     * Восстанавливает файловый менеджер в первоначальный вид
     * @param {boolean} onOpen При открытии
     */
    clear(onOpen = false) {
      this.selection = [];
      if (onOpen) {
      } else {
        this.resolve = null;
      }
    },
    /**
     * Получает объект папки по ее пути
     * @param {string} path Путь до папки
     * @return {object|null}
     */
    getFolder(path) {
      return findFolder(this.foldersGraph, path);
    },
  },
  computed: {
    /**
     * Режим изображений
     * @return {boolean}
     */
    imageMode() {
      return this.foldersGraph?.[0]?.name == "image";
    },
    /**
     * Текущая папка
     * @return {object}
     */
    currentFolder() {
      return this.getFolder(this.currentPath);
    },
    /**
     * Текущий набор путей
     * @return {string[]}
     */
    currentPathsList() {
      return this.currentFileList.map((x) => x.path);
    },
  },
};
</script>
