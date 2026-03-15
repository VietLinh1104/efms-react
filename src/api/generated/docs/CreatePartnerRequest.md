# CreatePartnerRequest

Payload tạo/cập nhật đối tác (Khách hàng / NCC)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Tên đối tác | [default to undefined]
**type** | **string** | Loại đối tác (customer / vendor) | [default to undefined]
**taxCode** | **string** | Mã số thuế | [optional] [default to undefined]
**phone** | **string** | Số điện thoại | [optional] [default to undefined]
**email** | **string** | Email | [optional] [default to undefined]
**address** | **string** | Địa chỉ | [optional] [default to undefined]
**arAccountId** | **string** | UUID tài khoản phải thu (AR) mặc định | [default to undefined]
**apAccountId** | **string** | UUID tài khoản phải trả (AP) mặc định | [default to undefined]
**companyId** | **string** | UUID công ty sở hữu | [optional] [default to undefined]

## Example

```typescript
import { CreatePartnerRequest } from './api';

const instance: CreatePartnerRequest = {
    name,
    type,
    taxCode,
    phone,
    email,
    address,
    arAccountId,
    apAccountId,
    companyId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
