# AttachmentRequest

Request body để upload một attachment và liên kết với một entity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**referenceId** | **string** | UUID của entity cần gắn attachment (ví dụ: invoice id) | [default to undefined]
**referenceType** | **string** | Kiểu entity (ví dụ: \&#39;invoice\&#39;, \&#39;payment\&#39;) | [default to undefined]
**fileName** | **string** | Tên file gốc | [default to undefined]
**fileType** | **string** | MIME type của file | [optional] [default to undefined]
**fileSize** | **number** | Kích thước file theo byte | [optional] [default to undefined]
**fileUrl** | **string** | URL trỏ đến file đã upload lên storage | [default to undefined]

## Example

```typescript
import { AttachmentRequest } from './api';

const instance: AttachmentRequest = {
    referenceId,
    referenceType,
    fileName,
    fileType,
    fileSize,
    fileUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
