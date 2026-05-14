import { format } from "date-fns";

export function buildJoinUrl(joinCode: string) {
  const APP_URL = import.meta.env.VITE_PUBLIC_APP_URL;
  return `${APP_URL}/classrooms/join/${joinCode}`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatDate(iso: string | number | Date | undefined) {
  if (!iso) return "—";
  return format(new Date(iso), "MMM d, yyyy · h:mm a");
}
