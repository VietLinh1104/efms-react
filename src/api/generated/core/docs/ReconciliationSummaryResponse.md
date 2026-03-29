# ReconciliationSummaryResponse

Báo cáo tổng hợp đối chiếu số dư (Ngân hàng vs Hệ thống)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**asOfDate** | **string** | Ngày tính toán số dư | [optional] [default to undefined]
**bankBalance** | **number** | Số dư hiện tại trên Bank (theo import) | [optional] [default to undefined]
**systemBalance** | **number** | Số dư trên hệ thống (Sổ cái - GL) | [optional] [default to undefined]
**unreconciledBankTransactions** | **number** | Tổng tiền các giao dịch chưa bị đối chiếu (Unreconciled) trên Bank | [optional] [default to undefined]
**unreconciledSystemEntries** | **number** | Tổng tiền các bút toán Hệ thống chưa được đối chiếu (Unreconciled System entries) | [optional] [default to undefined]
**difference** | **number** | Độ chênh lệch (bankBalance - systemBalance) | [optional] [default to undefined]

## Example

```typescript
import { ReconciliationSummaryResponse } from './api';

const instance: ReconciliationSummaryResponse = {
    asOfDate,
    bankBalance,
    systemBalance,
    unreconciledBankTransactions,
    unreconciledSystemEntries,
    difference,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
