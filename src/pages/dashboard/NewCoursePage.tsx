import CourseForm from "@/components/CourseForm";
import JoinClassroom from "@/components/JoinClassroom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/store/auth";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Classroom } from "types/classroom";

export default function NewCoursePage() {
  const params = useParams();

  const { token, user } = useAuthStore();
  const [classroomDetails, setClassroomDetails] = useState<Classroom>();

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_URL_API;
    const fetchClassroomDetails = async () => {
      if (!token) return;
      try {
        const request = await fetch(baseUrl + "/courses/" + params.courseId, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        console.log(response);
        setClassroomDetails(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClassroomDetails();
  }, [params, token]);

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
                <BreadcrumbLink href="/dashboard">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={`/dashboard/classroom/${classroomDetails?.id}`}
                >
                  {classroomDetails?.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Nouveau support de cours</BreadcrumbPage>
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
      <div className="flex flex-1 flex-col items-center justify-center min-h-[80vh] gap-4 p-4 pt-0">
        <Card className="w-[550px] mb-16">
          <CardContent>
            <CourseForm classroom={classroomDetails} />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
