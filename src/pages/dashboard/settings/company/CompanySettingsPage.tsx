import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Save, Globe, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@components/ui/card.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form.tsx";
import { Input } from "@components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select.tsx";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";
import { ButtonSpin } from "@components/common/ButtonSpin.tsx";
import { identityCompanyControllerApi } from "@/api";
import type { CompanyResponse, CompanyRequest } from "@/api/generated/identity/api";
import { isForbidden } from "@/lib/utils";

const companySchema = z.object({
    name: z.string().min(2, "Tên công ty phải có ít nhất 2 ký tự"),
    currency: z.string().min(1, "Vui lòng chọn tiền tệ"),
    taxCode: z.string().optional(),
    address: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

const CompanySettingsPage: React.FC = () => {
    const { success, error } = useToastApp();
    const { companyId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: "",
            currency: "VND",
            taxCode: "",
            address: "",
        },
    });

    const fetchCompanyDetail = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const res = await identityCompanyControllerApi.getCompanyById({ id: companyId });
            const data = res.data.data as any; // Using any to access potential new fields
            if (data) {
                form.reset({
                    name: data.name || "",
                    currency: data.currency || "VND",
                    taxCode: data.taxCode || "",
                    address: data.address || "",
                });
            }
        } catch (err) {
            if (isForbidden(err)) return;
            console.error("Fetch company detail failed:", err);
            error("Không thể tải thông tin công ty.");
        } finally {
            setIsLoading(false);
        }
    }, [companyId, error, form]);

    useEffect(() => {
        fetchCompanyDetail();
    }, [fetchCompanyDetail]);

    const onSubmit: SubmitHandler<CompanyFormValues> = async (values) => {
        if (!companyId) return;
        setIsSubmitting(true);
        try {
            const requestPayload: CompanyRequest = {
                name: values.name,
                currency: values.currency,
                taxCode: values.taxCode,
                address: values.address,
                isActive: true,
            };

            const res = await identityCompanyControllerApi.updateCompany({
                id: companyId,
                companyRequest: requestPayload
            });

            if (res.data?.status === 200) {
                success("Cập nhật thông tin công ty thành công");
            } else {
                error("Đã xảy ra lỗi khi cập nhật");
            }
        } catch (e) {
            if (isForbidden(e)) return;
            console.error(e);
            error("Cập nhật thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Cài đặt doanh nghiệp</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin doanh nghiệp</CardTitle>
                            <CardDescription>Quản lý các thông tin cơ bản của doanh nghiệp</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên doanh nghiệp</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-10" placeholder="Công ty TNHH EFMS" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="taxCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã số thuế</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-10" placeholder="0123456789" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tiền tệ mặc định</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full relative pl-10">
                                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <SelectValue placeholder="Chọn tiền tệ" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                                                    <SelectItem value="USD">USD - Đô la Mỹ</SelectItem>
                                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Địa chỉ</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-10" placeholder="Số 1, Đường ABC, Hà Nội" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t p-6 pb-0">
                            <ButtonSpin
                                variant="default"
                                isLoading={isSubmitting}
                                loadingText="Đang lưu..."
                                type="submit"
                                className="w-full sm:w-auto"
                            >
                                Lưu
                            </ButtonSpin>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
};

export default CompanySettingsPage;
