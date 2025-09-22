import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassroomLoading() {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="p-0">
        <div className="w-full h-48">
          <Skeleton className="w-full h-full rounded-none rounded-tl-xl rounded-tr-xl" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2 py-3">
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-40 h-2" />
        <Skeleton className="w-60 h-2" />
        <Skeleton className="w-32 h-2" />
      </CardContent>
    </Card>
  );
}
