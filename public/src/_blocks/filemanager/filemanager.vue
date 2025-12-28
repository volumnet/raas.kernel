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
    position: relative;
    &_empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-8);
    }
    &_drag {
      &:before-c {
        position: absolute;
        inset: 0;
        background: var(--hover-color);
      }
    }
  }
  &__footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    &:before,
    &:after {
      display: none !important;
    }
  }
  &__footer-buttons {
    display: flex;
    align-items: stretch;
    gap: 5px;
    button {
      margin-left: 0;
    }
  }
  &__progress {
    flex-grow: 1;
    > * {
      margin-bottom: 0;
    }
  }
}
</style>

<template>
  <div class="filemanager" v-if="opened">
    <div class="modal-backdrop" @click="close()"></div>
    <div
      class="modal fade in filemanager__modal"
      @keydown="handleKeyPress"
      tabindex="0"
    >
      <div class="modal-header">
        <button type="button" class="close" @click="close()">&times;</button>
        <h4>{{ $root.translations.FILEMANAGER }}</h4>
      </div>
      <div class="filemanager__inner">
        <control-panel
          :current-path="currentPath"
          :selection="selection"
          :clipboard="clipboard"
          @upload="$refs?.fileInput?.click()"
          @createFolder="handleCreateFolder"
          @open="handleOpen(selection?.[0])"
          @cut="handleCut()"
          @paste="handlePaste()"
          @rename="handleRename(selection?.[0])"
          @delete="handleDelete(selection)"
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
          <div
            class="filemanager__file-list"
            :class="{
              'filemanager__file-list_drag': dragOver,
              'filemanager__file-list_empty': !currentFileList.length,
            }"
            ref="fileList"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop.prevent="
              handleUpload(Array.from($event?.dataTransfer?.files));
              dragOver = false;
            "
          >
            <template v-if="!currentFileList.length">
              <template v-if="!loading">
                {{ $root.translations.FILEMANAGER_THIS_FOLDER_IS_EMPTY }}
              </template>
            </template>
            <template v-else>
              <component
                :is="imageMode ? 'image-list' : 'file-list'"
                :items="currentFileList"
                :selection="selection"
                @select="handleSelect($event)"
                @open="handleDblClick($event)"
              />
            </template>
          </div>
          <div v-if="loading" class="filemanager__loader"></div>
        </div>
      </div>
      <div class="modal-footer filemanager__footer">
        <div class="filemanager__progress">
          <input
            type="file"
            hidden
            multiple
            :accept="imageMode ? '.jpg,.jpeg,.png,.gif,.svg,.webp' : null"
            ref="fileInput"
            @change="handleUpload(Array.from($event.target.files))"
          />
          <progress-bar
            v-if="loading && progress !== null"
            :value="progress"
          ></progress-bar>
        </div>
        <div class="filemanager__footer-buttons">
          <template v-if="abortController">
            <button type="button" class="btn" @click="abortController.abort()">
              {{ $root.translations.CANCEL }}
            </button>
          </template>
          <template v-else>
            <button type="button" class="btn" @click="close()">
              {{ $root.translations.CLOSE }}
            </button>
            <button
              v-if="
                selection &&
                selection.length == 1 &&
                currentFileList?.find((entry) => entry.path == selection[0])
                  ?.type == 'file' &&
                withFileSelection
              "
              type="button"
              class="btn btn-primary"
              @click="resolveEntry()"
            >
              {{ $root.translations.SELECT }}
            </button>
          </template>
        </div>
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
import ProgressBar from "./progress-bar.vue";

