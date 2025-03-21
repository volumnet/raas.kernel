<style lang="scss">
.raas-repo-table-item {
    td {
        vertical-align: middle;
        input, select, textarea {
            margin-bottom: 0;
        }
    }
    // display: flex;
    // align-items: center;
    // gap: .25rem;
    // @include viewport('<xs') {
    //     flex-direction: column;
    //     align-items: flex-start;
    // }
    // .control-group_full & {
    //     flex-direction: column;
    //     align-items: flex-start;
    // }
    &__controls {
        width: 2rem;
    }
    // &__inner {
    //     max-width: 100%;
    //     &:has(.raas-field-ajax) {
    //         width: 100%; // Костыль, чтобы автокомплит был на полную строку
    //     }
    //     @include viewport('<xs') {
    //         width: 100%;
    //     }
    // }
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