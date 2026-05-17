import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ButtonSpin } from "@/components/common/ButtonSpin";
import { InputSpin } from "@/components/common/InputSpin";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { identityAuthControllerApi } from "@/api";
import type { ActivateUserRequest } from "@/api/generated/identity/api";

const ActivatePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const navigate = useNavigate();
    const { success, error } = useToastApp();

    const [values, setValues] = useState<ActivateUserRequest>({
        token: token || "",
        name: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-4 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-destructive">Link không hợp lệ</h1>
                <p className="text-sm text-muted-foreground max-w-[320px]">
                    Link kích hoạt của bạn bị thiếu hoặc sai mã xác thực. Vui lòng kiểm tra lại email.
                </p>
                <ButtonSpin onClick={() => navigate("/login")} variant="default" className="w-full max-w-[320px]">
                    Quay về đăng nhập
                </ButtonSpin>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await identityAuthControllerApi.activateUser({ activateUserRequest: values });
            const resData = res.data as any;
            if (resData.status === 200 || res.status === 200) {
                success("Kích hoạt tài khoản thành công! Bạn có thể đăng nhập ngay.");
                navigate("/login");
            } else {
                error("Kích hoạt thất bại. Token có thể đã hết hạn.");
            }
        } catch (err: any) {
            console.error(err);
            error(err.response?.data?.message || "Đã xảy ra lỗi khi kích hoạt tài khoản.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <h1 className="text-2xl font-semibold">Kích hoạt tài khoản</h1>
            <p className="text-sm text-muted-foreground text-center max-w-[320px]">
                Nhập họ tên và mật khẩu để hoàn tất việc kích hoạt tài khoản của bạn.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-[320px] flex flex-col gap-2">
                <InputSpin
                    id="email"
                    placeholder="Địa chỉ email"
                    value={email || ""}
                    readOnly
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    disabled={isLoading}
                />

                <InputSpin
                    id="name"
                    placeholder="Họ và tên"
                    required
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    disabled={isLoading}
                />

                <InputSpin
                    id="password"
                    type="password"
                    placeholder="Mật khẩu mới"
                    required
                    value={values.password}
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    disabled={isLoading}
                />

                <ButtonSpin
                    variant="default"
                    className="w-full mt-2"
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Đang kích hoạt..."
                    disabled={isLoading || !values.name || !values.password}
                >
                    Hoàn tất kích hoạt
                </ButtonSpin>
            </form>
        </div>
    );
};

export default ActivatePage;
