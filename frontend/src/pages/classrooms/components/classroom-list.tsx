import { Link } from "react-router";
import { Users, ClipboardList, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Classroom } from "@/features/classrooms/type";

type Props = {
  classrooms: Classroom[];
  action?: (classroom: Classroom) => React.ReactNode;
};

export default function ClassroomList({ classrooms, action }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classrooms.map((classroom) => (
        <Card key={classroom.id} className="group flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1">
                {/* Status + code */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={classroom.is_active ? "default" : "secondary"}
                    className="gap-1 text-[10px]"
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        classroom.is_active
                          ? "bg-green-400 animate-pulse"
                          : "bg-muted-foreground"
                      }`}
                    />
                    {classroom.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                    {classroom.code}
                  </span>
                </div>

                {/* Name */}
                <Link
                  to={`/classrooms/${classroom.id}/exams`}
                  className="hover:underline underline-offset-2 decoration-muted-foreground"
                >
                  <CardTitle className="text-base leading-snug">
                    {classroom.name}
                  </CardTitle>
                </Link>
              </div>

              {/* Action slot */}
              {action && <div className="shrink-0">{action(classroom)}</div>}
            </div>

            {/* Description */}
            <CardDescription className="line-clamp-2 text-xs leading-relaxed">
              {classroom.description || "No description provided."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <Separator className="mb-3" />

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  {classroom.students_count}
                  <span className="hidden sm:inline">students</span>
                </span>
                <span className="flex items-center gap-1">
                  <ClipboardList className="size-3.5" />
                  {classroom.exams_count}
                  <span className="hidden sm:inline">exams</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Zap className="size-3" />
                {formatDistanceToNow(new Date(classroom.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
