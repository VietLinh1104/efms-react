# BankAccountsApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create4**](#create4) | **POST** /v1/finance/bank-accounts | Tạo tài khoản ngân hàng|
|[**getBalance1**](#getbalance1) | **GET** /v1/finance/bank-accounts/{id}/balance | Lấy Số dư tài khoản hiện tại|
|[**getById2**](#getbyid2) | **GET** /v1/finance/bank-accounts/{id} | Chi tiết tài khoản ngân hàng|
|[**list4**](#list4) | **GET** /v1/finance/bank-accounts | Danh sách tài khoản ngân hàng|
|[**toggleActive1**](#toggleactive1) | **PATCH** /v1/finance/bank-accounts/{id}/toggle-active | Bật/Tắt trạng thái hoạt động tài khoản|
|[**update3**](#update3) | **PUT** /v1/finance/bank-accounts/{id} | Cập nhật tài khoản ngân hàng|

# **create4**
> ApiResponseBankAccountResponse create4(createBankAccountRequest)


### Example

```typescript
import {
    BankAccountsApi,
    Configuration,
    CreateBankAccountRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BankAccountsApi(configuration);

let createBankAccountRequest: CreateBankAccountRequest; //

const { status, data } = await apiInstance.create4(
    createBankAccountRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createBankAccountRequest** | **CreateBankAccountRequest**|  | |


### Return type

**ApiResponseBankAccountResponse**

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

# **getBalance1**
> ApiResponseBigDecimal getBalance1()


### Example

```typescript
import {
    BankAccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankAccountsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getBalance1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseBigDecimal**

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

# **getById2**
> ApiResponseBankAccountResponse getById2()


### Example

```typescript
import {
    BankAccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankAccountsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getById2(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseBankAccountResponse**

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

# **list4**
> ApiResponsePagedResponseBankAccountResponse list4()


### Example

```typescript
import {
    BankAccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankAccountsApi(configuration);

let companyId: string; // (default to undefined)
let type: string; //Loại (checking, savings) (optional) (default to undefined)
let search: string; //Từ khoá (optional) (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.list4(
    companyId,
    type,
    search,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **type** | [**string**] | Loại (checking, savings) | (optional) defaults to undefined|
| **search** | [**string**] | Từ khoá | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponseBankAccountResponse**

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

# **toggleActive1**
> ApiResponseBankAccountResponse toggleActive1()


### Example

```typescript
import {
    BankAccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankAccountsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.toggleActive1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseBankAccountResponse**

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

# **update3**
> ApiResponseBankAccountResponse update3(createBankAccountRequest)


### Example

```typescript
import {
    BankAccountsApi,
    Configuration,
    CreateBankAccountRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BankAccountsApi(configuration);

let id: string; // (default to undefined)
let createBankAccountRequest: CreateBankAccountRequest; //

const { status, data } = await apiInstance.update3(
    id,
    createBankAccountRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createBankAccountRequest** | **CreateBankAccountRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseBankAccountResponse**

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

