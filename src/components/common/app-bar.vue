<template>
  <!-- 상단 앱바 컴포넌트 -->
  <v-app-bar
    fixed
    elevation="2"
    color="white"
    height="64"
  >
    <!-- 좌측 메뉴 토글 버튼 -->
    <v-app-bar-nav-icon
      @click.stop="updateDrawer"
    />

    <!-- 로고 영역 -->
    <div class="logo-container">
      <img class="logo-img" src="~/assets/images/ci_active.png" alt="logo" @click="goHome" style="cursor: pointer; height: 40px;" />
    </div>
    
    <v-spacer />
    
    <div v-if="$route.path !== '/'">
      <v-btn
        icon
        variant="text"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
// 좌측 메뉴 토글 함수
const updateDrawer = () => {
  leftMenuState.value = !leftMenuState.value
}

// 홈 이동 함수
const goHome = () => {
  navigateTo('/')
}

// 뒤로 이동 함수
const goBack = () => {
  history.back()
}
</script>

<style scoped>
.user-section {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.user-name {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}
</style>
