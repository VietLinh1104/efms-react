import { ButtonSpin } from "@/components/common/ButtonSpin";
import { InputSpin } from "@/components/common/InputSpin";
import { Separator } from "@/components/ui/separator";
import googleLogo from "@/assets/image/google-logo.png";


const AuthPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        <InputSpin
          placeholder="Username"
        >
        </InputSpin>
        <InputSpin
          placeholder="Password"
        >
        </InputSpin>
        <ButtonSpin
          variant="default"
          loadingText="Logging in..."
          className="w-full max-w-[320px] mt-2"
        // isLoading={true}
        >
          Sign in with Username
        </ButtonSpin>

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
        // isLoading={true}
        >
          <img src={googleLogo} alt="Google" className="w-4 h-4" />
          Sign in with Google
        </ButtonSpin>

        <p className="text-sm text-muted-foreground">Don't have an account? <a href="#" className="text-primary">Sign up</a></p>
      </div>
    </>
  );
};

export default AuthPage;