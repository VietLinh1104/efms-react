# UpdateCompanyRequest

Payload cập nhật thông tin công ty

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Tên công ty | [default to undefined]
**taxCode** | **string** | Mã số thuế | [optional] [default to undefined]
**address** | **string** | Địa chỉ trụ sở chính | [optional] [default to undefined]
**currency** | **string** | Tiền tệ hạch toán gốc (ví dụ: VND) | [default to undefined]

## Example

```typescript
import { UpdateCompanyRequest } from './api';

const instance: UpdateCompanyRequest = {
    name,
    taxCode,
    address,
    currency,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
