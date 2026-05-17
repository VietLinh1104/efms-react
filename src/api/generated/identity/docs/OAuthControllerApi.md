# OAuthControllerApi

All URIs are relative to *http://localhost:8080/api/identity*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authorize**](#authorize) | **GET** /oauth/authorize | |
|[**callback**](#callback) | **GET** /oauth/callback | |
|[**getMetadata**](#getmetadata) | **GET** /oauth/.well-known/oauth-authorization-server | |
|[**token**](#token) | **POST** /oauth/token | |

# **authorize**
> object authorize()


### Example

```typescript
import {
    OAuthControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuthControllerApi(configuration);

let clientId: string; // (default to undefined)
let redirectUri: string; // (default to undefined)
let responseType: string; // (default to undefined)
let state: string; // (optional) (default to undefined)
let codeChallenge: string; // (optional) (default to undefined)
let codeChallengeMethod: string; // (optional) (default to undefined)
let scope: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.authorize(
    clientId,
    redirectUri,
    responseType,
    state,
    codeChallenge,
    codeChallengeMethod,
    scope
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **clientId** | [**string**] |  | defaults to undefined|
| **redirectUri** | [**string**] |  | defaults to undefined|
| **responseType** | [**string**] |  | defaults to undefined|
| **state** | [**string**] |  | (optional) defaults to undefined|
| **codeChallenge** | [**string**] |  | (optional) defaults to undefined|
| **codeChallengeMethod** | [**string**] |  | (optional) defaults to undefined|
| **scope** | [**string**] |  | (optional) defaults to undefined|


### Return type

**object**

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

# **callback**
> object callback()


### Example

```typescript
import {
    OAuthControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuthControllerApi(configuration);

let token: string; // (default to undefined)
let clientId: string; // (default to undefined)
let redirectUri: string; // (default to undefined)
let state: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.callback(
    token,
    clientId,
    redirectUri,
    state
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **token** | [**string**] |  | defaults to undefined|
| **clientId** | [**string**] |  | defaults to undefined|
| **redirectUri** | [**string**] |  | defaults to undefined|
| **state** | [**string**] |  | (optional) defaults to undefined|


### Return type

**object**

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

# **getMetadata**
> object getMetadata()


### Example

```typescript
import {
    OAuthControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuthControllerApi(configuration);

const { status, data } = await apiInstance.getMetadata();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

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

# **token**
> object token()


### Example

```typescript
import {
    OAuthControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuthControllerApi(configuration);

let grantType: string; // (default to undefined)
let code: string; // (default to undefined)
let redirectUri: string; // (default to undefined)
let clientId: string; // (optional) (default to undefined)
let clientSecret: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.token(
    grantType,
    code,
    redirectUri,
    clientId,
    clientSecret,
    authorization
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **grantType** | [**string**] |  | defaults to undefined|
| **code** | [**string**] |  | defaults to undefined|
| **redirectUri** | [**string**] |  | defaults to undefined|
| **clientId** | [**string**] |  | (optional) defaults to undefined|
| **clientSecret** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to undefined|


### Return type

**object**

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

