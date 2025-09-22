import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { LoaderCircle, School2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function DeleteClassroom({ id }: { id: string }) {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!token) return;
    toast("🔄 Suppression en cours", {
      description: "Vérification que l'id du classroom est valide.",
    });
    try {
      const baseUrl = import.meta.env.VITE_URL_API;
      const request = await fetch(`${baseUrl}/classrooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (request.status == 204) {
        toast("✅ Suppression réussie 🎉", {
          description: "Redirection vers le dashboard !",
        });
        navigate(`/dashboard`);
      } else {
        toast.warning("❌ Suppression échoué", {
          description: "L'id du classroom est invalide !",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 h-8 px-2 py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-sm text-xs font-light cursor-pointer"
        >
          <School2 className="size-4" />
          Supprimer le classroom
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>En êtes vous sûr?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible et vous n'aurez plus accès au support
            de cours de ce classroom.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="spin duration-100" />
            ) : (
              "Continuer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
