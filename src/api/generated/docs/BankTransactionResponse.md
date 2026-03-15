# BankTransactionResponse

Thông tin giao dịch ngân hàng

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID giao dịch | [optional] [default to undefined]
**bankAccountId** | **string** | ID tài khoản ngân hàng | [optional] [default to undefined]
**bankAccountName** | **string** | Tên tài khoản (ví dụ: Techcombank VND) | [optional] [default to undefined]
**transactionDate** | **string** | Ngày giao dịch | [optional] [default to undefined]
**description** | **string** | Nội dung giao dịch | [optional] [default to undefined]
**type** | **string** | Loại (in / out) | [optional] [default to undefined]
**amount** | **number** | Số tiền | [optional] [default to undefined]
**reference** | **string** | Mã tham chiếu NH | [optional] [default to undefined]
**isReconciled** | **boolean** | Trạng thái đối chiếu (Đã khớp hay chưa) | [optional] [default to undefined]
**journalEntryId** | **string** | ID bút toán Kế toán (Journal Entry) liên kết nếu đã khớp | [optional] [default to undefined]
**createdAt** | **string** | Ngày nạp dữ liệu | [optional] [default to undefined]

## Example

```typescript
import { BankTransactionResponse } from './api';

const instance: BankTransactionResponse = {
    id,
    bankAccountId,
    bankAccountName,
    transactionDate,
    description,
    type,
    amount,
    reference,
    isReconciled,
    journalEntryId,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
