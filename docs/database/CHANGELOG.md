# 데이터베이스 변경 이력

## 2025-10-12

### 메뉴 구조 DML 생성
- **파일**: `docs/database/menu-structure-dml.sql`
- **설명**: 애플리케이션의 전체 메뉴 구조를 데이터베이스에 삽입하는 DML 생성
- **포함 내용**:
  - 페이지 데이터 (sys_page): 20개 페이지
  - 메뉴 데이터 (sys_menu): 1단계 메뉴 6개, 2단계 메뉴 16개
  - 메뉴 권한 데이터 (sys_menu_role): 시스템 관리자 및 일반 사용자 권한 매핑

### 메뉴 구조
```
1. 홈 (/)
2. 로그인 (/login)
3. 실레나 (/rta)
4. 점령전
   ├─ 전체 점령전 (/siege)
   ├─ 최근 점령전 (/recentSiege)
   └─ 시즌 성적표 (/record)
5. 시스템 관리 (관리자만)
   ├─ 코드 관리 (/preference/cdmn)
   ├─ 코드 관계 (/preference/cdrelmn)
   ├─ 사용자 목록 (/preference/userlist)
   ├─ 권한 관리 (/preference/rolemn)
   ├─ 권한별 사용자 (/preference/mrgd/roleuserlist)
   ├─ 메뉴 관리 (/preference/menumn)
   ├─ 권한별 메뉴 (/preference/rolemenumn)
   ├─ 화면 관리 (/preference/pagemn)
   ├─ API 관리 (/preference/apimn)
   ├─ 권한별 API (/preference/roleapimn)
   ├─ 다국어 관리 (/preference/mlangmn)
   ├─ 로그인 이력 (/preference/loginhislist)
   └─ API 이력 (/preference/apihislist)
6. 설정 (/settings)
```

### 권한 규칙
- **RL0001 (시스템 관리자)**: 모든 메뉴 접근 가능
- **RL0002 (일반 사용자)**: `/admin` 경로를 제외한 모든 메뉴 접근 가능

### 프론트엔드 권한 체크 구현
1. **미들웨어** (`src/middleware/auth.global.ts`):
   - `/admin` 경로 접근 시 사용자 권한 체크
   - `RL0001` 권한이 없으면 `/error/403` 페이지로 리다이렉트
   
2. **메뉴바** (`src/components/common/menu-bar.vue`):
   - `adminOnly: true` 플래그로 관리자 전용 메뉴 표시
   - 일반 사용자는 시스템 관리 메뉴가 보이지 않음

### 생성된 문서
1. **menu-structure-dml.sql**: 실행 가능한 DML 스크립트
2. **menu-structure-generator.md**: DML 생성 가이드 및 자동화 계획
3. **CHANGELOG.md**: 변경 이력 (본 파일)

### 향후 계획
- [ ] 메뉴 구조 자동 추출 스크립트 개발
- [ ] DML 자동 생성 CLI 도구 개발
- [ ] 데이터베이스 동기화 도구 개발

