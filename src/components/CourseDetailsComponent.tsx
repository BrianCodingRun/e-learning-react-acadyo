import bgCourse from "@/assets/learning-bg-card.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Course } from "types/Course";

export default function CourseDetailsComponent({ course }: { course: Course }) {
  return (
    <Card className="border-none">
      <CardHeader className="px-0">
        <div className="relative w-full h-64">
          <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
          <img
            src={bgCourse}
            className="w-full h-full object-cover rounded-xl"
            alt="Learning course classroom"
          />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex gap-6">
          <div className="flex flex-1/4 flex-col gap-2">
            <CardTitle className="text-3xl">{course.title}</CardTitle>
            <CardDescription className="text-base">
              {course.content}
            </CardDescription>
            {/* <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <NotebookPen className="size-4" />{" "}
                <span className="text-sm">5 chapitres</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <List className="size-4" />{" "}
                <span className="text-sm">2 devoirs</span>
              </div>
            </div> */}
          </div>
          {/* <div className="flex-2/5">
            <div className="flex flex-col w-3/5 gap-6 border border-input rounded-sm p-4 text-muted-foreground">
              <div className="flex gap-1 items-center">
                <Bookmark />
                <p className="font-semibold text-lg">Objectifs pédagogique</p>
              </div>
              <ul className="px-8 list-disc text-sm">
                <li>Comprendre les principes de bases</li>
                <li>Apprendre à organiser ses tâches avec Trello</li>
                <li>Identifier les rôles clés</li>
              </ul>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
