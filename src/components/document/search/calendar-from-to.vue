<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-text-field
        v-model="dateText"
        v-bind="props"
        append-inner-icon="mdi-calendar"
        :base-color="Constants.DC_BASE_COLOR_GRAY"
        :variant="Constants.DC_VARIANT"
        :density="Constants.DC_DENSITY"
        :hide-details="true"
        :focused="focused"
        :label="$gfn_isEmpty(infoData) ? '' : infoData.label_nm"
        @keypress.enter="enter"
      />
    </template>
    <v-date-picker v-model="dateRange" hide-header color="blue lighten-1" multiple="range" @update:model-value="updateDateRange" />
  </v-menu>
</template>
<script setup>
const startDate = defineModel('start')
const endDate = defineModel('end')

const infoData = defineModel('data')

const menu = ref(false)
const dateText = ref('')
const dateRange = ref([])

const focused = ref(null)

const initCheck = ref(false)

const emit = defineEmits(['enter'])

onMounted(() => {
  init()
})

watch(dateText, () => {
  if (dateText.value && dateText.value.includes('~')) {
    dateText.value = dateText.value.trim()
    const dates = dateText.value.split('~').map(date => date.trim());
    if (dates.length === 2 && dates[0].match(/^\d{4}-\d{2}-\d{2}$/) && dates[1].match(/^\d{4}-\d{2}-\d{2}$/)) {
      const start = new Date(dates[0])
      const end = new Date(dates[1])
      startDate.value = dates[0]
      endDate.value = dates[1]
      
      const datesArr = []
      while (start <= end) {
        datesArr.push($gfn_convertDateToStringYYYYMMDD(new Date(start), '-'))
        start.setDate(start.getDate() + 1)
      }
      dateRange.value = datesArr
    }
  }
})

watch(startDate, () => {
  if (!initCheck.value) {
    init()
    initCheck.value = true
  } else {
    if (!$gfn_isEmpty(startDate.value)) {
      startDate.value = startDate.value ? startDate.value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3') : ''
      endDate.value = endDate.value ? endDate.value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3') : ''
      dateText.value = `${startDate.value} ~ ${endDate.value}`
      const start = new Date(startDate.value)
      const end = new Date(endDate.value)
      const dates = []
      while (start <= end) {
        dates.push($gfn_convertDateToStringYYYYMMDD(new Date(start), '-'))
        start.setDate(start.getDate() + 1)
      }
      dateRange.value = dates
    }
  }
})

const init = async () => {
  if (infoData.value && infoData.value.init_data_yn === 'Y') {
    const today = new Date()
    const startDay = new Date(today.getTime())

    const offset = Number(infoData.value.standard_date_val || 0)

    switch (infoData.value.standard_date_cd) {
      case 'YY':
        startDay.setFullYear(startDay.getFullYear() - offset)
        startDay.setDate(startDay.getDate() + 1)
        break
      case 'MM': {
        const currentMonth = startDay.getMonth()
        const targetMonth = currentMonth - offset
        const targetYear = startDay.getFullYear() + Math.floor(targetMonth / 12)
        const adjustedMonth = ((targetMonth % 12) + 12) % 12
        
        startDay.setFullYear(targetYear)
        startDay.setMonth(adjustedMonth)
        startDay.setDate(startDay.getDate() + 1)
        break
      }
      case 'DD':
        startDay.setDate(startDay.getDate() - offset)
        break
      case 'toDay':
        break
    }

    startDate.value = $gfn_convertDateToStringYYYYMMDD(startDay, '-')
    endDate.value = $gfn_convertDateToStringYYYYMMDD(today, '-')
    dateText.value = `${startDate.value} ~ ${endDate.value}`
  }
}

const updateDateRange = async (newVal) => {
  if (newVal.length === 1) {
    const date = await $gfn_convertDateToStringYYYYMMDD(new Date(newVal[0]), '-')
    startDate.value = date
    endDate.value = date
    dateText.value = `${date} ~ ${date}`
  } else if (newVal.length > 1) {
    const start = await $gfn_convertDateToStringYYYYMMDD(new Date(newVal[0]), '-')
    const end = await $gfn_convertDateToStringYYYYMMDD(new Date(newVal[newVal.length - 1]), '-')
    startDate.value = start
    endDate.value = end
    dateText.value = `${start} ~ ${end}`
    menu.value = false
  }
}

const enter = () => {
  menu.value = false
  emit('enter')
}

const focus = () => {
  focused.value = !focused.value
}

defineExpose({ init, focus })
</script>
