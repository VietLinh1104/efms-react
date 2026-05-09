# Identity API Skill

## Overview

This skill documents how to use the **Identity Service APIs** in the frontend. All API instances are pre-configured in `src/api/index.ts`. Import and use them directly in views, stores, or composables.

---

## Available API Instances

```typescript
import {
  identityAuditLogControllerApi,
  identityAuthControllerApi,
  identityCompanyControllerApi,
  identityPermissionControllerApi,
  identityRoleControllerApi,
  identityUserControllerApi,
} from "@/api";
```

---

## Types Reference

### Auth Types

#### `LoginRequest`
```typescript
interface LoginRequest {
  email: string;    // required
  password: string; // required
}
```

#### `RegisterRequest`
```typescript
interface RegisterRequest {
  name: string;        // required
  email: string;       // required
  password: string;    // required
  otp: string;         // required — verification code from send-code step
  companyName: string; // required
  taxCode?: string;
  address?: string;
}
```

---

### Company Types

#### `CompanyRequest` (create/update body)
```typescript
interface CompanyRequest {
  name: string;      // required
  currency?: string;
  taxCode?: string;
  address?: string;
  isActive?: boolean;
}
```

#### `CompanyResponse` (returned from API)
```typescript
interface CompanyResponse {
  id?: string;
  name?: string;
  currency?: string;
  taxCode?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
}
```

---

### Permission Types

#### `PermissionRequest`
```typescript
interface PermissionRequest {
  resource: string;    // required — e.g. "INVOICE", "USER"
  action: string;      // required — e.g. "READ", "CREATE", "DELETE"
  description?: string;
}
```

#### `PermissionResponse`
```typescript
interface PermissionResponse {
  id?: string;
  resource?: string;
  action?: string;
  description?: string;
  createdAt?: string;
}
```

---

### Role Types

#### `RoleRequest`
```typescript
interface RoleRequest {
  name: string;              // required
  description?: string;
  isActive?: boolean;
  permissionIds?: string[];  // array of PermissionResponse.id
}
```

#### `RoleResponse`
```typescript
interface RoleResponse {
  id?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  permissions?: PermissionResponse[];
}
```

---

### User Types

#### `UserUpdateRequest`
```typescript
interface UserUpdateRequest {
  name?: string;
  email?: string;
  isActive?: boolean;
  roleId?: string;   // RoleResponse.id
}
```

#### `UserResponse`
```typescript
interface UserResponse {
  id?: string;
  name?: string;
  email?: string;
  isActive?: boolean;
  createdAt?: string;
  company?: CompanyResponse;
  role?: RoleResponse;
}
```

#### `UserInternalResponse` (for batch lookup)
```typescript
interface UserInternalResponse {
  id?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
}
```

---

### Audit Log Types

#### `AuditLogResponse`
```typescript
interface AuditLogResponse {
  id?: string;
  tableName?: string;
  recordId?: string;
  action?: string;       // e.g. "CREATE", "UPDATE", "DELETE"
  changedByName?: string;
  changedAt?: string;    // ISO datetime string
  oldData?: { [key: string]: object };
  newData?: { [key: string]: object };
}
```

#### `PageAuditLogResponse` (paginated)
```typescript
interface PageAuditLogResponse {
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  size?: number;
  number?: number;       // current page index (0-based)
  content?: AuditLogResponse[];
  empty?: boolean;
}
```

---

### Generic API Response Wrapper

All endpoints return a wrapped response:
```typescript
interface ApiResponse<T> {
  status?: number;
  message?: string;
  data?: T;
}
```

Access data with: `response.data.data`

---

## Usage in Views

### Auth — Login
```typescript
import { identityAuthControllerApi } from "@/api";

const login = async (email: string, password: string) => {
  const response = await identityAuthControllerApi.authenticateUser({
    loginRequest: { email, password },
  });
  // response.data contains the token/session object
  return response.data;
};
```

### Auth — Register (2-step flow)

**Step 1: Send OTP**
```typescript
await identityAuthControllerApi.sendRegistrationCode({ email: "user@example.com" });
```

**Step 2: Register with OTP**
```typescript
const response = await identityAuthControllerApi.registerUser({
  registerRequest: {
    name: "Nguyen Van A",
    email: "user@example.com",
    password: "secret123",
    otp: "123456",
    companyName: "Acme Corp",
    taxCode: "0123456789",
    address: "Ha Noi",
  },
});
```

---

### Company — CRUD

```typescript
import { identityCompanyControllerApi } from "@/api";

// Get all
const { data } = await identityCompanyControllerApi.getAllCompanies();
const companies = data.data; // CompanyResponse[]

// Get by ID
const { data } = await identityCompanyControllerApi.getCompanyById({ id: "uuid" });
const company = data.data; // CompanyResponse

// Create
const { data } = await identityCompanyControllerApi.createCompany({
  companyRequest: { name: "New Co", currency: "VND", isActive: true },
});

// Update
await identityCompanyControllerApi.updateCompany({
  id: "uuid",
  companyRequest: { name: "Updated Name", isActive: false },
});

// Delete
await identityCompanyControllerApi.deleteCompany({ id: "uuid" });
```

