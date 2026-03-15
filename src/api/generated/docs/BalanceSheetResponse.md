# BalanceSheetResponse

Báo cáo Bảng cân đối kế toán (Balance Sheet)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**companyName** | **string** | Tên công ty | [optional] [default to undefined]
**asOfDate** | **string** | Lập tới ngày | [optional] [default to undefined]
**assets** | [**Array&lt;ReportRowResponse&gt;**](ReportRowResponse.md) | Tài sản (Assets) | [optional] [default to undefined]
**liabilities** | [**Array&lt;ReportRowResponse&gt;**](ReportRowResponse.md) | Nợ phải trả (Liabilities) | [optional] [default to undefined]
**equity** | [**Array&lt;ReportRowResponse&gt;**](ReportRowResponse.md) | Vốn chủ sở hữu (Equity) | [optional] [default to undefined]

## Example

```typescript
import { BalanceSheetResponse } from './api';

const instance: BalanceSheetResponse = {
    companyName,
    asOfDate,
    assets,
    liabilities,
    equity,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
