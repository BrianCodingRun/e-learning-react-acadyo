import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

export default function CourseDetailsLoading() {
  return (
    <Card className="border-none">
      <CardHeader className="px-0">
        <div className="relative w-full h-64">
          <Skeleton className="w-full h-full rounded-sm" />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex gap-6">
          <div className="flex flex-1/4 flex-col gap-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-60 h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
