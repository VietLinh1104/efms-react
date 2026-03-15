# JournalLineResponse

Một dòng bút toán

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID dòng bút toán | [optional] [default to undefined]
**accountId** | **string** | UUID tài khoản | [optional] [default to undefined]
**accountCode** | **string** | Mã tài khoản | [optional] [default to undefined]
**accountName** | **string** | Tên tài khoản | [optional] [default to undefined]
**partnerId** | **string** | UUID đối tác | [optional] [default to undefined]
**partnerName** | **string** | Tên đối tác | [optional] [default to undefined]
**debit** | **number** | Số tiền Nợ | [optional] [default to undefined]
**credit** | **number** | Số tiền Có | [optional] [default to undefined]
**currencyCode** | **string** | Mã tiền tệ | [optional] [default to undefined]
**amountCurrency** | **number** | Số tiền tiền tệ gốc | [optional] [default to undefined]
**exchangeRate** | **number** | Tỷ giá | [optional] [default to undefined]
**description** | **string** | Mô tả | [optional] [default to undefined]
**createdAt** | **string** | Thời điểm tạo | [optional] [default to undefined]

## Example

```typescript
import { JournalLineResponse } from './api';

const instance: JournalLineResponse = {
    id,
    accountId,
    accountCode,
    accountName,
    partnerId,
    partnerName,
    debit,
    credit,
    currencyCode,
    amountCurrency,
    exchangeRate,
    description,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
