# CreateBankTransactionRequest

Payload tạo giao dịch ngân hàng (thủ công)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**bankAccountId** | **string** | UUID tài khoản ngân hàng | [default to undefined]
**transactionDate** | **string** | Ngày giao dịch | [default to undefined]
**description** | **string** | Diễn giải / Nội dung CK | [optional] [default to undefined]
**type** | **string** | Loại giao dịch (in / out) | [default to undefined]
**amount** | **number** | Số tiền giao dịch | [default to undefined]
**reference** | **string** | Tham chiếu (Mã GD NH, Reference ID) | [optional] [default to undefined]

## Example

```typescript
import { CreateBankTransactionRequest } from './api';

const instance: CreateBankTransactionRequest = {
    bankAccountId,
    transactionDate,
    description,
    type,
    amount,
    reference,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
