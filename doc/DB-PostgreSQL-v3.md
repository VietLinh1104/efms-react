> 📋 **DB PostgreSQL v3** — Cập nhật theo hệ thống EFMS rút gọn 6 module: gộp AR/AP thành Invoices, gộp Customers/Vendors thành Partners, bỏ Fixed Assets & Budget & Integration Logs, thêm Bank Accounts & Bank Transactions.
> 

[DB DDL V3](https://www.notion.so/DB-DDL-V3-325488a3e0838000a8d2ee82a6e3214f?pvs=21)

---

# Danh sách bảng (14 bảng)

| # | Bảng | Mô tả |
| --- | --- | --- |
| 1 | companies | Công ty (multi-company) |
| 2 | users | Người dùng & phân quyền |
| 3 | fiscal_periods | Kỳ kế toán |
| 4 | accounts | Danh mục tài khoản kế toán |
| 5 | partners | Khách hàng & nhà cung cấp (gộp) |
| 6 | journal_entries | Chứng từ kế toán |
| 7 | journal_lines | Dòng bút toán |
| 8 | invoices | Hóa đơn AR + AP Bill (gộp) |
| 9 | invoice_lines | Chi tiết hóa đơn |
| 10 | payments | Thanh toán thu/chi |
| 11 | invoice_payments | Liên kết invoice ↔ payment |
| 12 | bank_accounts | Tài khoản ngân hàng / tiền mặt |
| 13 | bank_transactions | Giao dịch ngân hàng |
| 14 | audit_logs | Nhật ký thay đổi |

---

# 0. Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

# 1. Companies — Công ty

```sql
CREATE TABLE companies (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(255) NOT NULL,
    tax_code     VARCHAR(50),
    address      TEXT,
    currency     VARCHAR(3) NOT NULL DEFAULT 'VND',
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT now()
);
```

---

# 2. Users — Người dùng & Phân quyền

```sql
CREATE TABLE users (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id   UUID NOT NULL REFERENCES companies(id),
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    role         VARCHAR(50) NOT NULL,  -- admin / finance_manager / accountant / auditor
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT now()
);
```

---

# 3. Fiscal Periods — Kỳ kế toán

```sql
CREATE TABLE fiscal_periods (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id   UUID NOT NULL REFERENCES companies(id),
    name         VARCHAR(50) NOT NULL,
    start_date   DATE NOT NULL,
    end_date     DATE NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'open',  -- open / closed
    closed_by    UUID REFERENCES users(id),
    closed_at    TIMESTAMP,
    created_at   TIMESTAMP DEFAULT now()
);
```

---

# 4. Accounts — Danh mục tài khoản kế toán

```sql
CREATE TABLE accounts (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id   UUID NOT NULL REFERENCES companies(id),
    code         VARCHAR(20) NOT NULL,
    name         VARCHAR(255) NOT NULL,
    type         VARCHAR(50) NOT NULL,   -- asset / liability / equity / revenue / expense
    balance_type VARCHAR(10) NOT NULL,   -- debit / credit
    parent_id    UUID REFERENCES accounts(id),
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT now(),
    UNIQUE(company_id, code)
);
```

---

# 5. Partners — Khách hàng & Nhà cung cấp (gộp)

```sql
CREATE TABLE partners (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id    UUID NOT NULL REFERENCES companies(id),
    name          VARCHAR(255) NOT NULL,
    type          VARCHAR(20) NOT NULL,   -- customer / vendor / both
    tax_code      VARCHAR(50),
    phone         VARCHAR(50),
    email         VARCHAR(255),
    address       TEXT,
    ar_account_id UUID REFERENCES accounts(id),  -- TK phải thu mặc định
    ap_account_id UUID REFERENCES accounts(id),  -- TK phải trả mặc định
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT now()
);
```

---

# 6. Journal Entries — Chứng từ kế toán

```sql
CREATE TABLE journal_entries (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id    UUID NOT NULL REFERENCES companies(id),
    period_id     UUID REFERENCES fiscal_periods(id),
    entry_date    DATE NOT NULL,
    reference     VARCHAR(255),
    description   TEXT,
    status        VARCHAR(20) NOT NULL DEFAULT 'draft',  -- draft / posted / cancelled
    source        VARCHAR(50),   -- manual / ar / ap / payment / bank
    source_ref_id UUID,
    created_by    UUID REFERENCES users(id),
    posted_by     UUID REFERENCES users(id),
    posted_at     TIMESTAMP,
    created_at    TIMESTAMP DEFAULT now()
);
```

---

# 7. Journal Lines — Dòng bút toán

```sql
CREATE TABLE journal_lines (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id       UUID NOT NULL REFERENCES accounts(id),
    partner_id       UUID REFERENCES partners(id),
    debit            NUMERIC(18,2) NOT NULL DEFAULT 0,
    credit           NUMERIC(18,2) NOT NULL DEFAULT 0,
    currency_code    VARCHAR(3) NOT NULL DEFAULT 'VND',
    amount_currency  NUMERIC(18,2),
    exchange_rate    NUMERIC(18,6) DEFAULT 1,
    description      TEXT,
    created_at       TIMESTAMP DEFAULT now(),
    CONSTRAINT chk_debit_positive  CHECK (debit >= 0),
    CONSTRAINT chk_credit_positive CHECK (credit >= 0),
    CONSTRAINT chk_not_both        CHECK (NOT (debit > 0 AND credit > 0))
);
```

---

# 8. Invoices — Hóa đơn AR + AP (gộp)

> `invoice_type = 'ar'` → Hóa đơn bán (phải thu)
> 

> `invoice_type = 'ap'` → Chứng từ mua / Bill (phải trả)
> 

```sql
CREATE TABLE invoices (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id       UUID NOT NULL REFERENCES companies(id),
    partner_id       UUID NOT NULL REFERENCES partners(id),
    invoice_type     VARCHAR(5) NOT NULL,   -- ar / ap
    invoice_number   VARCHAR(100),
    invoice_date     DATE NOT NULL,
    due_date         DATE,
    currency_code    VARCHAR(3) NOT NULL DEFAULT 'VND',
    exchange_rate    NUMERIC(18,6) DEFAULT 1,
    subtotal         NUMERIC(18,2) NOT NULL DEFAULT 0,
    tax_amount       NUMERIC(18,2) NOT NULL DEFAULT 0,
    total_amount     NUMERIC(18,2) NOT NULL DEFAULT 0,
    paid_amount      NUMERIC(18,2) NOT NULL DEFAULT 0,
    status           VARCHAR(20) NOT NULL DEFAULT 'draft',  -- draft / open / partial / paid / cancelled
    journal_entry_id UUID REFERENCES journal_entries(id),
    created_by       UUID REFERENCES users(id),
    created_at       TIMESTAMP DEFAULT now()
);
```

---

# 9. Invoice Lines — Chi tiết hóa đơn

```sql
CREATE TABLE invoice_lines (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id   UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    account_id   UUID REFERENCES accounts(id),
    description  TEXT NOT NULL,
    quantity     NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price   NUMERIC(18,2) NOT NULL DEFAULT 0,
    tax_rate     NUMERIC(5,2) NOT NULL DEFAULT 0,
    tax_amount   NUMERIC(18,2) NOT NULL DEFAULT 0,
    amount       NUMERIC(18,2) NOT NULL DEFAULT 0
);
```

---

# 10. Payments — Thanh toán thu / chi

```sql
CREATE TABLE payments (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id       UUID NOT NULL REFERENCES companies(id),
    partner_id       UUID REFERENCES partners(id),
    payment_type     VARCHAR(10) NOT NULL,   -- receive / pay
    payment_date     DATE NOT NULL,
    currency_code    VARCHAR(3) NOT NULL DEFAULT 'VND',
    exchange_rate    NUMERIC(18,6) DEFAULT 1,
    amount           NUMERIC(18,2) NOT NULL,
    payment_method   VARCHAR(50),   -- cash / bank_transfer / check
    bank_account_id  UUID REFERENCES bank_accounts(id),
    reference        VARCHAR(255),
    journal_entry_id UUID REFERENCES journal_entries(id),
    created_by       UUID REFERENCES users(id),
    created_at       TIMESTAMP DEFAULT now()
);
```

---

# 11. Invoice Payments — Liên kết Invoice ↔ Payment

```sql
CREATE TABLE invoice_payments (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id       UUID NOT NULL REFERENCES invoices(id),
    payment_id       UUID NOT NULL REFERENCES payments(id),
    allocated_amount NUMERIC(18,2) NOT NULL,
    created_at       TIMESTAMP DEFAULT now(),
    UNIQUE(invoice_id, payment_id)
);
```

---

# 12. Bank Accounts — Tài khoản ngân hàng / tiền mặt

```sql
CREATE TABLE bank_accounts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id),
    name            VARCHAR(255) NOT NULL,
    bank_name       VARCHAR(255),
    account_number  VARCHAR(100),
    type            VARCHAR(20) NOT NULL,   -- cash / bank
    currency_code   VARCHAR(3) NOT NULL DEFAULT 'VND',
    opening_balance NUMERIC(18,2) DEFAULT 0,
    gl_account_id   UUID REFERENCES accounts(id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT now()
);
```

---

# 13. Bank Transactions — Giao dịch ngân hàng

```sql
CREATE TABLE bank_transactions (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_account_id  UUID NOT NULL REFERENCES bank_accounts(id),
    transaction_date DATE NOT NULL,
    description      TEXT,
    type             VARCHAR(10) NOT NULL,   -- in / out
    amount           NUMERIC(18,2) NOT NULL,
    reference        VARCHAR(255),
    is_reconciled    BOOLEAN NOT NULL DEFAULT FALSE,
    journal_entry_id UUID REFERENCES journal_entries(id),
    created_at       TIMESTAMP DEFAULT now()
);
```

---

# 14. Audit Logs — Nhật ký thay đổi

```sql
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name  VARCHAR(100) NOT NULL,
    record_id   UUID NOT NULL,
    action      VARCHAR(20) NOT NULL,   -- INSERT / UPDATE / DELETE
    changed_by  UUID REFERENCES users(id),
    changed_at  TIMESTAMP DEFAULT now(),
    old_data    JSONB,
    new_data    JSONB
);
```

---

# ERD — Sơ đồ quan hệ

```
companies
  │
  ├── users
  ├── fiscal_periods
  ├── accounts (self-ref parent_id)
  ├── partners ──→ accounts (ar/ap_account)
  │
  ├── journal_entries ──→ fiscal_periods
  │        └── journal_lines ──→ accounts, partners
  │
  ├── invoices ──→ partners, journal_entries
  │        ├── invoice_lines ──→ accounts
  │        └── invoice_payments ──→ payments
  │
  ├── payments ──→ partners, bank_accounts, journal_entries
  │
  └── bank_accounts ──→ accounts
           └── bank_transactions ──→ journal_entries

audit_logs (theo dõi tất cả bảng)
```

---

# Indexes

```sql
CREATE INDEX idx_accounts_company             ON accounts(company_id);
CREATE INDEX idx_partners_company             ON partners(company_id);
CREATE INDEX idx_journal_entries_company      ON journal_entries(company_id);
CREATE INDEX idx_journal_entries_period       ON journal_entries(period_id);
CREATE INDEX idx_journal_entries_date         ON journal_entries(entry_date);
CREATE INDEX idx_invoices_company             ON invoices(company_id);
CREATE INDEX idx_invoices_partner             ON invoices(partner_id);
CREATE INDEX idx_invoices_type_status         ON invoices(invoice_type, status);
CREATE INDEX idx_invoices_due_date            ON invoices(due_date);
CREATE INDEX idx_payments_company             ON payments(company_id);
CREATE INDEX idx_bank_transactions_account    ON bank_transactions(bank_account_id);
CREATE INDEX idx_bank_transactions_reconciled ON bank_transactions(is_reconciled);
CREATE INDEX idx_audit_logs_record            ON audit_logs(table_name, record_id);
```

---

# Thay đổi so với v2

| Thay đổi | Chi tiết |
| --- | --- |
| ✅ Bỏ `fixed_assets` | Module Fixed Assets không có trong MVP |
| ✅ Bỏ `budgets`, `budget_lines` | Module Budget không có trong MVP |
| ✅ Bỏ `integration_logs` | Tích hợp ERP để phase sau |
| ✅ Gộp AR/AP vào `invoices` | `invoice_type = ar / ap` |
| ✅ Gộp Customers/Vendors vào `partners` | `type = customer / vendor / both` |
| ✅ Thêm `ar_account_id`, `ap_account_id` vào `partners` | Auto mapping TK khi tạo bút toán |
| ✅ Thêm `bank_accounts`  • `bank_transactions` | Module Cash & Bank |
| ✅ Thêm `bank_account_id` vào `payments` | Liên kết thanh toán với TK ngân hàng |