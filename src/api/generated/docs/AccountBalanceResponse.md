# AccountBalanceResponse

Số dư tài khoản theo kỳ hoặc ngày

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accountCode** | **string** | Mã tài khoản | [optional] [default to undefined]
**accountName** | **string** | Tên tài khoản | [optional] [default to undefined]
**totalDebit** | **number** | Tổng phát sinh Nợ trong kỳ | [optional] [default to undefined]
**totalCredit** | **number** | Tổng phát sinh Có trong kỳ | [optional] [default to undefined]
**openingBalance** | **number** | Số dư đầu kỳ | [optional] [default to undefined]
**closingBalance** | **number** | Số dư cuối kỳ | [optional] [default to undefined]

## Example

```typescript
import { AccountBalanceResponse } from './api';

const instance: AccountBalanceResponse = {
    accountCode,
    accountName,
    totalDebit,
    totalCredit,
    openingBalance,
    closingBalance,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
