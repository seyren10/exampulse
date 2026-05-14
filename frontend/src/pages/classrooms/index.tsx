import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClassroomsQueryOptions } from "@/features/classrooms/query";
import ClassroomListSkeleton from "./components/classroom-list-skeleton";
import ClassroomList from "./components/classroom-list";
import CreateClassroomDialog from "./components/dialogs/create-classroom-dialog";
import { useState } from "react";
import ClassroomForm from "./components/classroom-form";
import {
  useCreateClassroom,
  useDeleteClassroom,
  useUpdateClassroom,
} from "@/features/classrooms/hooks/use-classroom";
import type { Classroom, ClassroomSchema } from "@/features/classrooms/type";
import ClassroomDropdownMenu from "./components/classroom-dropdown";
import EditClassroomDialog from "./components/dialogs/edit-classroom-dialog";
import AppConfirmDialog from "@/components/app/app-confirm-dialog";
import ClassroomsEmpty from "./components/classroom-empty";
import { useUserPermissions } from "@/features/auth/hooks/use-user-permissions";

export default function Classrooms() {
  const { hasPermission, user } = useUserPermissions();
  const { data, isPending, isError, error } = useQuery(
    getClassroomsQueryOptions(),
  );

  const [openCreateDialog, setCreateOpenDialog] = useState(false);
  const [createClassroom, isCreating] = useCreateClassroom();

  const [openEditDialog, setEditOpenDialog] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null,
  );
  const [updateClassroom, isUpdating] = useUpdateClassroom();

  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [deleteClassroom, isDeleting] = useDeleteClassroom();

  const handleCreateClassroom = (payload: ClassroomSchema) => {
    createClassroom(payload, {
      onSuccess: () => {
        setCreateOpenDialog(false);
      },
    });
  };

  const handleUpdateClassroom = (payload: ClassroomSchema) => {
    if (!selectedClassroom) return;

    updateClassroom(
      {
        classroomId: selectedClassroom.id,
        payload,
      },
      {
        onSuccess: () => {
          setEditOpenDialog(false);
        },
      },
    );
  };
  const handleOpenEditDialog = (classroom: Classroom) => {
    setEditOpenDialog(true);
    setSelectedClassroom(classroom);
  };

  const handleDeleteClassroomConfirmation = (classroom: Classroom) => {
    setDeleteOpenDialog(true);
    setSelectedClassroom(classroom);
  };
  const handleDeleteClassroom = () => {
    if (!selectedClassroom) return;

    deleteClassroom(selectedClassroom.id, {
      onSuccess: () => {
        setDeleteOpenDialog(false);
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
        {hasPermission("teacher") && (
          <Button onClick={() => setCreateOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Classroom
          </Button>
        )}
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
              hasPermission("teacher") && (
                <ClassroomDropdownMenu
                  classroom={classroom}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleDeleteClassroomConfirmation}
                >
                  <Button
                    className="md:group-hover:visible md:invisible"
                    variant="ghost"
                    size="icon"
                    aria-label="Classroom actions"
                    onClick={() => setEditOpenDialog(true)}
                  >
                    <MoreHorizontal />
                  </Button>
                </ClassroomDropdownMenu>
              )
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

      {/* Edit classroom dialog */}
      {selectedClassroom !== null && (
        <EditClassroomDialog
          open={openEditDialog}
          onOpenChange={setEditOpenDialog}
        >
          <ClassroomForm
            onClose={() => setEditOpenDialog(false)}
            onSubmit={handleUpdateClassroom}
            loading={isUpdating}
            classroom={selectedClassroom}
          />
        </EditClassroomDialog>
      )}

      {/* Delete classroom dialog */}
      {selectedClassroom !== null && (
        <AppConfirmDialog
          variant="destructive"
          loading={isDeleting}
          open={openDeleteDialog}
          onOpenChange={setDeleteOpenDialog}
          onConfirm={handleDeleteClassroom}
        />
      )}
    </div>
  );
}
