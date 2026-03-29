# TrialBalanceLineResponse

Một dòng trong Bảng cân đối tài khoản (Trial Balance)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accountCode** | **string** | Mã tài khoản | [optional] [default to undefined]
**accountName** | **string** | Tên tài khoản | [optional] [default to undefined]
**openingDebit** | **number** | Số dư đầu kỳ Nợ | [optional] [default to undefined]
**openingCredit** | **number** | Số dư đầu kỳ Có | [optional] [default to undefined]
**periodDebit** | **number** | Phát sinh Nợ trong kỳ | [optional] [default to undefined]
**periodCredit** | **number** | Phát sinh Có trong kỳ | [optional] [default to undefined]
**closingDebit** | **number** | Số dư cuối kỳ Nợ | [optional] [default to undefined]
**closingCredit** | **number** | Số dư cuối kỳ Có | [optional] [default to undefined]

## Example

```typescript
import { TrialBalanceLineResponse } from './api';

const instance: TrialBalanceLineResponse = {
    accountCode,
    accountName,
    openingDebit,
    openingCredit,
    periodDebit,
    periodCredit,
    closingDebit,
    closingCredit,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
