import ClassroomForm from "@/components/ClassroomForm";
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

export default function NewClassroomPage() {
  const { user } = useAuthStore();
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
                <BreadcrumbPage>Classroom</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Nouveau</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user.roles[0] == "ROLE_STUDENT" ? (
            <JoinClassroom />
          ) : (
            <div className="flex items-center gap-1 h-8 px-2 py-4 bg-primary text-neutral-800 rounded-sm text-xs font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="size-4" />
              <a href="dashboard/classroom/add">Créer un classroom</a>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center min-h-[80vh] gap-4 p-4 pt-0">
        <Card className="w-[440px] mb-16">
          <CardContent>
            <ClassroomForm />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
