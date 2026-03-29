# InvoicePaymentResponse

Thông tin dòng phân bổ thanh toán cho hóa đơn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID dòng phân bổ | [optional] [default to undefined]
**paymentId** | **string** | ID phiếu thanh toán gốc | [optional] [default to undefined]
**invoiceNumber** | **string** | Mã hóa đơn được phân bổ | [optional] [default to undefined]
**paymentDate** | **string** | Ngày thanh toán | [optional] [default to undefined]
**allocatedAmount** | **number** | Số tiền đã phân bổ | [optional] [default to undefined]
**createdBy** | **string** | Người phân bổ | [optional] [default to undefined]
**createdAt** | **string** | Thời gian phân bổ | [optional] [default to undefined]

## Example

```typescript
import { InvoicePaymentResponse } from './api';

const instance: InvoicePaymentResponse = {
    id,
    paymentId,
    invoiceNumber,
    paymentDate,
    allocatedAmount,
    createdBy,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
