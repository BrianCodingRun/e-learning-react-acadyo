import { LoginForm } from "@/components/login-form";
import Section from "@/components/Section";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center">
      <Section className="md:max-w-lg mb-10">
        <Card className="w-[500px]">
          <CardContent>
            <LoginForm register={true} />
          </CardContent>
        </Card>
      </Section>
    </main>
  );
}
