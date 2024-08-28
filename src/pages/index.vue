<template>
  <div>
    <div class="main_banner">
      <img :src="require(`~/assets/images/main/main_banner1.jpg`)" width="100%" />
      <div class="section1" @click="navigateTo('/recent')">
        <p>최근 점령전<span>NEW</span></p>
        <img :src="require(`~/assets/images/main/section1.png`)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
    };
  },
  mounted() { },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
  },
};
</script>
<style scoped>
.main_banner {
  position: relative;
}

.section1 {
  position: absolute;
  bottom: -20px;
  display: flex;
  align-items: center;
  width: 90%;
  background: #27282e;
  border-radius: 10px;
  height: 60px;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  padding-left: 25px;
}
.section1 > p {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.section1 > p > span {
  margin-left: 5px;
  font-size: 13px;
  color: #1cce1c;
}
.section1>img {
  position: absolute;
  width: 100px;
  right: 10px;
  top: -10px;
}
</style>
