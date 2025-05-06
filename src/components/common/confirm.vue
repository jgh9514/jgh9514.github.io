<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="confirmStore.$state.isShow" max-width="320" persistent @keydown.enter="confirm">
      <v-card max-width="400">
        <v-card-title>{{ confirmStore.$state.title }}</v-card-title>
        <v-card-text v-html="confirmStore.$state.content"></v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text="확인" @click="confirm" />
          <v-btn color="error" text="취소" @click="cancel" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
const confirmStore = useConfirmStore()
const confirm = () => {
  if (confirmStore.$state.callbackOkFn) {
    confirmStore.$state.callbackOkFn()
  }
  confirmStore.isShow = false
}

const cancel = () => {
  if (confirmStore.$state.callbackCancelFn) {
    confirmStore.$state.callbackCancelFn()
  }
  confirmStore.isShow = false
}
</script>
