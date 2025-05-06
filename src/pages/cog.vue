<template>
  <div id="cog">
    <div class="title">설정</div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div @click="navigateTo('/json/json')">JSON 데이터 추가</div>
        </v-col>
        <v-col cols="12" style="display: flex; justify-content: space-between">
          <div>버전 0.0.1</div>
          <div>최신 버전</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const router = useRouter();

const navigateTo = (route) => {
  router.push(route);
};
</script>
<style scoped>
#cog {
  padding: 10px;
}
#cog .title {
  font-size: 25px;
  font-weight: bold;
}
</style>