import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ReactNode } from "react";
import type { Classroom } from "@/features/classrooms/type";

type Props = {
  classrooms: Classroom[];
  action?: (classroom: Classroom) => ReactNode;
};
export default function ClassroomList({ classrooms, action }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classrooms.map((classroom) => (
        <Card key={classroom.id} className="group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{classroom.name}</CardTitle>
              <div>{action?.(classroom)}</div>
            </div>
            <CardDescription>{classroom.description || "-"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {classroom.students_count} students enrolled
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
