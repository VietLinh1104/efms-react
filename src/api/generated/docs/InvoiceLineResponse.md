# InvoiceLineResponse

Chi tiết một dòng hóa đơn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID dòng hóa đơn | [optional] [default to undefined]
**accountId** | **string** | ID tài khoản | [optional] [default to undefined]
**accountCode** | **string** | Mã tài khoản | [optional] [default to undefined]
**accountName** | **string** | Tên tài khoản | [optional] [default to undefined]
**description** | **string** | Mô tả mặt hàng | [optional] [default to undefined]
**quantity** | **number** | Số lượng | [optional] [default to undefined]
**unitPrice** | **number** | Đơn giá | [optional] [default to undefined]
**taxRate** | **number** | Tỷ lệ thuế (%) | [optional] [default to undefined]
**taxAmount** | **number** | Tiền thuế | [optional] [default to undefined]
**amount** | **number** | Thành tiền (trước thuế) | [optional] [default to undefined]

## Example

```typescript
import { InvoiceLineResponse } from './api';

const instance: InvoiceLineResponse = {
    id,
    accountId,
    accountCode,
    accountName,
    description,
    quantity,
    unitPrice,
    taxRate,
    taxAmount,
    amount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
