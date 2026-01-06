/**
 * Configuration for puzzle generation
 */

// Puzzle pattern types
export type PuzzlePattern = "classic" | "rounded" | "angular" | "wave";

// Pattern configuration
export const PUZZLE_PATTERNS = [
  {
    id: "classic" as const,
    name: "Classic",
    description: "Smooth curved connectors",
  },
  {
    id: "rounded" as const,
    name: "Rounded",
    description: "Circular arc tabs",
  },
  {
    id: "angular" as const,
    name: "Angular",
    description: "Sharp geometric edges",
  },
  {
    id: "wave" as const,
    name: "Wave",
    description: "Organic wave pattern",
  },
] as const;

// Allowed piece count values - these are valid grid configurations
export const ALLOWED_PIECE_COUNTS = [
  4, 6, 9, 12, 16, 20, 25, 30, 36, 42, 49, 56, 64, 72, 81, 90, 100, 110, 121,
  132, 144, 156, 169, 182, 196, 210, 225, 240, 256, 272, 289, 306, 324, 342,
  361, 380, 400, 420, 441, 462, 484, 506, 529, 552, 576, 600, 625, 650, 676,
  702, 729, 756, 784, 812, 841, 870, 900, 930, 961, 992, 1024, 1056, 1089, 1122,
  1156, 1190, 1225, 1260, 1296, 1332, 1369, 1406, 1444, 1482, 1521, 1560, 1600,
  1640, 1681, 1722, 1764, 1806, 1849, 1892, 1936, 1980, 2025, 2070, 2116, 2162,
  2209, 2256, 2304, 2352, 2401, 2450, 2500, 2550, 2601,
];
