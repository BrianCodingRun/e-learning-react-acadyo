import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export default function ClassroomForm({
  className,
  ...props
}: {
  props?: React.ComponentProps<"div">;
  className?: string;
}) {
  const formSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: "Le titre doit avoir minimum deux caractère.",
      })
      .max(50, {
        message: "Le titre ne doit pas dépasser cinquante caratère.",
      }),
    description: z.string().optional(),
  });

  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (!token) return;
    const baseUrl = import.meta.env.VITE_URL_API;
    toast("🔄 Création en cours...", {
      description: (
        <div className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Le classroom est cours de création !
        </div>
      ),
    });
    try {
      const request = await fetch(baseUrl + "/classroom", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const response = await request.json();
      if (request.status == 201) {
        toast("✅ Classroom créé 🎉", {
          description: "Le classroom a été créé avec succès !",
        });
        console.log(response.message);
        navigate(`/dashboard/classroom/${response.classroom.id}`);
      } else if (request.status == 401) {
        toast.warning("❌ Une erreur est survenue", {
          className: "error",
          description:
            "Une erreur inconnue est survenue, réessayer plus tard !",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">
                Création d'un nouveau classroom.
              </h1>
              <p className="text-sm text-muted-foreground">
                Veuillez rensignez tous les champs qui comporte un asterix (*).
              </p>
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre*</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Classroom 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="self-start cursor-pointer w-32 text-neutral-800"
            >
              {isLoading ? (
                <LoaderCircle className="ml-2 h-4 w-4 animate-spin duration-500" />
              ) : (
                "Créer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
