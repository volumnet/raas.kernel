<style lang="scss" scoped>
@use 'cms/_shared/mixins/filetype.scss' as *;

.thumbnails-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px;
    min-height: 40px;
    background-color: var(--gray-f);
    border: 1px solid var(--gray-e);
    border-radius: var(--border-radius-sm);
    box-shadow: inset 0 1px 1px rgba(black, .05);
    transition: all .25s;
    width: relMin(120px, $min: 85px);
    &__delete {
        @include center-alignment(40px, 32px);
        text-decoration: none !important;
        position: absolute;
        top: 0;
        right: 0;
        color: var(--danger);
        background: transparent;
        border: none;
        padding: 0;
        transition: all .25s;
        opacity: 0.5;
        cursor: pointer;
        &:hover {
            opacity: 1;
            text-shadow: 0 0 2px white;
        }
        &:after {
            content: '×';
            font-weight: bold;
        }
    }
    &__title {
        font-size: relMin(10px, $min: 8px);
        color: var(--gray-8);
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    &__image {
        $image: &;
        display: block;
        width: 100%;
        aspect-ratio: 1/1;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
        &_file {
            background: white;
            border: 1px solid var(--gray-d);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-a);
            font-size: 24px;
            transition: all .25s;
            @include filetype();
            &:before {
                @include fa('file');
            }
        }
        img {
            display: block;
            size: 100%;
            object-fit: cover;
        }
    }
}
</style>


<template>
  <div class="thumbnails-item">
    <a :href="item.fileURL" target="_blank" :class="imageCSSClass">
      <img v-if="item.tnURL" :src="item.tnURL" alt="">
    </a>
    <div class="thumbnails-item__title" :title="item.filename">
      {{ item.filename }}
    </div>
    <a
      class="thumbnails-item__delete" 
      :href="realDeleteUrl" 
      :onclick="'return confirm(\'' + $root.translations[item.tnURL ? 'DELETE_IMAGE_TEXT' : 'DELETE_FILE_TEXT'] + '\')'"
      :title="$root.translations.DELETE"
    ></a>
  </div>
</template>


<script>
export default {
    props: {
        /**
         * Элемент
         * @type {Object[]} <pre><code>{
         *     id: Number ID# вложения,
         *     fileURL: String Путь к файлу,
         *     filename: String Оригинальное название файла
         *     tnURL?: String Путь к эскизу
         * }</code></pre>
         */
        item: {
            type: Object,
            required: true,
        },
        /**
         * URL удаления вложения
         * @type {String}
         */
        deleteUrl: {
            type: String,
            required: false,
        }
    },
    data() {
        return {

        };
    },
    mounted() {

    },
    methods: {
        /**
         * Получает расширение для файла в нижнем регистре
         * @param  {String} filename Имя (или путь) файла
         * @return {String}
         */
        getExtension(filename) {
            const fileChunks = filename.split('.');
            const ext = ((fileChunks.length > 1) ? fileChunks[fileChunks.length - 1] : '').toLowerCase();
            return ext;
        },
    },

    computed: {
        /**
         * CSS классы иконки по расширению файла (включая основной класс и отсутствие файла)
         * @return {Object}
         */
        imageCSSClass() {
            const result = { 'thumbnails-item__image': true };
            if (this.item.tnURL) {
                result['thumbnails-item__image_image'] = true;
            } else {
                result['thumbnails-item__image_file'] = true;
                result['thumbnails-item__image_file_' + this.getExtension(this.item.fileURL)] = true;
            }
            return result;
        },
        /**
         * Реальный путь для удаления
         * @return {String}
         */
        realDeleteUrl() {
            let result = this.deleteUrl;
            result = result.replace('%s', this.item.id);
            result = result.replace('%d', this.item.id);
            return result;
        }
    }

};
</script>