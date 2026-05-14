import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  open: boolean;
  onOpenChange: (next: boolean) => void;
};

export default function CreateClassroomDialog({
  onOpenChange,
  open,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Classroom</DialogTitle>
          <DialogDescription>
            Set up a new classroom for your students.
          </DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
