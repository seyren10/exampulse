import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router";

type Props = {
  classroomId: number;
};
export default function ExamEmpty({ classroomId }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
      <ClipboardList className="size-10 opacity-30" />
      <p className="text-sm">No exams yet.</p>
      <Button size="sm" variant="outline" asChild>
        <Link to={`/classrooms/${classroomId}/exams/create`}>
          Create your first exam
        </Link>
      </Button>
    </div>
  );
}
