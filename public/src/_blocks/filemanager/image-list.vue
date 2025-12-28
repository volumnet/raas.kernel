<style lang="scss" scoped>
.image-list {
  display: grid;
  width: 100%;
  font-size: relMin(14px, $min: 12px);
  @include viewport-props(
    (
      --items-in-row: (
        ">lg": 5,
        "md": 4,
        "<sm": 3,
      ),
    )
  );
  grid-template-columns: repeat(var(--items-in-row), minmax(0, 1fr));
  &__item {
    overflow: hidden;
  }
}
</style>

<template>
  <div class="image-list">
    <template v-for="(item, index) in items" :key="item.path">
      <image-item
        :item="item"
        :selected="selection.includes(item.path)"
        @select="$emit('select', [item.path, $event])"
        @open="$emit('open', item.path)"
      />
    </template>
  </div>
</template>

<script>
import EntryList from "./entry-list.vue";
import ImageItem from "./image-item.vue";

export default {
  mixins: [EntryList],
  components: {
    "image-item": ImageItem,
  },
};
</script>
