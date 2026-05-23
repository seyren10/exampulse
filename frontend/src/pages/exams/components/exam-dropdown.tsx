"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, ListPlus, Radio } from "lucide-react";
import type { Exam } from "@/features/exams/type";

type Props = {
  exam: Exam;
};

export default function ExamDropdownMenu({ exam }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Exam actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {/* ── Group 1: Session — live only ── */}
        {exam.type === "live" && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Session
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Radio data-icon="inline-start" className="text-destructive" />
                Start live session
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        {/* ── Group 2: Content ── */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Content
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <ListPlus data-icon="inline-start" />
            Manage questions
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* ── Group 3: Settings ── */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Settings
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Pencil data-icon="inline-start" />
            Edit exam
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* ── Group 4: Danger ── */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 data-icon="inline-start" />
            Delete exam
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
