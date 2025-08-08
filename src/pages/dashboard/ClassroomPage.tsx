import bgCourse2 from "@/assets/learning-bg-card-2.png";
import bgCourse from "@/assets/learning-bg-card.png";
import CourseCard from "@/components/CourseCard";
import DutyCard from "@/components/DutyCard";
import JoinClassroom from "@/components/JoinClassroom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/store/auth";
import type { Classroom } from "@/types/ClassroomType";
import type { Courses, HomeWork } from "@/types/Course";
import type { EtudiantsClassroom, TeacherClassroom } from "@/types/User";
import { List, Plus, Presentation, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export default function ClassroomPage() {
  const params = useParams();
  const { token, user } = useAuthStore();
  const [classroomDetails, setClassroomDetails] = useState<Classroom>();
  const [courses, setCourses] = useState<Courses>([]);
  const [homeWork, setHomeWork] = useState<HomeWork>([]);
  const [homeWorkAssigned, setHomeWorkAssigned] = useState<HomeWork>([]);
  const [etudiantEnrolled, setEtudiantEnrolled] = useState<EtudiantsClassroom>(
    []
  );
  const [teacher, setTeacher] = useState<TeacherClassroom>();

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_URL_API;
    const fetchClassroomDetails = async () => {
      if (!token) return;
      try {
        const request = await fetch(
          baseUrl + "/courses/" + params.classroomId,
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
    const fetchCourses = async () => {
      if (!token) return;
      try {
        const request = await fetch(baseUrl + "/lessons", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        setCourses(response.member);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchHomeWork = async () => {
      if (!token) return;
      try {
        const request = await fetch(baseUrl + "/assignments", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        setHomeWork(response.member);
        setHomeWorkAssigned(response.member);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchEtudiant = async () => {
      if (!token) return;
      try {
        const request = await fetch(
          baseUrl + `/enrollment/course/${params.classroomId}/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const response = await request.json();
        setEtudiantEnrolled(response.students);
        setTeacher(response.course.teacher);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClassroomDetails();
    fetchCourses();
    fetchHomeWork();
    fetchEtudiant();
  }, [params, token]);

  const classroomCourseId = `/api/courses/${params.classroomId}`;
  const classroomCourses = courses.filter(
    (lesson) => lesson.course === classroomCourseId
  );

  const classroomAssignments = homeWork.filter(
    (work) => work.course === classroomCourseId
  );

  const userId = `/api/users/${user.id}`;

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
                <BreadcrumbPage>{classroomDetails?.title}</BreadcrumbPage>
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
          <div className="flex flex-col gap-2">
            <Badge className="rounded-sm">
              Code du classroom: <strong>{classroomDetails?.code}</strong>
            </Badge>
            <h2 className="text-3xl">{classroomDetails?.title}</h2>
          </div>
        </div>
        <div className="block">
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
                        to={`/dashboard/classroom/${params.classroomId}/add`}
                      >
                        Support de cours
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <List />
                      <Link
                        to={`/dashboard/classroom/homework/${params.classroomId}/add`}
                      >
                        Nouveau devoirs
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Tabs defaultValue="tab-1">
            <TabsList className="h-auto w-full justify-start gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
              <TabsTrigger
                value="tab-1"
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
              >
                Cours et devoirs
              </TabsTrigger>
              <TabsTrigger
                value="tab-2"
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
              >
                Membres
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab-1" className="py-2">
              <div className="flex flex-col gap-4">
                <h1 className="text-2lg font-light">Support de cours</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  {classroomCourses.length > 0 ? (
                    classroomCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        imgPath={bgCourse2}
                        course={course}
                        classroomId={params.classroomId as string}
                      />
                    ))
                  ) : (
                    <p>Aucun support de cours</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <h1 className="text-lg font-light">
                  {user.roles[0] == "ROLE_STUDENT"
                    ? "Mes devoirs"
                    : "Devoirs créé."}
                </h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  {user.roles[0] == "ROLE_STUDENT" ? (
                    homeWorkAssigned.length > 0 ? (
                      homeWorkAssigned
                        .filter((duty) =>
                          duty.assignedTo.some(
                            (assignedUserId) => assignedUserId === userId
                          )
                        )
                        .map((duty) => (
                          <DutyCard
                            key={duty.id}
                            duty={duty}
                            imgPath={bgCourse}
                            classroomId={params.classroomId as string}
                          />
                        ))
                    ) : (
                      <p>Aucun devoirs pour le moment.</p>
                    )
                  ) : classroomAssignments.length > 0 ? (
                    classroomAssignments.map((duty) => (
                      <DutyCard
                        key={duty.id}
                        duty={duty}
                        imgPath={bgCourse}
                        classroomId={params.classroomId as string}
                      />
                    ))
                  ) : (
                    <p>Aucun devoirs pour le moment.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tab-2" className="flex flex-col gap-4">
              <div className="bg-muted/50 min-h-[100vh] p-4 flex flex-col flex-1 gap-6 rounded-xl md:min-h-min">
                <h2 className="text-lg font-semibold">Professeur</h2>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{teacher?.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {teacher?.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {teacher?.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 min-h-[100vh] p-4 flex flex-col flex-1 gap-6 rounded-xl md:min-h-min">
                <h2 className="text-lg font-semibold">Étudiants</h2>
                <div className="flex flex-col gap-8">
                  {etudiantEnrolled.length > 0 ? (
                    etudiantEnrolled.map((etudiant) => (
                      <div
                        className="flex items-center gap-4"
                        key={etudiant.id}
                      >
                        <Avatar>
                          <AvatarFallback>
                            {etudiant.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {etudiant.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {etudiant.email}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Aucun étudiants pour le moment !</p>
                  )}
                </div>
              </div>
              <div className="flex justify-start">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2" size="sm">
                      <UserPlus className="size-4" />
                      Inviter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Code du cours</DialogTitle>
                      <DialogDescription>
                        Invitez des personnes à rejoindre ce cours via ce code
                        unique.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <div className="grid flex-1 gap-2">
                        <div className="flex items-center justify-between bg-sidebar px-4 py-2 rounded-lg">
                          <code className="text-sm text-muted-foreground">
                            {classroomDetails?.code}
                          </code>
                          <CopyToClipboard
                            className="bg-primary border-none cursor-pointer outline-none"
                            textToCopy={classroomDetails?.code as string}
                          />
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarInset>
  );
}
