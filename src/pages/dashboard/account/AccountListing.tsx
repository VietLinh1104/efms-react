import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import React from "react";
import type { AccountResponse } from "@/api/generated"
import { accountsApi } from "@/api";
import { AccountDialog } from "./AccountDialog";
import { Plus, RefreshCcw } from "lucide-react";

const AccountListing: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState<AccountResponse[]>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedAccount, setSelectedAccount] = React.useState<AccountResponse | null>(null);

    const handleGetAllAccounts = async () => {
        setIsLoading(true);
        try {
            const response = await accountsApi.listPage('b7430d8f-9698-42af-8160-45dc83d1fdd8', 0, 100);
            setData(response.data.data?.content || []);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (account: AccountResponse) => {
        setSelectedAccount(account);
        setIsDialogOpen(true);
    };

    const handleToggleActive = async (account: AccountResponse) => {
        if (!account.id) return;
        try {
            await accountsApi.toggleActive3(account.id);
            handleGetAllAccounts();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const columns = React.useMemo(() => getColumns(handleEdit, handleToggleActive), []);

    React.useEffect(() => {
        handleGetAllAccounts();
    }, []);

    return (
        <div className="space-y-2">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Account</h2>
                <p className="text-muted-foreground">
                    Quản lý danh mục tài khoản kế toán doanh nghiệp.
                </p>
            </div>
               
            <Tabs defaultValue="list" className="gap-0">
                 <div className="flex justify-between mb-5">
                    <TabsList>
                        <TabsTrigger value="list">Danh sách</TabsTrigger>
                        <TabsTrigger value="tree">Cây tài khoản</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleGetAllAccounts}
                            disabled={isLoading}
                        >
                            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button onClick={() => {
                            setSelectedAccount(null);
                            setIsDialogOpen(true);
                        }}>
                            <Plus className="mr-2 h-4 w-4" /> Thêm tài khoản
                        </Button>
                    </div>
            
                </div>
                <TabsContent value="list" className="">
                    <DataTable columns={columns} data={data} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="tree" className="">
                    <div className="p-8 text-center border rounded-lg bg-muted/20">
                        Tính năng xem dạng cây đang được cập nhật...
                    </div>
                </TabsContent>
            </Tabs>

            <AccountDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedAccount}
                onSuccess={handleGetAllAccounts}
            />
        </div>
    );
};

export default AccountListing;