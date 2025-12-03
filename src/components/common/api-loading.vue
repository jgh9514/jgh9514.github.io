<template>
  <v-dialog
    v-model="dialog"
    width="320"
    persistent
    :scrim="false"
  >
    <v-card>
      <v-card-text>
        <div style="display: flex; align-items: center; gap: 16px;">
          <v-progress-circular
            indeterminate
            color="primary"
            size="30"
          />
          <div>
            <div style="font-size: 14px; margin-bottom: 4px;">
              <b :style="'color:' + Constants.DC_BG_COLOR">데이터</b> 를 불러오는 중 입니다
            </div>
            <div style="font-size: 14px;">
              잠시만 기다려주세요
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { loading } from '@/utils/service' // Import the loading state
const dialog = loading // Get the loading state
</script>
