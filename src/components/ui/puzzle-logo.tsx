import { cn } from "@/utils/cn";

interface PuzzleLogoProps {
  className?: string;
}

export function PuzzleLogo({ className }: PuzzleLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100" // Simple square viewbox
      fill="currentColor"
      className={cn("w-8 h-8 text-primary", className)}
    >
      {/* 
         A stylized representation of 2 connected puzzle pieces or a 2x2 grid.
         Let's do a simple 4-piece grid look with curved connectors.
      */}
      <path
        d="M35 20 
           H65 
           V35 
           C65 43.2843 71.7157 50 80 50 
           C71.7157 50 65 56.7157 65 65 
           V80 
           H35 
           V65 
           C35 56.7157 28.2843 50 20 50 
           C28.2843 50 35 43.2843 35 35 
           V20Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* 
        This path above is a single "Cross" shape with curves indented.
        Let's try a more distinct "interlocking" look.
        Actually, simpler is better for a logo. 
        A filled square with puzzle notches cut out/in.
      */}
      <path
        d="M20,20 h20 a10,10 0 0,0 20,0 h20 v20 a10,10 0 0,0 0,20 v20 h-20 a10,10 0 0,0 -20,0 h-20 v-20 a10,10 0 0,0 0,-20 z"
        fill="currentColor"
      />
    </svg>
  );
}
