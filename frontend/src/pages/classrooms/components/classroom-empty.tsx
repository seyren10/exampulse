import { BookOpen, GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { UserRole } from "@/features/auth/type";
import JoinDialog from "./dialogs/join-classroom.dialog";

type ClassroomEmptyProps = {
  role: UserRole;
  onCreateClassroom?: () => void;
};
export default function ClassroomsEmpty({
  role,
  onCreateClassroom,
}: ClassroomEmptyProps) {
  const isTeacher = role === "teacher";

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      {/* Icon */}
      <div className="flex size-20 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30">
        {isTeacher ? (
          <BookOpen className="size-9 text-muted-foreground/40" />
        ) : (
          <GraduationCap className="size-9 text-muted-foreground/40" />
        )}
      </div>

      {/* Copy */}
      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-semibold">
          {isTeacher ? "No classrooms yet" : "You're not in any classrooms"}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isTeacher
            ? "Create your first classroom to start adding students, scheduling exams, and running live quizzes."
            : "Ask your teacher for a room code, then join to access exams and live quiz sessions."}
        </p>
      </div>

      {/* CTA */}
      {isTeacher ? (
        <Button onClick={onCreateClassroom}>
          <Plus data-icon="inline-start" />
          Create classroom
        </Button>
      ) : (
        <JoinDialog />
      )}
    </div>
  );
}
