<style lang="scss">
.raas-repo-table {
    $self: &;
    td, th {
        #{$self}_align-left & {
            white-space: nowrap;
        }
    }
    &__add {
        &:before {
            @include fa('plus');
            margin-right: 5px;
        }
    }
    &__controls {
        #{$self}_align-left & {
            width: 100%;
        }
    }
}
</style>

<template>
  <table class="raas-repo-table" :class="{ 'raas-repo-table_align-left': alignLeft }">
    <thead v-if="(columns && columns.length) || $slots.header">
      <slot name="header">
        <tr>
          <th v-for="column in columns">
            {{ column }}
          </th>
          <th class="raas-repo-table__controls"></th>
        </tr>
      </slot>
    </thead>
    <raas-repo-table-list 
      class="raas-repo-table__list" 
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
    </raas-repo-table-list>
    <tfoot v-if="insertable" class="raas-repo-table__controls">
      <tr>
        <td :colspan="realColumnsCounter + 1">
          <button type="button" class="btn btn-small raas-repo-table__add" @click="addItem()">{{ $root.translations.ADD }}</button>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import Repo from 'cms/application/raas-repo/raas-repo.vue.js';

export default {
    mixins: [Repo],
    props: {
        /**
         * Список заголовков
         * @type {String[]}
         */
        columns: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * Количество колонок (в случае отсутствия заголовков)
         * @type {Number}
         */
        columnsCounter: {
            type: Number,
        },
        /**
         * Выравнивать колонки по левому краю (максимально увеличить controls)
         * @type {Boolean}
         */
        alignLeft: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            realColumnsCounter: this.columns.length || this.columnsCounter || Object.keys(this.defval).length || 1,
        };
    },
};
</script>