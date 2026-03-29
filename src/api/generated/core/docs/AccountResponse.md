# AccountResponse

Thông tin tài khoản kế toán

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID tài khoản | [optional] [default to undefined]
**code** | **string** | Mã tài khoản | [optional] [default to undefined]
**name** | **string** | Tên tài khoản | [optional] [default to undefined]
**type** | **string** | Loại tài khoản | [optional] [default to undefined]
**balanceType** | **string** | Loại số dư | [optional] [default to undefined]
**parentId** | **string** | ID tài khoản cha | [optional] [default to undefined]
**parentName** | **string** | Tên tài khoản cha | [optional] [default to undefined]
**isActive** | **boolean** | Trạng thái hoạt động | [optional] [default to undefined]
**createdAt** | **string** | Thời điểm tạo | [optional] [default to undefined]
**children** | [**Array&lt;AccountResponse&gt;**](AccountResponse.md) | Danh sách tài khoản con (dạng cây) | [optional] [default to undefined]

## Example

```typescript
import { AccountResponse } from './api';

const instance: AccountResponse = {
    id,
    code,
    name,
    type,
    balanceType,
    parentId,
    parentName,
    isActive,
    createdAt,
    children,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
