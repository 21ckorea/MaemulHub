# Validation Matrix (필수/형식/범위/교차 규칙)

아래 표는 핵심 엔티티별 주요 필드의 검증 규칙을 정의합니다. 규칙 키워드: R(필수), O(선택), F(형식), B(범위), X(교차)

## Property(매물)
| 필드 | 규칙 | 설명 |
|---|---|---|
| type | R | 아파트/오피스텔/상가/토지/다가구/빌라 |
| address | R,F | 주소 자동완성/검색 허용, 문자열 길이 5~200 |
| geo | O,F | {lat:-90~90, lng:-180~180} |
| area_supply | O,B | >0, m² 단위 |
| area_exclusive | O,B,X | >0, 전용<=공급 권고(위반시 경고) |
| floor | O,B | 정수, -5~200(지하 허용) |
| rooms | O,B | 0~20 |
| baths | O,B | 0~20 |
| built_year | O,B | 1900~현재연도 |
| parking | O,F | enum(불가/가능/숫자입력) |
| deal_type | R | 매매/전세/월세/임대/임차 |
| price | X,B | 매매/전세일 때 R, 0 이상 정수 |
| deposit | X,B | 월세일 때 R, 0 이상 정수 |
| rent | X,B | 월세일 때 R, 0 이상 정수 |
| available_from | O,F | YYYY-MM-DD |
| maintenance_fee | O,B | 0 이상 정수 |
| includes[] | O | 프리 텍스트 20자 이내 항목 리스트 |
| status | R,F | 초안/검수/공개/계약중/완료 |
| assignee | O | 사용자 참조 유효 |
| tags[] | O | 태그 0~20개, 각 2~20자 |
| photos/videos | O,F | 확장자/용량 제한, 총 200MB 이내(경고) |
| public_data_snapshots | O | JSON 스키마 유효성 |

- **상태 전환(X)**: 공개 전 `필수 필드 충실도 ≥ 80%` 필요. 완료 전 `계약 존재` 필요.

## Customer(고객)
| 필드 | 규칙 | 설명 |
|---|---|---|
| type | R | 개인/법인 |
| name | R,F | 2~50자 |
| phones[] | R,F | 최소 1개, 한국 전화 패턴 허용 |
| email | O,F | 이메일 패턴 |
| preferences | O | JSON 스키마 유효성 |
| status | R | 활성/보류/휴면 |
| consent_flags | X | 수집 목적 고지 후 체크 필요 |

## Lead/Inquiry(의뢰)
| 필드 | 규칙 | 설명 |
|---|---|---|
| source | R | 공유링크/API/내부 |
| requester.name | R,F | 2~50자 |
| requester.contact | R,F | 전화/이메일 패턴 중 하나 |
| payload | O | 자유 JSON |
| status | R | 신규/상담/매칭/투어/협의/계약/종료 |
| assignee | O | 사용자 참조 |
| sla.first_response_due | O,F | 분 단위 정수(기본 120) |
| first_response_at | X | due 이후면 `breach=true` |

- **상태 흐름(X)**: 역행 금지. 예외 시 `reason` 필요.

## Contract(계약)
| 필드 | 규칙 | 설명 |
|---|---|---|
| property_id | R | 매물 참조 유효 |
| type | R | 매매/임대/전세/월세 |
| parties.lessor/lessee | R | 고객 참조 유효 |
| terms.price/deposit/rent | X | type에 따라 필수 값 상이 |
| important_dates.contract | R,F | YYYY-MM-DD |
| important_dates.balance | X | contract 이후 날짜 |
| checklist[].required | F | boolean |
| checklist[].done | X | required=true인 항목 전부 완료 전 확정 불가 |

## Schedule(일정)
| 필드 | 규칙 | 설명 |
|---|---|---|
| title | R,F | 2~100자 |
| category | R | 투어/계약/검침/만기/기타 |
| date | R,F | YYYY-MM-DD |
| time | O,F | HH:mm |
| related_entity | O,F | {type,id} 일관성 |
| reminders[] | O,B | 5~10080(분) |
