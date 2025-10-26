# 필드 정의표

각 모듈별 핵심 필드 정의입니다. 타입/필수/설명 순.

## Property(매물)
- **id:string(필수)** 고유코드
- **type:enum(필수)** 아파트/오피스텔/상가/토지/다가구/빌라
- **address:string(필수)** 도로명/지번
- **geo:{lat,lng}** 지오코딩 좌표
- **complex_name:string** 단지/건물명
- **area_supply:number** 공급면적(m²)
- **area_exclusive:number** 전용면적(m²)
- **floor:number** 층
- **rooms:number** 방수
- **baths:number** 욕실수
- **built_year:number** 준공연도
- **parking:enum/number** 주차정보
- **deal_type:enum(필수)** 매매/전세/월세/임대/임차
- **price:number** 매매/전세가
- **deposit:number** 보증금
- **rent:number** 월세
- **available_from:date** 입주가능일
- **maintenance_fee:number** 관리비
- **includes:string[]** 관리비 포함항목
- **status:enum(필수)** 초안/검수/공개/계약중/완료
- **assignee:userRef** 담당자
- **tags:string[]** 태그
- **owner_contact:customerRef** 소유자 연락처(선택)
- **photos/videos/voice_memos:media[]** 미디어
- **public_data_snapshots:json** 실거래가/건축물대장/토지이용
- **activities:activity[]** 활동 로그
- **created_at/updated_at** 생성/수정시각

## Customer(고객)
- **id:string(필수)**
- **type:enum(필수)** 개인/법인
- **name:string(필수)**
- **phones:string[](필수 하나 이상)**
- **email:string**
- **company_name:string**
- **preferences:json** types[], budget_min/max, regions[], must_have[]
- **status:enum(필수)** 활성/보류/휴면
- **consent_flags:json** processing, marketing
- **tags:string[]**
- **last_contact_at:datetime**
- **activities:activity[]**

## Lead/Inquiry(의뢰)
- **id:string(필수)**
- **source:enum(필수)** 공유링크/API/내부
- **requester:json(필수)** name, contact
- **payload:json** 자유 양식(예산/지역/요건)
- **status:enum(필수)** 신규/상담/매칭/투어/협의/계약/종료
- **assignee:userRef** 담당자
- **sla:json** first_response_due, first_response_at, breach
- **recommended_property_ids:string[]**
- **activities:activity[]**
- **created_at:datetime**

## Contract(계약)
- **id:string(필수)**
- **property_id:string(필수)**
- **type:enum(필수)** 매매/임대/전세/월세
- **parties:json(필수)** lessor/lessee/agents
- **terms:json** 가격/특약/기타
- **status/stage:enum(필수)**
- **checklist:json[]** label, required, done, done_at
- **important_dates:json** contract, move_in, balance
- **commission:number**
- **files:file[]**
- **activities:activity[]**

## Schedule(일정)
- **id:string(필수)**
- **title:string(필수)**
- **category:enum(필수)** 투어/계약/검침/만기/기타
- **date:date(필수)**
- **time:string** HH:mm
- **related_entity:json** type,id
- **assignee:userRef**
- **reminders:number[]** 분 단위
- **notes:string**

## IntegrationConfig(연동)
- **provider:string(필수)** rlt/bldg/land
- **api_key:string(필수)**
- **verified_at:datetime**
- **cache_ttl:number** 시간
- **disclaimer_enabled:boolean**

## ShareLink(공유)
- **id:string(필수)**
- **property_id:string(필수)**
- **visible_fields:string[](필수)**
- **password:string**
- **expires_at:datetime**
- **utm_source/medium/campaign:string**
- **view_count:number**
