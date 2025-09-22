import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function DutyDetailsLoading() {
  return (
    <Card className="border-none">
      <CardHeader className="px-0">
        <div className="relative w-full h-64">
          <Skeleton className="w-full h-full rounded-sm" />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex gap-6 w-full justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-60 h-3" />
          </div>
          <div className="flex flex-col w-80 gap-6 border border-input rounded-sm p-4">
            <Skeleton className="h-2 w-32" />
            <Separator />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full rounded-sm" />
              <Skeleton className="h-12 w-full rounded-sm" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
