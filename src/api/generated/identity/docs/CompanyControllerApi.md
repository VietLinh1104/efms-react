# CompanyControllerApi

All URIs are relative to *http://localhost:8080/api/identity*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCompany**](#createcompany) | **POST** /v1/companies | |
|[**deleteCompany**](#deletecompany) | **DELETE** /v1/companies/{id} | |
|[**getAllCompanies**](#getallcompanies) | **GET** /v1/companies | |
|[**getCompanyById**](#getcompanybyid) | **GET** /v1/companies/{id} | |
|[**updateCompany**](#updatecompany) | **PUT** /v1/companies/{id} | |

# **createCompany**
> ApiResponseCompanyResponse createCompany(companyRequest)


### Example

```typescript
import {
    CompanyControllerApi,
    Configuration,
    CompanyRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CompanyControllerApi(configuration);

let companyRequest: CompanyRequest; //

const { status, data } = await apiInstance.createCompany(
    companyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyRequest** | **CompanyRequest**|  | |


### Return type

**ApiResponseCompanyResponse**

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

# **deleteCompany**
> ApiResponseVoid deleteCompany()


### Example

```typescript
import {
    CompanyControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CompanyControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteCompany(
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

# **getAllCompanies**
> ApiResponseListCompanyResponse getAllCompanies()


### Example

```typescript
import {
    CompanyControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CompanyControllerApi(configuration);

const { status, data } = await apiInstance.getAllCompanies();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseListCompanyResponse**

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

# **getCompanyById**
> ApiResponseCompanyResponse getCompanyById()


### Example

```typescript
import {
    CompanyControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CompanyControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getCompanyById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseCompanyResponse**

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

# **updateCompany**
> ApiResponseCompanyResponse updateCompany(companyRequest)


### Example

```typescript
import {
    CompanyControllerApi,
    Configuration,
    CompanyRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CompanyControllerApi(configuration);

let id: string; // (default to undefined)
let companyRequest: CompanyRequest; //

const { status, data } = await apiInstance.updateCompany(
    id,
    companyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyRequest** | **CompanyRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseCompanyResponse**

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

