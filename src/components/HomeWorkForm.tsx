import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import type { Classroom } from "@/types/ClassroomType";
import type { EtudiantsClassroom } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

export default function HomeWorkForm({
  classroom,
  className,
  ...props
}: {
  classroom?: Classroom;
  className?: string;
  props?: React.ComponentProps<"div">;
}) {
  const formSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: "Le titre doit avoir minimum deux caractères.",
      })
      .max(50, {
        message: "Le titre ne doit pas dépasser cinquante caractères.",
      }),
    instruction: z.string().optional(),
    dueDate: z.date().optional(),
    assignedTo: z.string().array(),
  });

  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("10:30:00"); // format HH:mm:ss
  const [etudiantEnrolled, setEtudiantEnrolled] = useState<EtudiantsClassroom>(
    []
  );

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      instruction: "",
      dueDate: undefined,
      assignedTo: [],
    },
  });

  useEffect(() => {
    if (date && time) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const combined = new Date(date);
      combined.setHours(hours, minutes, seconds);
      form.setValue("dueDate", combined);
    }
  }, [date, time, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    toast("🔄 Création en cours...", {
      description: (
        <div className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Le devoir est cours de création !
        </div>
      ),
    });
    try {
      const baseUrl = import.meta.env.VITE_URL_API;
      const data = {
        title: values.title,
        instruction: values.instruction,
        assignedTo: values.assignedTo,
        dueDate: values.dueDate,
        course: `/api/courses/${classroom?.id}`,
      };
      const request = await fetch(baseUrl + "/assignments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify(data),
      });
      if (request.status == 201 || request.status == 200) {
        toast("✅ Devoir créé 🎉", {
          description: "Le devoir a été créé avec succès !",
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
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_URL_API;
    const fetchEtudiant = async () => {
      if (!token || !classroom?.id) return;
      try {
        const request = await fetch(
          baseUrl + `/enrollment/course/${classroom.id}/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const response = await request.json();
        console.log(response);
        setEtudiantEnrolled(response.students);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEtudiant();
  }, [token, classroom]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">Nouveau devoir.</h1>
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
                        placeholder="Nouveau devoir"
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
                name="instruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instruction</FormLabel>
                    <FormControl>
                      <Textarea
                        id="instruction"
                        placeholder="Instruction du devoir"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => {
                  const allIds =
                    etudiantEnrolled &&
                    etudiantEnrolled.map((s) => `/api/users/${s.id}`);
                  const allSelected = field.value.length === allIds.length;
                  const toggleAll = () => {
                    field.onChange(allSelected ? [] : allIds);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Assigner à</FormLabel>
                      <Popover open={openSelect} onOpenChange={setOpenSelect}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSelect}
                            className="w-80 justify-between"
                          >
                            {field.value.length > 0
                              ? `${field.value.length} étudiant(s) sélectionné(s)`
                              : "Sélectionner les étudiants..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0">
                          <Command>
                            <CommandInput placeholder="Rechercher un étudiant..." />
                            <CommandList>
                              <CommandEmpty>
                                Aucun étudiant trouvé.
                              </CommandEmpty>

                              <CommandGroup>
                                <CommandItem
                                  onSelect={toggleAll}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Checkbox checked={allSelected} />
                                  <span>
                                    {allSelected
                                      ? "Tout désélectionner"
                                      : "Tout sélectionner"}
                                  </span>
                                </CommandItem>
                              </CommandGroup>

                              <CommandGroup heading="Étudiants">
                                {etudiantEnrolled.length > 0 ? (
                                  etudiantEnrolled.map((student) => {
                                    const isSelected = field.value.includes(
                                      `/api/users/${student.id}`
                                    );
                                    return (
                                      <CommandItem
                                        key={student.id}
                                        onSelect={() => {
                                          const updated = isSelected
                                            ? field.value.filter(
                                                (id) => id !== student.id
                                              )
                                            : [
                                                ...field.value,
                                                `/api/users/${student.id}`,
                                              ];
                                          field.onChange(updated);
                                        }}
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <Checkbox checked={isSelected} />
                                        <span>{student.name}</span>
                                      </CommandItem>
                                    );
                                  })
                                ) : (
                                  <CommandItem>
                                    Aucun étudiant n'est dans ce cours.
                                  </CommandItem>
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* ✅ Affichage des étudiants sélectionnés */}
                      {field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {etudiantEnrolled
                            .filter((student) =>
                              field.value.includes(`/api/users/${student.id}`)
                            )
                            .map((student) => (
                              <span
                                key={student.id}
                                className="bg-muted text-sm px-2 py-1 rounded-md border"
                              >
                                {student.name}
                              </span>
                            ))}
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={() => (
                    <FormItem>
                      <FormLabel>Date de limite</FormLabel>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="w-56 justify-between font-normal"
                            >
                              {date
                                ? date.toLocaleDateString()
                                : "Selectionner une date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={() => (
                    <FormItem>
                      <FormLabel>Heure limite</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          id="time-picker"
                          step="1"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
