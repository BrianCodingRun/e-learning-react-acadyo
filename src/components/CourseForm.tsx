import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Classroom } from "types/classroom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

export default function CourseForm({
  classroom,
  className,
  ...props
}: {
  classroom?: Classroom;
  className?: string;
  props?: React.ComponentProps<"div">;
}) {
  const MAX_FILE_SIZE = 5000000;

  const formSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: "Le titre doit avoir minimum deux caractères.",
      })
      .max(50, {
        message: "Le titre ne doit pas dépasser cinquante caractères.",
      }),
    content: z.string().optional(),
    file: z
      .any()
      .refine((file) => file instanceof File, {
        message: "Un fichier est requis.",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "La taille maximale est de 5 Mo.",
      }),
  });

  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      file: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    toast("🔄 Création en cours...", {
      description: (
        <div className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Le support de cours est cours de création !
        </div>
      ),
    });
    try {
      const baseUrl = import.meta.env.VITE_URL_API;
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.content) {
        formData.append("content", values.content);
      }
      formData.append("file", values.file); // ⬅️ fichier brut
      formData.append("course", classroom?.["@id"] || "");
      const request = await fetch(baseUrl + "/lessons", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (request.status == 201) {
        toast("✅ Support de cours créé 🎉", {
          description: "Le support de cours a été créé avec succès !",
        });
        navigate(`/dashboard/classroom/${classroom?.id}`);
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
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">Nouveau support de cours.</h1>
              <p className="text-sm text-muted-foreground">
                Veuillez rensignez tous les champs qui comporte un asterix (*).
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre*</FormLabel>
                    <FormControl>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Mon support de cours"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu</FormLabel>
                    <FormControl>
                      <Textarea
                        id="content"
                        placeholder="Description du support de cours"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fichier</FormLabel>
                    <FormControl>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="grid gap-3">
                <Label htmlFor="title">Titre*</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Classroom 1"
                  onChange={(e) => setState({ ...state, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  placeholder="Description du support de cours"
                  onChange={(e) =>
                    setState({ ...state, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Fichier</Label>
                <Input id="description" type="file" required />
              </div> */}
            </div>
            <Button type="submit" className="self-start cursor-pointer w-32">
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
