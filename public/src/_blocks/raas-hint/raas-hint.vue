<style lang="scss">
.raas-hint {
    &__inner {
        display: none;
    }
}
</style>

<template>
  <button type="button" class="raas-hint btn btn-small" data-html="true" rel="popover">
    <raas-icon icon="circle-question"></raas-icon>
    <div v-if="!loaded" class="raas-hint__inner" ref="slotContainer">
      <slot></slot>
    </div>
  </button>
</template>


<script>
export default {
    props: {
        /**
         * Текст подсказки
         * @type {Object}
         */
        title: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            loaded: false,
        };
    },
    mounted() {
        $(this.$el).popover({ content: $(this.$refs.slotContainer).html() });
        this.loaded = true;
        $('body').on('click', () => {
            $(this.$el).popover('hide');
        });
    },
};
</script>