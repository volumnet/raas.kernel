<template>
  <select v-bind="$attrs" v-on="inputListeners" :multiple="multiple" :data-value="value">
    <option v-if="!multiple && placeholder" value="" :selected="!value">
      {{placeholder}}
    </option>
    <option 
      :value="option.value" 
      v-for="option in flatSource" 
      :selected="multiple ? ((value || []).indexOf(option.value) != -1) : (option.value == value)" 
      :disabled="option.disabled"
    >
      <template v-for="n in option.level">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </template>
      {{option.caption}}
    </option>
  </select>

</template>

<script>
import RAASFieldSelect from 'cms/application/fields/raas-field-select.vue.js';

export default {
    mixins: [RAASFieldSelect],
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
        checkMultiselect: function () {
        },
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