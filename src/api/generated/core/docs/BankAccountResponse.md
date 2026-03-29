# BankAccountResponse

Thông tin tài khoản ngân hàng

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID Tài khoản | [optional] [default to undefined]
**name** | **string** | Tên nhận diện | [optional] [default to undefined]
**bankName** | **string** | Tên ngân hàng | [optional] [default to undefined]
**accountNumber** | **string** | Số tài khoản | [optional] [default to undefined]
**type** | **string** | Loại (checking / savings) | [optional] [default to undefined]
**currencyCode** | **string** | Mã tiền tệ | [optional] [default to undefined]
**openingBalance** | **number** | Số dư đầu kỳ | [optional] [default to undefined]
**isActive** | **boolean** | Trạng thái hoạt động | [optional] [default to undefined]
**glAccountId** | **string** | ID Tài khoản Kế toán | [optional] [default to undefined]
**glAccountCode** | **string** | Mã Tài khoản Kế toán | [optional] [default to undefined]
**createdAt** | **string** | Thời gian tạo | [optional] [default to undefined]

## Example

```typescript
import { BankAccountResponse } from './api';

const instance: BankAccountResponse = {
    id,
    name,
    bankName,
    accountNumber,
    type,
    currencyCode,
    openingBalance,
    isActive,
    glAccountId,
    glAccountCode,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
