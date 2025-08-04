export type Courses = {
  "@id": string;
  id: string;
  title: string;
  content: string;
  filePath: string;
  studentsCount: number;
  course: string;
  createdAt: string;
}[];

export type Course = {
  id: string;
  title: string;
  content: string;
  filePath: string;
  studentsCount: number;
  course: string;
  createdAt: string;
};

export type HomeWork = {
  "@id": string;
  id: string;
  title: string;
  content: string;
  instruction: string;
  dueDate: string;
  course: string;
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
  submissions: string[];
}[];

export type Duty = {
  "@id": string;
  id: string;
  title: string;
  content: string;
  instruction: string;
  dueDate: string;
  course: string;
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
  submissions: string[];
};
