import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Users,
  ClipboardList,
  Zap,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ClassroomDropdownMenu from "../components/classroom-dropdown";
import { getClassroomDetailOptions } from "@/features/classrooms/query";
import ClassroomDetailSkeleton from "./components/skeleton";
import StatusBadge from "./components/status-badge";
import { initials } from "@/lib/helpers";
import NotFound from "./components/not-found";
import { useClassroomIdLoaderData } from "@/features/classrooms/hooks/use-classrooms-loader-data";
import { Link, Outlet } from "react-router";
import { useState } from "react";

export default function ClassroomDetail() {
  const classroomId = useClassroomIdLoaderData();
  const [activeTab, setActiveTab] = useState("exams");
  const {
    data: classroom,
    isPending,
    isError,
  } = useQuery(getClassroomDetailOptions(classroomId));

  if (isPending) return <ClassroomDetailSkeleton />;

  if (isError) {
    return <NotFound />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* ── Back ── */}
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        onClick={() => window.history.back()}
      >
        <ArrowLeft data-icon="inline-start" />
        Classrooms
      </Button>

      {/* ── Header Card ── */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge isActive={classroom.is_active} />
                <span className="font-mono text-xs text-muted-foreground">
                  {classroom.code}
                </span>
              </div>

              <CardTitle className="text-2xl leading-tight">
                {classroom.name}
              </CardTitle>

              {classroom.description && (
                <CardDescription className="text-sm leading-relaxed whitespace-pre-wrap">
                  {classroom.description}
                </CardDescription>
              )}
            </div>

            {/* Actions menu */}
            <ClassroomDropdownMenu classroom={classroom}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Classroom actions"
              >
                <MoreHorizontal />
              </Button>
            </ClassroomDropdownMenu>
          </div>

          <Separator className="mt-4" />

          {/* ── Meta row ── */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Avatar className="size-5">
                <AvatarFallback className="text-[10px]">
                  {initials(classroom.teacher?.name)}
                </AvatarFallback>
              </Avatar>
              {classroom.teacher?.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4" />
              {classroom.students?.length ?? 0} student
              {classroom.students?.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <ClipboardList className="size-4" />
              {classroom.exams?.length ?? 0} exam
              {classroom.exams?.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5 ml-auto">
              <Zap className="size-4" />
              Created{" "}
              {formatDistanceToNow(new Date(classroom.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="exams" className="gap-1.5" asChild>
              <Link to="exams" replace>
                <ClipboardList className="size-4" />
                Exams
                {classroom.exams?.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 px-1.5 text-[10px]"
                  >
                    {classroom.exams.length}
                  </Badge>
                )}
              </Link>
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-1.5" asChild>
              <Link to="students" replace>
                <Users className="size-4" />
                Students
                {classroom.students?.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 px-1.5 text-[10px]"
                  >
                    {classroom.students.length}
                  </Badge>
                )}
              </Link>
            </TabsTrigger>
          </TabsList>

          {activeTab === "exams" && (
            <Button size="sm" asChild>
              <Link to={`/classrooms/${classroom.id}/exams/create`}>
                <Zap data-icon="inline-start" />
                New exam
              </Link>
            </Button>
          )}
        </div>

        <Outlet />
      </Tabs>
    </div>
  );
}
