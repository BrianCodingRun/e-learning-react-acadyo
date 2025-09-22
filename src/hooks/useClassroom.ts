import { useAuthStore } from "@/store/auth";
import type { Classroom } from "@/types/Classroom";
import type { Courses } from "@/types/Course";
import type { Dutys } from "@/types/Duty";
import type { EtudiantsClassroom, TeacherClassroom } from "@/types/User";
import { useEffect, useState } from "react";

type UseClassroomProps = {
  classroomId: string;
};

export function useClassroom({ classroomId }: UseClassroomProps) {
  const { token, user } = useAuthStore();
  const [classroomDetails, setClassroomDetails] = useState<Classroom>();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Courses>([]);
  const [coursesFilter, setCoursesFilter] = useState<Courses>([]);
  const [dutys, setDutys] = useState<Dutys>([]);
  const [etudiantEnrolled, setEtudiantEnrolled] = useState<EtudiantsClassroom>(
    []
  );
  const [teacher, setTeacher] = useState<TeacherClassroom>();

  const baseUrl = import.meta.env.VITE_URL_API; // ex: "https://localhost:8000/api"
  const classroomCourseId = `/api/classrooms/${classroomId}`;

  useEffect(() => {
    if (!token) return;

    const fetchClassroomDetails = async () => {
      try {
        const request = await fetch(`${baseUrl}/classrooms/${classroomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        setClassroomDetails(response);
      } catch (error) {
        console.error("Erreur fetchClassroomDetails", error);
      }
    };

    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const request = await fetch(`${baseUrl}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        const courses: Courses = response.member;
        setCourses(courses);

        // filtre uniquement les cours de ce classroom
        const classroomCourses = courses.filter(
          (course) => course.classroom === classroomCourseId
        );
        setCoursesFilter(classroomCourses);
      } catch (error) {
        console.error("Erreur fetchCourses", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDutys = async () => {
      try {
        const request = await fetch(`${baseUrl}/assignments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        setDutys(response.member);
      } catch (error) {
        console.error("Erreur fetchHomeWork", error);
      }
    };

    const fetchEtudiant = async () => {
      try {
        const request = await fetch(
          `${baseUrl}/enrollment/classroom/${classroomId}/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const response = await request.json();
        setEtudiantEnrolled(response.students);
        setTeacher(response.classroom.teacher);
      } catch (error) {
        console.error("Erreur fetchEtudiant", error);
      }
    };

    fetchClassroomDetails();
    fetchCourses();
    fetchDutys();
    fetchEtudiant();
  }, [classroomId, token, classroomCourseId, baseUrl]);

  // filtre des devoirs liés à cette classroom
  const classroomAssignments = dutys.filter(
    (duty) => duty.classroom === classroomCourseId
  );

  const userId = `/api/users/${user?.id}`;

  return {
    classroomDetails,
    isLoading,
    courses,
    coursesFilter,
    dutys,
    classroomAssignments,
    etudiantEnrolled,
    teacher,
    userId,
  };
}
