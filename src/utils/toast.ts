export const $toast = (title: string, type: 'info' | 'error' | 'success' = 'info') => {
  const toast = useToast();

  // 타입별 배경색 설정
  let backgroundColor = '#1867c0'; // 기본 파란색

  if (type === 'error') {
    backgroundColor = '#D32F2F'; // 빨간색
  } else if (type === 'success') {
    backgroundColor = '#2196F3'; // 파란색 (success용)
  }

  toast.show({
    title,
    type,
    timeout: 3000,
    position: 'topCenter',
    progressBar: false,
    backgroundColor,
    titleColor: '#FFFFFF',
    theme: 'dark',
    animateInside: false,
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutUp',
    displayMode: 'replace',
    layout: 1,
    balloon: false,
    close: true,
    drag: false,
    pauseOnHover: true,
    resetOnHover: false,
    maxWidth: 400,
    zindex: 9999,
    class: 'custom-toast',
  });
};
