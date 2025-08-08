import bgCourse2 from "@/assets/learning-bg-card-2.png";
import bgCourse from "@/assets/learning-bg-card.png";
import ClassroomCard from "@/components/ClassroomCard";
import JoinClassroom from "@/components/JoinClassroom";
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
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { Classrooms } from "types/classroom";

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [classroomData, setClassroomData] = useState<Classrooms>([]);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        if (!token) return;
        const baseUrl = import.meta.env.VITE_URL_API;
        const fetchApi =
          user.roles[0] == "ROLE_TEACHER"
            ? "/courses"
            : "/enrollment/my-courses";
        const request = await fetch(baseUrl + fetchApi, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        if (response.courses) {
          setClassroomData(response.courses);
        }
        if (response.member) {
          setClassroomData(response.member);
        }
      } catch (error) {
        console.log(error);
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
              <a href="dashboard/classroom/add">Créer un classroom</a>
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
                : "Créez un nouveau classroom et partager des ressources avec vos étudiant !"}
            </p>
          </div>
        </div>
        <Separator />
        {user.roles[0] != "ROLE_STUDENT" ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-light">Les cours que j'ai créé</h1>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {classroomData &&
                classroomData.map((c) => (
                  <ClassroomCard key={c.id} imgPath={bgCourse2} classroom={c} />
                ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-light">
              Cours auquels je suis inscrit
            </h1>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {classroomData &&
                classroomData.map((c) => (
                  <ClassroomCard key={c.id} imgPath={bgCourse} classroom={c} />
                ))}
            </div>
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
