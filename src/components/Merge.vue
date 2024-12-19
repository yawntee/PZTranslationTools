<script setup lang="ts">

import {reactive, ref} from "vue";
import {type UploadFileInfo, useMessage} from "naive-ui";
import {downloadText, readTextFile} from "../utils/file.ts";
import {parse, save, type TranslationEntry} from "../utils/parser.ts";

const message = useMessage()

const loading = ref(false)
const reserve = ref(false)

interface FileInfo {
  name: string;
  content: string;
}

type FileType = 'origin' | 'increment'

const files = reactive<Partial<Record<FileType, FileInfo>>>({})

function run() {
  try {
    loading.value = true
    if (!files.origin || !files.increment) {
      return
    }
    const leaving: TranslationEntry[] = []
    const origin = parse(files.origin!.content);
    const increment = parse(files.increment!.content);
    for (const item of increment) {
      const found = origin.find(x => x.key === item.key)
      if (found) {
        found.contents = item.contents
      } else {
        leaving.push(item)
      }
    }
    if(leaving.length > 0 && reserve.value) {
      origin.push(...leaving)
    }
    message.info('合并完成')
    downloadText(files.origin.name, save(files.origin.name, origin))
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
      files.increment = {
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
      <div class="title">合并翻译</div>

      <n-flex :wrap="false">
        <n-upload
            directory-dnd
            @before-upload="handleUploadOrigin"
        >
          <n-upload-dragger>
            <n-flex vertical>
              <h1>原翻译文件</h1>
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
              <h1>增量翻译文件</h1>
              <span style="font-weight: bold">{{ files.increment?.name || '点击或拖拽上传' }}</span>
            </n-flex>
          </n-upload-dragger>
        </n-upload>
      </n-flex>

      <n-checkbox v-model="reserve">将未匹配项插入至原翻译末尾</n-checkbox>

      <n-button size="large" :disabled="!files.origin || !files.increment" @click="run">开始分析</n-button>
    </n-flex>
  </n-spin>
</template>

<style scoped>
.box {
  padding: 30px;
  color: #dfae9a;
  background-color: #b78282f2;
  border-radius: 15px;
  white-space: nowrap;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
}
</style>