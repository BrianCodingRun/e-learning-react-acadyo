import { ClassroomHeader } from "@/components/ClassroomHeader";
import ClassroomPageLoading from "@/components/ClassroomPageLoading";
import { ClassroomTabs } from "@/components/ClassroomTabs";
import { SidebarInset } from "@/components/ui/sidebar";
import { useClassroom } from "@/hooks/useClassroom";
import { useParams } from "react-router";

export default function ClassroomPage() {
  const { classroomId } = useParams<{ classroomId: string }>();

  const {
    classroomDetails,
    isLoading,
    coursesFilter,
    classroomAssignments,
    etudiantEnrolled,
    teacher,
    userId,
  } = useClassroom({ classroomId: classroomId ?? "" });

  if (!classroomId) {
    return <ClassroomPageLoading />;
  }

  if (!classroomDetails) {
    return <ClassroomPageLoading />;
  }

  if (!teacher) {
    return <ClassroomPageLoading />;
  }

  return (
    <SidebarInset>
      <ClassroomHeader
        classroomDetails={classroomDetails}
        classroomId={classroomId}
      />
      <ClassroomTabs
        classroomDetails={classroomDetails}
        isLoading={isLoading}
        coursesFilter={coursesFilter}
        classroomAssignments={classroomAssignments}
        etudiantEnrolled={etudiantEnrolled}
        teacher={teacher}
        classroomId={classroomId}
        userId={userId}
      />
    </SidebarInset>
  );
}
