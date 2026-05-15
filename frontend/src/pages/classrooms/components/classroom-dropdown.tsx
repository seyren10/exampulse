import { useState, type PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Check,
  Pencil,
  Trash2,
  Users,
  ClipboardList,
  Share2,
  DoorOpen,
} from "lucide-react";
import { toast } from "sonner";
import type { Classroom, ClassroomSchema } from "@/features/classrooms/type";
import { buildJoinUrl } from "@/lib/helpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserPermissions } from "@/features/auth/hooks/use-user-permissions";
import { useQuery } from "@tanstack/react-query";
import { getClassroomDetailOptions } from "@/features/classrooms/query";
import { Skeleton } from "@/components/ui/skeleton";
import AppConfirmDialog from "@/components/app/app-confirm-dialog";
import {
  useDeleteClassroom,
  useLeaveClassroom,
  useUpdateClassroom,
} from "@/features/classrooms/hooks/use-classroom";
import EditClassroomDialog from "./dialogs/edit-classroom-dialog";
import ClassroomForm from "./classroom-form";
import { Link, useNavigate } from "react-router";

type Props = PropsWithChildren & {
  classroom: Classroom;
  onManageStudents?: (classroom: Classroom) => void;
  onLeaveClassroom?: (classroom: Classroom) => void;
};
export default function ClassroomDropdownMenu({
  classroom,
  onManageStudents,
  children,
}: Props) {
  const navigate = useNavigate();

  const [shareOpen, setShareOpen] = useState(false);
  const { isClassroomOwner } = useUserPermissions();

  const [openLeaveConfirmDialog, setOpenLeaveConfirmDialog] = useState(false);
  const [leaveClassroom, isLeaving] = useLeaveClassroom();

  const [updateClassroom, isUpdating] = useUpdateClassroom();
  const [openEditDialog, setEditOpenDialog] = useState(false);

  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [deleteClassroom, isDeleting] = useDeleteClassroom();

  const handleUpdateClassroom = (payload: ClassroomSchema) => {
    updateClassroom(
      {
        classroomId: classroom.id,
        payload,
      },
      {
        onSuccess: () => {
          setEditOpenDialog(false);
        },
      },
    );
  };

  const handleLeaveClassroom = () => {
    leaveClassroom(classroom.id, {
      onSuccess: () => {
        setOpenLeaveConfirmDialog(false);
        navigate("/classrooms");
      },
    });
  };

  const handleDeleteClassroom = () => {
    deleteClassroom(classroom.id, {
      onSuccess: () => {
        setDeleteOpenDialog(false);
        navigate("/classrooms");
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* ── Group 1: Join Code ── */}

          {isClassroomOwner(classroom.teacher_id) && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Invite
                </DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setShareOpen(true)}>
                  <Share2 data-icon="inline-start" />
                  Share join link
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* ── Group 2: Classroom Settings ── */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Manage
                </DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setEditOpenDialog(true)}>
                  <Pencil data-icon="inline-start" />
                  Edit classroom
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onManageStudents?.(classroom)}
                >
                  <Users data-icon="inline-start" />
                  Manage students
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* ── Group 3: Content ── */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Content
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to={`/classrooms/${classroom.id}/exams/create`}>
                    <ClipboardList data-icon="inline-start" />
                    Create exam
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* ── Group 4: Danger Zone ── */}
          <DropdownMenuGroup>
            <LeaveClassroomDropdownMenuItem
              classroom={classroom}
              onLeaveClassroom={() => setOpenLeaveConfirmDialog(true)}
            />
            {isClassroomOwner(classroom.teacher_id) && (
              <DropdownMenuItem
                onSelect={() => setDeleteOpenDialog(true)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="stroke-destructive" />
                Delete classroom
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Share Dialog — rendered outside the menu so it survives menu unmount ── */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        classroom={classroom}
      />

      {/* Edit classroom dialog */}
      <EditClassroomDialog
        open={openEditDialog}
        onOpenChange={setEditOpenDialog}
      >
        <ClassroomForm
          onClose={() => setEditOpenDialog(false)}
          onSubmit={handleUpdateClassroom}
          loading={isUpdating}
          classroom={classroom}
        />
      </EditClassroomDialog>

      {/* ── Leave Classroom Confirm Dialog ── */}
      <AppConfirmDialog
        loading={isLeaving}
        variant="destructive"
        open={openLeaveConfirmDialog}
        onOpenChange={(open) => {
          if (!isLeaving) setOpenLeaveConfirmDialog(open);
        }}
        title="You are about to leave this classroom"
        description="Are you sure you want to leave this classroom? You will no longer be able to access the classroom or its content."
        onConfirm={handleLeaveClassroom}
      />

      {/* Delete classroom dialog */}
      <AppConfirmDialog
        variant="destructive"
        loading={isDeleting}
        open={openDeleteDialog}
        onOpenChange={setDeleteOpenDialog}
        onConfirm={handleDeleteClassroom}
      />
    </>
  );
}

type ShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: Classroom;
};
function ShareDialog({ open, onOpenChange, classroom }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const joinUrl = buildJoinUrl(classroom.code);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      toast.success("Join link copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share classroom</DialogTitle>
          <DialogDescription>
            Send this link to students so they can join{" "}
            <span className="font-medium text-foreground">
              {classroom.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* ── Join code badge ── */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2">
            <span className="text-xs text-muted-foreground">Join code</span>
            <span className="font-mono font-semibold tracking-widest text-foreground">
              {classroom.code}
            </span>
          </div>

          {/* ── URL row ── */}
          <div className="flex gap-2">
            <Input
              readOnly
              value={joinUrl}
              className="font-mono text-sm"
              onFocus={(e) => e.target.select()}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy join link"
            >
              {copied ? <Check className="text-green-500" /> : <Copy />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type LeaveClassroomDropdownMenuItemProps = {
  classroom: Classroom;
  onLeaveClassroom?: (classroom: Classroom) => void;
};
function LeaveClassroomDropdownMenuItem({
  classroom,
  onLeaveClassroom,
}: LeaveClassroomDropdownMenuItemProps) {
  const { data, isPending } = useQuery(getClassroomDetailOptions(classroom.id));
  const { isStudentOfClassroom } = useUserPermissions();

  if (isPending) return <Skeleton className="h-5" />;

  if (data && !isStudentOfClassroom(data)) return null;

  return (
    <DropdownMenuItem
      onSelect={() => onLeaveClassroom?.(classroom)}
      className="text-destructive focus:text-destructive focus:bg-destructive/10"
    >
      <DoorOpen className="stroke-destructive" />
      Leave classroom
    </DropdownMenuItem>
  );
}
