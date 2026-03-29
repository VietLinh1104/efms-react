# ProfitLossResponse

Bảng Kết quả kinh doanh (Profit & Loss)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**companyName** | **string** | Tên công ty | [optional] [default to undefined]
**fromDate** | **string** | Từ ngày | [optional] [default to undefined]
**toDate** | **string** | Đến ngày | [optional] [default to undefined]
**revenues** | [**Array&lt;ReportRowResponse&gt;**](ReportRowResponse.md) | Doanh thu (Revenues) | [optional] [default to undefined]
**expenses** | [**Array&lt;ReportRowResponse&gt;**](ReportRowResponse.md) | Chi phí (Expenses) | [optional] [default to undefined]
**netIncome** | [**ReportRowResponse**](ReportRowResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ProfitLossResponse } from './api';

const instance: ProfitLossResponse = {
    companyName,
    fromDate,
    toDate,
    revenues,
    expenses,
    netIncome,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
