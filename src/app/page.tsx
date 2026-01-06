import { Button } from "@/components/ui/button";
import { Puzzle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted">
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <Puzzle className="w-16 h-16" />
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-6 bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
          Puzzle Creator
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Transform any image into a beautiful jigsaw puzzle. Upload your
          photos, choose the number of pieces, and create custom puzzles with
          randomly generated organic shapes.
        </p>

        <div className="flex gap-4 justify-center items-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/puzzle/create">Create Puzzle</Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-lg mb-2">Easy Upload</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to upload any image. Supports JPG, PNG, and
              WebP formats.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-lg mb-2">Custom Pieces</h3>
            <p className="text-sm text-muted-foreground">
              Choose from 4 to 100 puzzle pieces. Perfect for beginners or
              experts.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-lg mb-2">Random Generation</h3>
            <p className="text-sm text-muted-foreground">
              Organic jigsaw-like shapes with tabs and blanks for authentic
              puzzle experience.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
