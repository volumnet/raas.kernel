<template>
  <checkbox-tree
    v-if="multiple"
    v-bind="$attrs"
    class="checkbox-tree checkbox-tree_checkbox"
    :flat-max-counter="flatMaxCounter"
    :is-flat="!multilevel"
    :data-options-counter="flatSource.length"
    :type="type"
    :name="name"
    :model-value="pValue"
    :defval="defval"
    :source="source"
    @update:model-value="toggleOption($event)"
    @propagate="propagate($event)"
  ></checkbox-tree>
  <span
    v-else
    class="raas-field-checkbox"
    :class="{ 'raas-field-checkbox_active': !!checked }"
  >
    <input
      type="checkbox"
      v-bind="$attrs"
      :name="name"
      :value="defval"
      :checked="checked"
      @click="toggleCheckbox()"
    />
    <input
      type="hidden"
      :name="name"
      v-if="mask !== null && !checked"
      :value="mask"
      :form="$attrs.form"
    />
  </span>
</template>

<script>
import RAASFieldCheckbox from "cms/application/fields/raas-field-checkbox.vue.js";

export default {
  mixins: [RAASFieldCheckbox],
  mounted() {
    // console.log(this.name, this.multiple)
  },
  methods: {
    /**
     * Получает список текущего и всех дочерних значений опции
     * @param  {Object[]} options Опция
     * @return {Object} Ассоциативный массив
     *     <pre><code>array<string[] Значение в текстовом виде => mixed Значение></code></pre>
     */
    getSelfAndChildrenValues(options) {
      let result = {};
      let ch = [];
      for (let option of options) {
        result[option.value.toString()] = option.value;
        if (option.children) {
          const optionChildren = option.children.filter(
            (child) =>
              !option["data-group"] ||
              child["data-group"].toString() == option["data-group"].toString()
          );
          if (optionChildren.length) {
            ch = ch.concat(optionChildren);
          }
        }
      }
      if (ch.length) {
        result = { ...result, ...this.getSelfAndChildrenValues(ch) };
      }
      return result;
    },
    /**
     * Переключение опции и всех дочерних
     * @param {Object} $event <pre><code>{
     *     option: Опция,
     *     checked: Boolean Установлено ли значение
     * }</code></pre>
     */
    propagate($event) {
      const valuesToToggle = this.getSelfAndChildrenValues([$event.option]);

      let newValue = JSON.parse(JSON.stringify(this.pValue));

      if ($event.checked) {
        newValue = newValue.concat(Object.values(valuesToToggle));
      } else {
        newValue = newValue.filter(
          (x) => Object.keys(valuesToToggle).indexOf(x.toString()) == -1
        );
      }
      newValue = newValue.filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
      this.pValue = newValue;
      this.$emit("update:modelValue", newValue);
    },
    console(x) {
      console.log(x);
    },
  },
};
</script>
