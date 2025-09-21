<template>
  <select 
    v-bind="$attrs" 
    :multiple="multiple" 
    class="form-control raas-field-select" 
    :data-value="pValue" 
    @change="$emit('update:modelValue', pValue = $event.target.value)"
  >
    <!-- 2025-03-12, AVS: placeholder не устанавливаем здесь, т.к. явно установлен в field.inc.php -->
    <!-- <option v-if="!multiple && placeholder" value="" :selected="!modelValue">
      {{placeholder}}
    </option> -->
    <option 
      :value="option.value" 
      v-for="option in flatSource" 
      :selected="multiple ? ((pValue || []).indexOf(option.value) != -1) : (option.value == pValue)" 
      :disabled="option.disabled"
      :style="option.style"
      v-bind="getDataAttrs(option)"
    >
      <template v-for="n in option.level">
        &nbsp;&nbsp;&nbsp;
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
    data() {
        return {
            pSource: this.source,
        };
    },
    mounted() {
        // Совместимость с RAAS_fillSelect
        $(this.$el).on('raas.fill-select', (e, data) => {
            if (data.source) {
                this.pSource = data.source;
            }
            if (data.value !== undefined) {
                this.pValue = data.value;
                this.$emit('update:modelValue', this.pValue);
            }
        });
    },
    methods: {
        checkMultiselect() {
        },
        getFlatSource(source, level = 0) {
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
        getDataAttrs(option) {
            return Object
              .keys(option)
              .filter(key => /^data-/.test(key))
              .reduce((acc, key) => { 
                acc[key] = option[key];
                return acc;
              }, {});
        },
    },
    computed: {
        flatSource() {
            let source = this.pSource;
            if (!(source instanceof Array)) {
                source = [];
            }
            return this.getFlatSource(source);
        },
    },
    watch: {
        source(newValue, oldValue) {
            if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
                this.pSource = newValue;
            }
        }
    },
}
</script>