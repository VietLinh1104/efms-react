# AllocatePaymentRequest

Payload phân bổ thanh toán vào một hoá đơn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**invoiceId** | **string** | UUID của chứng từ Hóa đơn cần trừ nợ | [default to undefined]
**amount** | **number** | Số tiền thanh toán sẽ gán vào hóa đơn này | [default to undefined]

## Example

```typescript
import { AllocatePaymentRequest } from './api';

const instance: AllocatePaymentRequest = {
    invoiceId,
    amount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
