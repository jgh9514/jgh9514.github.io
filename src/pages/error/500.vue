<template>
  <v-app dark>
    <div class="error-container">
      <div class="error-content" data-aos="fade-up">
        <!-- 에러 아이콘 -->
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <!-- 에러 타이틀 -->
        <h1 class="error-title">문제가 발생했습니다</h1>

        <!-- 에러 설명 -->
        <p class="error-description">
          일시적인 오류로 인해 요청하신 작업을 처리할 수 없습니다.<br>
          잠시 후 다시 시도해 주시기 바랍니다.
        </p>

        <!-- 추가 안내 -->
        <p class="error-sub-text">
          문제가 지속될 경우 고객센터로 문의해 주세요.
        </p>

        <!-- 액션 버튼 -->
        <div class="error-actions">
          <v-btn 
            color="primary" 
            size="large" 
            variant="flat"
            class="action-btn"
            @click="navigateTo('/')">
            <v-icon start>mdi-home</v-icon>
            홈으로 이동
          </v-btn>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script setup>
definePageMeta({
  layout: 'empty'
})

defineOptions({
  name: 'ErrorInfo',
  meta: {
    title: '에러가 발생했습니다.'
  }
})
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  padding: 20px;
}

.error-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.error-icon svg {
  width: 50px;
  height: 50px;
  color: white;
  stroke-width: 2.5;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
  }
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 20px;
  line-height: 1.3;
}

.error-description {
  font-size: 18px;
  color: #4a5568;
  margin-bottom: 16px;
  line-height: 1.6;
}

.error-sub-text {
  font-size: 14px;
  color: #718096;
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 160px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 태블릿 (768px 이하) */
@media (max-width: 768px) {
  .error-content {
    padding: 50px 30px;
    border-radius: 16px;
  }

  .error-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 24px;
  }

  .error-icon svg {
    width: 40px;
    height: 40px;
  }

  .error-title {
    font-size: 28px;
    margin-bottom: 16px;
  }

  .error-description {
    font-size: 16px;
    margin-bottom: 14px;
  }

  .error-sub-text {
    font-size: 13px;
    margin-bottom: 32px;
  }

  .error-actions {
    gap: 12px;
  }

  .action-btn {
    min-width: 140px;
  }
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .error-container {
    padding: 16px;
  }

  .error-content {
    padding: 40px 24px;
    border-radius: 12px;
  }

  .error-icon {
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
  }

  .error-icon svg {
    width: 35px;
    height: 35px;
  }

  .error-title {
    font-size: 24px;
    margin-bottom: 14px;
  }

  .error-description {
    font-size: 15px;
    margin-bottom: 12px;
  }

  .error-sub-text {
    font-size: 12px;
    margin-bottom: 28px;
  }

  .error-actions {
    flex-direction: column;
    gap: 10px;
  }

  .action-btn {
    width: 100%;
    min-width: unset;
  }
}

/* 작은 모바일 (360px 이하) */
@media (max-width: 360px) {
  .error-content {
    padding: 32px 20px;
  }

  .error-title {
    font-size: 22px;
  }

  .error-description {
    font-size: 14px;
  }

  .error-icon {
    width: 60px;
    height: 60px;
  }

  .error-icon svg {
    width: 30px;
    height: 30px;
  }
}
</style>