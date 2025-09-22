export type Dutys = {
  "@id": string;
  id: string;
  title: string;
  instruction: string;
  dueDate: string;
  classroom: string;
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
  dutyRendered: string[];
}[];

export type Duty = {
  "@id": string;
  id: string;
  title: string;
  instruction: string;
  dueDate: string;
  classroom: string;
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
  dutyRendered: string[];
};
