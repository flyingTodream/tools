<template>
  <h-single-layout mode="left" :width="1000">
    <a-spin :spinning="disabled">
      <a-space direction="vertical" :size="20">
        <h-multi-image-picker ref="imageRef" />
        <a-checkbox-group
          v-model:value="imageParam.size"
          :options="sizeOption"
        />
        <a-radio-group v-model:value="imageParam.shape">
          <a-radio-button value="square">
            {{ t('square') }}
          </a-radio-button>
          <a-radio-button value="circle">
            {{ t('circle') }}
          </a-radio-button>
          <a-radio-button value="fillet">
            {{ t('fillet') }}
          </a-radio-button>
        </a-radio-group>
        <a-select v-model:value="imageParam.iconType" style="width: 80px">
          <a-select-option value="ico">ico</a-select-option>
          <a-select-option value="icns">icns</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleDownload">
          {{
            imageParam.iconType === 'ico'
              ? t('transformICO')
              : t('transformICNS')
          }}
        </a-button>
      </a-space>
    </a-spin>
  </h-single-layout>
</template>

<script setup lang="ts">
import JSZip from 'jszip';
import type { Shape, SizeNumber } from './imageToIcon';
import { imgTool } from './imageToIcon';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import { ref, reactive, computed } from 'vue';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const imageRef = ref();
const fileList = computed(() => imageRef.value?.fileList);
const disabled = ref(false);

const sizeOption = [
  { label: '16x16', value: 16 },
  { label: '32x32', value: 32 },
  { label: '48x48', value: 48 },
  { label: '64x64', value: 64 },
  { label: '96x96', value: 96 },
  { label: '128x128', value: 128 },
  { label: '256x256', value: 256 },
  { label: '512x512', value: 512 },
  { label: '1024x1024', value: 1024 },
];

const imageParam = reactive({
  size: [16] as SizeNumber[],
  shape: 'square' as Shape,
  bleed: false,
  iconType: 'ico' as 'ico' | 'icns',
});

const handleDownload = async () => {
  if (!fileList.value.length) {
    window.$he3.message.warn(t('imageChoose'));
    return;
  }
  disabled.value = true;
  const zip = new JSZip();
  for (const image of fileList.value) {
    const imageName = image.name.split('.')[0];
    zip.folder(imageName);
    for (const size of imageParam.size) {
      const param = {
        source: image,
        size: size,
        shape: imageParam.shape,
        bleed: false,
        iconType: imageParam.iconType,
      };
      const blob = await imgTool.convert(param);
      if (
        fileList.value.length === 1 &&
        imageParam.size.length === 1 &&
        param.iconType !== 'icns'
      ) {
        const url = URL.createObjectURL(blob as Blob);
        window.$he3.downloadByUrl(url);
        disabled.value = false;
        return;
      }
      zip
        .folder(imageName)
        ?.file(`${imageName}--${size}x${size}.${param.iconType}`, blob);
    }
  }
  zip
    .generateAsync({
      type: 'blob',
    })
    .then((content) => {
      const url = URL.createObjectURL(content);
      window.$he3.downloadByUrl(url);
    });
  disabled.value = false;
};
</script>
