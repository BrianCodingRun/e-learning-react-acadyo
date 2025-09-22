export type Courses = {
  "@id": string;
  id: string;
  title: string;
  content: string;
  filePath: string;
  studentsCount: number;
  classroom: string;
  createdAt: string;
}[];

export type Course = {
  id: string;
  title: string;
  content: string;
  filePath: string;
  studentsCount: number;
  classroom: string;
  createdAt: string;
};
