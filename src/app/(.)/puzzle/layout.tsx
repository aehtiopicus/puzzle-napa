import { Button } from "@/components/ui/button";
import { PuzzleLogo } from "@/components/ui/puzzle-logo";
import Link from "next/link";

const PuzzleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Site Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="px-10 mx-auto w-full flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center space-x-2.5 transition-opacity hover:opacity-90"
            >
              <PuzzleLogo className="w-7 h-7 text-primary" />
              <span className="text-xl font-bold tracking-tight text-foreground/90">
                PieceMaker
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground/80">
              <Link
                href="/puzzle/gallery"
                className="hover:text-primary transition-colors"
              >
                Gallery
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Templates
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Features
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default PuzzleLayout;
