<style lang="scss">
.raas-repo-table-item {
    td {
        vertical-align: middle;
        input, select, textarea {
            margin-bottom: 0;
        }
    }
    &__controls {
        .raas-repo-table_align-left & {
            width: 100%;
        }
        // width: 2rem;
    }
    .raas-repo-item-controls-list {
        justify-content: flex-end;
    }
}
</style>

<template>
  <tr class="raas-repo-table-item">
    <slot :model-value="modelValue" :emit="slotEmit"></slot>
    <td class="raas-repo-table-item__controls" v-if="draggable || removable">
      <raas-repo-item-controls-list 
        :draggable="draggable" 
        :removable="removable" 
        @delete="$emit('delete', $event)"
      ></raas-repo-item-controls-list>
    </td>
  </tr>
</template>

<script>
import RepoItem from 'cms/application/raas-repo/raas-repo-item.vue.js';

export default {
    mixins: [RepoItem],
};
</script>