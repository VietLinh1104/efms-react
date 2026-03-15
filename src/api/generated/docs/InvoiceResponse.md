# InvoiceResponse

Thông tin hóa đơn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID hóa đơn | [optional] [default to undefined]
**invoiceType** | **string** | Phân loại hóa đơn (AR/AP) | [optional] [default to undefined]
**invoiceNumber** | **string** | Số hóa đơn | [optional] [default to undefined]
**partnerId** | **string** | ID Đối tác | [optional] [default to undefined]
**partnerName** | **string** | Tên Đối tác | [optional] [default to undefined]
**invoiceDate** | **string** | Ngày hóa đơn | [optional] [default to undefined]
**dueDate** | **string** | Ngày đến hạn | [optional] [default to undefined]
**currencyCode** | **string** | Mã tiền tệ | [optional] [default to undefined]
**exchangeRate** | **number** | Tỷ giá | [optional] [default to undefined]
**subtotal** | **number** | Tổng tiền trước thuế | [optional] [default to undefined]
**taxAmount** | **number** | Tổng tiền thuế | [optional] [default to undefined]
**totalAmount** | **number** | Tổng giá trị hóa đơn (sau thuế) | [optional] [default to undefined]
**paidAmount** | **number** | Số tiền đã thanh toán | [optional] [default to undefined]
**status** | **string** | Trạng thái (draft, open, in_payment, paid, cancelled) | [optional] [default to undefined]
**createdBy** | **string** | Người lập | [optional] [default to undefined]
**createdAt** | **string** | Thời điểm tạo | [optional] [default to undefined]
**journalEntryId** | **string** | ID Bút toán liên kết (nếu đã confirm) | [optional] [default to undefined]
**lines** | [**Array&lt;InvoiceLineResponse&gt;**](InvoiceLineResponse.md) | Chi tiết các dòng hóa đơn (chỉ có khi gọi detail) | [optional] [default to undefined]

## Example

```typescript
import { InvoiceResponse } from './api';

const instance: InvoiceResponse = {
    id,
    invoiceType,
    invoiceNumber,
    partnerId,
    partnerName,
    invoiceDate,
    dueDate,
    currencyCode,
    exchangeRate,
    subtotal,
    taxAmount,
    totalAmount,
    paidAmount,
    status,
    createdBy,
    createdAt,
    journalEntryId,
    lines,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
