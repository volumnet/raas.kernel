<style lang="scss">
.raas-repo-item-controls-list {
    display: flex;
    align-items: center;
    &__item {
        flex-shrink: 0;
    }
}
</style>

<template>
  <div class="raas-repo-item-controls-list">
    <div class="raas-repo-item-controls-list__item" v-if="removable">
      <raas-repo-item-controls-item type="delete" @click="$emit('delete', $event)"></raas-repo-item-controls-item>
    </div>
    <div class="raas-repo-item-controls-list__item" v-if="draggable">
      <raas-repo-item-controls-item type="drag"></raas-repo-item-controls-item>
    </div>
  </div>
</template>

<script>
import RepoItemControlsList from 'cms/application/raas-repo/raas-repo-item-controls-list.vue.js';

export default {
    mixins: [RepoItemControlsList],
};
</script>