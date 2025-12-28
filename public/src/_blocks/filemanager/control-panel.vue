<style lang="scss" scoped>
.control-panel {
  padding-inline: 0.5rem;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  align-items: stretch;
  gap: 0.25rem;
}
</style>

<template>
  <div class="control-panel">
    <control-button
      type="upload"
      :title="$root.translations.FILEMANAGER_UPLOAD"
      @click="$emit('upload')"
    />
    <control-button
      type="new-folder"
      :title="$root.translations.FILEMANAGER_CREATE_FOLDER"
      @click="$emit('createFolder')"
    />
    <control-button
      v-if="selection?.length == 1"
      type="view"
      :title="$root.translations.FILEMANAGER_VIEW"
      @click="$emit('open')"
    />

    <!-- <control-button type="select" :title="$root.translations.FILEMANAGER_SELECT_CHECK" /> -->
    <control-button
      v-if="selection?.length"
      type="cut"
      :title="$root.translations.FILEMANAGER_CUT"
      @click="$emit('cut')"
    />
    <control-button
      v-if="clipboard && clipboard?.dir != currentPath"
      type="paste"
      :title="$root.translations.FILEMANAGER_PASTE"
      @click="$emit('paste')"
    />
    <control-button
      v-if="selection?.length == 1"
      type="rename"
      :title="$root.translations.FILEMANAGER_RENAME"
      @click="$emit('rename')"
    />
    <control-button
      v-if="selection?.length"
      type="delete"
      :title="$root.translations.FILEMANAGER_DELETE"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
import ControlButton from "./control-button.vue";
export default {
  props: {
    /**
     * Текущая папка (путь)
     * @type {string}
     */
    currentPath: {
      type: String,
      required: true,
    },
    /**
     * Файлы/папки в буфере обмена
     * @type {object|null} <pre><code>{ dir: string Папка, paths: string[] Пути }</code></pre>
     */
    clipboard: {
      type: Object,
      default: null,
    },
    /**
     * Выделение
     * @type {string[]} Пути
     */
    selection: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    "control-button": ControlButton,
  },
  emits: ["upload", "createFolder", "open", "cut", "paste", "rename", "delete"],
};
</script>
