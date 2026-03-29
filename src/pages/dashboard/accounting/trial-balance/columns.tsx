import type { ColumnDef } from "@tanstack/react-table"
import type { TrialBalanceLineResponse } from "@/api/generated/core"
import { formatCurrency } from "@/lib/utils"
import { Checkbox } from "@components/ui/checkbox.tsx";


export const getColumns = (): ColumnDef<TrialBalanceLineResponse>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "accountName",
        header: "Tên tài khoản",
        cell: ({ row }) => <div className="max-w-[250px] truncate">{row.getValue("accountName")}</div>,
    },
    {
        accessorKey: "openingDebit",
        header: () => <div className="text-right">Dư đầu Nợ</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("openingDebit") as string) || 0;
            return <div className="text-right">{amount === 0 ? "—" : formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: "openingCredit",
        header: () => <div className="text-right">Dư đầu Có</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("openingCredit") as string) || 0;
            return <div className="text-right">{amount === 0 ? "—" : formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: "periodDebit",
        header: () => <div className="text-right">PS Nợ</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("periodDebit") as string) || 0;
            return <div className="text-right">{amount === 0 ? "—" : formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: "periodCredit",
        header: () => <div className="text-right">PS Có</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("periodCredit") as string) || 0;
            return <div className="text-right">{amount === 0 ? "—" : formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: "closingDebit",
        header: () => <div className="text-right">Dư cuối Nợ</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("closingDebit") as string) || 0;
            return <div className="text-right font-bold">{amount === 0 ? "—" : formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: "closingCredit",
        header: () => <div className="text-right">Dư cuối Có</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("closingCredit") as string) || 0;
            return <div className="text-right font-bold">{amount === 0 ? "—" : formatCurrency(amount)}</div>;
        },
    },
];
