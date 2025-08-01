import { GalleryVerticalEnd, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { AuthUser } from "types/AuthUser";

export function LoginForm({
  className,
  register,
  ...props
}: {
  props?: React.ComponentProps<"div">;
  register?: boolean;
  className?: string;
}) {
  const { setToken } = useAuthStore();
  const [state, setState] = useState<AuthUser>({
    name: "",
    email: "",
    password: "",
    roles: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    toast.info("🔄 Login in progress...", {
      description: (
        <div className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Vérification des identifiants...
        </div>
      ),
    });
    try {
      const raw = register
        ? JSON.stringify({
            email: state.email,
            password: state.password,
          })
        : JSON.stringify({
            name: state.name,
            email: state.email,
            password: state.password,
            roles: state.roles,
          });

      const requestUrl = register
        ? "https://localhost:8000/api/register"
        : "https://localhost:8000/api/login";

      const request = await fetch(requestUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: raw,
        redirect: "follow",
      });
      const response = await request.json();

      if (request.status == 200) {
        setToken(response.token);
        toast.success("✅ Connexion réussie 🎉", {
          description: "Redirection vers le tableau de bord...",
        });
        navigate("/");
      } else if (request.status == 401) {
        toast.warning("❌ Connexion échoué", {
          className: "error",
          description: "L'email où le mot de passe est incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      toast("🚨 Erreur inconnue", {
        description:
          "Une erreur soudaine est survenue, veuillez réessayez plus tard.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acadyo.</span>
            </a>
            <h1 className="text-xl font-bold">Bienvenue sur Acadyo.</h1>
            {register ? (
              <div className="text-center text-sm">
                Vous avez déjà un compte ?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Se connecter
                </a>
              </div>
            ) : (
              <div className="text-center text-sm">
                Vous n'êtes pas encore inscrit ?{" "}
                <a href="/register" className="underline underline-offset-4">
                  S'inscrire
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            {register && (
              <div className="grid gap-3">
                <Label htmlFor="email">Nom</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Thomas"
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setState({ ...state, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                onChange={(e) =>
                  setState({ ...state, password: e.target.value })
                }
                required
              />
            </div>
            {register && (
              <div className="grid gap-3">
                <Label htmlFor="roles">Votre rôle</Label>
                <Select
                  name="roles"
                  onValueChange={(value) =>
                    setState({ ...state, roles: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choisissez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Rôle</SelectLabel>
                      <SelectItem value="ROLE_STUDENT">Étudiant</SelectItem>
                      <SelectItem value="ROLE_TEACHER">Professeur</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              type="button"
              className="w-full cursor-pointer"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <LoaderCircle className="ml-2 h-4 w-4 animate-spin duration-500" />
              ) : register ? (
                "Inscription"
              ) : (
                "Connexion"
              )}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        En continuant, vous acceptez nos{" "}
        <a href="#">conditions d'utilisation</a> et notre{" "}
        <a href="#">Politique de confidentialité</a>.
      </div>
    </div>
  );
}
