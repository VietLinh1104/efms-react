# PagedResponsePartnerResponse

Wrapper cho danh sách có phân trang

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | [**Array&lt;PartnerResponse&gt;**](PartnerResponse.md) | Danh sách phần tử | [optional] [default to undefined]
**page** | **number** | Trang hiện tại (0-indexed) | [optional] [default to undefined]
**size** | **number** | Số phần tử mỗi trang | [optional] [default to undefined]
**totalElements** | **number** | Tổng số phần tử | [optional] [default to undefined]
**totalPages** | **number** | Tổng số trang | [optional] [default to undefined]
**hasPrevious** | **boolean** | Có trang trước không | [optional] [default to undefined]
**hasNext** | **boolean** | Có trang sau không | [optional] [default to undefined]

## Example

```typescript
import { PagedResponsePartnerResponse } from './api';

const instance: PagedResponsePartnerResponse = {
    content,
    page,
    size,
    totalElements,
    totalPages,
    hasPrevious,
    hasNext,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
