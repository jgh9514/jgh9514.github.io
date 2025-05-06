<template>
  <div class="full-width" style="height: 100vh;">
    <div class="absolute-center">
      <v-card
        class="mx-auto pa-3"
        min-width="400"
        flat
      >
        <v-card-item class="mt-4">
          <div class="text-h5 text-center font-weight-bold">
            Login
          </div>
        </v-card-item>
        <v-card-item class="mt-4">
          <v-text-field
            v-model="frmDatas.id"
            placeholder="ID"
            color="#2CA4F7"
            variant="outlined"
            block
          />
          <v-text-field
            v-model="frmDatas.password"
            type="password"
            placeholder="Password"
            color="#2CA4F7"
            variant="outlined"
            block
            @keyup.enter="login"
          />
        </v-card-item>
        <v-card-item class="mt-2">
          <v-btn
            color="red-lighten-2"
            text="Login"
            variant="outlined"
            block
            @click="login"
          />
        </v-card-item>
      </v-card>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: 'empty'
})

const validation = () => {
  // if($gfn_isEmpty(frmDatas.value.cmpy_cd)) {
  //   alert('회사코드를 입력해주세요.')
  //   return
  // }
  if($gfn_isEmpty(frmDatas.value.id)) {
    $toast($t('아이디를 입력해주세요.'), 'error')
    return false
  }
  if($gfn_isEmpty(frmDatas.value.password)) {
    $toast($t('비밀번호를 입력해주세요.'), 'error')
    return false
  }

  return true
}

const frmDatas = ref({
  cmpy_cd: '',
  id: '',
  password: ''
})

const login = async () => {
  if(validation()) {
    await $api.get('/common/login', frmDatas.value)
    const res = await $api.get('/common/whoami')
    $gfn_setUser(res.userInfo)

    location.href = '/'
  }
}
</script>
<style scoped>
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>