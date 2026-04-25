# AttachmentApi

All URIs are relative to *http://localhost:8083*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAttachment**](#createattachment) | **POST** /api/common/attachments | Tải lên/Tạo mới một file đính kèm|
|[**deleteAttachment**](#deleteattachment) | **DELETE** /api/common/attachments/{id} | Xoá file đính kèm và huỷ liên kết|
|[**getAllAttachments**](#getallattachments) | **GET** /api/common/attachments | Lấy danh sách tất cả file đính kèm của công ty (có phân trang)|
|[**getAttachmentById**](#getattachmentbyid) | **GET** /api/common/attachments/{id} | Lấy thông tin chi tiết một file đính kèm|
|[**getAttachmentsByReference**](#getattachmentsbyreference) | **GET** /api/common/attachments/reference/{referenceType}/{referenceId} | Lấy danh sách file đính kèm của một entity cụ thể|

# **createAttachment**
> ApiResponseAttachmentResponse createAttachment(attachmentRequest)

Tạo attachment và tự động liên kết với entity qua bảng entity_links.

### Example

```typescript
import {
    AttachmentApi,
    Configuration,
    AttachmentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AttachmentApi(configuration);

let xCompanyId: string; //ID công ty (lấy từ Header hoặc JWT) (default to undefined)
let xUserId: string; //ID người dùng (lấy từ Header hoặc JWT) (default to undefined)
let attachmentRequest: AttachmentRequest; //

const { status, data } = await apiInstance.createAttachment(
    xCompanyId,
    xUserId,
    attachmentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **attachmentRequest** | **AttachmentRequest**|  | |
| **xCompanyId** | [**string**] | ID công ty (lấy từ Header hoặc JWT) | defaults to undefined|
| **xUserId** | [**string**] | ID người dùng (lấy từ Header hoặc JWT) | defaults to undefined|


### Return type

**ApiResponseAttachmentResponse**

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

# **deleteAttachment**
> ApiResponseVoid deleteAttachment()


### Example

```typescript
import {
    AttachmentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttachmentApi(configuration);

let xCompanyId: string; //ID công ty (default to undefined)
let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteAttachment(
    xCompanyId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **xCompanyId** | [**string**] | ID công ty | defaults to undefined|
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

# **getAllAttachments**
> ApiResponsePagedResponseAttachmentResponse getAllAttachments()


### Example

```typescript
import {
    AttachmentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttachmentApi(configuration);

let xCompanyId: string; //ID công ty (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.getAllAttachments(
    xCompanyId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **xCompanyId** | [**string**] | ID công ty | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponseAttachmentResponse**

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

# **getAttachmentById**
> ApiResponseAttachmentResponse getAttachmentById()


### Example

```typescript
import {
    AttachmentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttachmentApi(configuration);

let xCompanyId: string; //ID công ty (default to undefined)
let id: string; // (default to undefined)

const { status, data } = await apiInstance.getAttachmentById(
    xCompanyId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **xCompanyId** | [**string**] | ID công ty | defaults to undefined|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseAttachmentResponse**

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

# **getAttachmentsByReference**
> ApiResponseListAttachmentResponse getAttachmentsByReference()


### Example

```typescript
import {
    AttachmentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttachmentApi(configuration);

let xCompanyId: string; //ID công ty (default to undefined)
let referenceType: string; // (default to undefined)
let referenceId: string; // (default to undefined)

const { status, data } = await apiInstance.getAttachmentsByReference(
    xCompanyId,
    referenceType,
    referenceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **xCompanyId** | [**string**] | ID công ty | defaults to undefined|
| **referenceType** | [**string**] |  | defaults to undefined|
| **referenceId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseListAttachmentResponse**

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

