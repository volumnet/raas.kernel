<style lang="scss">
.raas-repo-item {
    display: flex;
    align-items: center;
    gap: .25rem;
    @include viewport('<xs') {
        flex-direction: column;
        align-items: flex-start;
    }
    .control-group_full & {
        flex-direction: column;
        align-items: flex-start;
    }
    &__controls {
        flex-shrink: 0;
    }
    &__inner {
        max-width: 100%;
        &:has(.raas-field-ajax) {
            width: 100%; // Костыль, чтобы автокомплит был на полную строку
        }
        @include viewport('<xs') {
            width: 100%;
        }
    }
}
</style>

<template>
  <div class="raas-repo-item">
    <div class="raas-repo-item__inner" ref="inputContainer">
      <slot :model-value="modelValue" :emit="slotEmit"></slot>
    </div>
    <div class="raas-repo-item__controls" v-if="draggable || removable">
      <raas-repo-item-controls-list 
        :draggable="draggable" 
        :removable="removable" 
        @delete="$emit('delete', $event)"
      ></raas-repo-item-controls-list>
    </div>
  </div>
</template>

<script>
import RepoItem from 'cms/application/raas-repo/raas-repo-item.vue.js';
import RepoItemControlsList from './raas-repo-item-controls-list.vue';

export default {
    mixins: [RepoItem],
    components: { 'raas-repo-item-controls-list': RepoItemControlsList },
};
</script>