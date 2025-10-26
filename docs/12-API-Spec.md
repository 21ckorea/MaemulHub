# API Spec (MVP Draft)

Base URL: /api/v1
Auth: Bearer JWT, role-based access (RBAC)
Content-Type: application/json

## Properties
- GET /properties
  - query: q, type, status, tags[], assignee, page, pageSize
  - 200: {items: Property[], total}
- GET /properties/{id}
  - 200: Property
- POST /properties
  - body: Property (see schema)
  - 201: Property
- PATCH /properties/{id}
  - body: Partial<Property>
  - 200: Property
- POST /properties/{id}/share-links
  - body: {visible_fields[], password?, expires_at?}
  - 201: ShareLink
- GET /properties/{id}/integrations
  - 200: {rlt?, bldg?, land?, fetched_at}

## Customers
- GET /customers?q,status,tags,page,pageSize
- GET /customers/{id}
- POST /customers
- PATCH /customers/{id}

## Leads (Inquiries)
- GET /leads?status,source,assignee,SLA,page,pageSize
- GET /leads/{id}
- POST /leads
- PATCH /leads/{id}
- POST /leads/{id}/assign {assignee}
- POST /leads/{id}/recommendations
  - 200: {properties: Property[]}

## Contracts
- GET /contracts?type,status,assignee,page,pageSize
- GET /contracts/{id}
- POST /contracts
- PATCH /contracts/{id}
- POST /contracts/{id}/finalize

## Schedules
- GET /schedules?from,to,assignee,category
- POST /schedules
- PATCH /schedules/{id}

## Activities (timeline)
- GET /activities?entity_type,entity_id
- POST /activities

## Integrations Config
- GET /integrations/config
- PATCH /integrations/config {provider, api_key, cache_ttl, disclaimer_enabled}
- POST /integrations/refresh?property_id

## Schemas
- See `docs/schemas/*.schema.json` for payload definitions.

## Common Response
- Error: {error: {code, message, details?}}
- Pagination: {items, total, page, pageSize}

## Notes
- Partial updates follow JSON Merge Patch semantics.
- Timestamps in ISO8601 UTC.
- IDs are opaque strings.
