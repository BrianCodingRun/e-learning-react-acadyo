import { Presentation, School } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth";
import type { Classrooms } from "../types/Classroom";
import { Badge } from "./ui/badge";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, token } = useAuthStore();
  const [classroomData, setClassroomData] = React.useState<Classrooms>([]);

  React.useEffect(() => {
    const fetchClassroom = async () => {
      try {
        if (!token) return;
        const baseUrl = import.meta.env.VITE_URL_API;
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
      }
    };
    fetchClassroom();
  }, [token, user]);

  const classroomItems =
    classroomData &&
    classroomData.map((classroom) => ({
      title: classroom.title,
      url: `/dashboard/classroom/${classroom.id}`,
    }));

  const data = {
    navMain: [
      user.roles[0] == "ROLE_TEACHER"
        ? {
            title: "Mes cours",
            url: "#",
            icon: Presentation,
            isActive: true,
            items: classroomItems,
          }
        : {
            title: "Cours inscrit",
            url: "#",
            icon: School,
            isActive: true,
            items: classroomItems,
          },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex items-center gap-1">
            <Badge className="w-8 h-8 text-md font-bold">A</Badge>
            <span>Acadyo</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
