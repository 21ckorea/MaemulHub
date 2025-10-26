# Transition Rules (Guards & Effects)

엔티티별 상태 전이 규칙을 명시합니다. 상태도(`docs/14-State-Diagrams.puml`)와 함께 참고.

## Property
- draft → review
  - Guard: 필수 필드 충실도 ≥ 70%
  - Effect: reviewer 지정(없으면 관리자 큐)
- review → published
  - Guard: 필수 필드 충실도 ≥ 80%, 공공데이터 조회 최신(≤72h)
  - Effect: 공개 타임스탬프 기록, 공유링크 생성 옵션 표시
- published → in_contract
  - Guard: 계약 레코드 존재(status=drafting|pendingApproval)
  - Effect: 매물 상태 잠금(핵심 필드 편집 제한)
- in_contract → closed
  - Guard: 계약 finalized
  - Effect: 공개 비활성, 공유링크 자동 만료 옵션
- published → review
  - Guard: 관리자/매니저 권한
  - Effect: 공개 해제, 재검수 요청 알림

## Lead
- new → consult
  - Guard: first_response 기록
  - Effect: SLA 중지/재설정
- consult → match
  - Guard: 추천 리스트 ≥1
  - Effect: 추천 결과 로그
- match → tour
  - Guard: 일정 생성(투어)
  - Effect: 알림/캘린더 등록
- tour → negotiate
  - Guard: 피드백 기록
  - Effect: 제안/역제안 기록 시작
- negotiate → contract
  - Guard: 계약 초안 생성
  - Effect: 리드 상태 read-only(일부 필드), 계약 연결
- contract → closed
  - Guard: 계약 확정
  - Effect: 리드 종료 사유 기록

- 역행 금지: 상위 단계→하위 단계 전환 시 `reason` 필수, 감사 로그 기록.

## Contract
- drafting → pendingApproval
  - Guard: 체크리스트(required) 100% 완료
  - Effect: 승인 요청 알림
- pendingApproval → finalized
  - Guard: 승인자 권한(manager+)
  - Effect: 계약 확정, 관련 일정(잔금/입주) 생성 옵션
- finalized → archived
  - Guard: 잔금 완료/입주 완료
  - Effect: 관련 알림 종료, 보고서 집계 반영

## ShareLink
- active → expired
  - Guard: 현재시간 ≥ expires_at
  - Effect: 공개 차단
- active → revoked
  - Guard: 생성자/관리자 권한
  - Effect: 공개 차단, 접근 로그 기록
