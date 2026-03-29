# CreateAccountRequest

Payload tạo / cập nhật tài khoản kế toán

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** | Mã tài khoản (VD: 1111) | [default to undefined]
**name** | **string** | Tên tài khoản | [default to undefined]
**type** | **string** | Loại tài khoản (asset, liability, equity, revenue, expense) | [default to undefined]
**balanceType** | **string** | Loại số dư (debit / credit) | [default to undefined]
**parentId** | **string** | UUID tài khoản cha (nếu là tài khoản con) | [optional] [default to undefined]
**companyId** | **string** | UUID công ty sở hữu tài khoản | [optional] [default to undefined]

## Example

```typescript
import { CreateAccountRequest } from './api';

const instance: CreateAccountRequest = {
    code,
    name,
    type,
    balanceType,
    parentId,
    companyId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