---

### Permission — CRUD

```typescript
import { identityPermissionControllerApi } from "@/api";

// Get all
const { data } = await identityPermissionControllerApi.getAllPermissions();
const permissions = data.data; // PermissionResponse[]

// Create
await identityPermissionControllerApi.createPermission({
  permissionRequest: { resource: "INVOICE", action: "CREATE", description: "Can create invoices" },
});

// Update
await identityPermissionControllerApi.updatePermission({
  id: "uuid",
  permissionRequest: { resource: "INVOICE", action: "DELETE" },
});

// Delete
await identityPermissionControllerApi.deletePermission({ id: "uuid" });
```

---

### Role — CRUD

```typescript
import { identityRoleControllerApi } from "@/api";

// Get all
const { data } = await identityRoleControllerApi.getAllRoles();
const roles = data.data; // RoleResponse[] — each includes permissions array

// Create role with permissions
await identityRoleControllerApi.createRole({
  roleRequest: {
    name: "Accountant",
    description: "Manages invoices and payments",
    isActive: true,
    permissionIds: ["perm-uuid-1", "perm-uuid-2"],
  },
});

// Update
await identityRoleControllerApi.updateRole({
  id: "role-uuid",
  roleRequest: { name: "Senior Accountant", permissionIds: ["perm-uuid-1"] },
});

// Delete
await identityRoleControllerApi.deleteRole({ id: "role-uuid" });
```

---

### User — Read & Update

```typescript
import { identityUserControllerApi } from "@/api";

// Get all users
const { data } = await identityUserControllerApi.getAllUsers();
const users = data.data; // UserResponse[] — includes company and role objects

// Get by ID
const { data } = await identityUserControllerApi.getUserById({ id: "uuid" });
const user = data.data; // UserResponse

// Update user (assign role, toggle active, etc.)
await identityUserControllerApi.updateUser({
  id: "uuid",
  userUpdateRequest: {
    name: "Nguyen Van B",
    isActive: true,
    roleId: "role-uuid",
  },
});

// Delete
await identityUserControllerApi.deleteUser({ id: "uuid" });
```

---

### Audit Log — Paginated

```typescript
import { identityAuditLogControllerApi } from "@/api";

// All logs (paginated)
const { data } = await identityAuditLogControllerApi.getAllLogs({
  page: 0,
  size: 20,
});
const page = data.data; // PageAuditLogResponse
const logs = page.content; // AuditLogResponse[]

// Logs for a specific record
const { data } = await identityAuditLogControllerApi.getLogsByRecord({
  tableName: "users",
  recordId: "user-uuid",
  page: 0,
  size: 10,
});
```

---

## Common Patterns in Views

### Error Handling Pattern
```typescript
try {
  const { data } = await identityUserControllerApi.getAllUsers();
  if (data.status === 200) {
    users.value = data.data ?? [];
  }
} catch (error) {
  console.error("Failed to load users:", error);
  // handle 401, 403, etc. globally via axios interceptors in src/lib/axios.ts
}
```

### Pagination Pattern (with reactive state)
```typescript
const page = ref(0);
const size = ref(20);
const totalPages = ref(0);
const logs = ref<AuditLogResponse[]>([]);

const fetchLogs = async () => {
  const { data } = await identityAuditLogControllerApi.getAllLogs({
    page: page.value,
    size: size.value,
  });
  logs.value = data.data?.content ?? [];
  totalPages.value = data.data?.totalPages ?? 0;
};
```

### Populating a Role Form (permissions multi-select)
```typescript
// 1. Load all permissions for the selector
const { data: permData } = await identityPermissionControllerApi.getAllPermissions();
const allPermissions = permData.data ?? []; // PermissionResponse[]

// 2. Load existing role to pre-fill form
const { data: roleData } = await identityRoleControllerApi.getRoleById({ id: roleId });
const role = roleData.data; // RoleResponse
const selectedPermissionIds = role?.permissions?.map(p => p.id!) ?? [];

// 3. Submit update
await identityRoleControllerApi.updateRole({
  id: roleId,
  roleRequest: {
    name: role?.name!,
    permissionIds: selectedPermissionIds,
  },
});
```

---

## Notes

- All IDs are `string` (UUID format).
- All datetime fields (`createdAt`, `changedAt`) are ISO 8601 strings — parse with `new Date()` or a date library.
- `page` parameter is **0-based** in all paginated endpoints.
- `UserResponse.company` and `UserResponse.role` are nested objects — no need for separate lookups when displaying user details.
- Auth endpoints (`/auth/*`) do **not** require a Bearer token. All `/v1/*` endpoints require authentication handled by the axios interceptor.