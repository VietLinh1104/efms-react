# CreateJournalRequest

Payload tạo chứng từ kế toán

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**entryDate** | **string** | Ngày chứng từ | [default to undefined]
**reference** | **string** | Số tham chiếu | [optional] [default to undefined]
**description** | **string** | Mô tả chứng từ | [optional] [default to undefined]
**periodId** | **string** | UUID kỳ kế toán | [optional] [default to undefined]
**companyId** | **string** | UUID công ty | [optional] [default to undefined]
**lines** | [**Array&lt;JournalLineRequest&gt;**](JournalLineRequest.md) | Danh sách dòng bút toán (phải cân đối Nợ &#x3D; Có) | [default to undefined]

## Example

```typescript
import { CreateJournalRequest } from './api';

const instance: CreateJournalRequest = {
    entryDate,
    reference,
    description,
    periodId,
    companyId,
    lines,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
