<template>
  <tbody class="raas-repo-table-list">
    <raas-repo-table-item 
      class="raas-repo-table-list__item" 
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
    </raas-repo-table-item>
  </tbody>
</template>

<script>
import 'jquery-ui/ui/widgets/sortable.js'; // Требуется для нормальной работы сортировки
import RepoList from 'cms/application/raas-repo/raas-repo-list.vue.js';

export default {
    mixins: [RepoList],
};
</script>