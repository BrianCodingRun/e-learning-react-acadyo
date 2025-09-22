import bgCourse2 from "@/assets/learning-bg-card-2.png";
import bgCourse from "@/assets/learning-bg-card.png";
import ClassroomCard from "@/components/ClassroomCard";
import EmptyFolder from "@/components/EmptyFolder";
import JoinClassroom from "@/components/JoinClassroom";
import LoadingGrid from "@/components/LoadingGrid"; // <--- nouvel import
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/store/auth";
import type { Classroom, Classrooms } from "@/types/Classroom";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [classroomData, setClassroomData] = useState<Classrooms>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClassroom = async () => {
      setIsLoading(true);
      if (!token) return;
      try {
        const baseUrl = import.meta.env.VITE_URL_API; // https://localhost:8000/api
        const fetchApi =
          user.roles[0] == "ROLE_TEACHER"
            ? "/classrooms"
            : "/enrollment/my-classrooms";
        const request = await fetch(baseUrl + fetchApi, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        if (response.classrooms) {
          setClassroomData(response.classrooms);
        }
        if (response.member) {
          setClassroomData(response.member);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassroom();
  }, [token, user]);

  return (
    <SidebarInset>
      <header className="flex h-16 sticky z-40 dark:bg-neutral-950 top-0 left-0 shrink-0 items-center justify-between pr-4 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Accueil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user.roles[0] == "ROLE_STUDENT" ? (
            <JoinClassroom />
          ) : (
            <div className="flex items-center gap-1 h-8 px-2 py-4 bg-primary text-primary-foreground rounded-sm text-xs font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="size-4" />
              <a href="/dashboard/classroom/add">Créer un classroom</a>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex md:flex-row flex-col gap-4 md:items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl">Bonjour {user.name} 👋</h2>
            <p className="text-base text-muted-foreground">
              {user.roles[0] == "ROLE_STUDENT"
                ? "Continuez votre apprentissage !"
                : "Gérer vos classrooms et partager des ressources avec vos étudiant !"}
            </p>
          </div>
        </div>
        <Separator />
        {user.roles[0] != "ROLE_STUDENT" ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-light">Les classrooms que j'ai créé</h1>
            {!isLoading ? (
              classroomData.length > 0 ? (
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  {classroomData.map((c: Classroom) => (
                    <ClassroomCard
                      key={c.id}
                      imgPath={bgCourse2}
                      classroom={c}
                    />
                  ))}
                </div>
              ) : (
                <EmptyFolder
                  message="Il n'y a aucun classroom créé pour le moment."
                  action={true}
                />
              )
            ) : (
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <LoadingGrid count={3} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-light">
              Cours auxquels je suis inscrit
            </h1>
            {!isLoading ? (
              classroomData.length > 0 ? (
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  {classroomData.map((c: Classroom) => (
                    <ClassroomCard
                      key={c.id}
                      imgPath={bgCourse}
                      classroom={c}
                    />
                  ))}
                </div>
              ) : (
                <EmptyFolder
                  message="Vous n'êtes inscrit dans aucun classroom pour le moment."
                  action={true}
                />
              )
            ) : (
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <LoadingGrid count={3} />
              </div>
            )}
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
