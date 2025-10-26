# RBAC Test Cases (샘플)

형식: Given/When/Then

## Properties
- **[create_own]** Given staff, When create property, Then success, visible in mine scope
- **[edit_own]** Given staff, When edit property assigned to self, Then success
- **[edit_other_denied]** Given staff, When edit property assigned to other, Then forbidden
- **[archive_manager_only]** Given manager, When archive property in team, Then success; Given staff, Then forbidden

## Leads
- **[assign_manager]** Given manager, When assign lead to staff, Then success
- **[assign_staff_self]** Given staff, When assign to self, Then success; When assign to other, Then forbidden
- **[status_backward_denied]** Given any, When set status from 협의→상담, Then forbidden with reason required

## Contracts
- **[finalize_required_checklist]** Given manager, When finalize with required checklist incomplete, Then forbidden
- **[view_scope]** Given viewer, When view contracts, Then read-only scope, no export

## Schedules
- **[create_any]** Given staff, When create schedule for related own entity, Then success; for other team entity, Then success if manager, else forbidden

## Settings
- **[rbac_manage]** Given admin, When modify role, Then success; Given manager, Then forbidden

## Audit
- **[audit_access]** Given admin, When view audit logs, Then success; Given staff, Then forbidden
