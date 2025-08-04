export type User = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

export type EtudiantsClassroom = {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
}[];

export type TeacherClassroom = {
  id: string;
  name: string;
  email: string;
};
