import bgCourse from "@/assets/learning-bg-card.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Course } from "@/types/Course";
import { CalendarDays, Download } from "lucide-react";
import { Button } from "./ui/button";

export default function CourseDetailsComponent({ course }: { course: Course }) {
  function formatDateWithDash(dateString: Date) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <>
      <Card className="border-none p-0 bg-neutral-50 dark:bg-neutral-900">
        <CardHeader className="px-0">
          <div className="relative w-full h-64">
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-t-lg" />
            <img
              src={bgCourse}
              className="w-full h-full object-cover rounded-t-lg"
              alt="Learning course classroom"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="flex flex-1/4 flex-col gap-2">
              <CardTitle className="text-3xl">{course.title}</CardTitle>
              <CardDescription className="text-neutral-600 dark:text-neutral-300">
                {course.content}
              </CardDescription>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-6">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 bg-accent"
            onClick={() => {
              const link = document.createElement("a");
              link.href = course.filePath;
              link.download = course.title + ".pdf"; // nom du fichier
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="size-4" />
            Télécharger le support
          </Button>
        </CardFooter>
      </Card>
      <Card className="border-none bg-neutral-50 dark:bg-neutral-900 rounded-lg">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            <h2 className="text-sm">
              Créé le: {formatDateWithDash(course.createdAt)}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            <h2 className="text-sm">
              Dernière mise à jour: {formatDateWithDash(course.updatedAt)}
            </h2>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
