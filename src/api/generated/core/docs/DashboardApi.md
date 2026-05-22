# DashboardApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getDashboardSummary**](#getdashboardsummary) | **GET** /v1/dashboard/summary | Tổng hợp dữ liệu Dashboard|

# **getDashboardSummary**
> ApiResponseDashboardSummaryResponse getDashboardSummary()


### Example

```typescript
import {
    DashboardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardApi(configuration);

let companyId: string; // (default to undefined)

const { status, data } = await apiInstance.getDashboardSummary(
    companyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseDashboardSummaryResponse**

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

