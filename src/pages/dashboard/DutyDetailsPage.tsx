import DutyDetailsComponent from "@/components/DutyDetailsComponent";
import DutyDetailsLoading from "@/components/DutyDetailsLoading";
import JoinClassroom from "@/components/JoinClassroom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/store/auth";
import type { Classroom } from "@/types/Classroom";
import type { Duty } from "@/types/Duty";
import { List, Plus, Presentation } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export default function DutyDetailsPage() {
  const params = useParams();
  const { token, user } = useAuthStore();
  const [classroomDetails, setClassroomDetails] = useState<Classroom>();
  const [dutyDetails, setDutyDetails] = useState<Duty>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_URL_API;
    const fetchClassroomDetails = async () => {
      if (!token) return;
      try {
        const request = await fetch(
          baseUrl + "/classrooms/" + params.classroomId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const response = await request.json();
        setClassroomDetails(response);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDutyDetails = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const request = await fetch(`${baseUrl}/assignments/${params.dutyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        console.log(response);
        setDutyDetails(response);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassroomDetails();
    fetchDutyDetails();
  }, [token, params]);
  return (
    <SidebarInset>
      <header className="flex h-16 sticky z-40 bg-sidebar dark:bg-neutral-950 top-0 left-0 shrink-0 items-center justify-between pr-4 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <a href="/dashboard">Dashboard</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <a href={`/dashboard/classroom/${classroomDetails?.id}`}>
                    {classroomDetails?.title}
                  </a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>{dutyDetails?.title}</BreadcrumbPage>
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
      <div className="flex flex-1 flex-col gap-4 p-4 pl-8">
        {user.roles[0] == "ROLE_TEACHER" && (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1 rounded-sm cursor-pointer h-8 px-2 py-4 text-xs">
                  <Plus className="size-4" />
                  Créer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Presentation />
                    <Link
                      to={`/dashboard/classroom/${classroomDetails?.id}/add`}
                    >
                      Support de cours
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <List />
                    <Link
                      to={`/dashboard/classroom/homework/${classroomDetails?.id}/add`}
                    >
                      Nouveau devoirs
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {!isLoading ? (
          dutyDetails && <DutyDetailsComponent duty={dutyDetails} />
        ) : (
          <DutyDetailsLoading />
        )}
      </div>
    </SidebarInset>
  );
}
