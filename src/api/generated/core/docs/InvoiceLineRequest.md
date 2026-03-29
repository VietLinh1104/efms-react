# InvoiceLineRequest

Payload dòng hóa đơn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accountId** | **string** | UUID tài khoản doanh thu (AR) hoặc chi phí (AP) | [default to undefined]
**description** | **string** | Mô tả mặt hàng / dịch vụ | [default to undefined]
**quantity** | **number** | Số lượng | [default to undefined]
**unitPrice** | **number** | Đơn giá | [default to undefined]
**taxRate** | **number** | Tỷ lệ thuế (%) | [default to undefined]

## Example

```typescript
import { InvoiceLineRequest } from './api';

const instance: InvoiceLineRequest = {
    accountId,
    description,
    quantity,
    unitPrice,
    taxRate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
