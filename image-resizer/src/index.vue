<template>
  <a-spin wrapper-class-name="wrap" :spinning="spinning">
    <h-horizontal-layout mode="right" :width="250">
      <template #left>
        <h-multi-image-picker
          ref="multiImagePickerRef"
          @pick="beforeUpload"
          @remove="removeHook"
        />
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('pixels')">
            <a-form layout="horizontal">
              <a-form-item :label="t('width')">
                <a-input-number
                  v-model:value="resize.width"
                  addon-after="px"
                  @change="autoHeight"
                />
              </a-form-item>
              <a-form-item :label="t('height')">
                <a-input-number
                  v-model:value="resize.height"
                  addon-after="px"
                  @change="autoWidth"
                />
              </a-form-item>
              <a-form-item>
                <a-checkbox v-model:checked="resize.maintainAspectRatio">
                  {{ t('maintainAspectRatio') }}
                </a-checkbox>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            style="margin-bottom: 20px"
            :tab="t('percentage')"
          >
            <a-radio-group v-model:value="resize.percentage">
              <a-radio class="radioStyle" :value="75">
                {{ t('smaller25') }}
              </a-radio>
              <a-radio class="radioStyle" :value="50">
                {{ t('smaller50') }}
              </a-radio>
              <a-radio class="radioStyle" :value="25">
                {{ t('smaller75') }}
              </a-radio>
            </a-radio-group>
            <br />
            <a-input-number
              v-model:value="resize.percentage"
              style="margin-top: 15px"
              :min="1"
              :max="10000"
              addon-after="%"
            />
          </a-tab-pane>
        </a-tabs>
        <a-button type="primary" @click="handleResize">
          {{ t('resize') }}
        </a-button>
      </template>
      <template #right>
        <div style="height: 80vh; overflow: auto">
          <ImageMessage
            v-for="(item, index) in fileList"
            :key="index"
            :name="item.name"
            :size="{ width: item.width, height: item.height }"
            :resize="{ width: resize.width, height: resize.height }"
          />
        </div>
      </template>
    </h-horizontal-layout>
  </a-spin>
</template>

<script lang="ts" setup>
import ImageMessage from './ImageMessage.vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import { watch, ref, reactive } from 'vue';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const activeKey = ref('1');
const spinning = ref(false);
const multiImagePickerRef = ref();
const fileList = reactive<any[]>([]);

const resize = reactive({
  height: 1080,
  width: 1920,
  radio: 1,
  maintainAspectRatio: true,
  percentage: 100,
});

const autoHeight = () => {
  if (resize.maintainAspectRatio)
    resize.height = Math.floor(resize.width / resize.radio);
};
const autoWidth = () => {
  if (resize.maintainAspectRatio)
    resize.width = Math.floor(resize.height * resize.radio);
};

watch(
  () => resize.percentage,
  () => {
    if (!fileList.length) {
      window.$he3.message.error(t('errorChoose'));
      return;
    }
    resize.width = Math.floor((fileList[0].width * resize.percentage) / 100);
    resize.height = Math.floor((fileList[0].height * resize.percentage) / 100);
  }
);

const handleResize = () => {
  if (!fileList.length) {
    window.$he3.message.error(t('errorChoose'));
    return;
  }
  spinning.value = true;
  if (fileList.length === 1) {
    window.$he3
      .imageResize(fileList[0].path, resize.width, resize.height)
      .then((blob: Blob) => {
        window.$he3.downloadByUrl(URL.createObjectURL(blob));
        spinning.value = false;
      });
  } else {
    for (const item of fileList) {
      window.$he3
        .imageResize(item.path, resize.width, resize.height)
        .then((blob: Blob) => {
          window.$he3.downloadByUrl(URL.createObjectURL(blob));
          spinning.value = false;
        });
    }
  }
};

const beforeUpload = () => {
  fileList.length = 0;
  fileList.push(...multiImagePickerRef.value.fileList);
  resize.radio = fileList[0].width / fileList[0].height;
  if (resize.maintainAspectRatio && fileList.length === 1) {
    resize.height = Math.floor(resize.width / resize.radio);
    resize.width = Math.floor(resize.height * resize.radio);
  }
};

const removeHook = () => {
  fileList.length = 0;
  fileList.push(...multiImagePickerRef.value.fileList);
  if (!fileList.length) return;
  resize.radio = fileList[0].width / fileList[0].height;
  if (resize.maintainAspectRatio && fileList.length === 1) {
    resize.height = Math.floor(resize.width / resize.radio);
    resize.width = Math.floor(resize.height * resize.radio);
  }
};
</script>
<style scoped lang="less">
.wrap {
  height: 100%;
  :deep(.ant-spin-container) {
    height: 100%;
  }
}

.radioStyle {
  display: flex;
  height: 30px;
  line-height: 30px;
}
</style>
