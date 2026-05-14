import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Users, ClipboardList, Zap, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ClassroomDropdownMenu from "../components/classroom-dropdown";
import { getClassroomDetailOptions } from "@/features/classrooms/query";
import ClassroomDetailSkeleton from "./components/skeleton";
import StatusBadge from "./components/status-badge";
import { initials } from "@/lib/helpers";
import { ExamsTab } from "./components/exam-tab";
import StudentsTab from "./components/students-tab";
import NotFound from "./components/not-found";
import type { classroomDetailLoader } from "@/features/classrooms/loaders";
import AppConfirmDialog from "@/components/app/app-confirm-dialog";

export default function ClassroomDetail() {
  const classroomId =
    useLoaderData<Awaited<ReturnType<typeof classroomDetailLoader>>>();

  const [activeTab, setActiveTab] = useState("exams");

  const {
    data: classroom,
    isPending,
    isError,
  } = useQuery(getClassroomDetailOptions(classroomId));

  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);

  // Handlers passed to actions (wire up your dialogs here)
  const handlers = {
    onEdit: (c) => console.log("edit", c),
    onDelete: (c) => console.log("delete", c),
    onManageStudents: (c) => console.log("manage students", c),
    onCreateExam: (c) => console.log("create exam", c),
    onLeaveClassroom: (c) => console.log("leave classroom", c),
  };

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

              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="text-2xl leading-tight">
                  {classroom.name}
                </CardTitle>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpenLeaveDialog(true)}
                >
                  Leave classroom
                </Button>
              </div>

              {classroom.description && (
                <CardDescription className="text-sm leading-relaxed whitespace-pre-wrap">
                  {classroom.description}
                </CardDescription>
              )}
            </div>

            {/* Actions menu */}
            <ClassroomDropdownMenu
              classroom={classroom}
              onEdit={handlers.onEdit}
              onDelete={handlers.onDelete}
              onManageStudents={handlers.onManageStudents}
              onCreateExam={handlers.onCreateExam}
            />
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
            <TabsTrigger value="exams" className="gap-1.5">
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
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-1.5">
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
            </TabsTrigger>
          </TabsList>

          {activeTab === "exams" && (
            <Button size="sm" onClick={() => handlers.onCreateExam(classroom)}>
              <Zap data-icon="inline-start" />
              New exam
            </Button>
          )}
        </div>

        <TabsContent value="exams" className="mt-4">
          <ExamsTab
            exams={classroom.exams}
            onCreateExam={() => handlers.onCreateExam(classroom)}
          />
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          <StudentsTab students={classroom.students} />
        </TabsContent>
      </Tabs>

      {/* Leave Classroom Dialog */}
      <AppConfirmDialog
        open={openLeaveDialog}
        onOpenChange={setOpenLeaveDialog}
        variant="destructive"
        title="Leave classroom"
        description="Are you sure you want to leave this classroom? You will no longer be able to access it and its exams. You can always rejoin later."
        confirmLabel="Leave classroom"
        onConfirm={() => handlers.onLeaveClassroom(classroom)}
      />
    </div>
  );
}
