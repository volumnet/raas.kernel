<style lang="scss" scoped>
.raas-tree__item {
    $self: &;
    display: block;
    padding: 0;
    margin: 0;
    position: relative;
    #{$self} & {
        padding-left: 20px;
    }
}
.raas-tree__children-trigger {
    position: absolute;
    left: 1px;
    // margin-top: 6px;
    top: .5em;
    transform: translateY(-50%);
    size: 10px;
    display: block;
    padding: 0;
    border: none;
    color: #aaa;
    line-height: 1;
    background: transparent;
    border-radius: 2px;
    &:after {
        font-size: 10px;
        @include fa('square-plus');
    }
    &_unfolded {
        &:after {
            @include fa('square-minus');
        }
    }
}
</style>


<template>
  <li :class="liClasses">
    <button 
      v-if="foldable" 
      type="button"
      class="raas-tree__children-trigger" 
      :class="{ 'raas-tree__children-trigger_unfolded': unfolded }" 
      @click="clickFold()"
    ></button>
    <slot v-bind="self"></slot>
  </li>
</template>


<script>
export default {
    props: {
        foldable: {
            type: Boolean,
            default: false,
        },
        /**
         * Активный (развернутый) пункт
         * @type {Object}
         */
        active: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['fold'],
    data() {
        return {
            unfolded: this.active, // Пункт развернут
        };
    },
    methods: {
        /**
         * Клик по плюсу-минусу
         * @return {[type]} [description]
         */
        clickFold() {
            this.unfolded = !this.unfolded;
            this.$emit('fold', this.unfolded);
        },
    },
    computed: {
        /**
         * CSS-класс списка
         * @return {Object}
         */
        liClasses() {
            const result = { 'raas-tree__item': true };
            if (this.unfolded || !this.foldable) {
                result['raas-tree__item_unfolded'] = true;
            }
            return result;
        },
        self() {
            return {
                foldable: this.foldable,
                active: this.active,
                unfolded: this.unfolded,
                clickFold: this.clickFold.bind(this),
                liClasses: this.liClasses,
            };
        },
    },
    watch: {
        active(newValue, oldValue) {
            if (newValue != oldValue) {
                this.unfolded = newValue;
            }
        }
    }
};
</script>