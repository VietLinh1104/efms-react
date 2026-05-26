# PaymentResponse

Thông tin phiếu thu/chi

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID thanh toán | [optional] [default to undefined]
**paymentType** | **string** | Loại thanh toán (in / out) | [optional] [default to undefined]
**partnerId** | **string** | ID Đối tác | [optional] [default to undefined]
**partnerName** | **string** | Tên Đối tác | [optional] [default to undefined]
**paymentDate** | **string** | Ngày thanh toán | [optional] [default to undefined]
**currencyCode** | **string** | Loại tiền | [optional] [default to undefined]
**amount** | **number** | Tổng số tiền thanh toán | [optional] [default to undefined]
**paymentMethod** | **string** | Phương thức (bank, cash...) | [optional] [default to undefined]
**reference** | **string** | Diễn giải / tham chiếu | [optional] [default to undefined]
**journalEntryId** | **string** | ID bút toán (nếu đã post) | [optional] [default to undefined]
**createdBy** | **string** | Người nhận/chi | [optional] [default to undefined]
**createdAt** | **string** | Thời gian tạo | [optional] [default to undefined]
**invoiceId** | **string** | ID Hóa đơn liên kết | [optional] [default to undefined]
**invoiceNumber** | **string** | Số hóa đơn liên kết | [optional] [default to undefined]
**bankAccountId** | **string** | ID Tài khoản ngân hàng / tiền mặt | [optional] [default to undefined]
**bankAccountName** | **string** | Tên Tài khoản ngân hàng / tiền mặt | [optional] [default to undefined]

## Example

```typescript
import { PaymentResponse } from './api';

const instance: PaymentResponse = {
    id,
    paymentType,
    partnerId,
    partnerName,
    paymentDate,
    currencyCode,
    amount,
    paymentMethod,
    reference,
    journalEntryId,
    createdBy,
    createdAt,
    invoiceId,
    invoiceNumber,
    bankAccountId,
    bankAccountName,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
