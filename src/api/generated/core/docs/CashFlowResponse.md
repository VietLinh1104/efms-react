# CashFlowResponse

Báo cáo Lưu chuyển tiền tệ (Cash Flow Statement)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**companyName** | **string** | Tên công ty | [optional] [default to undefined]
**fromDate** | **string** | Từ ngày | [optional] [default to undefined]
**toDate** | **string** | Đến ngày | [optional] [default to undefined]
**operatingActivities** | [**Array&lt;ReportRowResponse&gt;**](ReportRowResponse.md) | Tiền thuần từ hoạt động kinh doanh (Operating Activities) | [optional] [default to undefined]
**investingActivities** | [**Array&lt;ReportRowResponse&gt;**](ReportRowResponse.md) | Tiền thuần từ hoạt động đầu tư (Investing Activities) | [optional] [default to undefined]
**financingActivities** | [**Array&lt;ReportRowResponse&gt;**](ReportRowResponse.md) | Tiền thuần từ hoạt động tài chính (Financing Activities) | [optional] [default to undefined]
**netCashFlow** | [**ReportRowResponse**](ReportRowResponse.md) |  | [optional] [default to undefined]
**openingCash** | [**ReportRowResponse**](ReportRowResponse.md) |  | [optional] [default to undefined]
**closingCash** | [**ReportRowResponse**](ReportRowResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CashFlowResponse } from './api';

const instance: CashFlowResponse = {
    companyName,
    fromDate,
    toDate,
    operatingActivities,
    investingActivities,
    financingActivities,
    netCashFlow,
    openingCash,
    closingCash,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
