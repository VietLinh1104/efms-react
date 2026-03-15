# FiscalPeriodResponse

Thông tin kỳ kế toán

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID kỳ kế toán | [optional] [default to undefined]
**name** | **string** | Tên kỳ kế toán | [optional] [default to undefined]
**startDate** | **string** | Ngày bắt đầu | [optional] [default to undefined]
**endDate** | **string** | Ngày kết thúc | [optional] [default to undefined]
**status** | **string** | Trạng thái kỳ (open / closed) | [optional] [default to undefined]
**closedBy** | **string** | Người đóng kỳ | [optional] [default to undefined]
**closedAt** | **string** | Thời điểm đóng kỳ | [optional] [default to undefined]
**createdAt** | **string** | Thời điểm tạo | [optional] [default to undefined]

## Example

```typescript
import { FiscalPeriodResponse } from './api';

const instance: FiscalPeriodResponse = {
    id,
    name,
    startDate,
    endDate,
    status,
    closedBy,
    closedAt,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
