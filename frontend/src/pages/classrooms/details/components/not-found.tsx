import { SearchAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex flex-col items-center gap-3 py-24 text-center text-muted-foreground">
        <SearchAlert className="size-10 text-destructive/60" />
        <p className="font-medium text-foreground font-heading text-9xl">404</p>
        <p className="text-sm">Classroom doesn&apos;t exist</p>
      </div>
    </div>
  );
}
