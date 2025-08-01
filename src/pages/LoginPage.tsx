import { LoginForm } from "@/components/login-form";
import Section from "@/components/Section";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center">
      <Section className="md:max-w-lg mb-10">
        <Card className="w-[440px]">
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </Section>
    </main>
  );
}
