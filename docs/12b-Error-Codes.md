# Error Code Catalog (Draft)

에러 포맷: `{ "error": { "code": "<CODE>", "message": "...", "details": { ... } } }`
코드 네이밍: `<Domain><HTTP>-<Numeric>` 예) P400-001

## Common (C)
- **C400-001 InvalidPayload**: 스키마 검증 실패
- **C400-002 InvalidQuery**: 지원되지 않는 필터/페이지 파라미터
- **C401-001 Unauthorized**: 토큰 누락/만료/서명 불일치
- **C403-001 Forbidden**: RBAC 위반
- **C404-001 NotFound**: 리소스 없음
- **C409-001 Conflict**: 중복/상태 충돌
- **C413-001 PayloadTooLarge**: 업로드/본문 과대
- **C429-001 RateLimited**: 과도한 요청
- **C500-001 Internal**: 서버 오류
- **C503-001 Unavailable**: 일시적 불가/메인터넌스

## Property (P)
- **P400-001 AddressRequired**: 주소 필수
- **P400-002 DealAmountMismatch**: 거래유형-금액 불일치
- **P400-003 AreaInvalid**: 면적/단위/범위 오류
- **P409-001 InvalidStatusTransition**: 상태 전이 불가
- **P409-002 PublishedRequiresReview**: 공개 전 검수 미충족

## Lead (L)
- **L400-001 RequesterRequired**: 요청자 정보 오류
- **L409-001 BackwardStatusBlocked**: 상태 역행 금지
- **L403-001 AssignForbidden**: 할당 권한 없음

## Contract (K)
- **K400-001 PartiesMissing**: 당사자 누락
- **K409-001 FinalizeChecklistIncomplete**: 필수 체크리스트 미완료
- **K409-002 InvalidDates**: 날짜 상관관계 위반

## Integration (I)
- **I401-001 ApiKeyInvalid**: API 키 유효성 실패
- **I429-001 QuotaExceeded**: 쿼터 초과
- **I502-001 UpstreamError**: 상위 API 오류

## ShareLink (S)
- **S400-001 FieldsEmpty**: visible_fields 필수
- **S403-001 Protected**: 비밀번호 불일치
- **S409-001 Expired**: 만료됨
