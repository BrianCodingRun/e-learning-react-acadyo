import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Duty } from "@/types/Course";

export default function DutyCard({
  imgPath,
  duty,
  classroomId,
}: {
  imgPath: string;
  duty: Duty;
  classroomId: string;
}) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="p-0">
        <div className="w-full h-48">
          <img
            src={imgPath}
            className="w-full h-full object-cover rounded-tl-xl rounded-tr-xl"
            alt="Learning course classroom"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2 py-3">
        <h2 className="text-lg leading-4">{duty.title}</h2>
        <p className="text-xs text-muted-foreground my-1">
          {duty.instruction.substring(0, 20)}
        </p>
        <div className="p-2 bg-primary text-primary-foreground rounded-sm text-xs font-semibold hover:bg-primary/90 transition-colors">
          <a href={`/dashboard/classroom/${classroomId}/duty/${duty.id}`}>
            Accéder
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
