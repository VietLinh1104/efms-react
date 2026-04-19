# BankTransactionsApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create2**](#create2) | **POST** /v1/finance/bank-transactions | Tạo một giao dịch thủ công trên hệ thống|
|[**delete1**](#delete1) | **DELETE** /v1/finance/bank-transactions/{id} | Xoá giao dịch (Chỉ khi CHƯA được đối chiếu - unreconciled)|
|[**getById1**](#getbyid1) | **GET** /v1/finance/bank-transactions/{id} | Chi tiết một giao dịch ngân hàng|
|[**importData**](#importdata) | **POST** /v1/finance/bank-transactions/import | Import bản sao kê (Bank Statement) từ file CSV/Excel|
|[**list2**](#list2) | **GET** /v1/finance/bank-transactions | Danh sách giao dịch ngân hàng|

# **create2**
> ApiResponseBankTransactionResponse create2(createBankTransactionRequest)


### Example

```typescript
import {
    BankTransactionsApi,
    Configuration,
    CreateBankTransactionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BankTransactionsApi(configuration);

let createBankTransactionRequest: CreateBankTransactionRequest; //

const { status, data } = await apiInstance.create2(
    createBankTransactionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createBankTransactionRequest** | **CreateBankTransactionRequest**|  | |


### Return type

**ApiResponseBankTransactionResponse**

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

# **delete1**
> ApiResponseVoid delete1()


### Example

```typescript
import {
    BankTransactionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankTransactionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete1(
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

# **getById1**
> ApiResponseBankTransactionResponse getById1()


### Example

```typescript
import {
    BankTransactionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankTransactionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getById1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseBankTransactionResponse**

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

# **importData**
> ApiResponseString importData()

Đang phát triển - TODO: sử dụng MultiPartFile upload

### Example

```typescript
import {
    BankTransactionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankTransactionsApi(configuration);

const { status, data } = await apiInstance.importData();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseString**

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

# **list2**
> ApiResponsePagedResponseBankTransactionResponse list2()


### Example

```typescript
import {
    BankTransactionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankTransactionsApi(configuration);

let companyId: string; // (default to undefined)
let bankAccountId: string; // (optional) (default to undefined)
let type: string; // (optional) (default to undefined)
let status: string; // (optional) (default to undefined)
let fromDate: string; // (optional) (default to undefined)
let toDate: string; // (optional) (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.list2(
    companyId,
    bankAccountId,
    type,
    status,
    fromDate,
    toDate,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **bankAccountId** | [**string**] |  | (optional) defaults to undefined|
| **type** | [**string**] |  | (optional) defaults to undefined|
| **status** | [**string**] |  | (optional) defaults to undefined|
| **fromDate** | [**string**] |  | (optional) defaults to undefined|
| **toDate** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponseBankTransactionResponse**

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

