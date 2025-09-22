import DotLoading from "@/components/DotLoading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const forgotPasswordSchema = z.object({
  email: z.email().min(1, {
    message: "L'adresse email est requis.",
  }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    const baseUrl = import.meta.env.VITE_URL_API;
    try {
      const data = JSON.stringify({
        email: values.email,
      });
      const request = await fetch(baseUrl + "/request-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      const response = await request.json();
      if (request.status == 200) {
        setSuccessMessage(response.message);
      } else {
        setErrorMessage(response.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center mb-[10%] px-4">
      <Card className="w-full sm:w-80 md:w-[440px]">
        <CardHeader className="text-center gap-4">
          <h2
            className="text-primary text-3xl font-semibold"
            style={{ fontFamily: "IBM Plex Mono" }}
          >
            Acadyo.
          </h2>
          <CardTitle>Réinitialiser de votre mot de passe</CardTitle>
          <CardDescription>
            Saisissez l'adresse email du compte concerné et nous vous enverrons
            un lien pour modifié votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email du compte:</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Saisissez votre email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}

              {successMessage && (
                <p className="text-sm text-green-700">{successMessage}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? "Envoi en cours" : "Envoyer"}{" "}
                {isLoading && <DotLoading />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
