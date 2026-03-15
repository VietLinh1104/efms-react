import React, { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { journalEntriesApi } from "@/api";
import type { JournalEntryResponse } from "@/api/generated";
import { useToastApp } from "@/hooks/use-toast-app";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const JournalListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<JournalEntryResponse[]>([]);
    const { success, error, warning } = useToastApp();
    const navigate = useNavigate();

    const fetchJournals = async () => {
        setIsLoading(true);
        try {
            const companyId = '4df27c87-491d-473e-999c-ce5678436be1';
            const response = await journalEntriesApi.list5(companyId, undefined, undefined, undefined, 0, 100);
            setData(response.data.data?.content || []);
        } catch (err) {
            console.error("Error fetching journals:", err);
            error("Không thể tải danh sách chứng từ.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleView = (journal: JournalEntryResponse) => {
        // For now, move to view page (which we might need to create or use the same form)
        // navigate(`/accounting/journal/${journal.id}`);
        warning("Tính năng xem chi tiết đang được phát triển.");
    };

    const handleDelete = async (journal: JournalEntryResponse) => {
        if (!journal.id) return;
        if (!confirm("Bạn có chắc chắn muốn xoá chứng từ này?")) return;

        try {
            await journalEntriesApi.delete2(journal.id);
            success("Đã xoá chứng từ thành công.");
            fetchJournals();
        } catch (err) {
            error("Lỗi khi xoá chứng từ.");
        }
    };

    const handlePost = async (journal: JournalEntryResponse) => {
        if (!journal.id) return;
        try {
            await journalEntriesApi.post(journal.id);
            success("Đã ghi sổ chứng từ thành công.");
            fetchJournals();
        } catch (err) {
            error("Lỗi khi ghi sổ.");
        }
    };

    const columns = useMemo(() => getColumns(handleView, handleDelete, handlePost), []);

    useEffect(() => {
        fetchJournals();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Journal Entries</h2>
                    <p className="text-muted-foreground">
                        Danh sách các bút toán kế toán tổng hợp.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchJournals}
                        disabled={isLoading}
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => navigate("/accounting/journal/new")}>
                        <Plus className="mr-2 h-4 w-4" /> Tạo chứng từ
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 py-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm chứng từ..." className="pl-8" />
                </div>
            </div>

            <DataTable columns={columns} data={data} isLoading={isLoading} />
        </div>
    );
};

export default JournalListing;
