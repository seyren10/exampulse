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
} from "lucide-react";
import { toast } from "sonner";
import type { Classroom } from "@/features/classrooms/type";
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

type Props = PropsWithChildren & {
  classroom: Classroom;
  onEdit?: (classroom: Classroom) => void;
  onDelete?: (classroom: Classroom) => void;
  onManageStudents?: (classroom: Classroom) => void;
  onCreateExam?: (classroom: Classroom) => void;
};
export default function ClassroomDropdownMenu({
  classroom,
  onEdit,
  onDelete,
  onManageStudents,
  onCreateExam,
  children,
}: Props) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* ── Group 1: Join Code ── */}
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
            <DropdownMenuItem onSelect={() => onEdit?.(classroom)}>
              <Pencil data-icon="inline-start" />
              Edit classroom
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onManageStudents?.(classroom)}>
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
            <DropdownMenuItem onSelect={() => onCreateExam?.(classroom)}>
              <ClipboardList data-icon="inline-start" />
              Create exam
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* ── Group 4: Danger Zone ── */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => onDelete?.(classroom)}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 data-icon="inline-start" />
              Delete classroom
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Share Dialog — rendered outside the menu so it survives menu unmount ── */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        classroom={classroom}
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
