import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  isActive?: boolean;
};
export default function StatusBadge({ isActive }: StatusBadgeProps) {
  return isActive ? (
    <Badge variant="default" className="gap-1.5">
      <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="gap-1.5">
      <span className="size-1.5 rounded-full bg-muted-foreground" />
      Inactive
    </Badge>
  );
}
