import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Student } from "@/features/auth/type";
import { initials } from "@/lib/helpers";
import { formatDistanceToNow } from "date-fns";
import { GraduationCap } from "lucide-react";

type Props = {
  students: Student[];
};
export default function StudentsTab({ students = [] }: Props) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <GraduationCap className="size-10 opacity-30" />
        <p className="text-sm">No students have joined yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {students.map((student) => (
        <div
          key={student.id}
          className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40"
        >
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="text-xs font-semibold">
              {initials(student.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{student.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {student.email}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">Joined</p>
            <p className="text-xs font-medium">
              {student.pivot?.joined_at
                ? formatDistanceToNow(new Date(student.pivot.joined_at), {
                    addSuffix: true,
                  })
                : "—"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
