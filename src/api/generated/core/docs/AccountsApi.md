# AccountsApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create7**](#create7) | **POST** /v1/accounting/accounts | Tạo tài khoản mới|
|[**getBalance2**](#getbalance2) | **GET** /v1/accounting/accounts/{id}/balance | Số dư tài khoản theo kỳ hoặc khoảng ngày|
|[**getById3**](#getbyid3) | **GET** /v1/accounting/accounts/{id} | Chi tiết tài khoản|
|[**list7**](#list7) | **GET** /v1/accounting/accounts | Danh sách tài khoản|
|[**listPage**](#listpage) | **GET** /v1/accounting/accounts/page | Danh sách tài khoản|
|[**toggleActive2**](#toggleactive2) | **PATCH** /v1/accounting/accounts/{id}/toggle-active | Bật / tắt trạng thái tài khoản|
|[**update5**](#update5) | **PUT** /v1/accounting/accounts/{id} | Cập nhật tài khoản|

# **create7**
> ApiResponseAccountResponse create7(createAccountRequest)


### Example

```typescript
import {
    AccountsApi,
    Configuration,
    CreateAccountRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let createAccountRequest: CreateAccountRequest; //

const { status, data } = await apiInstance.create7(
    createAccountRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createAccountRequest** | **CreateAccountRequest**|  | |


### Return type

**ApiResponseAccountResponse**

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

# **getBalance2**
> ApiResponseAccountBalanceResponse getBalance2()


### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let id: string; //UUID tài khoản (default to undefined)
let fromDate: string; //Ngày bắt đầu (yyyy-MM-dd) (default to undefined)
let toDate: string; //Ngày kết thúc (yyyy-MM-dd) (default to undefined)

const { status, data } = await apiInstance.getBalance2(
    id,
    fromDate,
    toDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID tài khoản | defaults to undefined|
| **fromDate** | [**string**] | Ngày bắt đầu (yyyy-MM-dd) | defaults to undefined|
| **toDate** | [**string**] | Ngày kết thúc (yyyy-MM-dd) | defaults to undefined|


### Return type

**ApiResponseAccountBalanceResponse**

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

# **getById3**
> ApiResponseAccountResponse getById3()


### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let id: string; //UUID tài khoản (default to undefined)

const { status, data } = await apiInstance.getById3(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID tài khoản | defaults to undefined|


### Return type

**ApiResponseAccountResponse**

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

# **list7**
> ApiResponseListAccountResponse list7()

Lấy danh sách tài khoản theo công ty. Truyền tree=true để lấy dạng cây.

### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let companyId: string; //UUID công ty (default to undefined)
let tree: boolean; //Trả về dạng cây nếu true (optional) (default to false)

const { status, data } = await apiInstance.list7(
    companyId,
    tree
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] | UUID công ty | defaults to undefined|
| **tree** | [**boolean**] | Trả về dạng cây nếu true | (optional) defaults to false|


### Return type

**ApiResponseListAccountResponse**

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

# **listPage**
> ApiResponsePagedResponseAccountResponse listPage()

Lấy danh sách tài khoản theo công ty (pagination).

### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let companyId: string; //UUID công ty (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.listPage(
    companyId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] | UUID công ty | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponseAccountResponse**

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

# **toggleActive2**
> ApiResponseAccountResponse toggleActive2()


### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let id: string; //UUID tài khoản (default to undefined)

const { status, data } = await apiInstance.toggleActive2(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID tài khoản | defaults to undefined|


### Return type

**ApiResponseAccountResponse**

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

# **update5**
> ApiResponseAccountResponse update5(createAccountRequest)


### Example

```typescript
import {
    AccountsApi,
    Configuration,
    CreateAccountRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let id: string; //UUID tài khoản (default to undefined)
let createAccountRequest: CreateAccountRequest; //

const { status, data } = await apiInstance.update5(
    id,
    createAccountRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createAccountRequest** | **CreateAccountRequest**|  | |
| **id** | [**string**] | UUID tài khoản | defaults to undefined|


### Return type

**ApiResponseAccountResponse**

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

