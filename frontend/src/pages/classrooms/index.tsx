import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClassroomsQueryOptions } from "@/features/classrooms/query";
import ClassroomListSkeleton from "./components/classroom-list-skeleton";
import ClassroomList from "./components/classroom-list";
import CreateClassroomDialog from "./components/dialogs/create-classroom-dialog";
import { useState } from "react";
import ClassroomForm from "./components/classroom-form";
import { useCreateClassroom } from "@/features/classrooms/hooks/use-classroom";
import type { ClassroomSchema } from "@/features/classrooms/type";
import ClassroomDropdownMenu from "./components/classroom-dropdown";
import ClassroomsEmpty from "./components/classroom-empty";
import { useUserPermissions } from "@/features/auth/hooks/use-user-permissions";
import JoinDialog from "./components/dialogs/join-classroom.dialog";

export default function Classrooms() {
  const { user, hasPermission } = useUserPermissions();
  const { data, isPending, isError, error } = useQuery(
    getClassroomsQueryOptions(),
  );

  const [openCreateDialog, setCreateOpenDialog] = useState(false);
  const [createClassroom, isCreating] = useCreateClassroom();

  const handleCreateClassroom = (payload: ClassroomSchema) => {
    createClassroom(payload, {
      onSuccess: () => {
        setCreateOpenDialog(false);
      },
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classrooms</h1>
          <p className="text-muted-foreground">
            Manage your classrooms and students
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasPermission("teacher") && (
            <Button onClick={() => setCreateOpenDialog(true)}>
              <Plus className="size-4" />
              Create Classroom
            </Button>
          )}
          <JoinDialog />
        </div>
      </div>

      {isPending ? (
        /* Pending State */
        <ClassroomListSkeleton listCount={9} />
      ) : isError ? (
        /* Error State */
        <p>{error.message}</p>
      ) : !data.data.length ? (
        /* Empty State */
        <ClassroomsEmpty
          role={user!.role}
          onCreateClassroom={() => setCreateOpenDialog(true)}
        />
      ) : (
        /* Classroom List */
        <ClassroomList
          classrooms={data.data}
          action={(classroom) => {
            return (
              <ClassroomDropdownMenu classroom={classroom}>
                <Button
                  className="md:group-hover:visible md:invisible"
                  variant="ghost"
                  size="icon"
                  aria-label="Classroom actions"
                >
                  <MoreHorizontal />
                </Button>
              </ClassroomDropdownMenu>
            );
          }}
        ></ClassroomList>
      )}

      {/* Create classroom dialog */}
      <CreateClassroomDialog
        open={openCreateDialog}
        onOpenChange={setCreateOpenDialog}
      >
        <ClassroomForm
          onClose={() => setCreateOpenDialog(false)}
          onSubmit={handleCreateClassroom}
          loading={isCreating}
        />
      </CreateClassroomDialog>
    </div>
  );
}
