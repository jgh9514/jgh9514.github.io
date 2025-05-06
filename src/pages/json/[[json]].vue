<template>
  <div style="padding: 0 10px">
    <div>점령전</div>
    <v-container>
      <v-row style="align-items: center">
        <v-col cols="9">
          <v-file-input v-model="files" label="File input"></v-file-input>
        </v-col>
        <v-col cols="3">
          <v-btn @click="save(files)">등록</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div>실레나</div>
    <v-container>
      <v-row style="align-items: center">
        <v-col cols="9">
          <v-file-input v-model="files2" label="File input"></v-file-input>
        </v-col>
        <v-col cols="3">
          <v-btn @click="save2(files2)">등록</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const files = ref([]);
const files2 = ref([]);
let fileContent = ref(null);
const frmData = ref({});

const save = (file) => {
  const reader = new FileReader();
  reader.onload = async () => {
    fileContent.value = reader.result;
    frmData.value = JSON.parse(fileContent.value);
    await $api.post("/summonerswar/json-save", frmData.value);
    $toast("저장되었습니다.");
    close();
  };
  reader.readAsText(file);
};

const save2 = (file) => {
  const reader = new FileReader();
  reader.onload = async () => {
    fileContent.value = reader.result;
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
    frmData.value.arenaJson = jsonObjects;
    const res = await $api.post("/summonerswar/arena-json-save", frmData.value);
    if (res.status == "200") {
      console.log(res.data);
      $toast("성공 : " + res.data.success + "개, 실패 : " + res.data.fail + "개");
    }
  };
  reader.readAsText(file[0].file);
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
