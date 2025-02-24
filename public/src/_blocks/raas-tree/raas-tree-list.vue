<style lang="scss" scoped>
.raas-tree__list {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    .raas-tree__item:not(.raas-tree__item_unfolded) & {
        display: none;
    }
}
</style>


<template>
  <ul class="raas-tree__list" data-role="raas-tree">
    <slot></slot>
  </ul>
</template>


<script>
export default {
};
</script>