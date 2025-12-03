# 메뉴 구조 DML 생성 가이드

## 개요
이 문서는 애플리케이션의 메뉴 구조를 데이터베이스 DML로 자동 생성하기 위한 가이드입니다.

## 데이터 소스
메뉴 구조는 다음 파일에서 관리됩니다:
- **메뉴 정의**: `src/components/common/menu-bar.vue`
- **메뉴 스토어**: `src/stores/menus.ts`
- **페이지 라우트**: `src/pages/` 디렉토리

## DML 생성 규칙

### 1. 페이지 ID 규칙 (sys_page)
- **형식**: `PAGE` + 3자리 숫자 (예: PAGE001, PAGE002, ...)
- **순서**: 메뉴 구조의 표시 순서대로 부여
- **필수 컬럼**:
  - `page_id`: 페이지 고유 ID
  - `page_nm`: 페이지명 (화면에 표시되는 이름)
  - `page_url`: 페이지 URL 경로
  - `page_desc`: 페이지 설명
  - `srt_sn`: 정렬 순서
  - `usg_yn`: 사용 여부 (기본값: 'Y')
  - `del_yn`: 삭제 여부 (기본값: 'N')
  - `crt_user_id`: 생성자 ID (기본값: 'ADMIN')
  - `crt_date`: 생성일시 (기본값: NOW())
  - `upt_user_id`: 수정자 ID (기본값: 'ADMIN')
  - `upt_date`: 수정일시 (기본값: NOW())

### 2. 메뉴 ID 규칙 (sys_menu)
- **1단계 메뉴**: `M` + 5자리 숫자 (예: M00001, M00002, ...)
- **2단계 메뉴**: 부모 메뉴 ID + 2자리 숫자 (예: M00401, M00402, ...)
- **3단계 메뉴**: 부모 메뉴 ID의 마지막 2자리 + 2자리 숫자 (예: M040101, M040102, ...)

### 3. 메뉴 계층 구조
- **pr_menu_id**: 
  - 1단계 메뉴: `NULL`
  - 2단계 이상: 부모 메뉴의 `menu_id`
- **level**: 메뉴 레벨 (0: 1단계, 1: 2단계, 2: 3단계)
  - 주의: 코드에서는 0부터 시작하지만, 사람이 읽을 때는 1단계, 2단계로 표현

### 4. 권한별 메뉴 매핑 (sys_menu_role)
- **RL0001 (시스템 관리자)**: 모든 메뉴 접근 가능
- **RL0002 (일반 사용자)**: 시스템 관리 메뉴 제외한 모든 메뉴 접근 가능

### 5. 프론트엔드 권한 체크
#### 미들웨어 (src/middleware/auth.global.ts)
- `/admin` 경로로 시작하는 모든 페이지에 대해 권한 체크
- 사용자 정보에서 `roles` 또는 `role_id` 확인
- `RL0001` 권한이 없으면 `/error/403` 페이지로 리다이렉트

#### 메뉴 표시 (src/components/common/menu-bar.vue)
- `adminOnly: true` 플래그가 있는 메뉴는 관리자에게만 표시
- `computed` 속성으로 사용자 권한에 따라 메뉴 필터링
- 일반 사용자는 시스템 관리 메뉴 자체를 볼 수 없음

## DML 생성 프로세스

### 단계 1: 메뉴 구조 파악
```typescript
// src/components/common/menu-bar.vue의 additionalMenus 확인
const additionalMenus = ref([
  {
    title: '메뉴명',
    value: 'menu-key',
    icon: 'mdi-icon',
    path: '/path',
    children: [...]  // 하위 메뉴가 있는 경우
  }
]);
```

### 단계 2: 페이지 데이터 생성
1. `src/pages/` 디렉토리에서 모든 페이지 파일 목록 추출
2. 각 페이지에 대해 PAGE ID 부여
3. URL 경로와 페이지명 매핑
4. INSERT 문 생성

### 단계 3: 메뉴 데이터 생성
1. 1단계 메뉴 생성 (pr_menu_id = NULL)
2. 2단계 메뉴 생성 (부모 메뉴 ID 연결)
3. 3단계 메뉴 생성 (있는 경우)
4. 각 메뉴에 page_id 연결 (그룹 메뉴는 NULL)

### 단계 4: 권한별 메뉴 매핑 생성
1. 시스템 관리자용: 모든 메뉴 ID 추출하여 매핑
2. 일반 사용자용: 시스템 관리 메뉴 제외하고 매핑

## 자동화 스크립트 (추후 구현)

