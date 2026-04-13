import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { ButtonSpin } from "@/components/common/ButtonSpin";
import { InputSpin } from "@/components/common/InputSpin";
import { Separator } from "@/components/ui/separator";
import { identityAuthControllerApi } from "@/api/index";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import googleLogo from "@/assets/image/google-logo.png";
import { useAuthContext } from "@/context/AuthContext";
import type { UserResponse } from "@/api/generated/identity/api";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthData } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Where to go after login — falls back to "/"
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setErrorMsg(null);
    try {
      const response = await identityAuthControllerApi.authenticateUser({
        loginRequest: {
          email: values.email,
          password: values.password,
        },
      });

      // DEBUG: log full response to inspect actual backend structure
      console.log("[AuthPage] raw response:", response);
      console.log("[AuthPage] response.data:", response.data);

      // Data trả về đang ở dạng mảng/object phẳng thay cho key `user` lồng nhau.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (response.data as any)?.data ?? response.data;
      
      if (!data?.token) {
        setErrorMsg("Login failed: No token received from server.");
        return;
      }

      // Map lại structure phẳng sang nested UserResponse
      const mappedUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        company: data.companyId ? { id: data.companyId } : undefined,
      };

      // Persist auth data in context + localStorage
      setAuthData({
        token: data.token,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: mappedUser as any,
      });

      // Navigate to the originally intended route
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        axiosError?.response?.data?.message ??
        axiosError?.message ??
        "Login failed. Please check your credentials."
      );
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[320px] flex flex-col gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputSpin
                    placeholder="Email"
                    {...field}
                  />
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
                  <InputSpin
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
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
            loadingText="Logging in..."
            className="w-full mt-2"
          >
            Sign in with Email
          </ButtonSpin>
        </form>
      </Form>

      <div className="relative w-full max-w-[320px] mt-2">
        <Separator orientation="horizontal" className="w-full" />

        <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-2 text-sm text-muted-foreground">
          or
        </span>
      </div>

      <ButtonSpin
        variant="default"
        loadingText="Logging in with Google..."
        className="w-full max-w-[320px] mt-2"
      >
        <img src={googleLogo} alt="Google" className="w-4 h-4" />
        Sign in with Google
      </ButtonSpin>

      <p className="text-sm text-muted-foreground">Don't have an account? <a href="#" className="text-primary">Sign up</a></p>
    </div>
  );
};

export default AuthPage;