# FiscalPeriodsApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**close**](#close) | **POST** /v1/accounting/fiscal-periods/{id}/close | Đóng kỳ kế toán|
|[**create6**](#create6) | **POST** /v1/accounting/fiscal-periods | Tạo kỳ kế toán mới|
|[**list6**](#list6) | **GET** /v1/accounting/fiscal-periods | Danh sách kỳ kế toán|
|[**reopen**](#reopen) | **POST** /v1/accounting/fiscal-periods/{id}/reopen | Mở lại kỳ kế toán (Admin)|

# **close**
> ApiResponseFiscalPeriodResponse close()


### Example

```typescript
import {
    FiscalPeriodsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FiscalPeriodsApi(configuration);

let id: string; //UUID kỳ kế toán (default to undefined)

const { status, data } = await apiInstance.close(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID kỳ kế toán | defaults to undefined|


### Return type

**ApiResponseFiscalPeriodResponse**

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

# **create6**
> ApiResponseFiscalPeriodResponse create6(createFiscalPeriodRequest)


### Example

```typescript
import {
    FiscalPeriodsApi,
    Configuration,
    CreateFiscalPeriodRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new FiscalPeriodsApi(configuration);

let createFiscalPeriodRequest: CreateFiscalPeriodRequest; //

const { status, data } = await apiInstance.create6(
    createFiscalPeriodRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createFiscalPeriodRequest** | **CreateFiscalPeriodRequest**|  | |


### Return type

**ApiResponseFiscalPeriodResponse**

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

# **list6**
> ApiResponseListFiscalPeriodResponse list6()


### Example

```typescript
import {
    FiscalPeriodsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FiscalPeriodsApi(configuration);

let companyId: string; //UUID công ty (default to undefined)

const { status, data } = await apiInstance.list6(
    companyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] | UUID công ty | defaults to undefined|


### Return type

**ApiResponseListFiscalPeriodResponse**

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

# **reopen**
> ApiResponseFiscalPeriodResponse reopen()


### Example

```typescript
import {
    FiscalPeriodsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FiscalPeriodsApi(configuration);

let id: string; //UUID kỳ kế toán (default to undefined)

const { status, data } = await apiInstance.reopen(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID kỳ kế toán | defaults to undefined|


### Return type

**ApiResponseFiscalPeriodResponse**

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

