<template>
  <v-container class="pa-4" style="max-width: 960px">
    <!-- 헤더 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="pa-4 d-flex align-center justify-space-between">
          <div>
            <div class="text-h6 font-weight-bold">전투 로그 업로드</div>
            <div class="text-body-2 text-medium-emphasis mt-1">
              점령전 / 실레나 JSON 로그 파일을 업로드하여 데이터를 수집합니다.
            </div>
          </div>
          <div class="text-caption text-right text-medium-emphasis">
            업로드 후 결과 요약과 상세 로그를 아래에서 확인할 수 있습니다.
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 본문 -->
    <v-row class="mt-4" dense>
      <!-- 왼쪽: 업로드 영역 -->
      <v-col cols="12" md="7">
        <v-card elevation="2" class="pa-4 mb-4">
          <div class="d-flex align-center mb-3">
            <span class="text-subtitle-1 font-weight-bold">점령전 로그</span>
            <span class="text-caption text-medium-emphasis ml-2">Guild Siege</span>
          </div>
          <v-row class="align-center" dense>
            <v-col cols="12" sm="8">
              <v-file-input
                v-model="files"
                label="점령전 JSON 파일 선택"
                prepend-icon="mdi-file-json"
                accept=".json,.txt"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="4" class="text-right">
              <v-btn color="primary" @click="handleSiegeUpload" :loading="loadingSiege">
                점령전 업로드
              </v-btn>
            </v-col>
          </v-row>

          <v-expand-transition>
            <div v-if="siegeResult" class="mt-4">
              <v-divider class="mb-3" />
              <div class="text-subtitle-2 font-weight-medium mb-2">점령전 처리 결과</div>
              <v-row dense>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis">인식된 점령전</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ siegeResult.totalSiegeCount ?? "-" }} 건
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis">저장된 점령전</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ siegeResult.insertedSiegeCount ?? "-" }} 건
                  </div>
                </v-col>
                <v-col cols="6" class="mt-2">
                  <div class="text-caption text-medium-emphasis">인식된 결투</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ siegeResult.totalBattleCount ?? "-" }} 건
                  </div>
                </v-col>
                <v-col cols="6" class="mt-2">
                  <div class="text-caption text-medium-emphasis">저장된 결투</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ siegeResult.insertedBattleCount ?? "-" }} 건
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-card>

        <v-card elevation="2" class="pa-4">
          <div class="d-flex align-center mb-3">
            <span class="text-subtitle-1 font-weight-bold">실레나 로그</span>
            <span class="text-caption text-medium-emphasis ml-2">RTA</span>
          </div>
          <v-row class="align-center" dense>
            <v-col cols="12" sm="8">
              <v-file-input
                v-model="files2"
                label="실레나 로그 파일 선택"
                prepend-icon="mdi-file-document"
                accept=".txt,.log"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="4" class="text-right">
              <v-btn color="secondary" @click="handleArenaUpload" :loading="loadingArena">
                실레나 업로드
              </v-btn>
            </v-col>
          </v-row>

          <v-expand-transition>
            <div v-if="arenaResult" class="mt-4">
              <v-divider class="mb-3" />
              <div class="text-subtitle-2 font-weight-medium mb-2">실레나 처리 결과</div>
              <v-row dense>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">성공(저장)</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ arenaResult.success ?? 0 }} 건
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">중복/실패</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ arenaResult.fail ?? 0 }} 건
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">총 전투 수</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ (arenaResult.success ?? 0) + (arenaResult.fail ?? 0) }} 건
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>

      <!-- 오른쪽: 로그 영역 -->
      <v-col cols="12" md="5">
        <v-card elevation="2" class="pa-4" style="height: 100%">
          <div class="d-flex align-center mb-3">
            <span class="text-subtitle-1 font-weight-bold">처리 로그</span>
            <v-spacer />
            <v-btn variant="text" size="small" @click="clearLogs" :disabled="logs.length === 0">
              로그 지우기
            </v-btn>
          </div>

          <div
            style="
              border-radius: 4px;
              padding: 8px;
              height: 340px;
              overflow-y: auto;
              font-family: monospace;
              font-size: 0.8rem;
              background-color: #111;
              color: #eee;
              white-space: pre-wrap;
            "
          >
            <div v-if="logs.length === 0" style="opacity: 0.6">
              아직 로그가 없습니다. 파일을 업로드하면 처리 과정이 표시됩니다.
            </div>
            <div v-for="(log, index) in logs" :key="index">
              {{ log }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const files = ref(null);
const files2 = ref(null);
let fileContent = ref(null);
const frmData = ref({});
const siegeResult = ref(null);
const arenaResult = ref(null);
const logs = ref([]);
const loadingSiege = ref(false);
const loadingArena = ref(false);

const addLog = (message) => {
  const now = new Date();
  const time = now.toTimeString().split(" ")[0];
  logs.value.push(`[${time}] ${message}`);
};

const clearLogs = () => {
  logs.value = [];
};

const handleSiegeUpload = () => {
  if (!files.value) {
    $toast("점령전 JSON 파일을 선택해 주세요.");
    return;
  }
  save(files.value);
};

const handleArenaUpload = () => {
  if (!files2.value || !files2.value[0]) {
    $toast("실레나 로그 파일을 선택해 주세요.");
    return;
  }
  save2(files2.value);
};

const save = (file) => {
  addLog("점령전 JSON 파일 읽기 시작");
  loadingSiege.value = true;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      fileContent.value = reader.result;
      addLog("점령전 JSON 파싱 중...");
      frmData.value = JSON.parse(fileContent.value);
      addLog("서버로 점령전 데이터 전송 중...");
      const res = await $api.post("/summonerswar/json-save", frmData.value);
      siegeResult.value = res.data;
      addLog(
        `점령전 저장 완료 - 인식: ${res.data.totalSiegeCount ?? "-"}건, 저장: ${
          res.data.insertedSiegeCount ?? "-"
        }건, 전투 인식: ${res.data.totalBattleCount ?? "-"}건, 전투 저장: ${
          res.data.insertedBattleCount ?? "-"
        }건`
      );
      $toast("점령전 데이터가 저장되었습니다.");
    } catch (e) {
      console.error(e);
      addLog("점령전 저장 중 오류 발생");
      $toast("점령전 저장 중 오류가 발생했습니다.");
    } finally {
      loadingSiege.value = false;
    }
  };
  reader.onerror = () => {
    loadingSiege.value = false;
    addLog("점령전 파일 읽기 실패");
    $toast("점령전 파일을 읽는 중 오류가 발생했습니다.");
  };
  reader.readAsText(file);
};

