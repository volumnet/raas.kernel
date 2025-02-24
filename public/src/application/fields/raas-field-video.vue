<style lang="scss">
.raas-field-video {
    $field: &;
    display: inline-block;
    position: relative;
    margin-bottom: 0;
    overflow: hidden;
    border: 1px solid #ddd;
    background: white;
    position: relative;
    &:hover {
        & #{$field}__delete {
            display: block;
        }
    }
    &_active {
        & #{$field}__image {
            &:after {
                @include fa('youtube-play');
                color: map-get($social-colors, 'youtube');
                display: none;
            }
            &:hover {
                &:after {
                    display: block;
                }
            }
          }
    }
    &__image {
        background-size: cover;
        background-position: 50% 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        @include media-breakpoint-up('lg') { 
            @include size(300px, 170px);
        }
        @include media-breakpoint-only('md') {
            @include size(240px, 135px);
        }
        @include media-breakpoint-down('md') {
            @include size(160px, 90px);
        }
        &:after {
            @include fa('youtube');
            color: silver;
        }
        &, &:hover, &:focus {
            text-decoration: none;
        }
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
            color: var(--danger);
            text-shadow: 0px 0px 4px rgba(white, .5);
            text-decoration: none;
        }
        &:after {
            content: '×';
        }
    }
    input {
        border-radius: 0;
        border: none;
        border-top: 1px solid #ddd;
        box-shadow: none;
        @include media-breakpoint-down('sm') {
            padding: 6px;
            width: 160px;
        }
    }
}
</style>

<template>
  <input type="text" v-bind="$attrs" v-on="inputListeners" :value="value">
</template>

<template>
  <div class="raas-field-video" :class="{ 'raas-field-video_active': !!ytId }">
    <a :href="videoURL" target="_blank" class="raas-field-video__image"  :style="{ 'background-image': (ytId ? ('url(' + coverURL + ')') : '') }" v-if="ytId"></a>
    <div class="raas-field-video__image" v-else></div>
    <div class="raas-field-video__url">
      <input type="text" class="form-control" v-bind="$attrs" v-on="inputListeners" :value="value">
    </div>
    <a class="raas-field-video__delete" @click="clear()" v-if="ytId"></a>
  </div>
</template>

<script>
import RAASFieldVideo from 'cms/application/fields/raas-field-video.vue.js';
export default {
    mixins: [RAASFieldVideo],
}
</script>