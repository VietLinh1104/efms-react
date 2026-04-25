# CommentRequest

Request body để tạo một comment và liên kết với một entity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**referenceId** | **string** | UUID của entity cần gắn comment | [default to undefined]
**referenceType** | **string** | Kiểu entity (ví dụ: \&#39;invoice\&#39;, \&#39;payment\&#39;) | [default to undefined]
**content** | **string** | Nội dung comment | [default to undefined]

## Example

```typescript
import { CommentRequest } from './api';

const instance: CommentRequest = {
    referenceId,
    referenceType,
    content,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
