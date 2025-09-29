import bgCourse2 from "@/assets/learning-bg-card-2.png";
import bgCourse from "@/assets/learning-bg-card.png";
import DutyCard from "@/components/DutyCard";
import EmptyFolder from "@/components/EmptyFolder";
import InviteStudent from "@/components/InviteStudent";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth";
import type { Classroom } from "@/types/Classroom";
import type { Courses } from "@/types/Course";
import type { Dutys } from "@/types/Duty";
import type { EtudiantsClassroom, TeacherClassroom } from "@/types/User";
import { List, Plus, Presentation } from "lucide-react";
import { Link } from "react-router";
import CourseCard from "./CourseCard";
import LoadingGrid from "./LoadingGrid";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

type Props = {
  classroomDetails: Classroom;
  isLoading: boolean;
  coursesFilter: Courses;
  classroomAssignments: Dutys;
  etudiantEnrolled: EtudiantsClassroom;
  teacher: TeacherClassroom;
  classroomId: string;
  userId: string;
};

export function ClassroomTabs({
  classroomDetails,
  isLoading,
  coursesFilter,
  classroomAssignments,
  etudiantEnrolled,
  teacher,
  classroomId,
  userId,
}: Props) {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex md:flex-row flex-col gap-4 md:items-center justify-between">
        <div className="flex flex-col gap-2">
          <Badge className="rounded-sm">
            Code du classroom:
            {!isLoading ? (
              <strong>{classroomDetails?.code}</strong>
            ) : (
              <Skeleton className="w-10 h-1" />
            )}
          </Badge>
          {!isLoading ? (
            <h2 className="text-3xl">{classroomDetails?.title}</h2>
          ) : (
            <Skeleton className="w-48 h-5" />
          )}
        </div>
      </div>
      {user.roles[0] == "ROLE_ADMIN" && "ROLE_TEACHER" && (
        <div className="flex justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1 rounded-sm cursor-pointer h-8 px-2 py-4 text-xs">
                <Plus className="size-4" />
                Créer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Presentation />
                  <Link to={`/dashboard/classroom/${classroomId}/add`}>
                    Support de cours
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <List />
                  <Link to={`/dashboard/classroom/${classroomId}/duty/add`}>
                    Nouveau devoirs
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <Tabs defaultValue="courses">
        <TabsList className="h-auto w-full justify-start gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
          <TabsTrigger
            value="courses"
            className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
          >
            Cours & devoirs
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
          >
            Membres
          </TabsTrigger>
        </TabsList>

        {/* Onglet Cours & Devoirs */}
        <TabsContent value="courses" className="py-2">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <LoadingGrid count={3} />
            </div>
          ) : coursesFilter.length === 0 &&
            classroomAssignments.length === 0 ? (
            <EmptyFolder message="Aucun contenu pour ce classroom" />
          ) : (
            <>
              <h1 className="text-lg font-light mb-4">Support de cours</h1>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {coursesFilter.map((course) => (
                  <CourseCard
                    key={course.id}
                    imgPath={bgCourse2}
                    course={course}
                    classroomId={classroomId as string}
                  />
                ))}
              </div>
              <h1 className="text-lg font-light my-4">
                {user.roles[0] == "ROLE_STUDENT"
                  ? "Mes devoirs"
                  : "Devoirs créé."}
              </h1>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {user.roles.includes("ROLE_TEACHER")
                  ? classroomAssignments.map((duty) => (
                      <DutyCard
                        key={duty.id}
                        duty={duty}
                        imgPath={bgCourse}
                        classroomId={classroomId as string}
                      />
                    ))
                  : classroomAssignments
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
                          classroomId={classroomId as string}
                        />
                      ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Onglet Membres */}
        <TabsContent value="members" className="flex flex-col gap-4">
          <div className="bg-muted/50 min-h-[100vh] p-4 flex flex-col flex-1 gap-6 rounded-xl md:min-h-min">
            <h2 className="text-lg font-semibold">Professeur</h2>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{teacher?.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{teacher?.name}</span>
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
                  <div className="flex items-center gap-4" key={etudiant.id}>
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
          <InviteStudent classroomDetails={classroomDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
