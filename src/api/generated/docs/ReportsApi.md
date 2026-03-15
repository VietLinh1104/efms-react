# ReportsApi

All URIs are relative to *http://localhost:8081*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**exportReport**](#exportreport) | **GET** /api/v1/reports/cash-flow/export | Xuất các báo cáo ra định dạng Excel / PDF (Stub)|
|[**exportReport1**](#exportreport1) | **GET** /api/v1/reports/profit-loss/export | Xuất các báo cáo ra định dạng Excel / PDF (Stub)|
|[**exportReport2**](#exportreport2) | **GET** /api/v1/reports/balance-sheet/export | Xuất các báo cáo ra định dạng Excel / PDF (Stub)|
|[**getApAging**](#getapaging) | **GET** /api/v1/reports/ap-aging | Báo cáo Tuổi nợ Phải Trả (AP Aging)|
|[**getArAging**](#getaraging) | **GET** /api/v1/reports/ar-aging | Báo cáo Tuổi nợ Phải Thu (AR Aging)|
|[**getBalanceSheet**](#getbalancesheet) | **GET** /api/v1/reports/balance-sheet | Bảng Cân đối kế toán (Balance Sheet)|
|[**getCashFlow**](#getcashflow) | **GET** /api/v1/reports/cash-flow | Báo cáo Lưu chuyển tiền tệ (Cash Flow Statement)|
|[**getGeneralLedger**](#getgeneralledger) | **GET** /api/v1/reports/general-ledger | Sổ cái chi tiết theo tài khoản (Account Ledger)|
|[**getProfitLoss**](#getprofitloss) | **GET** /api/v1/reports/profit-loss | Báo cáo Kết quả Hoạt động Kinh doanh (Profit &amp; Loss / Income Statement)|
|[**getTrialBalanceReport**](#gettrialbalancereport) | **GET** /api/v1/reports/trial-balance | Bảng Cân đối tài khoản (Trial Balance)|

# **exportReport**
> ApiResponseString exportReport()


### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

const { status, data } = await apiInstance.exportReport();
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

# **exportReport1**
> ApiResponseString exportReport1()


### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

const { status, data } = await apiInstance.exportReport1();
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

# **exportReport2**
> ApiResponseString exportReport2()


### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

const { status, data } = await apiInstance.exportReport2();
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

# **getApAging**
> ApiResponseListAgingResponse getApAging()


### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let companyId: string; // (default to undefined)
let asOfDate: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getApAging(
    companyId,
    asOfDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **asOfDate** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ApiResponseListAgingResponse**

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

# **getArAging**
> ApiResponseListAgingResponse getArAging()


### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let companyId: string; // (default to undefined)
let asOfDate: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getArAging(
    companyId,
    asOfDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **asOfDate** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ApiResponseListAgingResponse**

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

# **getBalanceSheet**
> ApiResponseBalanceSheetResponse getBalanceSheet()


### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let companyId: string; // (default to undefined)
let asOfDate: string; // (default to undefined)

const { status, data } = await apiInstance.getBalanceSheet(
    companyId,
    asOfDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **asOfDate** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseBalanceSheetResponse**

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

# **getCashFlow**
> ApiResponseCashFlowResponse getCashFlow()


### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let companyId: string; // (default to undefined)
let fromDate: string; // (default to undefined)
let toDate: string; // (default to undefined)

const { status, data } = await apiInstance.getCashFlow(
    companyId,
    fromDate,
    toDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **fromDate** | [**string**] |  | defaults to undefined|
| **toDate** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseCashFlowResponse**

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

# **getGeneralLedger**
> ApiResponseString getGeneralLedger()

Sử dụng bộ lọc search trên /api/v1/accounting/journals

### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

const { status, data } = await apiInstance.getGeneralLedger();
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

# **getProfitLoss**
> ApiResponseProfitLossResponse getProfitLoss()


### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let companyId: string; // (default to undefined)
let fromDate: string; // (default to undefined)
let toDate: string; // (default to undefined)

const { status, data } = await apiInstance.getProfitLoss(
    companyId,
    fromDate,
    toDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|
| **fromDate** | [**string**] |  | defaults to undefined|
| **toDate** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseProfitLossResponse**

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

# **getTrialBalanceReport**
> ApiResponseString getTrialBalanceReport()

Chuyển hướng dùng Endpoint của Accounting module

### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

const { status, data } = await apiInstance.getTrialBalanceReport();
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

