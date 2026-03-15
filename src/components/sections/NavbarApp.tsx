import { Moon, Sun, Search } from "lucide-react";
import { Button } from "@components/ui/button";
import { useTheme } from "@hooks/use-theme";
import { Separator } from "@components/ui/separator";
import { InputSpin } from "@components/common/InputSpin";

export function NavbarApp({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="flex items-center gap-2 h-12 border-b w-full justify-end px-8">
            {children}
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleTheme}
                >
                    {theme === "dark" ? <Sun /> : <Moon />}
                </Button>
                <Separator orientation="vertical" className="h-full" />
                <InputSpin
                    isLoading={true}
                    icon={<Search />}
                    loadingText="Searching..."
                    placeholder="Search..."
                    className="h-7"
                >
                    12 results
                </InputSpin>

            </div>
        </div>
    )
}