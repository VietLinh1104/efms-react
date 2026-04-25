# CommentResponse

Thông tin chi tiết của một comment

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID của comment | [optional] [default to undefined]
**companyId** | **string** | ID công ty sở hữu | [optional] [default to undefined]
**content** | **string** | Nội dung comment | [optional] [default to undefined]
**authorId** | **string** | ID tác giả comment | [optional] [default to undefined]
**authorName** | **string** | Tên tác giả comment | [optional] [default to undefined]
**authorAvatar** | **string** | Ảnh đại diện tác giả (nếu có) | [optional] [default to undefined]
**createdAt** | **string** | Thời điểm tạo | [optional] [default to undefined]

## Example

```typescript
import { CommentResponse } from './api';

const instance: CommentResponse = {
    id,
    companyId,
    content,
    authorId,
    authorName,
    authorAvatar,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
