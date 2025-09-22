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
import { useSearchParams } from "react-router";
import z from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Un minimum de 6 caractères est requis.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!token) {
      setErrorMessage("Lien invalide ou token manquant.");
      setIsLoading(false);
      return;
    }
    const baseUrl = import.meta.env.VITE_URL_API;
    try {
      const request = await fetch(baseUrl + "/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: values.password,
        }),
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
          <CardTitle>Changement du mot de passe</CardTitle>
          <CardDescription>
            Veuillez saisir un nouveau mot de passe pour votre compte.
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe:</FormLabel>
                    <FormControl>
                      <Input type="password" onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmez le nouveau mot de passe:</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
