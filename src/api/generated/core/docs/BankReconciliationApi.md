# BankReconciliationApi

All URIs are relative to *http://localhost:8080/api/core*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**autoMatch**](#automatch) | **POST** /v1/finance/reconciliation/auto-match | Tính năng tự động tìm kiếm và Match hàng loạt các GD có Amount trùng và cùng Time|
|[**getPendingMatches**](#getpendingmatches) | **GET** /v1/finance/reconciliation | Lấy danh sách các giao dịch NH đang đợi ghép / chờ đối chiếu|
|[**getSummary**](#getsummary) | **GET** /v1/finance/reconciliation/summary | Báo cáo Tổng hợp tình trạng Số dư &amp; Giao dịch|
|[**manualMatch**](#manualmatch) | **POST** /v1/finance/reconciliation/match | Ghép thủ công 1 GD ngân hàng với 1 Bút toán trên Hệ thống|
|[**unmatch**](#unmatch) | **POST** /v1/finance/reconciliation/unmatch/{bankTransactionId} | Gỡ / Xóa link khớp của giao dịch (Un-reconcile)|

# **autoMatch**
> ApiResponseListBankTransactionResponse autoMatch()


### Example

```typescript
import {
    BankReconciliationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankReconciliationApi(configuration);

let bankAccountId: string; // (default to undefined)

const { status, data } = await apiInstance.autoMatch(
    bankAccountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bankAccountId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListBankTransactionResponse**

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

# **getPendingMatches**
> ApiResponseListBankTransactionResponse getPendingMatches()


### Example

```typescript
import {
    BankReconciliationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankReconciliationApi(configuration);

let bankAccountId: string; // (default to undefined)

const { status, data } = await apiInstance.getPendingMatches(
    bankAccountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bankAccountId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListBankTransactionResponse**

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

# **getSummary**
> ApiResponseReconciliationSummaryResponse getSummary()


### Example

```typescript
import {
    BankReconciliationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankReconciliationApi(configuration);

let bankAccountId: string; // (default to undefined)

const { status, data } = await apiInstance.getSummary(
    bankAccountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bankAccountId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseReconciliationSummaryResponse**

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

# **manualMatch**
> ApiResponseBankTransactionResponse manualMatch(reconcileMatchRequest)


### Example

```typescript
import {
    BankReconciliationApi,
    Configuration,
    ReconcileMatchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BankReconciliationApi(configuration);

let reconcileMatchRequest: ReconcileMatchRequest; //

const { status, data } = await apiInstance.manualMatch(
    reconcileMatchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reconcileMatchRequest** | **ReconcileMatchRequest**|  | |


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

# **unmatch**
> ApiResponseBankTransactionResponse unmatch()


### Example

```typescript
import {
    BankReconciliationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BankReconciliationApi(configuration);

let bankTransactionId: string; // (default to undefined)

const { status, data } = await apiInstance.unmatch(
    bankTransactionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bankTransactionId** | [**string**] |  | defaults to undefined|


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

