# RoleControllerApi

All URIs are relative to *http://localhost:8080/api/identity*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createRole**](#createrole) | **POST** /v1/roles | |
|[**deleteRole**](#deleterole) | **DELETE** /v1/roles/{id} | |
|[**getAllRoles**](#getallroles) | **GET** /v1/roles | |
|[**getRoleById**](#getrolebyid) | **GET** /v1/roles/{id} | |
|[**updateRole**](#updaterole) | **PUT** /v1/roles/{id} | |

# **createRole**
> ApiResponseRoleResponse createRole(roleRequest)


### Example

```typescript
import {
    RoleControllerApi,
    Configuration,
    RoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let roleRequest: RoleRequest; //

const { status, data } = await apiInstance.createRole(
    roleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleRequest** | **RoleRequest**|  | |


### Return type

**ApiResponseRoleResponse**

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

# **deleteRole**
> ApiResponseVoid deleteRole()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteRole(
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

# **getAllRoles**
> ApiResponseListRoleResponse getAllRoles()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

const { status, data } = await apiInstance.getAllRoles();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseListRoleResponse**

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

# **getRoleById**
> ApiResponseRoleResponse getRoleById()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getRoleById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseRoleResponse**

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

# **updateRole**
> ApiResponseRoleResponse updateRole(roleRequest)


### Example

```typescript
import {
    RoleControllerApi,
    Configuration,
    RoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: string; // (default to undefined)
let roleRequest: RoleRequest; //

const { status, data } = await apiInstance.updateRole(
    id,
    roleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleRequest** | **RoleRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseRoleResponse**

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

