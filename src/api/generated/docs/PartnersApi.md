# PartnersApi

All URIs are relative to *http://localhost:8081*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create1**](#create1) | **POST** /api/v1/partners | Tạo đối tác mới|
|[**getBalance**](#getbalance) | **GET** /api/v1/partners/{id}/balance | Số dư công nợ của đối tác|
|[**getById**](#getbyid) | **GET** /api/v1/partners/{id} | Chi tiết đối tác|
|[**getPartnerInvoices**](#getpartnerinvoices) | **GET** /api/v1/partners/{id}/invoices | Lịch sử hóa đơn của đối tác|
|[**list1**](#list1) | **GET** /api/v1/partners | Danh sách đối tác (phân trang)|
|[**toggleActive1**](#toggleactive1) | **PATCH** /api/v1/partners/{id}/toggle-active | Bật / tắt đối tác|
|[**update1**](#update1) | **PUT** /api/v1/partners/{id} | Cập nhật đối tác|

# **create1**
> ApiResponsePartnerResponse create1(createPartnerRequest)


### Example

```typescript
import {
    PartnersApi,
    Configuration,
    CreatePartnerRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnersApi(configuration);

let createPartnerRequest: CreatePartnerRequest; //

const { status, data } = await apiInstance.create1(
    createPartnerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPartnerRequest** | **CreatePartnerRequest**|  | |


### Return type

**ApiResponsePartnerResponse**

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

# **getBalance**
> ApiResponseBigDecimal getBalance()


### Example

```typescript
import {
    PartnersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getBalance(
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

# **getById**
> ApiResponsePartnerResponse getById()


### Example

```typescript
import {
    PartnersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePartnerResponse**

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

# **getPartnerInvoices**
> ApiResponseListInvoiceResponse getPartnerInvoices()


### Example

```typescript
import {
    PartnersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getPartnerInvoices(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListInvoiceResponse**

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

# **list1**
> ApiResponsePagedResponsePartnerResponse list1()


### Example

```typescript
import {
    PartnersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnersApi(configuration);

let companyId: string; // (default to undefined)
let type: string; //Loại (customer/vendor) (optional) (default to undefined)
let search: string; //Từ khóa tìm kiếm (optional) (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.list1(
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
| **type** | [**string**] | Loại (customer/vendor) | (optional) defaults to undefined|
| **search** | [**string**] | Từ khóa tìm kiếm | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponsePartnerResponse**

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
> ApiResponsePartnerResponse toggleActive1()


### Example

```typescript
import {
    PartnersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnersApi(configuration);

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

**ApiResponsePartnerResponse**

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

# **update1**
> ApiResponsePartnerResponse update1(createPartnerRequest)


### Example

```typescript
import {
    PartnersApi,
    Configuration,
    CreatePartnerRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnersApi(configuration);

let id: string; // (default to undefined)
let createPartnerRequest: CreatePartnerRequest; //

const { status, data } = await apiInstance.update1(
    id,
    createPartnerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPartnerRequest** | **CreatePartnerRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePartnerResponse**

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

