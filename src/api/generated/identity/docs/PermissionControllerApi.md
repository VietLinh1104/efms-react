# PermissionControllerApi

All URIs are relative to *http://localhost:8080/api/identity*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createPermission**](#createpermission) | **POST** /v1/permissions | |
|[**deletePermission**](#deletepermission) | **DELETE** /v1/permissions/{id} | |
|[**getAllPermissions**](#getallpermissions) | **GET** /v1/permissions | |
|[**getPermissionById**](#getpermissionbyid) | **GET** /v1/permissions/{id} | |
|[**updatePermission**](#updatepermission) | **PUT** /v1/permissions/{id} | |

# **createPermission**
> ApiResponsePermissionResponse createPermission(permissionRequest)


### Example

```typescript
import {
    PermissionControllerApi,
    Configuration,
    PermissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PermissionControllerApi(configuration);

let permissionRequest: PermissionRequest; //

const { status, data } = await apiInstance.createPermission(
    permissionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **permissionRequest** | **PermissionRequest**|  | |


### Return type

**ApiResponsePermissionResponse**

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

# **deletePermission**
> ApiResponseVoid deletePermission()


### Example

```typescript
import {
    PermissionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PermissionControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deletePermission(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseVoid**

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

# **getAllPermissions**
> ApiResponseListPermissionResponse getAllPermissions()


### Example

```typescript
import {
    PermissionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PermissionControllerApi(configuration);

const { status, data } = await apiInstance.getAllPermissions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseListPermissionResponse**

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

# **getPermissionById**
> ApiResponsePermissionResponse getPermissionById()


### Example

```typescript
import {
    PermissionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PermissionControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getPermissionById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePermissionResponse**

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

# **updatePermission**
> ApiResponsePermissionResponse updatePermission(permissionRequest)


### Example

```typescript
import {
    PermissionControllerApi,
    Configuration,
    PermissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PermissionControllerApi(configuration);

let id: string; // (default to undefined)
let permissionRequest: PermissionRequest; //

const { status, data } = await apiInstance.updatePermission(
    id,
    permissionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **permissionRequest** | **PermissionRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePermissionResponse**

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

