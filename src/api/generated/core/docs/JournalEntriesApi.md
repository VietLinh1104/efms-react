# JournalEntriesApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cancel1**](#cancel1) | **POST** /v1/accounting/journals/{id}/cancel | Huỷ chứng từ|
|[**create5**](#create5) | **POST** /v1/accounting/journals | Tạo chứng từ mới (trạng thái draft)|
|[**delete3**](#delete3) | **DELETE** /v1/accounting/journals/{id} | Xoá chứng từ (chỉ áp dụng khi ở trạng thái draft)|
|[**getDetail2**](#getdetail2) | **GET** /v1/accounting/journals/{id} | Chi tiết chứng từ kèm các dòng bút toán|
|[**list5**](#list5) | **GET** /v1/accounting/journals | Danh sách chứng từ (có phân trang, lọc theo trạng thái / ngày)|
|[**post**](#post) | **POST** /v1/accounting/journals/{id}/post | Post chứng từ (draft → posted)|
|[**update4**](#update4) | **PUT** /v1/accounting/journals/{id} | Cập nhật chứng từ (chỉ áp dụng khi ở trạng thái draft)|

# **cancel1**
> ApiResponseJournalEntryResponse cancel1()


### Example

```typescript
import {
    JournalEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntriesApi(configuration);

let id: string; //UUID chứng từ (default to undefined)

const { status, data } = await apiInstance.cancel1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID chứng từ | defaults to undefined|


### Return type

**ApiResponseJournalEntryResponse**

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

# **create5**
> ApiResponseJournalEntryResponse create5(createJournalRequest)

Tổng Nợ phải bằng Tổng Có mới tạo được

### Example

```typescript
import {
    JournalEntriesApi,
    Configuration,
    CreateJournalRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntriesApi(configuration);

let createJournalRequest: CreateJournalRequest; //

const { status, data } = await apiInstance.create5(
    createJournalRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createJournalRequest** | **CreateJournalRequest**|  | |


### Return type

**ApiResponseJournalEntryResponse**

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

# **delete3**
> ApiResponseVoid delete3()


### Example

```typescript
import {
    JournalEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntriesApi(configuration);

let id: string; //UUID chứng từ (default to undefined)

const { status, data } = await apiInstance.delete3(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID chứng từ | defaults to undefined|


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

# **getDetail2**
> ApiResponseJournalEntryResponse getDetail2()


### Example

```typescript
import {
    JournalEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntriesApi(configuration);

let id: string; //UUID chứng từ (default to undefined)

const { status, data } = await apiInstance.getDetail2(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID chứng từ | defaults to undefined|


### Return type

**ApiResponseJournalEntryResponse**

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

# **list5**
> ApiResponsePagedResponseJournalEntryResponse list5()


### Example

```typescript
import {
    JournalEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntriesApi(configuration);

let companyId: string; //UUID công ty (default to undefined)
let status: string; //Lọc theo trạng thái: draft, posted, cancelled (optional) (default to undefined)
let fromDate: string; //Từ ngày (yyyy-MM-dd) (optional) (default to undefined)
let toDate: string; //Đến ngày (yyyy-MM-dd) (optional) (default to undefined)
let page: number; //Trang hiện tại (0-indexed) (optional) (default to 0)
let size: number; //Số phần tử mỗi trang (optional) (default to 20)

const { status, data } = await apiInstance.list5(
    companyId,
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
| **companyId** | [**string**] | UUID công ty | defaults to undefined|
| **status** | [**string**] | Lọc theo trạng thái: draft, posted, cancelled | (optional) defaults to undefined|
| **fromDate** | [**string**] | Từ ngày (yyyy-MM-dd) | (optional) defaults to undefined|
| **toDate** | [**string**] | Đến ngày (yyyy-MM-dd) | (optional) defaults to undefined|
| **page** | [**number**] | Trang hiện tại (0-indexed) | (optional) defaults to 0|
| **size** | [**number**] | Số phần tử mỗi trang | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponseJournalEntryResponse**

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

# **post**
> ApiResponseJournalEntryResponse post()


### Example

```typescript
import {
    JournalEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntriesApi(configuration);

let id: string; //UUID chứng từ (default to undefined)

const { status, data } = await apiInstance.post(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID chứng từ | defaults to undefined|


### Return type

**ApiResponseJournalEntryResponse**

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

# **update4**
> ApiResponseJournalEntryResponse update4(createJournalRequest)


### Example

```typescript
import {
    JournalEntriesApi,
    Configuration,
    CreateJournalRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntriesApi(configuration);

let id: string; //UUID chứng từ (default to undefined)
let createJournalRequest: CreateJournalRequest; //

const { status, data } = await apiInstance.update4(
    id,
    createJournalRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createJournalRequest** | **CreateJournalRequest**|  | |
| **id** | [**string**] | UUID chứng từ | defaults to undefined|


### Return type

**ApiResponseJournalEntryResponse**

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

