<template>
  <div class="pa-4 text-center">
    <v-dialog
      v-model="alertStore.$state.isShow"
      max-width="320"
      persistent
      @keydown.enter="alertStore.closeAlert()"
    >
      <v-card
        max-width="400"
        :text="alertStore.$state.text"
      >
        <template #actions>
          <v-btn
            class="ms-auto"
            color="primary"
            text="OK"
            @click="alertStore.closeAlert()"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
const alertStore = useAlertStore()
</script>
