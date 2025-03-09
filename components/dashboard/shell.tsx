import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/dashboard/user-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-6">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                DeFi Sentiment Trader
              </span>
            </a>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                Analytics
              </Button>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ModeToggle />
              <UserNav />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 px-6 space-y-8">{children}</div>
      </main>
    </div>
  );
}
