<style lang="scss">
@import 'bootstrap/scss/forms/_input-group.scss';

.raas-field-file {
    position: relative;
    &__input {
        display: flex !important;
        align-items: center;
        position: relative;
    }
    &__icon {
        @include filetype();
        @include center-alignment(1em, 1em);
        margin-right: .5rem;
        color: var(--gray-6);
        &:before {
            font-weight: normal;
        }
    }
    &__filename {
        &_placeholder {
            color: $input-placeholder-color;
        }
    }
    &__delete {
        position: absolute !important;
        top: 50%;
        right: .5rem;
        transform: translate(0, -50%);
    }
    &__picker {
        width: 45px;
        &:after {
            @include fa('folder-open');
        }
    }
}
</style>

<template>
  <div class="raas-field-file input-group">
    <input type="file" v-bind="$attrs" :accept="accept" ref="input" v-on="inputListeners" @change="changeFile($event)" style="opacity: 0; pointer-events: none; position: absolute;">
    <div class="form-control raas-field-file__input" @click="!fileName ? chooseFile() : null" :style="{ cursor: (fileName ? '' : 'pointer') }">
      <span class="raas-field-file__icon" :class="iconCSSClass" v-if="fileName"></span>
      <span class="raas-field-file__filename" :class="{ 'raas-field-file__filename_placeholder': !fileName }">{{fileName || placeholder}}</span>
      <a class="raas-field-file__delete btn btn-close" v-if="fileName" @click.stop="clearFile()"></a>
    </div>
    <button type="button" class="btn btn-outline-secondary raas-field-file__picker" @click="chooseFile()"></button>
  </div>
</template>

<script>
import RAASFieldFile from 'cms/application/fields/raas-field-file.vue.js';
export default {
    mixins: [RAASFieldFile],
}
</script>