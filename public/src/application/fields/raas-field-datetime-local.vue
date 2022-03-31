<template>
  <input type="datetime-local" v-bind="$attrs" :value="pValue" v-on="inputListeners" class="form-control">
</template>

<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';

export default {
    mixins: [RAASField],
}
</script>