<template>
  <v-app>
    <div class="container">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
      <v-text-field
        v-model="id"
        label="아이디"
        prepend-icon="mdi-account"
        variant="underlined"
        hide-details
        :style="{ 'font-size': '16px' }"
      ></v-text-field>
      <v-text-field
        v-model="password"
        type="password"
        label="비밀번호"
        prepend-icon="mdi-lock"
        variant="underlined"
        hide-details
        :style="{ 'font-size': '16px' }"
      ></v-text-field>
      <div class="btnBox">
        <v-btn class="loginBtn" @click="login()">로그인</v-btn>
        <v-checkbox v-model="rememberMe" label="자동 로그인"></v-checkbox>
      </div>
      <div v-if="warning" class="warningComment">
        <v-icon left>mdi-alert-circle</v-icon>
        <p>부적합한 사용자명 또는 암호가<br />지정되었습니다.</p>
      </div>
    </div>
  </v-app>
</template>
  
<script>
export default {
  layout: "no-layout",
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      warning: false,
    };
  },
  methods: {
    login() {
      console.log("Email:", this.email);
      console.log("Password:", this.password);
      console.log("Remember me:", this.rememberMe);
      this.warning = true;
    },
  },
};
</script>
  
<style>
.container {
  width: 90%;
  margin: 0 auto;
}
.logo {
  display: table;
  width: 100%;
  height: auto;
  margin: 50px auto;
}
.mdi-account,
.mdi-lock {
  font-size: 18px !important;
  color: #aaa !important;
}
.v-text-field input {
  font-size: 13px !important;
}
.v-label {
  font-size: 13px !important;
}
.v-label--active {
  color: #0b2481 !important;
  font-weight: bold !important;
}
.btnBox {
  margin-top: 15px;
}
.loginBtn {
  width: 100%;
  background: #5479ff !important;
  color: #fff !important;
}
.warningComment {
  display: flex;
  align-items: center;
}
.warningComment > p {
  color: #c50000;
  margin: 0;
  font-size: 13px;
}
.mdi-alert-circle {
  color: #c50000 !important;
}
</style>