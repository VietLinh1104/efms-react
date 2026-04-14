# InvoiceApprovalControllerApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllTasks**](#getalltasks) | **GET** /api/core/invoices/tasks | |
|[**getInvoiceByTaskId**](#getinvoicebytaskid) | **GET** /api/core/invoices/tasks/{taskId}/invoice | |

# **getAllTasks**
> ApiResponsePagedResponseInvoiceResponse getAllTasks()


### Example

```typescript
import {
    InvoiceApprovalControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApprovalControllerApi(configuration);

let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAllTasks(
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
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

# **getInvoiceByTaskId**
> ApiResponseInvoiceResponse getInvoiceByTaskId()


### Example

```typescript
import {
    InvoiceApprovalControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApprovalControllerApi(configuration);

let taskId: string; // (default to undefined)

const { status, data } = await apiInstance.getInvoiceByTaskId(
    taskId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskId** | [**string**] |  | defaults to undefined|


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

