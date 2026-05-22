# DashboardSummaryResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**kpi** | [**KpiStats**](KpiStats.md) |  | [optional] [default to undefined]
**invoiceStatusStats** | [**Array&lt;InvoiceStatusStat&gt;**](InvoiceStatusStat.md) |  | [optional] [default to undefined]
**monthlyFlow** | [**Array&lt;MonthlyFlowStat&gt;**](MonthlyFlowStat.md) |  | [optional] [default to undefined]
**pendingInvoices** | [**Array&lt;PendingInvoiceItem&gt;**](PendingInvoiceItem.md) |  | [optional] [default to undefined]
**recentPayments** | [**Array&lt;RecentPaymentItem&gt;**](RecentPaymentItem.md) |  | [optional] [default to undefined]

## Example

```typescript
import { DashboardSummaryResponse } from './api';

const instance: DashboardSummaryResponse = {
    kpi,
    invoiceStatusStats,
    monthlyFlow,
    pendingInvoices,
    recentPayments,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
