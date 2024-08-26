<template>
  <div id="cog">
    <div class="title">설정</div>
    <v-container>
      <v-row>
        <div @click="navigateTo('/json/json')">JSON 데이터 추가</div>
      </v-row>
      <v-row>
        <div>버전 0.0.1</div>
        <div>최신 버전</div>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {}
  },
  computed: {
  },
  async mounted() {
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    
  },
}
</script>
<style scoped>
  #cog {
    color: #fff;
    padding: 10px;
  }
  #cog .title {
    font-size: 25px;
    font-weight: bold;
  }
</style>