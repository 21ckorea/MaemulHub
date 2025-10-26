# API Sample Payloads

샘플 요청/응답 페이로드. 실제 배포 시 `docs/schemas/*.schema.json`과 동기화 유지.

## Property

### Create (POST /properties)
```json
{
  "type": "apartment",
  "address": "서울 강남구 테헤란로 123",
  "geo": {"lat": 37.501, "lng": 127.037},
  "complex_name": "역삼OO아파트",
  "area_supply": 112.3,
  "area_exclusive": 84.9,
  "floor": 14,
  "rooms": 3,
  "baths": 2,
  "built_year": 2011,
  "parking": "available",
  "deal_type": "jeonse",
  "price": 650000000,
  "available_from": "2025-11-01",
  "maintenance_fee": 120000,
  "includes": ["internet", "tv"],
  "status": "review",
  "assignee": "u_kim",
  "tags": ["역세권", "도배"]
}
```

### Response (201)
```json
{
  "id": "P-2025-0042",
  "created_at": "2025-10-14T11:30:00Z",
  "updated_at": "2025-10-14T11:30:00Z"
}
```

## Lead

### Create (POST /leads)
```json
{
  "source": "share_link",
  "requester": {"name": "김OO", "contact": "010-1234-5678"},
  "payload": {"type": "apartment", "budget_min": 600000000, "budget_max": 700000000, "rooms": 2, "areas": ["강남", "선릉"]},
  "status": "new"
}
```

### Assign (POST /leads/{id}/assign)
```json
{"assignee": "u_park"}
```

## Contract

### Create Draft (POST /contracts)
```json
{
  "property_id": "P-2025-0042",
  "type": "jeonse",
  "parties": {"lessor": "c_lessor", "lessee": "c_lessee"},
  "terms": {"price": 650000000, "special": "귀중품 제외"},
  "status": "drafting",
  "important_dates": {"contract": "2025-10-20", "balance": "2025-11-05"}
}
```

### Finalize (POST /contracts/{id}/finalize)
```json
{"approve": true}
```

## Schedule

### Create (POST /schedules)
```json
{
  "title": "역삼OO 투어",
  "category": "tour",
  "date": "2025-10-19",
  "time": "14:30",
  "related_entity": {"type": "property", "id": "P-2025-0042"},
  "assignee": "u_park",
  "reminders": [30]
}
```
