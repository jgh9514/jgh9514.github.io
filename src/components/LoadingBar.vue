<template>
  <div v-show="loading" class="loading-page">
    <div class="loadingDiv">
      <div class="loading"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
  },
}
</script>
<style>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  text-align: center;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  width: 100%;
  height: 100%;
}
.loadingDiv {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.loading {
  display: inline-block;
  width: 70px;
  height: 70px;
  border: 5px solid #588c61;
  border-radius: 50%;
  border-top-color: #1965c9;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
