# JournalLineRequest

Một dòng bút toán trong chứng từ kế toán

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accountId** | **string** | UUID tài khoản kế toán | [default to undefined]
**partnerId** | **string** | UUID đối tác liên quan | [optional] [default to undefined]
**debit** | **number** | Số tiền Nợ | [default to undefined]
**credit** | **number** | Số tiền Có | [default to undefined]
**currencyCode** | **string** | Mã tiền tệ | [optional] [default to undefined]
**amountCurrency** | **number** | Số tiền theo tiền tệ gốc (nếu khác VND) | [optional] [default to undefined]
**exchangeRate** | **number** | Tỷ giá quy đổi | [optional] [default to undefined]
**description** | **string** | Mô tả dòng bút toán | [optional] [default to undefined]

## Example

```typescript
import { JournalLineRequest } from './api';

const instance: JournalLineRequest = {
    accountId,
    partnerId,
    debit,
    credit,
    currencyCode,
    amountCurrency,
    exchangeRate,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
