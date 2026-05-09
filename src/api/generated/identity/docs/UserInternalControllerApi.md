# UserInternalControllerApi

All URIs are relative to *http://localhost:8080/api/identity*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUsersBatch**](#getusersbatch) | **POST** /internal/users/batch | |

# **getUsersBatch**
> ApiResponseListUserInternalResponse getUsersBatch(requestBody)


### Example

```typescript
import {
    UserInternalControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserInternalControllerApi(configuration);

let xCompanyId: string; // (default to undefined)
let requestBody: Set<string>; //

const { status, data } = await apiInstance.getUsersBatch(
    xCompanyId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Set<string>**|  | |
| **xCompanyId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListUserInternalResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

