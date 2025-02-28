<style lang="scss">
.raas-repo {
    display: block;
    &__controls {
        margin-top: .5rem;
    }
    &__add {
        @include center-alignment(14px, 14px);
        padding: 0 !important;
        border: none !important;
        text-decoration: none !important;
        &:after {
            @include fa('plus');
        }
    }
}
</style>

<template>
  <div class="raas-repo">
    <raas-repo-list 
      class="raas-repo__list" 
      :horizontal="horizontal" 
      :sortable="sortable && (items.length > 1)" 
      :required="required" 
      :model-value="items" 
      @update:model-value="changeItem($event);"
      @sort="sortable && sort($event)" 
      @delete="deleteItem($event);" 
      v-slot="slotProps"
    >
      <slot :model-value="slotProps.modelValue" :emit="slotProps.emit" :index="slotProps.index" :id="slotProps.id"></slot>
    </raas-repo-list>
    <div v-if="insertable" class="raas-repo__controls">
      <button type="button" class="btn-link raas-repo__add" @click="addItem()"></button>
    </div>
  </div>
</template>

<script>
import Repo from 'cms/application/raas-repo/raas-repo.vue.js';
import RepoList from './raas-repo-list.vue';

export default {
    mixins: [Repo],
    components: { 'raas-repo-list': RepoList },
};
</script>