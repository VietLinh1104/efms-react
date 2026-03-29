# CreatePaymentRequest

Payload tạo/cập nhật phiếu thu/chi

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**paymentType** | **string** | Loại giao dịch (in / out) | [default to undefined]
**partnerId** | **string** | UUID đối tác | [default to undefined]
**paymentDate** | **string** | Ngày giao dịch | [default to undefined]
**currencyCode** | **string** | Loại tiền tệ | [optional] [default to undefined]
**exchangeRate** | **number** | Tỷ giá quy đổi (mặc định 1) | [optional] [default to undefined]
**amount** | **number** | Số tiền thanh toán | [default to undefined]
**paymentMethod** | **string** | Phương thức thanh toán (cash, bank, card...) | [optional] [default to undefined]
**bankAccountId** | **string** | UUID tài khoản ngân hàng (nếu method&#x3D;bank) | [optional] [default to undefined]
**reference** | **string** | Số tham chiếu / Lý do | [optional] [default to undefined]
**companyId** | **string** | UUID công ty sở hữu | [optional] [default to undefined]

## Example

```typescript
import { CreatePaymentRequest } from './api';

const instance: CreatePaymentRequest = {
    paymentType,
    partnerId,
    paymentDate,
    currencyCode,
    exchangeRate,
    amount,
    paymentMethod,
    bankAccountId,
    reference,
    companyId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
