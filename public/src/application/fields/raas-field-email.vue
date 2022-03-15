<template>
  <input type="text" data-type="email" v-bind="$attrs" v-on="inputListeners" :pattern="pattern" :value="pValue" @input="pValue = $event.target.value">
</template>

<script>
import RAASFieldEmail from 'cms/application/fields/raas-field-email.vue.js';
export default {
    mixins: [RAASFieldEmail],
}
</script>