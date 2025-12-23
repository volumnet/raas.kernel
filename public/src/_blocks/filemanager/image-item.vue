<style lang="scss" scoped>
.image-item {
  $self: &;

  cursor: pointer;
  padding: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: center;
  &:not(#{$self}_selected):hover {
    @include viewport(">lg") {
      background-color: var(--hover-color) !important;
    }
  }
  &_selected {
    background-color: var(--selected-color);
  }
  &__image {
    width: 100%;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    img {
      max-width: 100%;
      max-height: 100%;
      aspect-ratio: 1/1;
      object-fit: contain;
    }
    &:not(:has(img)) {
      &:before {
        @include fa("file");
        color: var(--gray-c);
        font-size: 64px;
      }
      #{$self}_folder &:before {
        @include fa("folder");
        color: var(--folder-color);
      }
    }
  }
  &__title {
    margin-top: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    #{$self}_folder & {
      font-weight: bold;
    }
  }
  &__description {
    color: var(--gray-8);
    font-size: 12px;
  }
}
</style>

<template>
  <div
    :class="className"
    :title="item.name"
    @click="handleSelect($event)"
    @dblclick="$emit('open')"
  >
    <div class="image-item__image">
      <img v-if="isImage" ref="image" :src="item.url" loading="lazy" />
    </div>

    <div class="image-item__title">
      {{ item.name }}
    </div>
    <div v-if="item.type == 'file'" class="image-item__description">
      <div>{{ formatNumber(item.size) }} Б</div>
      <div v-if="width && height">{{ width }}x{{ height }}</div>
    </div>
  </div>
</template>

<script>
import EntryItem from "./entry-item.vue";
export default {
  mixins: [EntryItem],
  data() {
    return {
      width: null,
      height: null,
    };
  },
  mounted() {
    if (this.$refs.image) {
      const img = this.$refs.image;
      $(img).on("load", () => {
        if (img.naturalWidth) {
          this.width = img.naturalWidth;
        }
        if (img.naturalHeight) {
          this.height = img.naturalHeight;
        }
      });
      if (img.naturalWidth) {
        this.width = img.naturalWidth;
      }
      if (img.naturalHeight) {
        this.height = img.naturalHeight;
      }
    }
  },
  computed: {
    /**
     * CSS-класс
     * @return {Object}
     */
    className() {
      const result = { "image-item": true };
      if (this.item.type == "dir") {
        result["image-item_folder"] = true;
      } else {
        result["image-item_file"] = true;
      }
      if (this.selected) {
        result["image-item_selected"] = true;
      }
      return result;
    },
  },
};
</script>
