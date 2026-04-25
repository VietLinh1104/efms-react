# AttachmentResponse

Thông tin chi tiết của một attachment

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID của attachment | [optional] [default to undefined]
**companyId** | **string** | ID công ty sở hữu | [optional] [default to undefined]
**fileName** | **string** | Tên file gốc | [optional] [default to undefined]
**fileType** | **string** | MIME type | [optional] [default to undefined]
**fileSize** | **number** | Kích thước file theo byte | [optional] [default to undefined]
**fileUrl** | **string** | URL truy cập file | [optional] [default to undefined]
**createdBy** | **string** | ID người upload | [optional] [default to undefined]
**createdByName** | **string** | Tên người upload | [optional] [default to undefined]
**createdAt** | **string** | Thời điểm upload | [optional] [default to undefined]

## Example

```typescript
import { AttachmentResponse } from './api';

const instance: AttachmentResponse = {
    id,
    companyId,
    fileName,
    fileType,
    fileSize,
    fileUrl,
    createdBy,
    createdByName,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
