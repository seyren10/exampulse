import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Classrooms() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classrooms</h1>
          <p className="text-muted-foreground">Manage your classrooms and students</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Classroom
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Mathematics 101</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">35 students enrolled</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}