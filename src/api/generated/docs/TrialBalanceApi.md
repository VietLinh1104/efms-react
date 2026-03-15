# TrialBalanceApi

All URIs are relative to *http://localhost:8081*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_export**](#_export) | **GET** /api/v1/accounting/trial-balance/export | Xuất Trial Balance (Excel / PDF)|
|[**get**](#get) | **GET** /api/v1/accounting/trial-balance | Lấy Trial Balance theo kỳ hoặc khoảng ngày|

# **_export**
> ApiResponseString _export()

TODO: implement export

### Example

```typescript
import {
    TrialBalanceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TrialBalanceApi(configuration);

let companyId: string; // (default to undefined)
let periodId: string; // (optional) (default to undefined)
let format: string; //Định dạng xuất: excel hoặc pdf (optional) (default to 'excel')

const { status, data } = await apiInstance._export(
    companyId,
    periodId,
    format
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **periodId** | [**string**] |  | (optional) defaults to undefined|
| **format** | [**string**] | Định dạng xuất: excel hoặc pdf | (optional) defaults to 'excel'|


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

# **get**
> ApiResponseTrialBalanceResponse get()


### Example

```typescript
import {
    TrialBalanceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TrialBalanceApi(configuration);

let companyId: string; //UUID công ty (default to undefined)
let periodId: string; //UUID kỳ kế toán (ưu tiên nếu có) (optional) (default to undefined)
let fromDate: string; //Ngày bắt đầu (yyyy-MM-dd) — dùng khi không có periodId (optional) (default to undefined)
let toDate: string; //Ngày kết thúc (yyyy-MM-dd) — dùng khi không có periodId (optional) (default to undefined)

const { status, data } = await apiInstance.get(
    companyId,
    periodId,
    fromDate,
    toDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] | UUID công ty | defaults to undefined|
| **periodId** | [**string**] | UUID kỳ kế toán (ưu tiên nếu có) | (optional) defaults to undefined|
| **fromDate** | [**string**] | Ngày bắt đầu (yyyy-MM-dd) — dùng khi không có periodId | (optional) defaults to undefined|
| **toDate** | [**string**] | Ngày kết thúc (yyyy-MM-dd) — dùng khi không có periodId | (optional) defaults to undefined|


### Return type

**ApiResponseTrialBalanceResponse**

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

