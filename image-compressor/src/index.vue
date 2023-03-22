<template>
  <h-single-layout mode="left">
    <a-spin :spinning="disabled">
      <a-space direction="vertical">
        <h-multi-image-picker
          ref="imageRef"
          @pick="compress"
          @remove="compress"
        />
        <h2 style="margin-top: 10px">
          {{ t('compressLevel') }}
        </h2>
        <div style="position: relative; padding-right: 30px; width: 250px">
          <a-radio-group
            v-model:value="compressParam.quality"
            :disabled="disabled"
            @change="compress"
          >
            <a-radio :value="1">1</a-radio>
            <a-radio :value="2">2</a-radio>
            <a-radio :value="3">3</a-radio>
            <a-radio :value="4">4</a-radio>
          </a-radio-group>
        </div>
        {{ t('original') }}
        <strong>
          <h-file-size-view :size="compressParam.originalSize" />
        </strong>
        {{ t('compressed') }}
        <strong>
          <h-file-size-view :size="compressParam.compressedSize" />
        </strong>
        <a-button type="danger" :disabled="disabled" @click="clearImg">
          {{ t('clear') }}
        </a-button>
        <a-button type="primary" :disabled="disabled" @click="exportImage">
          {{ t('exportImage') }}
        </a-button>
      </a-space>
    </a-spin>
  </h-single-layout>
</template>

<script lang="ts" setup>
import JSZip from 'jszip';
import imageCompression from 'browser-image-compression';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import { ref, reactive, computed } from 'vue';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

enum Level {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
}

const imageRef = ref();
const fileList = computed(() => imageRef.value?.fileList);
// const fileName = ref('')
const compressImageList: File[] = [];
const compressParam = reactive({
  quality: 1 as Level,
  originalSize: 0,
  compressedSize: 0,
});
const disabled = ref(false);
// 压缩等级
const level: Record<Level, number> = {
  1: 1,
  2: 0.7,
  3: 0.4,
  4: 0.1,
};

const compress = () => {
  if (!fileList.value?.length) {
    compressParam.originalSize = 0;
    compressParam.compressedSize = 0;
    return;
  }
  disabled.value = true;
  let originSum = 0;
  let compressSum = 0;
  compressImageList.length = 0;
  new Promise<void>((resolve, reject) => {
    let i = 0;
    for (const image of fileList.value) {
      originSum += image.size;
      let options = {
        useWebWorker: true,
        initialQuality: level[compressParam.quality],
      };
      imageCompression(image, options)
        .then((compressedFile) => {
          if (!compressedFile) {
            window.$he3.message.error(t('imageError'));
            disabled.value = false;
            return;
          }
          i++;
          compressSum += compressedFile.size;
          compressImageList.push(compressedFile);
          if (i === fileList.value.length) resolve();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }).then(() => {
    compressParam.originalSize = originSum;
    compressParam.compressedSize = compressSum;
    disabled.value = false;
  });
};

const exportImage = () => {
  if (!fileList.value.length) {
    window.$he3.message.warn(t('imageChoose'));
    return;
  }
  if (compressImageList.length === 1) {
    const url = URL.createObjectURL(compressImageList[0]);
    window.$he3.downloadByUrl(url);
  } else {
    const zip = new JSZip();
    for (const image of compressImageList) zip.file(`${image.name}`, image);
    zip
      .generateAsync({
        type: 'blob',
      })
      .then((content) => {
        const url = URL.createObjectURL(content);
        window.$he3.downloadByUrl(url);
      });
  }
};

const clearImg = () => {
  imageRef.value.clearImage();
  compressParam.originalSize = 0;
  compressParam.compressedSize = 0;
};
</script>
