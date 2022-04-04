<template>
  <select v-bind="$attrs" v-on="inputListeners" :value="pValue">
    <option v-if="placeholder" value="">
      {{placeholder}}
    </option>
    <option :value="option.value" v-bind="option" v-for="option in flatSource">
      <template v-for="n in option.level">
        &nbsp;&nbsp;&nbsp;
      </template>
      {{option.caption}}
    </option>
  </select>
</template>

<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';

export default {
    mixins: [RAASField],
    props: {
        /**
         * Подсказка
         * @type {String|null}
         */
        placeholder: {
            type: String,
            required: false,
        },
    },
    methods: {
        getFlatSource: function (source, level = 0) {
            let result = [];
            for (let option of source) {
                let newOption = JSON.parse(JSON.stringify(option));
                delete newOption.children;
                newOption.level = level;
                result.push(newOption);
                if (option.children) {
                    result = result.concat(this.getFlatSource(option.children, level + 1));
                }
            }
            return result;
        },
    },



}
</script>