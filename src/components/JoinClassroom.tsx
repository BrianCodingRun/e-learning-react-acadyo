import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, School2 } from "lucide-react";
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

export default function JoinClassroom() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    code: z
      .string()
      .min(6, "Le code doit avoir minimum six caractère.")
      .max(6, "Le code ne doit pas dépasser six caratère."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (!token) return;
    try {
      const request = await fetch(
        "https://localhost:8000/api/enrollment/join",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const response = await request.json();
      if (response.success) {
        toast("✅ Inscription réussie 🎉", {
          description: "Redirection vers le classroom !",
        });
        navigate(`/dashboard/classroom/${response.course.id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 h-8 px-2 py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-sm text-xs font-light cursor-pointer"
        >
          <School2 className="size-4" />
          Rejoindre un classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 "
          >
            <DialogHeader>
              <DialogTitle>Rejoindre un classroom</DialogTitle>
              <DialogDescription>
                Veuillez saisir le code de cours à 6 caractères fourni par le
                professeur.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code:</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="43ND93" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit">
                {isLoading ? (
                  <LoaderCircle className="ml-2 h-4 w-4 animate-spin duration-500" />
                ) : (
                  "Rejoindre"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
