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
      <raas-repo-controls-item type="delete" @click="$emit('delete', $event)"></raas-repo-controls-item>
    </div>
    <div class="raas-repo-item-controls-list__item" v-if="draggable">
      <raas-repo-controls-item type="drag"></raas-repo-controls-item>
    </div>
  </div>
</template>

<script>
import RepoItemControlsList from 'cms/application/raas-repo/raas-repo-item-controls-list.vue.js';
import RepoItemControlsItem from './raas-repo-item-controls-item.vue';

export default {
    mixins: [RepoItemControlsList],
    components: { 'raas-repo-controls-item': RepoItemControlsItem },
};
</script>