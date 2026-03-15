# AgingResponse

Báo cáo Tuổi nợ (Aging Report) cho 1 Đối tác / Hóa đơn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID Đối tác hoặc Hóa đơn | [optional] [default to undefined]
**name** | **string** | Tên Đối tác | [optional] [default to undefined]
**totalAmount** | **number** | Tổng dư nợ | [optional] [default to undefined]
**current** | **number** | Số dư chưa quá hạn (Current) | [optional] [default to undefined]
**over1To30** | **number** | Quá hạn từ 1 đến 30 ngày | [optional] [default to undefined]
**over31To60** | **number** | Quá hạn từ 31 đến 60 ngày | [optional] [default to undefined]
**over61To90** | **number** | Quá hạn từ 61 đến 90 ngày | [optional] [default to undefined]
**over90** | **number** | Quá hạn trên 90 ngày | [optional] [default to undefined]

## Example

```typescript
import { AgingResponse } from './api';

const instance: AgingResponse = {
    id,
    name,
    totalAmount,
    current,
    over1To30,
    over31To60,
    over61To90,
    over90,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
