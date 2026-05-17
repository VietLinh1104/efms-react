import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ButtonSpin } from "@/components/common/ButtonSpin";
import { InputSpin } from "@/components/common/InputSpin";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { identityAuthControllerApi } from "@/api/index";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import googleLogo from "@/assets/image/google-logo.png";
import { useAuthContext } from "@/context/AuthContext";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { auth, setAuthData, isAuthenticated } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // MCP / OAuth Parameters
  const redirectUri = searchParams.get("oauth_redirect_uri") || searchParams.get("redirect_uri");
  const clientId = searchParams.get("oauth_client_id") || searchParams.get("client_id");
  const oauthState = searchParams.get("oauth_state") || searchParams.get("state");

  const isOAuthFlow = !!(redirectUri || clientId);

  // Lưu token tạm thời khi vừa login xong (trước khi AuthContext kịp update)
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [pendingCompanyId, setPendingCompanyId] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Hiện màn confirm nếu:
  //   1. Người dùng đã đăng nhập sẵn và có OAuth params (tnh trực tiếp, không qua useEffect)
  //   2. Hoặc người dùng vừa login xong + có OAuth params (setPendingToken)
  const showMcpConfirmation =
    (isOAuthFlow && isAuthenticated && !!auth?.token) || !!pendingToken;

  console.log("[AuthPage]", { isAuthenticated, isOAuthFlow, pendingToken: !!pendingToken, showMcpConfirmation });

  const handleConfirmMcp = () => {
    // Dùng token từ pendingToken (vừa login) hoặc token đã có trong context
    const token = pendingToken || auth?.token;
    const companyId = pendingCompanyId || auth?.user.company?.id || "";

    if (!token || !redirectUri) return;

    // Kiểm tra nếu là Remote OAuth Flow (Claude/Anthropic)
    const isRemoteOAuth = !!clientId || redirectUri.includes("anthropic.com") || redirectUri.includes("claude.ai");

    if (isRemoteOAuth) {
      // Remote Flow: Phải quay lại Identity Service để lấy code
      const identityApiUrl = import.meta.env.VITE_PUBLIC_API_URL_IDENTITY || "http://localhost:8080/api/identity";
      const callbackUrl = new URL(`${identityApiUrl}/oauth/callback`);
      callbackUrl.searchParams.set("token", token);
      callbackUrl.searchParams.set("client_id", clientId || "claude-connector");
      callbackUrl.searchParams.set("redirect_uri", redirectUri);
      if (oauthState) callbackUrl.searchParams.set("state", oauthState);
      window.location.href = callbackUrl.toString();
    } else {
      // Local Flow: Redirect trực tiếp về local MCP server (stdio)
      const url = new URL(redirectUri);
      url.searchParams.set("token", token);
      url.searchParams.set("company_id", companyId);
      url.searchParams.set("expires_in", "3600");
      window.location.href = url.toString();
    }
  };

  const handleCancelMcp = () => {
    navigate("/");
  };

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
        company: data.companyId ? { id: data.companyId } : data.company,
        role: (data.roles && data.roles.length > 0) ? { name: data.roles[0] } : undefined,
      };

      // Persist auth data in context + localStorage
      setAuthData({
        token: data.token,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: mappedUser as any,
      });

      // Handle MCP/OAuth: luôn hiện màn confirm trước khi callback
      if (isOAuthFlow) {
        // Set pending state → showMcpConfirmation (computed) sẽ tự động thành true
        setPendingToken(data.token);
        setPendingCompanyId(data.companyId || "");
        setPendingEmail(data.email || "");
      } else {
        // Navigate to the originally intended route
        navigate(from, { replace: true });
      }
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

  // Lấy email hiển thị: ưu tiên pendingEmail (vừa login), sau đó từ context
  const displayEmail = pendingEmail || auth?.user.email;
  const displayCompanyId = pendingCompanyId || auth?.user.company?.id || "your organization";

  if (showMcpConfirmation) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* ── Card ── */}
          <Card className="gap-0 overflow-hidden py-0 shadow-lg">

            {/* ── Header: App info ── */}
            <CardHeader className="px-6 pt-6 pb-5 border-b gap-4">
              {/* App icon + lock badge */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold truncate">EFMS MCP Server</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">OAuth 2.1</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight">
                    efms-mcp-server-sse-production.up.railway.app
                  </p>
                </div>
              </div>

              {/* Title */}
              <div>
                <CardTitle className="text-lg">Xác nhận cấp quyền truy cập</CardTitle>
                <CardDescription className="mt-1 text-xs leading-relaxed">
                  Ứng dụng muốn truy cập tài khoản{" "}
                  <span className="font-medium text-foreground">{displayEmail}</span>
                </CardDescription>
              </div>
            </CardHeader>

            {/* ── Content: Permissions ── */}
            <CardContent className="px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Quyền được yêu cầu
              </p>

              <div className="space-y-0 rounded-lg border border-border overflow-hidden">
                {[
                  {
                    icon: <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />,
                    title: "Đọc thông tin tài khoản",
                    desc: "Profile, email và authentication token của bạn",
                  },
                  {
                    icon: <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />,
                    title: "Truy cập dữ liệu công ty",
                    desc: (
                      <>
                        Dữ liệu tài chính của{" "}
                        <span className="font-medium text-foreground">{displayCompanyId}</span>
                      </>
                    ),
                  },
                  {
                    icon: <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />,
                    title: "Thực thi hành động qua AI",
                    desc: "Tự động hóa thao tác thông qua MCP tools",
                  },
                ].map((item, i, arr) => (
                  <div key={i}>
                    <div className="flex items-start gap-3 px-4 py-3 bg-muted/20">
                      {item.icon}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground/60 text-center mt-4 leading-relaxed">
                Bằng cách xác nhận, bạn cho phép ứng dụng trên truy cập tài khoản theo các quyền đã liệt kê.
              </p>
            </CardContent>

            {/* ── Footer: Actions ── */}
            <CardFooter className="px-6 py-4 border-t flex-col gap-2">
              <ButtonSpin
                variant="default"
                onClick={handleConfirmMcp}
                className="w-full font-semibold"
              >
                <ShieldCheck className="w-4 h-4" />
                Xác nhận & Tiếp tục
              </ButtonSpin>
              <ButtonSpin
                variant="outline"
                onClick={handleCancelMcp}
                className="w-full text-muted-foreground"
              >
                Huỷ
              </ButtonSpin>
            </CardFooter>
          </Card>

          {/* ── Trust badge ── */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
              Được bảo mật bởi EFMS Gateway
            </span>
          </div>

        </div>
      </div>
    );
  }

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

      <p className="text-sm text-muted-foreground">Don't have an account? <span onClick={() => navigate("/register")} className="text-primary cursor-pointer hover:underline">Sign up</span></p>
    </div>
  );
};

export default AuthPage;
