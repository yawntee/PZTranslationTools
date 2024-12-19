<script setup lang="ts">

import {reactive, ref} from "vue";
import {type UploadFileInfo, useMessage} from "naive-ui";
import {downloadText, readTextFile} from "../utils/file.ts";
import {parse, save} from "../utils/parser.ts";

const message = useMessage()

const loading = ref(false)

interface FileInfo {
  name: string;
  content: string;
}

type FileType = 'origin' | 'translated'

const files = reactive<Partial<Record<FileType, FileInfo>>>({})

function run() {
  try {
    loading.value = true
    if (!files.origin || !files.translated) {
      return
    }
    const en = parse(files.origin!.content);
    const zh = parse(files.translated!.content);
    const difference = en.filter(x => !zh.find(y => y.key === x.key))
    if (difference.length > 0) {
      message.info('分析完成')
      downloadText(files.translated.name, save(files.translated.name, difference))
    } else {
      message.info('未找到差异')
    }
  } catch (e) {
    console.error(e)
    message.error('解析错误')
  } finally {
    loading.value = false
  }
}

async function handleUploadOrigin(options: { file: UploadFileInfo, fileList: Array<UploadFileInfo> }) {
  const {file} = options.file
  if (file) {
    if (!file.name.endsWith('.txt')) {
      message.info('文件类型错误')
      return false
    }
    readTextFile(file).then(content => {
      files.origin = {
        name: file.name,
        content
      }
    })
  }
  return false
}

async function handleUploadTranslated(options: { file: UploadFileInfo, fileList: Array<UploadFileInfo> }) {
  const {file} = options.file
  if (file) {
    if (!file.name.endsWith('.txt')) {
      message.info('文件类型错误')
      return false
    }
    readTextFile(file).then(content => {
      files.translated = {
        name: file.name,
        content
      }
    })
  }
  return false
}
</script>

<template>
  <n-spin :show="loading">
    <n-flex class="box" align="center" vertical>
      <div class="title">增量分析</div>

      <n-flex :wrap="false">
        <n-upload
            directory-dnd
            @before-upload="handleUploadOrigin"
        >
          <n-upload-dragger>
            <n-flex vertical>
              <h1>英文翻译文件</h1>
              <span style="font-weight: bold">{{ files.origin?.name || '点击或拖拽上传' }}</span>
            </n-flex>
          </n-upload-dragger>
        </n-upload>
        <n-upload
            directory-dnd
            @before-upload="handleUploadTranslated"
        >
          <n-upload-dragger>
            <n-flex vertical>
              <h1>中文翻译文件</h1>
              <span style="font-weight: bold">{{ files.translated?.name || '点击或拖拽上传' }}</span>
            </n-flex>
          </n-upload-dragger>
        </n-upload>
      </n-flex>

      <n-button size="large" :disabled="!files.origin || !files.translated" @click="run">开始分析</n-button>
    </n-flex>
  </n-spin>
</template>

<style scoped>
.box {
  padding: 30px;
  color: #dfae9a;
  background-color: #b78282f2;
  border-radius: 15px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
}
</style>