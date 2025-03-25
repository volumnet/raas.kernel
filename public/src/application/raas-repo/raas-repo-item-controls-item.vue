<style lang="scss">
.raas-repo-item-controls-item {
    @include center-alignment(16px, 14px);
    padding: 0 !important;
    border: none !important;
    cursor: pointer;
    text-decoration: none !important;
    &_drag {
        cursor: ns-resize;
        &:after {
            @include fa('arrows-up-down');
        }
        .raas-repo-list_horizontal & {
            cursor: move;
            &:after {
                @include fa('arrows-up-down-left-right');
            }
        }
    }
    &_delete:after {
        @include fa('times');
    }
}
</style>

<template>
  <div v-if="type == 'drag'" class="btn-link" :class="cssClass"></div>
  <button v-else type="button" class="btn-link" :class="cssClass" @click="$emit('click', $event)"></button>
</template>

<script>
import RepoItemControlsItem from 'cms/application/raas-repo/raas-repo-item-controls-item.vue.js';

export default {
    mixins: [RepoItemControlsItem],
    computed: {
        /**
         * Маппинг CSS-класса элемента
         * @return {Object}
         */
        cssClass: function () {
            let result = { 'raas-repo-item-controls-item': true };
            if (this.type) {
                result['raas-repo-item-controls-item_' + this.type] = true;
            }
            return result;
        }
    }
};
</script>