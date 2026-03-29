# AuditLogControllerApi

All URIs are relative to *http://localhost:8080/api/identity*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllLogs**](#getalllogs) | **GET** /v1/audit-logs | |
|[**getLogsByRecord**](#getlogsbyrecord) | **GET** /v1/audit-logs/record | |

# **getAllLogs**
> ApiResponsePageAuditLogResponse getAllLogs()


### Example

```typescript
import {
    AuditLogControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuditLogControllerApi(configuration);

let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.getAllLogs(
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePageAuditLogResponse**

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

# **getLogsByRecord**
> ApiResponsePageAuditLogResponse getLogsByRecord()


### Example

```typescript
import {
    AuditLogControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuditLogControllerApi(configuration);

let tableName: string; // (default to undefined)
let recordId: string; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.getLogsByRecord(
    tableName,
    recordId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tableName** | [**string**] |  | defaults to undefined|
| **recordId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePageAuditLogResponse**

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

