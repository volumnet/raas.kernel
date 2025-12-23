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
    <control-button type="upload" title="Загрузить" />
    <control-button
      type="new-folder"
      title="Создать папку"
      @click="$emit('createFolder')"
    />
    <control-button
      v-if="selection?.length == 1"
      type="view"
      title="Просмотр"
      @click="$emit('open')"
    />

    <control-button type="select" title="Отметить" />
    <control-button
      v-if="selection?.length"
      type="cut"
      title="Вырезать"
      @click="$emit('cut')"
    />
    <control-button
      v-if="clipboard && clipboard?.dir != currentPath"
      type="paste"
      title="Вставить"
      @click="$emit('paste')"
    />
    <control-button
      v-if="selection?.length == 1"
      type="rename"
      title="Переименовать"
      @click="$emit('rename')"
    />
    <control-button v-if="selection?.length" type="delete" title="Удалить" />
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
  emits: ["createFolder", "open", "cut", "paste", "rename"],
};
</script>
