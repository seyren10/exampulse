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

export default function EditClassroomDialog({
  onOpenChange,
  open,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Classroom</DialogTitle>
          <DialogDescription>
            Update the details for this classroom.
          </DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
