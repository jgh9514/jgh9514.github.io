<template>
  <v-app dark>
    <div class="container_error">
      <h1>Not Found</h1>
      <div>
        <div class="con01">요청하신 페이지를 찾을 수 없습니다.</div>
        <div class="con02">확인 후 다시 이용해주시기 바랍니다.</div>
        <div class="con03">
          <a href="/">HOME</a>
        </div>
      </div>
    </div>
  </v-app>

</template>

<script setup>
defineOptions({
  meta: {
    title: '페이지를 찾을 수 없습니다.'
  }
})
definePageMeta({
  layout: 'empty',
})

</script>