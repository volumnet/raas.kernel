<style lang="scss">
.raas-field-image {
    $field: &;
    position: relative;
    // margin-bottom 0
    @include size(120px, 80px);
    overflow: hidden;
    border: 1px solid #ddd;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    background: white;
    background-position: 50% 50%;
    &_active {
        & #{$field}__image {
            background-size: cover;
        }
        &:after {
            display: none;
        }
    }
    &:hover {
        & #{$field}__delete {
            display: block;
        }
    }
    &:after {
        @include fa('camera');
        color: silver;
    }
    &__image {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0;
    }
    &__delete {
        position: absolute;
        @include center-alignment(24px, 24px);
        line-height: 24px;
        top: 0px;
        right: 0px;
        cursor: pointer;
        display: none;
        color: silver;
        &, &:hover, &:focus {
            color: $danger;
            text-shadow: 0px 0px 4px rgba(white, .5);
            text-decoration: none;
        }
        &:after {
            content: '×';
        }
    }
}
</style>

<template>
  <div class="raas-field-image" :class="{ 'raas-field-image_active': !!fileName }">
    <input type="file" v-bind="$attrs" :accept="accept" ref="input" v-on="inputListeners" @change="changeFile($event)" style="opacity: 0; pointer-events: none; position: absolute;">
    <div class="raas-field-image__image" @click="chooseFile()" :title="fileName" :style="{ 'background-image': (fileName ? ('url(' + file + ')') : '') }"></div>
    <a class="raas-field-image__delete" v-if="fileName" @click.stop="clearFile()"></a>
  </div>
</template>

<script>
import RAASFieldImage from 'cms/application/fields/raas-field-image.vue.js';
export default {
    mixins: [RAASFieldImage],
}
</script>