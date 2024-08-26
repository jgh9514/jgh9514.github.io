<template>
  <v-app dark>
    <v-app-bar app class="header">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="logo" @click="goHome"
        ><img :src="require(`../assets/images/logo.png`)"
      /></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="navigateTo(item.route)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div class="contents">
      <Nuxt />
    </div>
    <v-bottom-navigation>
      <v-btn>
        <span>알림</span>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn>
        <span class="homeBtn active">
          <img :src="require(`../assets/images/ci_active.png`)" width="24px" />
        </span>
      </v-btn>
      <v-btn>
        <span>설정</span>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <transition name="slide-y-reverse-transition">
      <v-snackbar v-model="showSnackbar" :timeout="2000" transition="true"
        >뒤로 버튼을 한번 더 누르면 어플리케이션이 종료됩니다.</v-snackbar
      >
    </transition>
  </v-app>
</template>

<script>
import { App } from "@capacitor/app";

export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: "홈(점령전)", route: "/" },
        { title: "json 데이터 추가", route: "/json/json" },
        { title: "최근 점령전", route: "/recent" },
        { title: "실레나(미완성)" },
      ],
      showSnackbar: false,
      backButtonPressedOnce: false,
    };
  },
  created() {
    App.addListener("backButton", ({ isActive }) => {
      this.goBack();
    });
  },
  mounted() {},
  methods: {
    async goBack() {
      this.drawer = false;
      if (window.location.pathname === "/") {
        if (!this.backButtonPressedOnce) {
          this.showSnackbar = true;
          this.backButtonPressedOnce = true;
          this.backButtonTimer = setTimeout(() => {
            this.backButtonPressedOnce = false;
            clearTimeout(this.backButtonTimer);
          }, 2000);
        } else {
          App.exitApp();
        }
      } else {
        this.$router.go(-1); // 한단계 뒤로 가기
      }
    },
    goHome() {
      this.$router.push("/");
    },
    navigateTo(route) {
      this.$router.push(route);
    },
  },
};
</script>
<style scoped>
.header {
  background: #fff !important;
}
.logo {
  display: flex;
  align-items: center;
  padding: 0;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.logo > img {
  height: 75%;
}
.contents {
  padding: 60px 0;
  background: #222;
}
.v-bottom-navigation {
  position: fixed !important;
  background: #363944 !important;
}
.v-bottom-navigation .v-btn {
  width: 33.3%;
}
.v-bottom-navigation .v-btn__content > span {
  color: #bbb;
  margin-top: 5px;
  font-size: 9px;
}
.v-bottom-navigation .v-btn__content .v-icon {
  color: #bbb;
}
.homeBtn {
  padding: 10px;
  border: 2px solid #bbb;
  border-radius: 50px;
  width: 44px;
  height: 44px;
  box-sizing: border-box;
  position: relative;
  margin: 0 !important;
}
.homeBtn > img {
  width: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.homeBtn.active {
  position: absolute;
  width: 55px;
  height: 55px;
  bottom: 25px;
  border-color:rgb(255, 200, 0);
  background: #000;
}
.homeBtn.active > img {
  width: 34px;
}
</style>