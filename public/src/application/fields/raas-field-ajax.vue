<style lang="scss">
.raas-field-ajax {
    $self: &;
    position: relative;
    width: 100%;
    &__input-container {
        display: inline-block;
        position: relative;
        #{$self}_busy &:after {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            right: 0;
            top: 0;
            width: 30px;
            height: 30px;
            @include fa('spinner');
            animation: var(--rotate);
        }
    }
    &__delete {
        @include center-alignment(14px, 14px);
        padding: 0 !important;
        border: none !important;
        text-decoration: none !important;
        &:after {
            @include fa('close');
        }
    }
    &__entity, &__autocomplete-item {
        display: flex;
        align-items: center;
        gap: 10px;
        &-image {
            flex-shrink: 0;
            size: 32px;
        }
        &-text {
            display: flex;
            flex-direction: column;
        }
        &-title {
            font-size: 12px;
        }
        &-description {
            font-size: 10px;
            color: silver;
        }
    }
    &__autocomplete-item {
        align-items: flex-start;
    }
    &__entity {
        $material: &;
        justify-content: space-between;
        &-link {
            display: flex;
            gap: 1rem;
            text-decoration: none !important;
        }
        &-title {
            #{$material}-link:hover & {
                text-decoration: underline;
            }
        }
    }
    &__autocomplete {
        position: absolute;
        z-index: 3;
        width: 100%;
        max-height: 200px;
        inset: 100% 0 auto;
        overflow: auto;
        background: white;
        box-shadow: 0 .5rem 1rem rgba(black, .25);
        display: block;
        padding: 0;
        margin: 0;
        &-item {
            cursor: pointer;
            padding: 8px 16px;
            &:not(:last-child) {
                border-bottom: 1px solid #ddd;
            }
            &:hover, &:focus, &:focus-visible {
                background: #eee;
                text-decoration: none;
            }
        }
    }

}
</style>


<template>
  <div class="raas-field-ajax" :class="{ 'raas-field-ajax_busy': busy }">
    <input type="hidden" :name="name" :value="(pValue && pValue.id) || 0">
    <div v-if="pValue && pValue.id" class="raas-field-ajax__entity">
      <a 
        :href=" pValue.url" 
        class="raas-field-ajax__entity-link" 
        target="_blank"
      >
        <img :src="pValue.img" class="raas-field-ajax__entity-image">
        <span class="raas-field-ajax__entity-text">
          <span class="raas-field-ajax__entity-title">
            {{ pValue.name }}
          </span>
          <span class="raas-field-ajax__entity-description">
            {{ pValue.description }}
          </span>
        </span>
      </a>
      <button v-if="!multiple" type="button" class="btn btn-link raas-field-ajax__delete" @click="clearSearchString()"></button>
    </div>
    <template v-else>
      <div class="raas-field-ajax__input-container">
        <input 
          type="text" 
          class="raas-field-ajax__input"
          :value="searchString" 
          :placeholder="$attrs.placeholder" 
          @input="searchString = $event.target.value"
        >
      </div>
      <ul class="raas-field-ajax__autocomplete" v-if="autocomplete">
        <li 
          v-for="autocompleteItem in autocomplete" 
          class="raas-field-ajax__autocomplete-item" 
          @click="selectItem(autocompleteItem)"
        >
          <img :src="autocompleteItem.img" class="raas-field-ajax__autocomplete-item-image">
          <span class="raas-field-ajax__autocomplete-item-text">
            <span class="raas-field-ajax__autocomplete-item-title">
              {{ autocompleteItem.name }}
            </span>
            <span class="raas-field-ajax__autocomplete-item-description">
              {{ autocompleteItem.description }}
            </span>
          </span>
        </li>
      </ul>
    </template>

  </div>
</template>


<script>
import RAASField from 'cms/application/fields/raas-field.vue.js';

export default {
    mixins: [RAASField],
    props: {
        /**
         * Наименование поля
         * @type {String}
         */
        name: {
            type: String,
        },
        /**
         * Множественное поле (убирает возможность очистки)
         * @type {Boolean}
         */
        multiple: {
            type: Boolean,
            default: false,
        },
        /**
         * URL для автоподстановок (после него идет значение поиска)
         * @type {String}
         */
        autocompleteUrl: {
            type: String,
            default: '',
        },
        /**
         * Минимальная длина поисковой строки для автозаполнения
         * @type {Number}
         */
        minLength: {
            type: Number,
            default: 3
        },
        /**
         * Интервал после ввода поисковой строки до инициализации автозаполнения
         * @type {Number}
         */
        showInterval: {
            type: Number,
            default: 1000,
        },
    },
    emits: ['autocomplete'],
    data() {
        return {
            /**
             * Активность формы по кнопке
             * @type {Boolean}
             */
            active: false,
            /**
             * Поисковая строка для автозаполнения
             * @type {String}
             */
            searchString: '',
            /**
             * Происходит ли в данный момент автозаполнение
             * @type {Boolean}
             */
            busy: false,
            /**
             * Результат автозаполнения
             * @type {Object|null}
             */
            autocomplete: null,
            /**
             * ID# таймаута автозаполнения
             * @type {Number|null}
             */
            timeoutId: null,

        };
    },
    mounted() {
        $('body').on('click', () => {
            this.autocomplete = null;
        });
        $(this.$el).on('click', e => e.stopPropagation());
    },
    methods: {
        /**
         * Событие при изменении текста
         * @param {String} value Новое значение поисковой строки
         */
        change(value) {
            window.clearTimeout(this.timeoutId);
            if ((value.length >= this.minLength) && this.autocompleteUrl) {
                const url = this.autocompleteUrl + value;
                this.timeoutId = window.setTimeout(async () => { 
                    this.busy = true;
                    this.autocomplete = null;
                    const data = await this.$root.api(url);
                    this.busy = false;
                    this.autocomplete = data.Set;
                    this.$emit('autocomplete', data.Set);
                }, this.showInterval);
            }
        },
        /**
         * Очищает значение поиска
         */
        clearSearchString() {
            this.pValue = {};
            this.$emit('update:modelValue', this.pValue); 
        },
        /**
         * Выбирает элемент автозаполнения
         * @param  {Object} item
         */
        selectItem(item) {
            this.pValue = JSON.parse(JSON.stringify(item));
            this.$emit('update:modelValue', this.pValue); 
            this.searchString = ''; 
            this.autocomplete = null;
        },
    },
    watch: {
        searchString(newVal, oldVal) {
            if (newVal != oldVal) {
                this.change(newVal);
            }
        },
    }
};
</script>