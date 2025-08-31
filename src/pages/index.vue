<template>
  <div style="height: 100%; background: #222">
    <div class="main_banner">
      <img :src="`${Constants.BASE_URL}/images/main/main_banner1.jpg`" width="100%" />
      <div class="section section1" @click="navigateTo('/recentSiege')">
        <p>최근 점령전<span>NEW</span></p>
        <img src="/assets/images/main/section1.png" />
      </div>
    </div>
    <div class="middle_banner">
      <div class="leftBox">
        <div class="section section2">
          <p class="title">즐겨찾기</p>
          <p class="subTitle">관심 방덱 저장</p>
          <img :src="`${Constants.BASE_URL}/images/main/section2.png`" />
        </div>
        <div class="section section3">
          <p class="title">공덱 조합</p>
          <p class="subTitle">스펙 보기</p>
          <img :src="`${Constants.BASE_URL}/images/main/section3.png`" />
        </div>
      </div>
      <div class="rightBox">
        <div class="section section4" @click="navigateTo('/siege')">
          <p class="title">전체 점령전</p>
          <p class="subTitle">시즌별 공방덱 통계</p>
          <img :src="`${Constants.BASE_URL}/images/main/section4.png`" />
        </div>
      </div>
    </div>
    <div class="bottom_banner">
      <div class="section section5" @click="navigateTo('/record')">
        <p class="title">시즌 성적표</p>
        <p class="subTitle">시즌별 공성률 통계</p>
        <img :src="`${Constants.BASE_URL}/images/main/section5.png`" />
      </div>
    </div>
  </div>
</template>
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
}

.section {
  background: #27282e;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
}

.section .title {
  font-size: 18px !important;
  font-weight: bold;
  color: #fff;
}

.section .subTitle {
  font-size: 14px;
  color: #999;
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

.section1 > img {
  position: absolute;
  width: 100px;
  right: 10px;
  top: -10px;
}

.middle_banner {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 90%;
  height: 250px;
  margin: 35px auto 0;
}

.middle_banner .leftBox {
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 15px;
}

.middle_banner .leftBox .section {
  position: relative;
  flex: 1;
}

.middle_banner .leftBox .section2 > img {
  position: absolute;
  width: 135px;
  bottom: -20px;
  right: -30px;
}

.middle_banner .leftBox .section3 > img {
  position: absolute;
  width: 95px;
  bottom: 0;
  right: 3px;
}

.middle_banner .rightBox {
  width: 50%;
  height: 100%;
}

.middle_banner .rightBox .section {
  position: relative;
  height: 100%;
}

.middle_banner .rightBox .section4 > img {
  position: absolute;
  width: 100%;
  bottom: -20px;
  right: 0;
}

.bottom_banner {
  width: 90%;
  margin: 15px auto 0;
}

.bottom_banner .section {
  position: relative;
  height: 117.5px;
}

.bottom_banner .section5 > img {
  position: absolute;
  width: 150px;
  bottom: 15px;
  right: 15px;
}
</style>
