// @pages/dashboard/HomePage.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ButtonSpin } from "@components/common/ButtonSpin";
import { useToastApp } from "@hooks/use-toast-app";
import { useState } from "react";

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { success } = useToastApp();

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      success("Document generated successfully!");
    }, 300);
  };

  return (
    <>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ButtonSpin
            variant="default"
            isLoading={isLoading}
            loadingText="Generating..."
            onClick={handleGenerate}
            className="mt-4"
          >
            Generate DOC
          </ButtonSpin>
          <ButtonSpin variant="outline" onClick={() => setIsLoading(!isLoading)} className="mt-4">
            Download DOC
          </ButtonSpin>
        </TabsContent>
        <TabsContent value="password">Change your password here. Click save when you&apos;re done.</TabsContent>
      </Tabs>


    </>
  );
};

export default HomePage;