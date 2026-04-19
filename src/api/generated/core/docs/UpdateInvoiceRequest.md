# UpdateInvoiceRequest

Payload cập nhật hóa đơn (chỉ cho phép ở trạng thái draft)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**partnerId** | **string** | UUID đối tác | [default to undefined]
**invoiceNumber** | **string** | Số hóa đơn | [optional] [default to undefined]
**invoiceDate** | **string** | Ngày phát hành | [default to undefined]
**dueDate** | **string** | Ngày đến hạn | [optional] [default to undefined]
**currencyCode** | **string** | Loại tiền tệ | [optional] [default to undefined]
**exchangeRate** | **number** | Tỷ giá quy đổi | [optional] [default to undefined]
**lines** | [**Array&lt;UpdateInvoiceLineRequest&gt;**](UpdateInvoiceLineRequest.md) | Danh sách dòng hóa đơn – nếu id !&#x3D; null thì update dòng đó, id &#x3D;&#x3D; null thì tạo mới | [default to undefined]

## Example

```typescript
import { UpdateInvoiceRequest } from './api';

const instance: UpdateInvoiceRequest = {
    partnerId,
    invoiceNumber,
    invoiceDate,
    dueDate,
    currencyCode,
    exchangeRate,
    lines,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