const save2 = (fileList) => {
  addLog("실레나 로그 파일 읽기 시작");
  loadingArena.value = true;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      fileContent.value = reader.result;
      addLog("실레나 로그 파싱 중...");
      const jsonArray = fileContent.value.split("\r\n");
      const jsonObjects = [];
      const uniqueObjects = {};
      jsonArray.forEach((item) => {
        if (isJSON(item)) {
          const jsonData = JSON.parse(item);
          if (
            jsonData.command === "getRankerRtpvpReplayList" &&
            jsonData.ranker_replay_list !== undefined
          ) {
            jsonData.ranker_replay_list.forEach((obj) => {
              if (!uniqueObjects[obj.rid]) {
                uniqueObjects[obj.rid] = true;
                jsonObjects.push(obj);
              }
            });
          }
        }
      });
      addLog(`실레나 전투 추출 완료 - 중복 제거 후 ${jsonObjects.length}건`);
      frmData.value.arenaJson = jsonObjects;
      addLog("서버로 실레나 데이터 전송 중...");
      const res = await $api.post("/summonerswar/arena-json-save", frmData.value);
      arenaResult.value = res.data;
      if (res.status == "200" || res.status === 200) {
        console.log(res.data);
        addLog(`실레나 저장 완료 - 성공: ${res.data.success}건, 실패: ${res.data.fail}건`);
        $toast("실레나 데이터 저장 완료");
      } else {
        addLog("실레나 저장 중 오류 응답 수신");
        $toast("실레나 저장 중 오류가 발생했습니다.");
      }
    } catch (e) {
      console.error(e);
      addLog("실레나 저장 중 예외 발생");
      $toast("실레나 저장 중 오류가 발생했습니다.");
    } finally {
      loadingArena.value = false;
    }
  };
  reader.onerror = () => {
    loadingArena.value = false;
    addLog("실레나 파일 읽기 실패");
    $toast("실레나 파일을 읽는 중 오류가 발생했습니다.");
  };
  reader.readAsText(fileList[0].file);
};

const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
</script>
