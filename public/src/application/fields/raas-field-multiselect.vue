<style lang="scss" scoped>
.raas-field-multiselect {
    $self: &;

    position: relative;
    &__button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        max-width: 220px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:after {
            @include fa('caret-down');
            font-size: 10px;
        }
    }
    &__select {
        position: absolute;
        top: 100%;
        left: 0;
        border-radius: 0;
        outline: none !important;
        overflow: auto;
        height: auto;
        min-height: 100px;
        max-height: 300px;
        visibility: hidden;
        pointer-events: none;
        #{$self}_active & {
            visibility: visible;
            pointer-events: all;
            z-index: 1;
        }
    }
}
</style>

<template>
  <div class="raas-field-multiselect" :class="{ 'raas-field-multiselect_active': active }">
    <button type="button" class="btn btn-default raas-field-multiselect__button" @click="active = !active">
      {{ buttonTitle.trim() || ' ' }}
    </button>
    <select 
      v-bind="$attrs" 
      multiple 
      class="raas-field-multiselect__select" 
      :data-value="pValue" 
      @change="$emit('update:modelValue', pValue = Array.from($event.target.options).filter(opt => !!opt.selected).map(opt => opt.value));"
    >
      <option 
        :value="option.value" 
        v-for="option in flatSource" 
        :selected="((pValue || []).map(x => x.toString()).indexOf(option.value.toString()) != -1)" 
        :disabled="option.disabled"
        :data-group="option['data-group']"
        :style="option.style"
      >
        <template v-for="n in option.level">
          &nbsp;&nbsp;&nbsp;
        </template>
        {{option.caption}}
      </option>
    </select>
  </div>
</template>

<script>
import RAASFieldSelect from './raas-field-select.vue';

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
            active: false,
        };
    },
    mounted() {
        $('body').on('click', () => {
            this.active = false;
        });
        $(this.$el).on('click', (e) => {
            e.stopPropagation();
        })
    },
    computed: {
        buttonTitle() {
            let selectedValues = this.flatSource.filter((item) => {
                return (this.pValue || []).map(x => (x + '').trim()).indexOf((item.value + '').trim()) !== -1;
            });
            if (selectedValues.length) {
                return selectedValues.map(x => x.caption).join(', ');
            } else if (this.$attrs.placeholder) {
                return this.$attrs.placeholder;
            } else {
                return '--';
            }
        },
    },
}
</script>