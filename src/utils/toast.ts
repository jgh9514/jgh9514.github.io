export const $toast = (title: string, type: 'info' | 'error' = 'info') => {
    const toast = useToast()
    toast.show({
      title,
      type,
      timeout : 3000,
      position: 'topCenter',
      progressBar: false,
      backgroundColor: type === 'info' ? '#1867c0' : '#D32F2F',
      titleColor: '#FFFFFF',
      theme: 'dark',
      animateInside: false,
    })
  }