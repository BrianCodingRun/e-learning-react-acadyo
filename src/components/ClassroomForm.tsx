import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ClassroomForm({
  className,
  ...props
}: {
  props?: React.ComponentProps<"div">;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log(state);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">
              Création d'un nouveau classroom.
            </h1>
            <p className="text-sm text-muted-foreground">
              Veuillez rensignez tous les champs qui comporte un asterix (*).
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
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
              <Input
                id="description"
                type="text"
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
                required
              />
            </div>
          </div>
          <Button
            type="button"
            className="self-start cursor-pointer"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <LoaderCircle className="ml-2 h-4 w-4 animate-spin duration-500" />
            ) : (
              "Créer"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
