<template>
  <h-single-layout mode="left">
    <a-space direction="vertical">
      <h-multi-image-picker ref="imageRef" />
      <a-select v-model:value="imageType" style="width: 120px">
        <a-select-option
          v-for="item in imageTypeList"
          :key="item"
          :value="item"
        >
          {{ item.split('/')[1] }}
        </a-select-option>
      </a-select>
      <a-button type="primary" :loading="loading" @click="convertor">
        {{ t('converter') }}
      </a-button>
    </a-space>
  </h-single-layout>
</template>

<script lang="ts" setup>
import JSZip from 'jszip';
import compressImage from 'ls-compressimage';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import { ref, reactive, computed } from 'vue';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const imageRef = ref();
const fileList = computed(() => imageRef.value?.fileList);
const loading = ref(false);
const imageType = ref('image/jpeg');
const imageTypeList = reactive([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/avif',
  'image/tiff',
]);
const convertor = () => {
  if (!fileList.value.length) {
    window.$he3.message.warn(t('imageChoose'));
    return;
  }
  loading.value = true;
  const zip = new JSZip();
  new Promise<File | 0>((resolve, reject) => {
    let i = 0;
    for (const item of fileList.value) {
      getBase64(item).then((image) => {
        new compressImage({
          res: image, // 必选 资源
          justConversion: true, // 可选 声明了此字段说明只进行格式转换 res requestType responseType callback必填，其他随意
          requestType: 'base64', // 必选 传入文件类别 base64 | file | blob
          responseType: 'file', // 必选 返回文件类别 base64 | file | blob
          imgType: imageType.value, // 可选 (默认原生文件类型) 返回文件对象的文件类型
          fileName: item.name.split('.')[0], // 如果responseType的类型为file和非justConversion 此选项可选 返回文件对象的文件名
          callback: (result: File) => {
            if (result === null) {
              window.$he3.message.error(t('imageError'));
              loading.value = false;
              return;
            }
            i++;
            zip.file(`${result.name}`, result);
            if (i === fileList.value.length && fileList.value.length === 1)
              resolve(result);
            if (i === fileList.value.length) resolve(0);
          }, // 回调函数 返回处理后文件 如果为null 表示文件处理不了(原因 少了参数 参数不合法))
        });
      });
    }
  })
    .then((result) => {
      if (!fileList.value.length) {
        window.$he3.message.warn(t('imageChoose'));
        return;
      } else if (fileList.value.length === 1) {
        const url = URL.createObjectURL(result as File);
        window.$he3.downloadByUrl(url);
      } else {
        zip
          .generateAsync({
            type: 'blob',
          })
          .then((content) => {
            const url = URL.createObjectURL(content);
            window.$he3.downloadByUrl(url);
          });
      }
      loading.value = false;
    })
    .catch((err) => {
      window.$he3.message.warn(err.toString());
    });
};
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
</script>
