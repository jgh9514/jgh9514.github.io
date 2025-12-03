<template>
  <v-dialog v-model="dialog" persistent :width="isMobile ? '100%' : isTablet ? '800px' : '1000px'" style="z-index: 1200">
    <v-card class="container_pop d-flex flex-column">
      <v-toolbar flat class="flex-shrink-0">
        <v-toolbar-title>{{ label }}</v-toolbar-title>
        <v-btn icon class="btn_pop_cls" @click="close">{{ $t('닫기') }}</v-btn>
      </v-toolbar>

      <div class="flex-grow-1 overflow-y-auto">
        <slot />
      </div>

      <v-card-actions class="flex-shrink-0">
        <v-card-actions class="pop_btn">
          <slot name="btn" />
          <dc-btn :label="$t('닫기')" type="border" @click="close" />
        </v-card-actions>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
const dialog = defineModel()
const label = defineModel('label')

const closeValidationFunction = defineModel('close-validation-function')

const emits = defineEmits('close')

const close = async () => {
  if (!$gfn_isEmpty(closeValidationFunction.value)) {
    await closeValidationFunction.value()
    emits('close')
  } else {
    dialog.value = false
    emits('close')
  }
}
</script>
