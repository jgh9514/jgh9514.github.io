<template>
  <v-dialog
    v-model="confirmStore.$state.isShow"
    max-width="320"
    persistent
    @keydown.enter="confirm"
  >
    <v-card>
      <v-card-title>{{ confirmStore.$state.title }}</v-card-title>
      <v-card-text>
        <div v-html="confirmStore.$state.content"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="confirm">확인</v-btn>
        <v-btn color="error" @click="cancel">취소</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
