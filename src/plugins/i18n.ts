export default defineNuxtPlugin(async () => {
  const { $i18n } = useNuxtApp();

  try {
    const messages: any = {};
    // DB에서 메시지 데이터 가져오기
    // const response = await $api.get('/comm/mlang/i18n')
    // const messages = response
    //   $i18n.fallbackLocale.value = 'ko'
    //   // 뷰티파이 메시지 설정 (이거 손 봐야할 듯. console. 에 warning 떠서 임시로 넣어놓음.)
    messages['$vuetify.open'] = 'open';
    messages['$vuetify.close'] = 'close';
    //   messages['$vuetify.input.clear'] = 'clear'
    messages['$vuetify.noDataText'] = '데이터가 없습니다.';
    //   // messages.$vuetify.open = 'open'
    //   // messages.$vuetify.close = 'close'
    //   // 다국어 메시지 설정
    $i18n.setLocaleMessage('ko', messages);
  } catch (error) {
    console.error('Failed to load i18n messages:', error);
  }
});
