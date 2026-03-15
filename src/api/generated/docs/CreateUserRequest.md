# CreateUserRequest

Payload Thêm mới Người dùng

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Họ và tên | [default to undefined]
**email** | **string** | Email đăng nhập | [default to undefined]
**password** | **string** | Mật khẩu gốc (Chưa mã hóa) | [default to undefined]
**role** | **string** | Vai trò (ADMIN, ACCOUNTANT, VIEWER) | [default to undefined]
**companyId** | **string** | UUID Công ty (Organization) quản lý user này | [default to undefined]

## Example

```typescript
import { CreateUserRequest } from './api';

const instance: CreateUserRequest = {
    name,
    email,
    password,
    role,
    companyId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
