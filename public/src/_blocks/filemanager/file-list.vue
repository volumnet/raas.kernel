<style lang="scss">
.raas-filemanager-file-list {
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
  @include viewport("<md") {
    font-size: 12px;
  }
  thead,
  tbody {
    display: contents;
  }
  &__row {
    display: grid;
    cursor: pointer;
    grid-template-columns: 1fr 4em 7em 11em;
    @include viewport("<sm") {
      grid-template-columns: 1fr 4em 7em;
    }
    &_header {
      position: sticky;
      background: white;
      border-bottom: 1px solid var(--gray-d);
      top: 0;
    }
    td,
    th {
      display: block;
      text-align: left;
      overflow: hidden;
      padding-inline: 4px;
      padding-block: 2px;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:nth-child(n + 4) {
        @include viewport("<sm") {
          display: none;
        }
      }
    }
    tbody & {
      &:nth-child(even) {
        background-color: var(--gray-f);
      }
    }
  }
  // @include viewport-props(
  //   (
  //     --items-in-row: (
  //       ">lg": 5,
  //       "md": 4,
  //       "sm": 3,
  //       "<xs": 2,
  //     ),
  //   )
  // );
  // grid-template-columns: repeat(var(--items-in-row), minmax(0, 1fr));
  // &__item {
  //   overflow: hidden;
  // }
}
</style>

<template>
  <table class="raas-filemanager-file-list">
    <thead>
      <tr
        class="raas-filemanager-file-list__row raas-filemanager-file-list__row_header"
      >
        <th>{{ $root.translations.FILEMANAGER_NAME }}</th>
        <th>{{ $root.translations.FILEMANAGER_TYPE }}</th>
        <th>{{ $root.translations.FILEMANAGER_SIZE }}</th>
        <th>{{ $root.translations.FILEMANAGER_DATE }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, index) in items" :key="item.path">
        <file-item
          class="raas-filemanager-file-list__row"
          :item="item"
          :selected="selection.includes(item.path)"
          @select="$emit('select', [item.path, $event])"
          @open="$emit('open', item.path)"
        />
      </template>
    </tbody>
  </table>
</template>

<script>
import EntryList from "./entry-list.vue";
import FileItem from "./file-item.vue";

export default {
  mixins: [EntryList],
  components: {
    "file-item": FileItem,
  },
};
</script>
