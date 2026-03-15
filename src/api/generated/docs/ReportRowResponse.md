# ReportRowResponse

Một dòng dữ liệu trong báo cáo tài chính (hỗ trợ phân cấp cây)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Mã/Tên mục báo cáo (vd: 111, Tiền mặt) | [optional] [default to undefined]
**amount** | **number** | Giá trị số tiền | [optional] [default to undefined]
**level** | **number** | Mức độ thò thụt (Cấp độ cha con) để in lề | [optional] [default to undefined]
**children** | **any** |  | [optional] [default to undefined]
**total** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { ReportRowResponse } from './api';

const instance: ReportRowResponse = {
    name,
    amount,
    level,
    children,
    total,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
