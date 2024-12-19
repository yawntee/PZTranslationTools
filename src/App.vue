<script setup lang="ts">
import Difference from "./components/Difference.vue";
import {darkTheme} from "naive-ui";
import Merge from "./components/Merge.vue";
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-message-provider>
      <n-flex class="container" justify="center" align="center" vertical>
        <div class="title">僵尸毁灭工程翻译工具</div>
        <n-flex size="large">
          <Difference/>
          <Merge/>
        </n-flex>
      </n-flex>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}

.title {
  font-size: 4rem;
  font-weight: bolder;
  color: white;
  text-shadow: 2px 2px 2px black;
}
</style>
