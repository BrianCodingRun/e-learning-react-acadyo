import bgCourse from "@/assets/learning-bg-card.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth";
import type { Duty } from "@/types/Course";
import { Paperclip, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FilePreview = {
  name: string;
  url: string;
  type: string;
  file: File;
};

export default function DutyDetailsComponent({ duty }: { duty: Duty }) {
  const { user } = useAuthStore();
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Fichier ajouté");

    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setFilePreview({
      name: file.name,
      url: fileUrl,
      type: file.type,
      file: file,
    });
  };

  const handleSubmit = async () => {
    if (!filePreview?.file) {
      toast.error("Aucun fichier sélectionné.");
      return;
    }

    const formData = new FormData();

    // Tu dois fournir les valeurs correctes selon l'API Platform
    formData.append("file", filePreview.file); // fichier
    formData.append("student", `/api/users/${user.id}`); // Relation vers User
    formData.append("assignment", duty["@id"]); // Relation vers Duty (Assignment)
    formData.append("submittedAt", new Date().toISOString()); // Format ISO standard

    try {
      const response = await fetch("https://localhost:8000/api/submissions", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Erreur backend:", result);
        toast.error("Erreur lors de l'envoi !");
        return;
      }

      toast.success("Devoir envoyé avec succès !");
      setFilePreview(null); // reset file après envoi
      const input = document.getElementById("fileUpload") as HTMLInputElement;
      if (input) input.value = "";
    } catch (error) {
      console.error("Erreur réseau:", error);
      toast.error("Erreur réseau lors de l'envoi.");
    }
  };

  return (
    <Card className="border-none">
      <CardHeader className="px-0">
        <div className="relative w-full h-64">
          <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
          <img
            src={bgCourse}
            className="w-full h-full object-cover rounded-xl"
            alt="Learning course classroom"
          />
        </div>
      </CardHeader>
      <CardContent className="px-0 overflow-y-auto">
        <div className="flex gap-6 w-full justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-3xl">{duty.title}</CardTitle>
            <CardDescription className="text-base">
              {duty.instruction}
            </CardDescription>
          </div>
          {user.roles[0] == "ROLE_STUDENT" && (
            <div className="flex flex-col w-80 gap-6 border border-input rounded-sm p-4">
              <h2 className="text-xl font-semibold">Vos devoirs</h2>
              <div className="flex flex-col gap-2">
                {filePreview && (
                  <div className="text-sm flex flex-col gap-2">
                    <span className="font-medium">Aperçu :</span>

                    {filePreview.type.startsWith("image/") ? (
                      <div className="flex items-center gap-2 border border-input rounded-sm py-2 px-4">
                        <img
                          src={filePreview.url}
                          alt={filePreview.name}
                          className="w-10 max-h-10 object-cover"
                        />
                        <div className="flex flex-col gap-1">
                          <p>
                            {filePreview.name.length > 20
                              ? filePreview.name.substring(0, 20) + "..."
                              : filePreview.name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {filePreview.type}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 border border-input rounded-sm py-2 px-4">
                        <Paperclip size={16} />
                        <div className="flex flex-col gap-1">
                          <p>
                            {filePreview.name.length > 20
                              ? filePreview.name.substring(0, 20) + "..."
                              : filePreview.name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {filePreview.type}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* INPUT FICHIER CACHÉ */}
                <input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus /> Ajouter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="center">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="py-2 cursor-pointer"
                        onSelect={(e) => {
                          e.preventDefault();
                          const fileInput =
                            document.getElementById("fileUpload");
                          fileInput?.click();
                        }}
                      >
                        <Paperclip className="mr-2" size={16} /> Fichier
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* BOUTON SUPPRIMER */}
                {filePreview && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setFilePreview(null);
                      const input = document.getElementById(
                        "fileUpload"
                      ) as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                  >
                    Supprimer
                  </Button>
                )}
                {/* BOUTON POUR ENVOYER */}
                <Button
                  size="sm"
                  disabled={!filePreview}
                  onClick={handleSubmit}
                >
                  Rendre
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
