export type Classrooms = {
  ["@id"]: string;
  id: string;
  title: string;
  description: string;
  code: string;
  teacher: string[];
  studentsCount: number;
  lessonsCount: number;
  assignmentsCount: number;
  createdAt: string;
}[];

export type Classroom = {
  ["@id"]: string;
  id: string;
  title: string;
  description: string;
  code: string;
  teacher: string[];
  studentsCount: number;
  lessonsCount: number;
  assignmentsCount: number;
  createdAt: string;
};
