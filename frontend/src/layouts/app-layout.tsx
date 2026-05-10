import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  Bell,
  Settings,
  Search,
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Classrooms", href: "/classrooms", icon: Users },
  { name: "Exams", href: "/exams", icon: FileText },
  { name: "Messages", href: "/messages", icon: MessageSquare },
];

export function AppLayout() {
  const location = useLocation();
  const [user] = useState({
    name: "John Teacher",
    email: "teacher@exampulse.com",
    avatar: null,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center gap-4 mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-semibold">ExamPulse</span>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 ml-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Enter your search request..."
                className="pl-8"
              />
            </div>

            {/* Icons */}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Avatar */}
            <Avatar>
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
