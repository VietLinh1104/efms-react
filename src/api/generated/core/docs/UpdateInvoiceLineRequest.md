# UpdateInvoiceLineRequest

Payload cập nhật dòng hóa đơn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | UUID dòng hóa đơn hiện tại (null &#x3D; tạo mới, có giá trị &#x3D; cập nhật) | [optional] [default to undefined]
**accountId** | **string** | UUID tài khoản doanh thu (AR) hoặc chi phí (AP) | [default to undefined]
**description** | **string** | Mô tả mặt hàng / dịch vụ | [default to undefined]
**quantity** | **number** | Số lượng | [default to undefined]
**unitPrice** | **number** | Đơn giá | [default to undefined]
**taxRate** | **number** | Tỷ lệ thuế (%) | [default to undefined]

## Example

```typescript
import { UpdateInvoiceLineRequest } from './api';

const instance: UpdateInvoiceLineRequest = {
    id,
    accountId,
    description,
    quantity,
    unitPrice,
    taxRate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
