-- ============================================
-- 메뉴 구조 DML
-- 생성일: 2025-10-12
-- 설명: 애플리케이션의 전체 메뉴 구조 데이터
-- 
-- 권한 규칙:
-- - RL0001 (시스템 관리자): 모든 메뉴 접근 가능
-- - RL0002 (일반 사용자): /admin 경로를 제외한 모든 메뉴 접근 가능
-- - 프론트엔드 미들웨어(auth.global.ts)에서 /admin 경로 접근 시 권한 체크
-- - 메뉴바 컴포넌트에서 권한에 따라 시스템 관리 메뉴 표시/숨김
-- ============================================

-- ============================================
-- 1. 페이지 데이터 (sys_page)
-- ============================================

-- 기존 데이터 삭제 (개발환경용)
DELETE FROM public.sys_menu_role;
DELETE FROM public.sys_menu;
DELETE FROM public.sys_page;

-- 페이지 데이터 삽입
INSERT INTO public.sys_page (page_id, page_nm, page_url, page_desc, srt_sn, usg_yn, del_yn, crt_user_id, crt_date, upt_user_id, upt_date) VALUES
('PAGE001', '홈', '/', '메인 홈 페이지', 1, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE002', '로그인', '/login', '로그인 페이지', 2, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE003', '실레나', '/rta', '실레나 페이지', 3, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE004', '전체 점령전', '/siege', '전체 점령전 목록', 4, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE005', '최근 점령전', '/recentSiege', '최근 점령전 목록', 5, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE006', '시즌 성적표', '/record', '시즌 성적표', 6, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE007', '설정', '/settings', '설정 페이지', 7, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE008', '코드 관리', '/preference/cdmn', '공통 코드 관리', 8, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE009', '코드 관계', '/preference/cdrelmn', '코드 관계 관리', 9, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE010', '사용자 목록', '/preference/userlist', '사용자 목록 관리', 10, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE011', '권한 관리', '/preference/rolemn', '권한 관리', 11, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE012', '권한별 사용자', '/preference/mrgd/roleuserlist', '권한별 사용자 관리', 12, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE013', '메뉴 관리', '/preference/menumn', '메뉴 관리', 13, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE014', '권한별 메뉴', '/preference/rolemenumn', '권한별 메뉴 관리', 14, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE015', '화면 관리', '/preference/pagemn', '화면 관리', 15, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE016', 'API 관리', '/preference/apimn', 'API 관리', 16, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE017', '권한별 API', '/preference/roleapimn', '권한별 API 관리', 17, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE018', '다국어 관리', '/preference/mlangmn', '다국어 관리', 18, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE019', '로그인 이력', '/preference/loginhislist', '로그인 이력 조회', 19, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('PAGE020', 'API 이력', '/preference/apihislist', 'API 이력 조회', 20, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW());

-- ============================================
-- 2. 메뉴 데이터 (sys_menu)
-- ============================================

-- 1단계 메뉴 (pr_menu_id = NULL)
INSERT INTO public.sys_menu (menu_id, pr_menu_id, menu_url, menu_nm, page_id, sort_sn, usg_yn, del_yn, crt_user_id, crt_date, upt_user_id, upt_date) VALUES
('M00001', NULL, '/', '홈', 'PAGE001', 1, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00002', NULL, '/login', '로그인', 'PAGE002', 2, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00003', NULL, '/rta', '실레나', 'PAGE003', 3, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00004', NULL, NULL, '점령전', NULL, 4, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00005', NULL, NULL, '시스템 관리', NULL, 5, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00006', NULL, '/settings', '설정', 'PAGE007', 6, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW());

-- 2단계 메뉴 (점령전 하위 메뉴)
INSERT INTO public.sys_menu (menu_id, pr_menu_id, menu_url, menu_nm, page_id, sort_sn, usg_yn, del_yn, crt_user_id, crt_date, upt_user_id, upt_date) VALUES
('M00401', 'M00004', '/siege', '전체 점령전', 'PAGE004', 1, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00402', 'M00004', '/recentSiege', '최근 점령전', 'PAGE005', 2, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00403', 'M00004', '/record', '시즌 성적표', 'PAGE006', 3, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW());

-- 2단계 메뉴 (시스템 관리 하위 메뉴)
INSERT INTO public.sys_menu (menu_id, pr_menu_id, menu_url, menu_nm, page_id, sort_sn, usg_yn, del_yn, crt_user_id, crt_date, upt_user_id, upt_date) VALUES
('M00501', 'M00005', '/preference/cdmn', '코드 관리', 'PAGE008', 1, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00502', 'M00005', '/preference/cdrelmn', '코드 관계', 'PAGE009', 2, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00503', 'M00005', '/preference/userlist', '사용자 목록', 'PAGE010', 3, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00504', 'M00005', '/preference/rolemn', '권한 관리', 'PAGE011', 4, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00505', 'M00005', '/preference/mrgd/roleuserlist', '권한별 사용자', 'PAGE012', 5, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00506', 'M00005', '/preference/menumn', '메뉴 관리', 'PAGE013', 6, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00507', 'M00005', '/preference/rolemenumn', '권한별 메뉴', 'PAGE014', 7, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00508', 'M00005', '/preference/pagemn', '화면 관리', 'PAGE015', 8, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00509', 'M00005', '/preference/apimn', 'API 관리', 'PAGE016', 9, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00510', 'M00005', '/preference/roleapimn', '권한별 API', 'PAGE017', 10, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00511', 'M00005', '/preference/mlangmn', '다국어 관리', 'PAGE018', 11, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00512', 'M00005', '/preference/loginhislist', '로그인 이력', 'PAGE019', 12, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00513', 'M00005', '/preference/apihislist', 'API 이력', 'PAGE020', 13, 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW());

-- ============================================
-- 3. 메뉴 권한 데이터 (sys_menu_role)
-- ============================================

-- 시스템 관리자(RL0001)는 모든 메뉴 접근 가능
INSERT INTO public.sys_menu_role (menu_id, role_id, usg_yn, del_yn, crt_user_id, crt_date, upt_user_id, upt_date) VALUES
-- 1단계 메뉴
('M00001', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00002', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00003', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00004', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00005', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00006', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
-- 점령전 하위 메뉴
('M00401', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00402', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00403', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
-- 시스템 관리 하위 메뉴
('M00501', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00502', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00503', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00504', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00505', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00506', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00507', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00508', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00509', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW'),
('M00510', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00511', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00512', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00513', 'RL0001', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW());

-- 일반 사용자(RL0002)는 시스템 관리 제외한 메뉴 접근 가능
INSERT INTO public.sys_menu_role (menu_id, role_id, usg_yn, del_yn, crt_user_id, crt_date, upt_user_id, upt_date) VALUES
-- 1단계 메뉴 (시스템 관리 제외)
('M00001', 'RL0002', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00002', 'RL0002', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00003', 'RL0002', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00004', 'RL0002', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00006', 'RL0002', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
-- 점령전 하위 메뉴
('M00401', 'RL0002', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00402', 'RL0002', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW()),
('M00403', 'RL0002', 'Y', 'N', 'ADMIN', NOW(), 'ADMIN', NOW());

-- ============================================
-- 4. 검증 쿼리
-- ============================================

-- 페이지 목록 확인
-- SELECT * FROM public.sys_page ORDER BY srt_sn;

-- 메뉴 목록 확인 (계층 구조)
-- SELECT 
--     m1.menu_id,
--     m1.menu_nm,
--     m1.menu_url,
--     m1.pr_menu_id,
--     m2.menu_nm as parent_menu_nm,
--     m1.sort_sn,
--     m1.page_id
-- FROM public.sys_menu m1
-- LEFT JOIN public.sys_menu m2 ON m1.pr_menu_id = m2.menu_id
-- ORDER BY 
--     COALESCE(m1.pr_menu_id, m1.menu_id),
--     m1.sort_sn;

-- 권한별 메뉴 확인
-- SELECT 
--     mr.role_id,
--     m.menu_id,
--     m.menu_nm,
--     m.menu_url,
--     m.pr_menu_id
-- FROM public.sys_menu_role mr
-- INNER JOIN public.sys_menu m ON mr.menu_id = m.menu_id
-- WHERE mr.usg_yn = 'Y' AND mr.del_yn = 'N'
-- ORDER BY mr.role_id, m.sort_sn;

-- ============================================
-- 메뉴 구조 요약
-- ============================================
-- 
-- 1. 홈 (/)
-- 2. 로그인 (/login)
-- 3. 실레나 (/rta)
-- 4. 점령전
--    ├─ 전체 점령전 (/siege)
--    ├─ 최근 점령전 (/recentSiege)
--    └─ 시즌 성적표 (/record)
-- 5. 시스템 관리 (관리자만 접근)
--    ├─ 코드 관리 (/preference/cdmn)
--    ├─ 코드 관계 (/preference/cdrelmn)
--    ├─ 사용자 목록 (/preference/userlist)
--    ├─ 권한 관리 (/preference/rolemn)
--    ├─ 권한별 사용자 (/preference/mrgd/roleuserlist)
--    ├─ 메뉴 관리 (/preference/menumn)
--    ├─ 권한별 메뉴 (/preference/rolemenumn)
--    ├─ 화면 관리 (/preference/pagemn)
--    ├─ API 관리 (/preference/apimn)
--    ├─ 권한별 API (/preference/roleapimn)
--    ├─ 다국어 관리 (/preference/mlangmn)
--    ├─ 로그인 이력 (/preference/loginhislist)
--    └─ API 이력 (/preference/apihislist)
-- 6. 설정 (/settings)
-- 
-- ============================================

