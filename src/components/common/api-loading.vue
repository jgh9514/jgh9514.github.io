<template>
  <v-dialog v-model="dialog" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item>
        <template #prepend>
          <div class="pe-5">
            <v-progress-circular indeterminate="disable-shrink" size="30" width="4" />
          </div>
        </template>
        <template #title>
          <div class="text-subtitle">
            <b :style="'color:' + Constants.DC_BG_COLOR">데이터</b> 를 불러오는 중 입니다
          </div>
          <div class="text-subtitle">
            잠시만 기다려주세요
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
<script setup>
import { loading } from '@/utils/service' // Import the loading state
const dialog = loading // Get the loading state
</script>
