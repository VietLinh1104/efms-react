# AuditLogResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**tableName** | **string** |  | [optional] [default to undefined]
**recordId** | **string** |  | [optional] [default to undefined]
**action** | **string** |  | [optional] [default to undefined]
**changedByName** | **string** |  | [optional] [default to undefined]
**changedAt** | **string** |  | [optional] [default to undefined]
**oldData** | **{ [key: string]: object; }** |  | [optional] [default to undefined]
**newData** | **{ [key: string]: object; }** |  | [optional] [default to undefined]

## Example

```typescript
import { AuditLogResponse } from './api';

const instance: AuditLogResponse = {
    id,
    tableName,
    recordId,
    action,
    changedByName,
    changedAt,
    oldData,
    newData,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
