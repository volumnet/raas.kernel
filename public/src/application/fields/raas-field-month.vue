<template>
  <input type="month" v-bind="$attrs" :value="pValue" class="form-control raas-field-month__input">
</template>

<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';

export default {
    mixins: [RAASField],
}
</script>