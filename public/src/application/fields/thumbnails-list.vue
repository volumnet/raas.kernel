<style lang="scss">
.thumbnails-list {
    display: flex;
    flex-wrap: wrap;
    gap: #{relMin(2rem, 1rem)};
    &:not(:last-child) {
        margin-bottom: 1rem;
    }
}
</style>


<template>
  <div class="thumbnails-list">
    <thumbnails-item class="thumbnails-list__item" v-for="item of items" :item="item" :delete-url="deleteUrl" />
  </div>
</template>


<script>
export default {
    props: {
        /**
         * Элементы для отображения
         * @type {Object[]} <pre><code>array<{
         *     id: Number ID# вложения,
         *     fileURL: String Путь к файлу,
         *     tnURL?: String Путь к эскизу
         * }></code></pre>
         */
        items: {
            type: Array,
            default() {
                return [];
            },
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
};
</script>