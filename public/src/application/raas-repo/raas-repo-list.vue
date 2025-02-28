<style lang="scss">
.raas-repo-list {
    $self: &;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .5rem;
    &__item {
        @include smartprops((
            width: (
                '': 100%,
                ($self + '_horizontal &'): auto,
            ),
        ));
    }
}
</style>

<template>
  <div class="raas-repo-list" :class="{ 'raas-repo-list_horizontal': horizontal }">
    <raas-repo-item 
      class="raas-repo-list__item" 
      v-for="(item, index) in modelValue" 
      :key="sortable ? (item.id + '_' + sortCounter) : item.id"
      :draggable="sortable" 
      :removable="removable" 
      :model-value="item.value" 
      @update:model-value="$emit('update:modelValue', { target: item, value: $event})" 
      @delete="$emit('delete', item)"
      v-slot="slotProps"
    >
      <slot 
        :model-value="slotProps.modelValue" 
        :emit="slotProps.emit" 
        :index="index" 
        :id="sortable ? (item.id + '_' + sortCounter) : item.id"
      ></slot>
    </raas-repo-item>
  </div>
</template>

<script>
import 'jquery-ui/ui/widgets/sortable.js'; // Требуется для нормальной работы сортировки
import RepoList from 'cms/application/raas-repo/raas-repo-list.vue.js';
import RepoItem from './raas-repo-item.vue';

export default {
    mixins: [RepoList],
    components: { 'raas-repo-item': RepoItem },
};
</script>