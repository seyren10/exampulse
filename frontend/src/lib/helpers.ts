export function buildJoinUrl(joinCode: string) {
  const APP_URL = import.meta.env.VITE_PUBLIC_APP_URL;
  return `${APP_URL}/classroom/join/${joinCode}`;
}
