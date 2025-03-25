<style lang="scss">
.raas-repo-item {
    $self: &;

    display: flex;
    align-items: center;
    gap: .25rem;
    position: relative;
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
        .raas-repo-list_horizontal & {
            position: absolute;
            right: 0;
            top: 0;
            padding: 5px;
            opacity: 0.5;
            background: transparent;
            transition: all .25s;
        }
        .raas-repo-list_horizontal #{$self}:hover & {
            opacity: 1;
            background: white;
        }
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

export default {
    mixins: [RepoItem],
};
</script>