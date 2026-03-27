---
description: Frontend guidelines and architecture rules for the EFMS React project. Triggers on any frontend tasks like UI components, API integration, or page development.
---

# EFMS Frontend Project Guidelines

This skill defines the structural and architectural guidelines for the EFMS (Enterprise Financial Management System) React frontend application. When working on this project, ALWAYS adhere to the following rules:

## 1. UI Components & Styling

- **Shadcn UI First**: Always use Shadcn UI components for building user interfaces.
- **Minimize Custom Styles**: Strictly limit the modification of core UI styles. Use the provided utility classes if variations are absolutely necessary, but prefer to keep Shadcn styles as standard as possible.
- **Consistency in Shared Components**:
  - **Data Table**: Use the shared `DataTable` component located at `src/components/ui/data-table.tsx` for all data grid scenarios. It handles pagination, row selection, and rendering inherently.
  - **Column Definitions**: Structure column definitions following the standard pattern demonstrated in `src/pages/dashboard/invoices/invoices-details/columns.tsx`. Use `@tanstack/react-table` patterns with appropriate cell formatting (dates, currency, badges).
  - **Forms**: Build all forms using `react-hook-form` combined with `zod` for robust schema validation. 
  - **Dialogs**: Utilize the standard Shadcn UI `Dialog` component for all modal interactions.

## 2. API Integration & Services

- **Available API Services (`src/api/index.ts`)**:
  All external API service instances are initialized and exported from `src/api/index.ts`. Do not initialize Axios instances directly in your components. The available pre-configured services are:
  - `accountsApi`: Chart of Accounts and account balances (Types: `AccountResponse`, `CreateAccountRequest`).
  - `paymentsApi`: Creating and managing payments/receipts (Types: `PaymentResponse`, `CreatePaymentRequest`).
  - `invoicesApi`: Managing AR (Sales) and AP (Purchase) invoices (Types: `InvoiceResponse`, `CreateInvoiceRequest`).
  - `bankAccountsApi`: Managing bank accounts (Types: `BankAccountResponse`, `CreateBankAccountRequest`).
  - `journalEntriesApi`: Internal accounting journal entries (Types: `JournalEntryResponse`, `CreateJournalRequest`).
  - `partnersApi`: Vendor and customer management (Types: `PartnerResponse`, `CreatePartnerRequest`).
  - `fiscalPeriodsApi`: Managing financial and accounting periods (Types: `FiscalPeriodResponse`).
  - `trialBalanceApi`: Extracting reports like balance sheets or trial balances.

- **Generated Types and Models**:
  - The project utilizes an OpenAPI generator. All data models, entity types, request payloads, and response definitions are auto-generated and reside in `src/api/generated/api.ts`.
  - ALWAYS import strong typings (like `InvoiceResponse`, `AccountResponse`, `CreateInvoiceRequest`, etc.) from `src/api/generated` rather than creating redundant manual types.
  - When in doubt about endpoints, refer to `src/api/generated/api.ts` to inspect available properties, DTOs, and methods.

- **API Method Signatures (OpenAPI Generated Classes)**:
  - Typical API method execution follows standard CRUD patterns. Examples:
    - `api.createX(requestPayload)` - Creates a new entity. (e.g. `accountsApi.create7(payload)`). Use Axios options for fine-grained control if needed.
    - `api.getByIdX(id)` - Fetches a single entity by ID.
    - `api.updateX(id, requestPayload)` - Updates an entity.
    - `api.deleteX(id)` - Deletes an entity.
    - `api.getAllX(...)` or `api.listX(...)` - Fetches a list. Returns wrapped list structures like `ApiResponsePagedResponse...` or `ApiResponseList...`.
  - To extract the actual interface data from the response, typically you will resolve the promise and use `.data.data` (e.g. `const response = await invoicesApi.getById1(id); return response.data.data;`), where `response` is an AxiosResponse containing an `ApiResponseX` wrapper.

## 3. Project Directory Structure

Adhere to the following structural conventions when adding or modifying files:
- `src/api/` - Contains API client configurations (`index.ts`) and auto-generated OpenAPI types (`generated/api.ts`).
- `src/assets/` - Static files like images, icons, and global styles.
- `src/components/` - Reusable UI components.
  - `src/components/ui/` - Core Shadcn UI components. Do not add business-specific logic here.
- `src/hooks/` - Custom generic React hooks (e.g., custom toast wrappers).
- `src/lib/` - Utility functions, configurations, and core setup (e.g., Axios setup `axios.ts`, tailwind `utils.ts`).
- `src/pages/` - Page-level components, grouped by feature domains (e.g., `dashboard/invoices/`). Business logic, API calls, and state management should mostly reside here instead of generic UI components.
- `src/main.tsx` & `src/App.tsx` - App entry point, global routing, and context providers.

## 4. General Best Practices

- Ensure separation of concerns by placing business and page-level logic in `src/pages` and keeping UI elements in `src/components`.
- Always verify API models before passing data from UI components to the API services to ensure type safety.
