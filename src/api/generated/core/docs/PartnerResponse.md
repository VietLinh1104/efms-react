# PartnerResponse

Thông tin đối tác

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID đối tác | [optional] [default to undefined]
**name** | **string** | Tên | [optional] [default to undefined]
**type** | **string** | Loại (customer / vendor) | [optional] [default to undefined]
**taxCode** | **string** | Mã số thuế | [optional] [default to undefined]
**phone** | **string** | Điện thoại | [optional] [default to undefined]
**email** | **string** | Email | [optional] [default to undefined]
**address** | **string** | Địa chỉ | [optional] [default to undefined]
**arAccountId** | **string** | ID tài khoản AR | [optional] [default to undefined]
**arAccountCode** | **string** | Mã tài khoản AR | [optional] [default to undefined]
**apAccountId** | **string** | ID tài khoản AP | [optional] [default to undefined]
**apAccountCode** | **string** | Mã tài khoản AP | [optional] [default to undefined]
**isActive** | **boolean** | Trạng thái hoạt động | [optional] [default to undefined]
**createdAt** | **string** | Thời gian tạo | [optional] [default to undefined]

## Example

```typescript
import { PartnerResponse } from './api';

const instance: PartnerResponse = {
    id,
    name,
    type,
    taxCode,
    phone,
    email,
    address,
    arAccountId,
    arAccountCode,
    apAccountId,
    apAccountCode,
    isActive,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
