import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ButtonSpin } from "@/components/common/ButtonSpin";
import { InputSpin } from "@/components/common/InputSpin";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { identityAuthControllerApi } from "@/api/index";
import { useToastApp } from "@/hooks/use-toast-app";
import { getApiErrorMessage } from "@/lib/api-error";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(255),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  companyName: z.string().min(1, "Company name is required").max(255),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToastApp();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      otp: "",
      companyName: "",
    },
  });

  const handleSendOtp = async () => {
    const email = form.getValues("email");
    const result = z.string().email().safeParse(email);
    if (!result.success) {
      form.setError("email", { type: "manual", message: "Vui lòng nhập email hợp lệ" });
      return;
    }

    setIsSendingOtp(true);
    setErrorMsg(null);
    try {
      const response = await identityAuthControllerApi.sendRegistrationCode({
        email: email
      });
      console.log("send mail response:", response);

      success("Mã xác thực đã được gửi tới email của bạn!");
    } catch (error: unknown) {
      const msg = getApiErrorMessage(error, "Lỗi gửi mã xác thực");
      setErrorMsg(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setErrorMsg(null);
    try {
      await identityAuthControllerApi.registerUser({
        registerRequest: {
          name: values.name,
          email: values.email,
          password: values.password,
          otp: values.otp,
          companyName: values.companyName,
        },
      });

      navigate("/login");
    } catch (error: unknown) {
      setErrorMsg(getApiErrorMessage(error, "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-2xl font-semibold">Đăng ký công ty</h1>
      <p className="text-sm text-muted-foreground">Tạo tài khoản và công ty mới để sử dụng EFMS</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[400px] flex flex-col gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex gap-2">
                    <InputSpin placeholder="Email" {...field} className="flex-1" />
                    <ButtonSpin
                      type="button"
                      variant="outline"
                      onClick={handleSendOtp}
                      isLoading={isSendingOtp}
                      disabled={isSendingOtp || !form.watch("email")}
                    >
                      Gửi mã
                    </ButtonSpin>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputSpin placeholder="Họ và Tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputSpin placeholder="Mã xác thực (OTP)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputSpin type="password" placeholder="Mật khẩu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputSpin placeholder="Tên công ty" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMsg && (
            <p className="text-sm text-destructive text-center">{errorMsg}</p>
          )}

          <ButtonSpin
            variant="default"
            type="submit"
            isLoading={form.formState.isSubmitting}
            loadingText="Đang đăng ký..."
            className="w-full mt-2"
          >
            Đăng ký
          </ButtonSpin>
        </form>
      </Form>

      <p className="text-sm text-muted-foreground mt-2">
        Đã có tài khoản? <span onClick={() => navigate("/login")} className="text-primary cursor-pointer hover:underline">Đăng nhập</span>
      </p>
    </div>
  );
};

export default RegisterPage;
