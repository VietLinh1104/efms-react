# SettingsCompanyApi

All URIs are relative to *http://localhost:8081*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCompany**](#getcompany) | **GET** /api/v1/settings/company | Lấy thông tin công ty|
|[**updateCompany**](#updatecompany) | **PUT** /api/v1/settings/company | Cập nhật thông tin công ty|

# **getCompany**
> ApiResponseCompanyResponse getCompany()


### Example

```typescript
import {
    SettingsCompanyApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SettingsCompanyApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getCompany(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseCompanyResponse**

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

# **updateCompany**
> ApiResponseCompanyResponse updateCompany(updateCompanyRequest)


### Example

```typescript
import {
    SettingsCompanyApi,
    Configuration,
    UpdateCompanyRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SettingsCompanyApi(configuration);

let id: string; // (default to undefined)
let updateCompanyRequest: UpdateCompanyRequest; //

const { status, data } = await apiInstance.updateCompany(
    id,
    updateCompanyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCompanyRequest** | **UpdateCompanyRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseCompanyResponse**

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

