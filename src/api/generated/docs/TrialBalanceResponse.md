# TrialBalanceResponse

Bảng cân đối tài khoản (Trial Balance)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**periodId** | **string** | UUID kỳ kế toán | [optional] [default to undefined]
**periodName** | **string** | Tên kỳ kế toán | [optional] [default to undefined]
**fromDate** | **string** | Ngày bắt đầu | [optional] [default to undefined]
**toDate** | **string** | Ngày kết thúc | [optional] [default to undefined]
**lines** | [**Array&lt;TrialBalanceLineResponse&gt;**](TrialBalanceLineResponse.md) | Danh sách các dòng tài khoản | [optional] [default to undefined]

## Example

```typescript
import { TrialBalanceResponse } from './api';

const instance: TrialBalanceResponse = {
    periodId,
    periodName,
    fromDate,
    toDate,
    lines,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