### Node.js 스크립트 예시
```javascript
// scripts/generate-menu-dml.js
const fs = require('fs');
const path = require('path');

// 1. menu-bar.vue 파싱하여 메뉴 구조 추출
// 2. src/pages 디렉토리 스캔하여 페이지 목록 추출
// 3. 메뉴와 페이지 매핑
// 4. DML 생성

async function generateMenuDML() {
  // 구현 예정
}
```

## 현재 메뉴 구조 (2025-10-12 기준)

### 메뉴 트리
```
1. 홈 (/)                              - PAGE001, M00001
2. 로그인 (/login)                     - PAGE002, M00002
3. 실레나 (/rta)                       - PAGE003, M00003
4. 점령전                              - M00004 (그룹)
   ├─ 전체 점령전 (/siege)              - PAGE004, M00401
   ├─ 최근 점령전 (/recentSiege)        - PAGE005, M00402
   └─ 시즌 성적표 (/record)             - PAGE006, M00403
5. 시스템 관리                          - M00005 (그룹, 관리자만)
   ├─ 코드 관리 (/preference/cdmn)          - PAGE008, M00501
   ├─ 코드 관계 (/preference/cdrelmn)       - PAGE009, M00502
   ├─ 사용자 목록 (/preference/userlist)    - PAGE010, M00503
   ├─ 권한 관리 (/preference/rolemn)        - PAGE011, M00504
   ├─ 권한별 사용자 (/preference/mrgd/roleuserlist) - PAGE012, M00505
   ├─ 메뉴 관리 (/preference/menumn)        - PAGE013, M00506
   ├─ 권한별 메뉴 (/preference/rolemenumn)  - PAGE014, M00507
   ├─ 화면 관리 (/preference/pagemn)        - PAGE015, M00508
   ├─ API 관리 (/preference/apimn)          - PAGE016, M00509
   ├─ 권한별 API (/preference/roleapimn)    - PAGE017, M00510
   ├─ 다국어 관리 (/preference/mlangmn)     - PAGE018, M00511
   ├─ 로그인 이력 (/preference/loginhislist) - PAGE019, M00512
   └─ API 이력 (/preference/apihislist)     - PAGE020, M00513
6. 설정 (/settings)                    - PAGE007, M00006
```

### 권한 매핑
- **RL0001 (시스템 관리자)**: 모든 메뉴 (M00001 ~ M00006, M00401 ~ M00403, M00501 ~ M00513)
- **RL0002 (일반 사용자)**: 시스템 관리 제외 (M00001 ~ M00004, M00006, M00401 ~ M00403)

## 유지보수 가이드

### 메뉴 추가 시
1. `menu-bar.vue`의 `additionalMenus` 배열에 메뉴 추가
2. 해당 페이지 컴포넌트를 `src/pages/`에 생성
3. 이 가이드를 참고하여 DML 생성:
   - PAGE ID 부여 (마지막 번호 + 1)
   - MENU ID 부여 (규칙에 따라)
   - 권한별 메뉴 매핑 추가
4. 생성된 DML을 데이터베이스에 적용

### 메뉴 수정 시
1. `menu-bar.vue`에서 메뉴 정보 수정
2. 필요시 페이지 컴포넌트 경로 변경
3. UPDATE 문으로 데이터베이스 반영

### 메뉴 삭제 시
1. `menu-bar.vue`에서 메뉴 제거
2. 데이터베이스에서 논리 삭제 (del_yn = 'Y')
   ```sql
   UPDATE sys_menu SET del_yn = 'Y', upt_date = NOW() WHERE menu_id = 'M00XXX';
   UPDATE sys_menu_role SET del_yn = 'Y', upt_date = NOW() WHERE menu_id = 'M00XXX';
   ```

## 참고 사항
- 메뉴 삭제는 물리적 삭제가 아닌 논리적 삭제(del_yn = 'Y') 사용 권장
- sort_sn 값은 10단위로 부여하면 중간 삽입 시 유연함
- 메뉴 URL이 없는 경우(그룹 메뉴)는 menu_url과 page_id를 NULL로 설정
- crt_user_id와 upt_user_id는 실제 사용자 ID로 변경 가능

## 자동화 TODO
- [ ] menu-bar.vue 파싱 스크립트 작성
- [ ] pages 디렉토리 스캔 스크립트 작성
- [ ] DML 생성 템플릿 엔진 구현
- [ ] CLI 도구 개발 (`npm run generate:menu-dml`)
- [ ] 메뉴 구조 검증 도구 개발
- [ ] 데이터베이스 동기화 도구 개발

