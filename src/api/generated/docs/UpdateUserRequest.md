# UpdateUserRequest

Payload cập nhật thông tin Người dùng

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Họ và tên | [default to undefined]
**email** | **string** | Email liên hệ | [default to undefined]
**role** | **string** | Vai trò (ADMIN, ACCOUNTANT, VIEWER) | [default to undefined]

## Example

```typescript
import { UpdateUserRequest } from './api';

const instance: UpdateUserRequest = {
    name,
    email,
    role,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
