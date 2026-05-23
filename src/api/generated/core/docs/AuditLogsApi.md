# AuditLogsApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getRecordHistory**](#getrecordhistory) | **GET** /v1/audit-logs/record | Timeline lịch sử thay đổi của một record cụ thể|
|[**listAuditLogs**](#listauditlogs) | **GET** /v1/audit-logs | Danh sách audit log (toàn hệ thống, có phân trang)|

# **getRecordHistory**
> ApiResponseListAuditLogResponse getRecordHistory()


### Example

```typescript
import {
    AuditLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuditLogsApi(configuration);

let tableName: string; // (default to undefined)
let recordId: string; // (default to undefined)
let xCompanyId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getRecordHistory(
    tableName,
    recordId,
    xCompanyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tableName** | [**string**] |  | defaults to undefined|
| **recordId** | [**string**] |  | defaults to undefined|
| **xCompanyId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ApiResponseListAuditLogResponse**

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

# **listAuditLogs**
> ApiResponsePagedResponseAuditLogResponse listAuditLogs()


### Example

```typescript
import {
    AuditLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuditLogsApi(configuration);

let xCompanyId: string; // (optional) (default to undefined)
let tableName: string; // (optional) (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.listAuditLogs(
    xCompanyId,
    tableName,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **xCompanyId** | [**string**] |  | (optional) defaults to undefined|
| **tableName** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponseAuditLogResponse**

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

