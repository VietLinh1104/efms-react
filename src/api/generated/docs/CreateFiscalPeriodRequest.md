# CreateFiscalPeriodRequest

Payload tạo kỳ kế toán

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Tên kỳ kế toán | [default to undefined]
**startDate** | **string** | Ngày bắt đầu kỳ | [default to undefined]
**endDate** | **string** | Ngày kết thúc kỳ | [default to undefined]
**companyId** | **string** | UUID công ty | [optional] [default to undefined]

## Example

```typescript
import { CreateFiscalPeriodRequest } from './api';

const instance: CreateFiscalPeriodRequest = {
    name,
    startDate,
    endDate,
    companyId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