export default {
  props: {},
  components: {
    "control-panel": ControlPanel,
    "left-menu": LeftMenu,
    "image-list": ImageList,
    "file-list": FileList,
    "current-path": CurrentPath,
    "progress-bar": ProgressBar,
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
       * Прогресс, %%
       * @type {number|null}
       */
      progress: null,
      /**
       * AbortController
       * @type {AbortController}
       */
      abortController: null,
      /**
       * Дерево файлов/папок
       * @type {object}
       */
      foldersGraph: [],
      /**
       * Файлы перетаскиваются на область файлов
       * @type {boolean}
       */
      dragOver: false,
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
        throw new Error(
          this.$root.translations.FILEMANAGER_ROOT_FOLDER_MUST_BE_IMAGE_OR_FILE
        );
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
      this.currentFileList = [];
      await this.load(rootPath);

      return promise;
    },
    /**
     * Обработчик нажатия клавиши
     * @param {KeyboardEvent} e
     */
    handleKeyPress(e) {
      if (e.code == "KeyA" && e.ctrlKey) {
        this.selection = this.currentFileList.map((entry) => entry.path);
        e.stopPropagation();
        e.preventDefault();
      }
    },
    /**
     * Отправляет запрос к API
     * @param {string} path Путь для действий с API
     * @param  {string} urlSuffix суффикс URL для отправки
     * @param  {object|FormData|null} postData POST-данные для отправки (если null, то GET-запрос)
     * @param {boolean} showErrors Отображать ошибки
     * @return {mixed} Результат запроса
     */
    async api(path, urlSuffix, postData = null, showErrors = true) {
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
          "application/json",
          postData && postData instanceof FormData
            ? "multipart/form-data"
            : "application/x-www-form-urlencoded",
          {},
          this.abortController
        );
        if (result?.result) {
          return result.result;
        } else {
          const errorMsg =
            result?.error?.message ||
            this.$root.translations.FILEMANAGER_UNKNOWN_ERROR;
          if (showErrors) {
            alert(errorMsg);
          } else {
            throw errorMsg;
          }
        }
      } catch (e) {
        let errorMsg;
        if (typeof e == "string" && e) {
          errorMsg = e;
        } else if (e?.message) {
          errorMsg = e.message;
        } else {
          errorMsg = this.$root.translations.FILEMANAGER_UNKNOWN_ERROR;
        }
        if (showErrors) {
          alert(errorMsg);
        } else {
          throw errorMsg;
        }
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
      this?.$refs?.fileList?.scrollTo(0, 0);
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
     * Обрабатывает событие загрузки файлов
     * @param {File[]} files Файлы
     */
    async handleUpload(files) {
      if (!files?.length) {
        return;
      }
      const totalSize = files
        .map((file) => file.size)
        .reduce((carry, index) => carry + index, 0);
      let uploadedSize = 0;
      await this.processBatch(
        files,
        async (file) => {
          const formData = new FormData();
          formData.append("files[]", file);
          const fileUploadResult = await this.api(
            this.currentPath,
            "action=upload",
            formData,
            false
          );
          this.currentFileList = [...this.currentFileList, ...fileUploadResult];
          uploadedSize += file.size;
          this.progress = Math.round((uploadedSize / totalSize) * 100);
        },
        this.$root.translations.FILEMANAGER_UPLOADED_FILES
      );
      this.$refs.fileInput.value = "";
    },
    /**
     * Обрабатывает удаление
     * @param {string[]} selection Пути для удаления
     */
    async handleDelete(selection) {
      if (!selection?.length) {
        return;
      }
      let alertMsg;
      if (selection.length > 1) {
        alertMsg =
          this.$root.translations.FILEMANAGER_ARE_YOU_SURE_TO_DELETE_ENTRIES.replace(
            "%d",
            selection.length
          );
      } else {
        const selectedEntry = this.currentFileList.find(
          (entry) => entry.path == selection[0]
        );
        if (selectedEntry) {
          if (selectedEntry.type == "dir") {
            alertMsg =
              this.$root.translations.FILEMANAGER_ARE_YOU_SURE_TO_DELETE_FOLDER.replace(
                "%s",
                selectedEntry.name
              );
          } else if (selectedEntry.type == "file") {
            alertMsg =
              this.$root.translations.FILEMANAGER_ARE_YOU_SURE_TO_DELETE_FILE.replace(
                "%s",
                selectedEntry.name
              );
          }
        } else {
          alertMsg =
            this.$root.translations.FILEMANAGER_ARE_YOU_SURE_TO_DELETE.replace(
              "%s",
              selection[0]
            );
        }
      }
      if (!confirm(alertMsg)) {
        return false;
      }

      await this.processBatch(
        selection,
        async (path, index) => {
          await this.api(path, "action=delete", {}, false);
          this.currentFileList = this.currentFileList.filter(
            (entry) => entry.path != path
          );
          this.progress = Math.round(((index + 1) / selection.length) * 100);
        },
        this.$root.translations.FILEMANAGER_DELETED_FILES
      );
    },
    /**
     * Вставляет из буфера обмена
     */
    async handlePaste() {
      if (!this.clipboard?.paths) {
        return;
      }
      // if (this.currentPath.indexOf(this.clipboard?.dir) == 0) {
      //   return;
      // }
      if (this.clipboard?.dir == this.currentPath) {
        return;
      }
      await this.processBatch(
        this.clipboard.paths,
        async (path, index) => {
          const fileMoveResult = await this.api(
            path,
            "action=move",
            { to: this.currentPath },
            false
          );
          this.currentFileList = [...this.currentFileList, fileMoveResult];
          this.progress = Math.round(
            ((index + 1) / this.clipboard.paths.length) * 100
          );
        },
        this.$root.translations.FILEMANAGER_MOVED_FILES
      );
      this.clipboard = null;
    },
    /**
     * Проводит пакетную обработку
     * @param {T[]} entries Набор сущностей
     * @param {async (entry: T, index: number) => void} callback Обработчик одной сущности
     * @param {string} multipleErrorTemplate Шаблон сообщения о множественных ошибках (первая %d - количество успешно выполненных, вторая %d - общее количество сущностей)
     */
    async processBatch(entries, callback, multipleErrorTemplate) {
      let abort = false;
      this.abortController = new AbortController();
      this.abortController.signal.addEventListener("abort", () => {
        abort = true;
      });

      let okCounter = 0;
      const errors = [];
      this.loading = true;
      this.progress = 0;
      for (let i = 0; i < entries.length; i++) {
        if (abort) {
          break;
        }
        try {
          await callback(entries[i], i);
          this.progress = Math.round(((i + 1) / entries.length) * 100);
          okCounter++;
        } catch (e) {
          errors.push(e);
        }
      }
      this.abortController = null;
      this.progress = null;
      await this.load(this.currentPath);
      this.loading = false;
      this.selection = [];
      if (!abort && errors.length) {
        alert(
          entries.length > 1
            ? multipleErrorTemplate
                .replace("%d", okCounter)
                .replace("%d", entries.length)
            : errors[0]
        );
      }
    },
    /**
     * Запрашивает создание папки
     */
    async handleCreateFolder() {
      const newFolderName = window.prompt(
        this.$root.translations.FILEMANAGER_ENTER_FOLDER_NAME
      );
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
     * Обрабатывает двойной клик по записи
     * @param {string} path Путь
     */
    handleDblClick(path) {
      if (this.withFileSelection) {
        const entry = this.currentFileList.find((x) => x.path == path);
        if (entry?.type == "file") {
          this.resolveEntry();
          return;
        }
      }
      this.handleOpen(path);
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
        this.$root.translations.FILEMANAGER_ENTER_NEW_NAME_FOR.replace(
          "%s",
          entry.name
        ),
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
        this.selection = [];
      }
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
      if (!this?.selection?.length) {
        this.close();
        return;
      }
      const selectedEntry = this.currentFileList.find(
        (entry) => entry.path == this.selection[0]
      );
      this.opened = false;
      this.resolve(selectedEntry.url);
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
