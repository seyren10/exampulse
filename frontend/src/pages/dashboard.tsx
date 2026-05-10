import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, MapPin, Clock, ChevronDown, ArrowRight, FileText } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content - Left Column (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Income Tracker Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <CardTitle>Income Tracker</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                Week
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Track changes in income over time and access detailed data on each project and payments received
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Chart Area */}
            <div className="relative h-64">
              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <div className="text-3xl font-bold">+20%</div>
                <p className="text-sm text-muted-foreground">
                  This week's income is higher than last week's
                </p>
              </div>

              {/* Simple Bar Chart */}
              <div className="absolute bottom-0 right-0 flex h-48 items-end gap-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 bg-muted rounded-t"
                      style={{
                        height: `${[40, 60, 100, 80, 90, 70, 85][i]}%`,
                      }}
                    />
                    {i === 3 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs text-background">
                        $2,567
                      </div>
                    )}
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm">
                      {day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Let's Connect Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Let's Connect</CardTitle>
              <Button variant="ghost" size="sm">
                See all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Connection Item */}
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>RG</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Randy Gouse</span>
                    <Badge variant="destructive">Senior</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Cybersecurity specialist</p>
                </div>
                <Button size="icon" variant="outline">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>GS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Giana Schleifer</span>
                    <Badge>Middle</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">UX/UI Designer</p>
                </div>
                <Button size="icon" variant="outline">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar (1/3) */}
      <div className="space-y-6">
        {/* Recent Projects */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Your Recent Projects</h3>
            <Button variant="ghost" size="sm">
              See all Project
            </Button>
          </div>

          <div className="space-y-3">
            {/* Project Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Web Development Project</CardTitle>
                      <p className="text-sm text-muted-foreground">$10/hour</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary">Remote</Badge>
                  <Badge variant="secondary">Part-time</Badge>
                  <Badge>Paid</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This project involves implementing both frontend and backend functionalities, as well as integrating with third-party APIs.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Germany
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    2h ago
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Copyright Project</CardTitle>
                      <p className="text-sm text-muted-foreground">$10/hour</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Not Paid</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Web Design Project</CardTitle>
                      <p className="text-sm text-muted-foreground">$10/hour</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Badge>Paid</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Unlock Premium */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Unlock Premium Features</CardTitle>
            <CardDescription>
              Get access to exclusive benefits and expand your freelancing opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Upgrade now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Proposal Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Proposal Progress</CardTitle>
              <Button variant="outline" size="sm">
                April 11, 2024
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Proposals sent</p>
                <p className="text-2xl font-bold">64</p>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="h-8 w-0.5 bg-muted" />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interviews</p>
                <p className="text-2xl font-bold">12</p>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-0.5"
                      style={{
                        backgroundColor: i < 5 ? 'hsl(var(--destructive))' : 'hsl(var(--muted))',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hires</p>
                <p className="text-2xl font-bold">10</p>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="h-8 w-0.5 bg-foreground" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}