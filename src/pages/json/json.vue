<template>
  <div style="padding: 0 10px">
    <div>점령전</div>
    <v-container>
      <v-row style="align-items: center;">
        <v-col cols="9">
        <vue-upload
          ref="fileUpload"
          v-model="files"
          :input-id="inputId"
          :drop="true"
          :drop-directory="true"
        >
          <v-file-input v-model="files" label="File input"></v-file-input>
        </vue-upload>
      </v-col>
      <v-col cols="3">
        <v-btn @click="save(files)">등록</v-btn>
      </v-col>
      </v-row>
    </v-container>
    <div>실레나</div>
    <v-container>
      <v-row style="align-items: center;">
        <v-col cols="9">
        <vue-upload
          ref="fileUpload"
          v-model="files2"
          :input-id="inputId2"
          :drop="true"
          :drop-directory="true"
        >
          <v-file-input v-model="files2" label="File input"></v-file-input>
        </vue-upload>
      </v-col>
      <v-col cols="3">
        <v-btn @click="save(files2)">등록</v-btn>
      </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import VueUpload from "vue-upload-component";
export default {
  components: {
    VueUpload,
  },
  meta: {
    title: "json 추가",
    key(route) {
      return `/json/${route.params.catalog}`;
    },
  },
  data() {
    return {
      inputId: "file",
      inputId2: "file2",
      files: [],
      files2: [],
      fileContent: null,
      frmData: {},
    };
  },
  async mounted() {},
  methods: {
    save(file) {
      const reader = new FileReader();
      reader.onload = async () => {
        this.fileContent = reader.result;
        const jsonArray = this.fileContent.split("\r\n");
        const jsonObjects = [];
        const uniqueObjects = {};
        jsonArray.forEach((item) => {
          if (this.isJSON(item)) {
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
        
        console.log(jsonObjects);
        this.frmData.arenaJson = jsonObjects;
        await this.$axios
          .post("/api/v1/summonerswar/arena-json-save", this.frmData)
          .then((res) => {
            if (res.status == "200") {
              console.log(res.data);
              this.$toast.show("성공 : " + res.data.success + "개, 실패 : " + res.data.fail + "개");
            }
          });
        // this.frmData = JSON.parse(this.fileContent);
        // console.log(this.frmData);
        // await this.$axios
        //   .post("/api/v1/summonerswar/json-save", this.frmData)
        //   .then((res) => {
        //     if (res.data == "SUCCESS") {
        //       this.$toast.show("저장되었습니다.");
        //       this.close();
        //     }
        //   });
      };
      reader.readAsText(file[0].file);
    },
    isJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    },
  },
};
</script>
