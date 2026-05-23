import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { Outlet } from "react-router";
export default function FullscreenLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6 mx-auto">
        <TooltipProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </TooltipProvider>
      </main>
    </div>
  );
}
