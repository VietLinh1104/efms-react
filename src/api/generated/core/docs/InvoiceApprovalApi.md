# InvoiceApprovalApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getInvoiceDetail1**](#getinvoicedetail1) | **GET** /v1/invoice-tasks/tasks/{invoiceId}/invoice | Chi tiết hóa đơn AP đang chờ duyệt|
|[**getPendingApprovals**](#getpendingapprovals) | **GET** /v1/invoice-tasks/tasks | Danh sách AP Bill đang chờ phê duyệt|

# **getInvoiceDetail1**
> ApiResponseInvoiceResponse getInvoiceDetail1()


### Example

```typescript
import {
    InvoiceApprovalApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApprovalApi(configuration);

let invoiceId: string; // (default to undefined)

const { status, data } = await apiInstance.getInvoiceDetail1(
    invoiceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **invoiceId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseInvoiceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPendingApprovals**
> ApiResponsePagedResponseInvoiceResponse getPendingApprovals()


### Example

```typescript
import {
    InvoiceApprovalApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApprovalApi(configuration);

let companyId: string; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getPendingApprovals(
    companyId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**ApiResponsePagedResponseInvoiceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

