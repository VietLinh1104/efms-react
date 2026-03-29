# CreateBankAccountRequest

Payload tạo/cập nhật tài khoản ngân hàng

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Tên nhận diện tài khoản | [default to undefined]
**bankName** | **string** | Tên ngân hàng | [optional] [default to undefined]
**accountNumber** | **string** | Số tài khoản | [optional] [default to undefined]
**type** | **string** | Loại tài khoản (checking / savings) | [default to undefined]
**currencyCode** | **string** | Mã tiền tệ | [default to undefined]
**openingBalance** | **number** | Số dư đầu kỳ | [optional] [default to undefined]
**glAccountId** | **string** | UUID Tài khoản Kế toán tương ứng (1121..) | [optional] [default to undefined]
**companyId** | **string** | UUID Công ty | [default to undefined]

## Example

```typescript
import { CreateBankAccountRequest } from './api';

const instance: CreateBankAccountRequest = {
    name,
    bankName,
    accountNumber,
    type,
    currencyCode,
    openingBalance,
    glAccountId,
    companyId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
