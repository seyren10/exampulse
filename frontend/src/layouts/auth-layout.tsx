import { FileText } from 'lucide-react';
import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex items-center justify-center bg-muted p-8">
        <div className="max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <FileText className="h-8 w-8" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">ExamPulse</h1>
            <p className="text-muted-foreground text-lg">
              Create engaging quizzes and exams. Track student performance in real-time.
            </p>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Live Quiz Sessions</p>
                <p>Kahoot-style real-time quizzes with leaderboards</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Async Exams</p>
                <p>Scheduled exams with automatic grading</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Auto Certificates</p>
                <p>Generate certificates automatically after grading</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}