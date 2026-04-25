# CommentApi

All URIs are relative to *http://localhost:8083*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createComment**](#createcomment) | **POST** /api/common/comments | Viết bình luận mới|
|[**deleteComment**](#deletecomment) | **DELETE** /api/common/comments/{id} | Xoá bình luận và huỷ liên kết|
|[**getCommentById**](#getcommentbyid) | **GET** /api/common/comments/{id} | Lấy thông tin chi tiết một bình luận|
|[**getCommentsByReference**](#getcommentsbyreference) | **GET** /api/common/comments/reference/{referenceType}/{referenceId} | Lấy danh sách bình luận của một entity (không phân trang)|
|[**getPagedCommentsByReference**](#getpagedcommentsbyreference) | **GET** /api/common/comments/reference/{referenceType}/{referenceId}/paged | Lấy danh sách bình luận của một entity (có phân trang)|

# **createComment**
> ApiResponseCommentResponse createComment(commentRequest)

Tạo bình luận và tự động liên kết với entity qua bảng entity_links.

### Example

```typescript
import {
    CommentApi,
    Configuration,
    CommentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentApi(configuration);

let xCompanyId: string; //ID công ty (lấy từ Header hoặc JWT) (default to undefined)
let xUserId: string; //ID người dùng (lấy từ Header hoặc JWT) (default to undefined)
let commentRequest: CommentRequest; //

const { status, data } = await apiInstance.createComment(
    xCompanyId,
    xUserId,
    commentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentRequest** | **CommentRequest**|  | |
| **xCompanyId** | [**string**] | ID công ty (lấy từ Header hoặc JWT) | defaults to undefined|
| **xUserId** | [**string**] | ID người dùng (lấy từ Header hoặc JWT) | defaults to undefined|


### Return type

**ApiResponseCommentResponse**

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

# **deleteComment**
> ApiResponseVoid deleteComment()


### Example

```typescript
import {
    CommentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentApi(configuration);

let xCompanyId: string; //ID công ty (default to undefined)
let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteComment(
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

# **getCommentById**
> ApiResponseCommentResponse getCommentById()


### Example

```typescript
import {
    CommentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentApi(configuration);

let xCompanyId: string; //ID công ty (default to undefined)
let id: string; // (default to undefined)

const { status, data } = await apiInstance.getCommentById(
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

**ApiResponseCommentResponse**

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

# **getCommentsByReference**
> ApiResponseListCommentResponse getCommentsByReference()


### Example

```typescript
import {
    CommentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentApi(configuration);

let xCompanyId: string; //ID công ty (default to undefined)
let referenceType: string; // (default to undefined)
let referenceId: string; // (default to undefined)

const { status, data } = await apiInstance.getCommentsByReference(
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

**ApiResponseListCommentResponse**

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

# **getPagedCommentsByReference**
> ApiResponsePagedResponseCommentResponse getPagedCommentsByReference()


### Example

```typescript
import {
    CommentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentApi(configuration);

let xCompanyId: string; //ID công ty (default to undefined)
let referenceType: string; // (default to undefined)
let referenceId: string; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.getPagedCommentsByReference(
    xCompanyId,
    referenceType,
    referenceId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **xCompanyId** | [**string**] | ID công ty | defaults to undefined|
| **referenceType** | [**string**] |  | defaults to undefined|
| **referenceId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**ApiResponsePagedResponseCommentResponse**

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

