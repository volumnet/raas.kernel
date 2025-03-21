<template>
  <input type="file" v-bind="$attrs" :accept="accept">
</template>

<script>
import RAASFieldFile from 'cms/application/fields/raas-field-file.vue.js';
export default {
    mixins: [RAASFieldFile],
}
</script>