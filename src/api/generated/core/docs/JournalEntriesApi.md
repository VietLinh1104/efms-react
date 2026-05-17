# JournalEntriesApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getDetail1**](#getdetail1) | **GET** /v1/accounting/journals/{id} | Chi tiết bút toán kèm các dòng Nợ/Có|
|[**list3**](#list3) | **GET** /v1/accounting/journals | Danh sách bút toán (phân trang, lọc theo trạng thái / ngày)|

# **getDetail1**
> ApiResponseJournalEntryResponse getDetail1()


### Example

```typescript
import {
    JournalEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntriesApi(configuration);

let id: string; //UUID bút toán (default to undefined)

const { status, data } = await apiInstance.getDetail1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | UUID bút toán | defaults to undefined|


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

# **list3**
> ApiResponsePagedResponseJournalEntryResponse list3()


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

const { status, data } = await apiInstance.list3(
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

