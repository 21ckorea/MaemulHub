# RBAC Details (화면/행동/데이터 스코프)

역할: owner, admin, manager, staff, viewer
데이터 스코프: all(전체), team(팀/사무소), mine(담당/작성), read-only(열람만)

## 화면 접근
| 화면 | owner | admin | manager | staff | viewer |
|---|---|---|---|---|---|
| 홈 대시보드 | all | all | team | mine | read-only |
| 매물 리스트/상세 | all | all | team | mine | read-only |
| 매물 편집 | all | all | team | mine |  |
| 고객 리스트/상세 | all | all | team | mine | read-only |
| 고객 편집 | all | all | team | mine |  |
| 의뢰 인박스/상세 | all | all | team | mine |  |
| 계약 파이프라인/상세 | all | all | team | mine |  |
| 일정 | all | all | team | mine | read-only |
| 설정/권한 | all | all |  |  |  |

## 행동 권한
| 행동 | owner | admin | manager | staff | viewer |
|---|---|---|---|---|---|
| 매물 생성/편집/아카이브 | ✓ | ✓ | ✓ | 제한(mine) |  |
| 고객 생성/편집 | ✓ | ✓ | ✓ | 제한(mine) |  |
| 의뢰 할당/상태변경 | ✓ | ✓ | ✓ | 제한(mine) |  |
| 계약 생성/확정/문서출력 | ✓ | ✓ | ✓ | 제한(mine) |  |
| 일정 생성/편집 | ✓ | ✓ | ✓ | ✓ |  |
| 공유 링크 생성/폐기 | ✓ | ✓ | ✓ | 제한(mine) |  |
| 권한/역할 관리 | ✓ | ✓ |  |  |  |
| 감사 로그 열람 | ✓ | ✓ |  |  |  |

## 데이터 스코프 규칙(예)
- **team**: 동일 `office_id`에 속한 레코드만 접근.
- **mine**: `assignee == me` 또는 `created_by == me` 인 레코드만 편집/전환.
- **read-only**: 다운로드/외부공유는 불가(별도 허용 시 화이트리스트).

## 감사(Audit)
- 이벤트: 생성/수정/삭제/열람(민감), 권한변경, 상태전환.
- 로깅: `entity, action, actor, ts, before, after, ip`.
- 보관: 1년 이상(정책에 따름), 내보내기 CSV.
