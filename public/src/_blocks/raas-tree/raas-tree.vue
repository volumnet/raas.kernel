<template>
  <nav class="raas-tree">
    <slot v-bind="self"></slot>
  </nav>
</template>


<script>
export default {
    computed: {
        self() {
            return {...this};
        },
    },
};
</script>