<template>
  <v-app dark>
    <v-app-bar app class="header" :class="nowRoute === 'cog' ? 'displaynone' : ''">
      <v-toolbar-title class="logo" @click="goHome">Crazy Monkey</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="searchBox" @click="searchBoxOpen">
        <p class="placeHolder">몬스터 검색</p>
        <v-icon>mdi-magnify</v-icon>
      </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" @click="navigateTo(item.route)">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div :class="nowRoute === 'cog' ? '' : 'contents'">
      <Nuxt />
    </div>
    <v-bottom-navigation>
      <v-btn>
        <span>알림</span>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn @click="navigateTo('/')">
        <span class="homeBtn" :class="nowRoute === '/' ? 'active' : ''">
          <img :src="
            require(`~/assets/images/${nowRoute === '/' ? 'ci_active' : 'ci'
              }.png`)
          " width="24px" />
        </span>
      </v-btn>
      <v-btn @click="navigateTo('cog')" :class="nowRoute === 'cog' ? 'active' : ''">
        <span>설정</span>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <transition name="slide-y-reverse-transition">
      <v-snackbar v-model="showSnackbar" :timeout="2000" transition="true">뒤로 버튼을 한번 더 누르면 어플리케이션이 종료됩니다.</v-snackbar>
    </transition>
    <searchBox ref="searchBox"></searchBox>
  </v-app>
</template>

<script>
import { App } from "@capacitor/app";
import searchBox from '@pages/search';

export default {
  components: {
    searchBox,
  },
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
      nowRoute: "/",
    };
  },
  computed: {
    getMonster() {
      return this.$store.getters['monster/getMonster']
    },
  },
  created() {
    App.addListener("backButton", ({ isActive }) => {
      this.goBack();
    });
  },
  async mounted() {
    await this.$axios
      .get("/api/v1/summonerswar/monster-list", { params: {} })
      .then((res) => {
        this.$store.commit('monster/setMonster', res.data)
      });
  },
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
      if (route === "/") this.nowRoute = "/";
      else if (route === "cog") this.nowRoute = "cog";
      this.$router.push(route);
    },
    searchBoxOpen() {
      this.$refs.searchBox.open();
    },
  },
};
</script>
<style scoped>
.header {
  background: #222 !important;
  box-shadow: none !important;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0;
  height: 100%;
  color: #fff;
  font-weight: bold;
}

.header .searchBox {
  width: calc(100% - 150px);
  background: #363944;
  position: relative;
  padding: 7px 10px;
  border-radius: 5px;
  margin-left: 15px;
}

.header .searchBox .placeHolder {
  color: #999;
  font-size: 13px;
  font-weight: bold;
}

.header .searchBox .mdi-magnify {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.contents {
  padding: 56px 0;
}

.v-bottom-navigation {
  position: fixed !important;
  background: #363944 !important;
}

.v-bottom-navigation .v-btn {
  width: 33.3%;
  height: 100%;
  background: #363944;
}

.v-bottom-navigation .v-btn__content>span {
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

.homeBtn>img {
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
  border-color: rgb(255, 200, 0);
  background: #000;
}

.homeBtn.active>img {
  width: 34px;
}
</style>