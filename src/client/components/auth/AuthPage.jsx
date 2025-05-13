import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export function AuthPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-[400px] card">
        <CardHeader>
          <CardTitle className="text-start text-2xl">Welcome</CardTitle>
          <CardDescription className="text-start">
            Create or sing-in to an existing account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background p-0">
              <TabsTrigger value="signin" className="cursor-pointer">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="cursor-pointer">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
