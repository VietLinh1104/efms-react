# CompanyResponse

Thông tin Công ty

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Mã Công ty (Tenant ID) | [optional] [default to undefined]
**name** | **string** | Tên Công ty | [optional] [default to undefined]
**taxCode** | **string** | Mã số thuế | [optional] [default to undefined]
**address** | **string** | Địa chỉ trụ sở | [optional] [default to undefined]
**currency** | **string** | Đồng tiền sử dụng mặc định | [optional] [default to undefined]
**isActive** | **boolean** | Đang hoạt động | [optional] [default to undefined]
**createdAt** | **string** | Ngày tạo | [optional] [default to undefined]

## Example

```typescript
import { CompanyResponse } from './api';

const instance: CompanyResponse = {
    id,
    name,
    taxCode,
    address,
    currency,
    isActive,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
