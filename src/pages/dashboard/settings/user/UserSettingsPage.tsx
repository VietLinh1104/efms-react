import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Save } from "lucide-react";
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
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";
import { ButtonSpin } from "@components/common/ButtonSpin.tsx";
import { identityUserControllerApi } from "@/api";
import type { UserResponse, UserUpdateRequest } from "@/api/generated/identity/api";
import { isForbidden } from "@/lib/utils";
import { formatApiErrorForUser } from "@/lib/api-error";

const userSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserSettingsPage: React.FC = () => {
    const { success, error } = useToastApp();
    const { user: authUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const fetchUserDetail = useCallback(async () => {
        if (!authUser?.id) return;
        setIsLoading(true);
        try {
            const res = await identityUserControllerApi.getUserById({ id: authUser.id });
            const data = res.data.data as UserResponse;
            if (data) {
                form.reset({
                    name: data.name || "",
                    email: data.email || "",
                });
            }
        } catch (err) {
            if (isForbidden(err)) return;
            error(formatApiErrorForUser(err, "Không thể tải thông tin người dùng."));
        } finally {
            setIsLoading(false);
        }
    }, [authUser?.id, error, form]);

    useEffect(() => {
        fetchUserDetail();
    }, [fetchUserDetail]);

    const onSubmit: SubmitHandler<UserFormValues> = async (values) => {
        if (!authUser?.id) return;
        setIsSubmitting(true);
        try {
            const requestPayload: UserUpdateRequest = {
                name: values.name,
                email: values.email,
                isActive: true, // Keep it active
            };

            const res = await identityUserControllerApi.updateUser({
                id: authUser.id,
                userUpdateRequest: requestPayload
            });

            if (res.data?.status === 200) {
                success("Cập nhật thông tin thành công");
            } else {
                error("Đã xảy ra lỗi khi cập nhật");
            }
        } catch (e) {
            if (isForbidden(e)) return;
            error(formatApiErrorForUser(e, "Cập nhật thất bại"));
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
                <User className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Cài đặt cá nhân</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin tài khoản</CardTitle>
                            <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input className="pl-10" placeholder="Nguyễn Văn A" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                disabled
                                render={({ field }) => (

                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input className="pl-10" placeholder="user@example.com" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-end border-t p-6 pb-0 ">
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

export default UserSettingsPage;
