# E2E Test Scenarios (MVP)

형식: Precondition / Steps / Expected

## 1) Lead → Contract Happy Path
- **Precondition**: 통합 설정 완료, 유저(매니저) 로그인
- **Steps**
  1. 공유 링크 통해 리드 생성(요청자/조건 입력)
  2. 인박스에서 매니저가 리드 수락/할당
  3. 추천 매물 조회 후 2건 공유
  4. 투어 일정 생성(캘린더 등록/알림)
  5. 투어 후 피드백 기록, 협의 전환
  6. 계약 초안 생성(체크리스트 포함)
  7. 필수 체크리스트 완료 → 승인 요청 → 확정
  8. 리드 상태 계약→종료 전환
- **Expected**
  - 각 단계 상태/로그 기록, SLA 준수, 계약 finalized, 관련 일정 생성 옵션 노출

## 2) Property Publish Gate (검수 통과 후 공개)
- **Precondition**: 매물 초안 존재, 필수 필드 일부 미입력
- **Steps**
  1. 초안→검수 전환 시 충실도 경고 확인(70% 미만)
  2. 필수/핵심 필드 보완 후 검수 통과(≥80%)
  3. 공공데이터 최신 스냅샷(≤72h) 보장
  4. 검수→공개 전환
- **Expected**
  - 70% 미만 전환 차단, 80% 이상 + 공공데이터 요건 충족 시 공개 성공, 공개 타임스탬프 기록

## 3) Monthly Rent Validation (월세 금액 규칙)
- **Precondition**: deal_type=monthly
- **Steps**
  1. deposit 누락 저장 시도
  2. rent 누락 저장 시도
  3. deposit+rent 유효 값 저장 시도
- **Expected**
  - 1~2단계 `P400-002 DealAmountMismatch` 오류, 3단계 저장 성공

## 4) RBAC Enforcement (Staff Scope)
- **Precondition**: staff 로그인, 타 담당자의 매물 존재
- **Steps**
  1. 다른 담당자 매물 편집 시도
  2. 본인 담당 매물 편집 시도
- **Expected**
  - 1단계 `C403-001 Forbidden`, 2단계 성공

## 5) Status Backward Block (Lead 역행 금지)
- **Precondition**: 리드 상태=협의
- **Steps**
  1. 협의→상담 전환 시도(사유 미입력)
  2. 협의→상담 전환 시도(사유 입력)
- **Expected**
  - 1단계 `L409-001 BackwardStatusBlocked`, 2단계 허용하되 감사 로그에 사유 기록

## 6) Share Link Lifecycle
- **Precondition**: 공개 매물 존재, 공유링크 생성
- **Steps**
  1. 만료시간 지난 후 접근 시도
  2. 비밀번호 설정 후 접근(오류→정상)
  3. 링크 폐기 후 접근 시도
- **Expected**
  - 1단계 `S409-001 Expired`, 2단계 `S403-001 Protected`→정상, 3단계 접근 차단/로그 기록

## 7) Integration Quota Handling
- **Precondition**: 공공데이터 쿼터 고갈 상태 시뮬레이션
- **Steps**
  1. 실거래가 조회 요청 연속 호출
- **Expected**
  - `I429-001 QuotaExceeded`, 백오프/캐시 사용 안내

## 8) Calendar & Notifications
- **Precondition**: Firebase 푸시 설정
- **Steps**
  1. 투어 일정 생성(30분 전 리마인드)
  2. 30분 전 푸시 수신 확인
- **Expected**
  - 일정 저장, 리마인드 시각에 푸시 수신, 타임라인 기록
