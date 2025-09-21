export default defineNuxtPlugin(() => {
  // 클라이언트 사이드에서만 실행
  if (process.client) {
    // crypto polyfill for browser compatibility
    if (!window.crypto) {
      // @ts-ignore
      window.crypto = {
        getRandomValues: (array: any) => {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
          return array;
        },
        randomUUID: () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        },
      };
    }
  }
});
