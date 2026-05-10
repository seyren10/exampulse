import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Exams() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exams</h1>
          <p className="text-muted-foreground">Create and manage your exams</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Exam
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Midterm Exam</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">10 questions</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}