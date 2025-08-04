import { LoginForm } from "@/components/login-form";
import Section from "@/components/Section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <main>
      <Section className="md:max-w-lg min-h-screen flex items-center">
        <Card className="w-[440px]">
          <CardHeader className="flex items-center justify-start">
            <ArrowLeft className="w-3 text-muted-foreground" />
            <a
              href="/"
              className="font-sans text-xs text-muted-foreground hover:underline underline-offset-1"
            >
              Retour vers l'accueil
            </a>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </Section>
    </main>
  );
}
