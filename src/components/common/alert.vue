<template>
  <v-dialog
    v-model="alertStore.$state.isShow"
    max-width="320"
    persistent
    @keydown.enter="alertStore.closeAlert()"
  >
    <v-card>
      <v-card-text>
        <p>{{ alertStore.$state.text }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="alertStore.closeAlert()">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const alertStore = useAlertStore()
</script>
