# InvoiceRequest

Payload tạo / cập nhật hóa đơn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**invoiceType** | **string** | Loại hóa đơn (AR: thu, AP: chi) — bắt buộc khi tạo mới | [default to undefined]
**companyId** | **string** | UUID công ty — bắt buộc khi tạo mới | [optional] [default to undefined]
**partnerId** | **string** | UUID đối tác | [default to undefined]
**invoiceNumber** | **string** | Số hóa đơn (tùy chọn) | [optional] [default to undefined]
**invoiceDate** | **string** | Ngày phát hành | [default to undefined]
**dueDate** | **string** | Ngày đến hạn | [optional] [default to undefined]
**currencyCode** | **string** | Loại tiền tệ | [optional] [default to undefined]
**exchangeRate** | **number** | Tỷ giá quy đổi (mặc định 1) | [optional] [default to undefined]
**lines** | [**Array&lt;InvoiceLineRequest&gt;**](InvoiceLineRequest.md) | Danh sách dòng hóa đơn — id &#x3D;&#x3D; null: tạo mới, id !&#x3D; null: cập nhật dòng đó | [default to undefined]

## Example

```typescript
import { InvoiceRequest } from './api';

const instance: InvoiceRequest = {
    invoiceType,
    companyId,
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
