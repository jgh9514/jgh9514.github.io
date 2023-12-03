<template>
  <div style="padding: 0 10px;">
    <v-file-input v-model="files" label="File input"></v-file-input>
    <vue-upload ref="fileUpload" v-model="files" :input-id="inputId" multiple :drop="true" :drop-directory="true">
      <v-btn>test</v-btn>
    </vue-upload>
    <v-btn @click="save()">등록</v-btn>
  </div>
</template>

<script>
import VueUpload from 'vue-upload-component'
export default {
  components: {
    VueUpload,
  },
  meta: {
    title: 'json 추가',
    key(route) {
      return `/json/${route.params.catalog}`
    },
  },
  data () {
    return {
      inputId: 'file',
      files: [],
      fileContent: null,
      frmData: {},
    }
  },
  async mounted() {},
  methods: {
    save() {
      const reader = new FileReader();
      reader.onload = async () => {
        this.fileContent = reader.result;
        this.frmData = JSON.parse(this.fileContent)
        console.log(this.frmData)
        await this.$axios.post('/api/v1/summonerswar/json-save', this.frmData).then((res) => {
          if (res.data == 'SUCCESS') {
            this.$toast.show('저장되었습니다.')
            this.close()
          }
        })
      };
      reader.readAsText(this.files[0].file);
    },
  },
}
</script>
