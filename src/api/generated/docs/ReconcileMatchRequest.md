# ReconcileMatchRequest

Payload đối chiếu: Khớp thủ công 1 giao dịch ngân hàng vào 1 chứng từ Hệ thống (Journal Entry)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**bankTransactionId** | **string** | UUID của Giao dịch Ngân hàng chưa đối chiếu | [default to undefined]
**journalEntryId** | **string** | UUID của Bút toán trên Hệ thống (Journal Entry) cần khớp | [default to undefined]

## Example

```typescript
import { ReconcileMatchRequest } from './api';

const instance: ReconcileMatchRequest = {
    bankTransactionId,
    journalEntryId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
