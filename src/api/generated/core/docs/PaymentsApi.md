# PaymentsApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_delete**](#_delete) | **DELETE** /v1/payments/{id} | Xoá hoàn toàn thanh toán (chỉ khi chưa Post GL)|
|[**allocate**](#allocate) | **POST** /v1/payments/{id}/allocate | Phân bổ số tiền của payment vào 1 Inovice (AR/AP)|
|[**create**](#create) | **POST** /v1/payments | Tạo thanh toán mới|
|[**getDetail**](#getdetail) | **GET** /v1/payments/{id} | Chi tiết Phiếu thanh toán kèm các khoản phân bổ|
|[**list**](#list) | **GET** /v1/payments | Danh sách phiếu thanh toán (Thu/Chi)|
|[**postPayment**](#postpayment) | **POST** /v1/payments/{id}/post | Ghi sổ bút toán tổng hợp (Post payment → GL)|
|[**removeAllocation**](#removeallocation) | **DELETE** /v1/payments/{id}/allocate/{invoiceId} | Gỡ / Xóa phân bổ payment vào invoice|
|[**update**](#update) | **PUT** /v1/payments/{id} | Cập nhật phiếu thanh toán|

# **_delete**
> ApiResponseVoid _delete()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance._delete(
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

# **allocate**
> ApiResponsePaymentResponse allocate(allocatePaymentRequest)


### Example

```typescript
import {
    PaymentsApi,
    Configuration,
    AllocatePaymentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)
let allocatePaymentRequest: AllocatePaymentRequest; //

const { status, data } = await apiInstance.allocate(
    id,
    allocatePaymentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **allocatePaymentRequest** | **AllocatePaymentRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePaymentResponse**

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

# **create**
> ApiResponsePaymentResponse create(createPaymentRequest)


### Example

```typescript
import {
    PaymentsApi,
    Configuration,
    CreatePaymentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let createPaymentRequest: CreatePaymentRequest; //

const { status, data } = await apiInstance.create(
    createPaymentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPaymentRequest** | **CreatePaymentRequest**|  | |


### Return type

**ApiResponsePaymentResponse**

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

# **getDetail**
> ApiResponsePaymentResponse getDetail()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getDetail(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePaymentResponse**

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

# **list**
> ApiResponsePagedResponsePaymentResponse list()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let companyId: string; // (default to undefined)
let paymentType: string; // (optional) (default to undefined)
let partnerId: string; // (optional) (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.list(
    companyId,
    paymentType,
    partnerId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **paymentType** | [**string**] |  | (optional) defaults to undefined|
| **partnerId** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponsePaymentResponse**

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

# **postPayment**
> ApiResponsePaymentResponse postPayment()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.postPayment(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePaymentResponse**

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

# **removeAllocation**
> ApiResponseString removeAllocation()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)
let invoiceId: string; // (default to undefined)

const { status, data } = await apiInstance.removeAllocation(
    id,
    invoiceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **invoiceId** | [**string**] |  | defaults to undefined|


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

# **update**
> ApiResponsePaymentResponse update(createPaymentRequest)


### Example

```typescript
import {
    PaymentsApi,
    Configuration,
    CreatePaymentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)
let createPaymentRequest: CreatePaymentRequest; //

const { status, data } = await apiInstance.update(
    id,
    createPaymentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPaymentRequest** | **CreatePaymentRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePaymentResponse**

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

