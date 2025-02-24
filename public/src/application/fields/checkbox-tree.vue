<style lang="scss">
.checkbox-tree {
    $self: &;
    &__list {
        $list: &;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        padding-left: 0;
        margin: 0;
        #{$list} & {
            margin-top: 5px;
        }
        #{$self}_flat & {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            column-gap: 1rem;
            row-gap: .5rem;
        }
    }
    &__item {
        #{$self}:not(#{$self}_flat) & {
            padding-left: 20px;
        }
        #{$self}_flat & {
            padding: 0px;
            list-style-type: none;
        }
    }
}
</style>

<template>
  <component :is="isFlat ? 'nav' : 'raas-tree'" class="checkbox-tree" :class="{ 'checkbox-tree_flat': isFlat }">
    <component :is="isFlat ? 'ul' : 'raas-tree-list'" class="checkbox-tree__list">
      <template v-for="option in source">
        <component 
          :is="isFlat ? 'li' : 'raas-tree-item'" 
          class="checkbox-tree__item" 
          :foldable="!!option.children?.length" 
          :active="!!selfOrChildrenChecked[option.value.toString()]"
        >
          <!-- 2024-05-28, AVS: приводим к string, чтобы не было путаницы при различных типах -->
          <label v-if="type == 'checkbox'" @contextmenu.prevent.stop="$emit('update:modelValue', { value: option.value })">
            <raas-field-checkbox 
              @update:model-value="$emit('propagate', { option, checked: !!$event })" 
              ref="field"
              :type="type" 
              :required="!!$attrs.required && !arrayValue.length" 
              :name="/\[/.test(name) ? name : (name + '[]')" 
              :model-value="checkedValues[option.value.toString()] || ''" 
              :defval="option.value"
            ></raas-field-checkbox>
            {{ option.caption }}
          </label>
          <label v-else-if="type == 'radio'">
            <raas-field-radio 
              @update:model-value="$emit('update:modelValue', $event)" 
              :type="type" 
              :name="name" 
              :model-value="modelValue" 
              :defval="option.value" 
              :required="!!$attrs.required && !modelValue"
            ></raas-field-radio>
            {{ option.caption }}
          </label>
          <checkbox-tree 
            v-if="option.children && option.children.length" 
            @update:model-value="$emit('update:modelValue', $event)" 
            @propagate="$emit('propagate', $event)" 
            :is-flat="isFlat"
            :type="type" 
            :name="name" 
            :model-value="modelValue" 
            :defval="defval" 
            :source="option.children"
          ></checkbox-tree>
        </component>
      </template>
    </component>
  </component>
</template>

<script>
import CheckboxTree from 'cms/application/fields/checkbox-tree.vue.js';

export default {
    mixins: [CheckboxTree],
    props: {
        /**
         * Плоский список
         * @type {Object}
         */
        isFlat: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['propagate'],
    methods: {
        /**
         * Получает список для опций, отмечена ли конкретная опция или любая из ее дочерних
         * @param  {Object[]} options Опция
         * @return {Object} Ассоциативный массив 
         *     <pre><code>array<string[] Значение в текстовом виде => bool></code></pre>
         */
        hasSelfOrChildrenChecked(options)
        {
            let result = {};
            for (let option of options) {
                let optionChildren = {};
                if (option.children) {
                    optionChildren = this.hasSelfOrChildrenChecked(option.children);
                    result = { ...result, ...optionChildren };
                }
                if (Object.values(optionChildren).filter(x => !!x).length || 
                    this.arrayValue.map(x => x.toString()).indexOf(option.value.toString()) != -1
                ) {
                    result[option.value.toString()] = true;
                }
            }
            // console.log(result)
            return result;
        },
    },
    computed: {
        selfOrChildrenChecked() {
            return this.hasSelfOrChildrenChecked(this.source);
        },
    }
}
</script>