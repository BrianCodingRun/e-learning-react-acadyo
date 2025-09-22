import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Classroom } from "@/types/Classroom";
import { UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import CopyToClipboard from "./ui/copy-to-clipboard";

export default function InviteStudent({
  classroomDetails,
}: {
  classroomDetails: Classroom;
}) {
  return (
    <div className="flex justify-start">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2" size="sm">
            <UserPlus className="size-4" />
            Inviter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Code du cours</DialogTitle>
            <DialogDescription>
              Invitez des personnes à rejoindre ce cours via ce code unique.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center justify-between bg-sidebar px-4 py-2 rounded-lg">
                <code className="text-sm text-muted-foreground">
                  {classroomDetails?.code}
                </code>
                <CopyToClipboard
                  className="bg-primary border-none cursor-pointer outline-none"
                  textToCopy={classroomDetails?.code as string}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
