# JournalEntryResponse

Thông tin chứng từ kế toán

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID chứng từ | [optional] [default to undefined]
**entryDate** | **string** | Ngày chứng từ | [optional] [default to undefined]
**reference** | **string** | Số tham chiếu | [optional] [default to undefined]
**description** | **string** | Mô tả chứng từ | [optional] [default to undefined]
**status** | **string** | Trạng thái (draft / posted / cancelled) | [optional] [default to undefined]
**source** | **string** | Nguồn tạo (manual, invoice, payment, ...) | [optional] [default to undefined]
**periodId** | **string** | ID kỳ kế toán | [optional] [default to undefined]
**periodName** | **string** | Tên kỳ kế toán | [optional] [default to undefined]
**createdBy** | **string** | Người tạo | [optional] [default to undefined]
**postedBy** | **string** | Người post | [optional] [default to undefined]
**postedAt** | **string** | Thời điểm post | [optional] [default to undefined]
**createdAt** | **string** | Thời điểm tạo | [optional] [default to undefined]
**lines** | [**Array&lt;JournalLineResponse&gt;**](JournalLineResponse.md) | Danh sách dòng bút toán (chỉ có trong API detail) | [optional] [default to undefined]

## Example

```typescript
import { JournalEntryResponse } from './api';

const instance: JournalEntryResponse = {
    id,
    entryDate,
    reference,
    description,
    status,
    source,
    periodId,
    periodName,
    createdBy,
    postedBy,
    postedAt,
    createdAt,
    lines,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
