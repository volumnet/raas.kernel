<template>
  <div class="progress">
    <div class="bar" :style="{ width: value + '%' }">
      {{ value ? value + "%" : "" }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * Значение, %%
     * @type {number}
     */
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>
