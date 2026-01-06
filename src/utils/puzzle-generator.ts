import { PuzzlePattern } from "./puzzle-config";

export interface PuzzleLine {
  path: string; // SVG path
  type: "vertical" | "horizontal";
}

interface Point {
  x: number;
  y: number;
}

type Segment =
  | { type: "L"; p: Point }
  | { type: "C"; cp1: Point; cp2: Point; p: Point }
  | { type: "M"; p: Point };

/**
 * Generate deterministic direction based on piece coordinates
 */
function generateDeterministicDirection(
  row: number,
  col: number,
  edgeIndex: number
): number {
  const hash = (row * 73 + col * 149 + edgeIndex * 211) % 2;
  return hash === 0 ? 1 : -1;
}

export function generatePuzzleLines(
  imageWidth: number,
  imageHeight: number,
  pieceCount: number,
  pattern: PuzzlePattern = "classic"
): PuzzleLine[] {
  const lines: PuzzleLine[] = [];
  const { cols, rows, pieceWidth, pieceHeight } = calculateGridDimensions(
    imageWidth,
    imageHeight,
    pieceCount
  );

  // Generate vertical lines (columns)
  for (let i = 1; i < cols; i++) {
    const x = i * pieceWidth;
    const segments: Segment[] = [{ type: "M", p: { x, y: 0 } }];

    for (let j = 0; j < rows; j++) {
      const yStart = j * pieceHeight;
      const yEnd = (j + 1) * pieceHeight;

      const tabSegments = generateVerticalTabSegments(
        x,
        yStart,
        yEnd,
        pieceHeight,
        pattern,
        j,
        i
      );
      segments.push(...tabSegments);
    }

    // Ensure we finish at the bottom
    segments.push({ type: "L", p: { x, y: imageHeight } });

    lines.push({ path: serializeSegments(segments), type: "vertical" });
  }

  // Generate horizontal lines (rows)
  for (let i = 1; i < rows; i++) {
    const y = i * pieceHeight;
    const segments: Segment[] = [{ type: "M", p: { x: 0, y } }];

    for (let j = 0; j < cols; j++) {
      const xStart = j * pieceWidth;
      const xEnd = (j + 1) * pieceWidth;

      const tabSegments = generateHorizontalTabSegments(
        y,
        xStart,
        xEnd,
        pieceWidth,
        pattern,
        i,
        j
      );
      segments.push(...tabSegments);
    }

    // Ensure we finish at the right
    segments.push({ type: "L", p: { x: imageWidth, y } });

    lines.push({ path: serializeSegments(segments), type: "horizontal" });
  }

  return lines;
}

/**
 * Generates a closed SVG path for a specific puzzle piece.
 */
export function generatePiecePath(
  row: number,
  col: number,
  imageWidth: number,
  imageHeight: number,
  pieceCount: number,
  pattern: PuzzlePattern
): string {
  const { cols, rows, pieceWidth, pieceHeight } = calculateGridDimensions(
    imageWidth,
    imageHeight,
    pieceCount
  );

  const x = col * pieceWidth;
  const y = row * pieceHeight;
  const w = pieceWidth;
  const h = pieceHeight;

  const segments: Segment[] = [{ type: "M", p: { x, y } }];

  // TOP EDGE
  if (row === 0) {
    segments.push({ type: "L", p: { x: x + w, y } });
  } else {
    // Shared horizontal line row with segment col
    const edge = generateHorizontalTabSegments(
      y,
      x,
      x + w,
      w,
      pattern,
      row,
      col
    );
    // Include tail
    edge.push({ type: "L", p: { x: x + w, y } });
    segments.push(...edge);
  }

  // RIGHT EDGE
  if (col === cols - 1) {
    segments.push({ type: "L", p: { x: x + w, y: y + h } });
  } else {
    // Shared vertical line col+1 with segment row
    const edge = generateVerticalTabSegments(
      x + w,
      y,
      y + h,
      h,
      pattern,
      row,
      col + 1
    );
    // Include tail
    edge.push({ type: "L", p: { x: x + w, y: y + h } });
    segments.push(...edge);
  }

  // BOTTOM EDGE (Reversed)
  if (row === rows - 1) {
    segments.push({ type: "L", p: { x, y: y + h } });
  } else {
    // Shared horizontal line row+1 with segment col
    const edge = generateHorizontalTabSegments(
      y + h,
      x,
      x + w,
      w,
      pattern,
      row + 1,
      col
    );
    // Include tail
    edge.push({ type: "L", p: { x: x + w, y: y + h } });

    // Reverse logic: The edge goes Left -> Right. We need Right -> Left.
    // Start point of edge is (x, y+h). End point is (x+w, y+h).
    // We are currently at (x+w, y+h). We need to go to (x, y+h).
    segments.push(...reverseSegments(edge, { x, y: y + h }));
  }

  // LEFT EDGE (Reversed)
  if (col === 0) {
    segments.push({ type: "L", p: { x, y } });
  } else {
    // Shared vertical line col with segment row
    const edge = generateVerticalTabSegments(x, y, y + h, h, pattern, row, col);
    // Include tail
    edge.push({ type: "L", p: { x, y: y + h } });

    // Reverse logic: Edge goes Top -> Bottom (y -> y+h). We need Bottom -> Top.
    // Start point of edge is (x, y). End point is (x, y+h).
    // We are currently at (x, y+h). We need to go to (x, y).
    segments.push(...reverseSegments(edge, { x, y }));
  }

  // Close path
  // (Optional, as the last point should be x,y)

  return serializeSegments(segments) + " Z";
}

function calculateGridDimensions(
  width: number,
  height: number,
  pieceCount: number
) {
  let cols = Math.round(Math.sqrt(pieceCount));
  cols = Math.max(2, cols);
  let rows = Math.round(pieceCount / cols);
  rows = Math.max(2, rows);

  // Correction to exact count? No, logic in original reused these.
  const pieceWidth = width / cols;
  const pieceHeight = height / rows;

  return { cols, rows, pieceWidth, pieceHeight };
}

function serializeSegments(segments: Segment[]): string {
  return segments
    .map((s) => {
      if (s.type === "M") return `M ${s.p.x} ${s.p.y}`;
      if (s.type === "L") return `L ${s.p.x} ${s.p.y}`;
      if (s.type === "C")
        return `C ${s.cp1.x} ${s.cp1.y}, ${s.cp2.x} ${s.cp2.y}, ${s.p.x} ${s.p.y}`;
      return "";
    })
    .join(" ");
}

/**
 * Reverses a list of segments.
 * @param segments Forward segments
 * @param startPoint The point where the forward path technically starts
 * @param endPoint The point where the forward path technically ends
 */
function reverseSegments(segments: Segment[], startPoint: Point): Segment[] {
  const reversed: Segment[] = [];

  // Create a quick lookup of "current point" logic
  // Forward: P0 -> Seg1 -> P1 -> Seg2 -> P2 ... -> Pn
  // Reverse: Pn -> Rev(Segn) -> ... -> Rev(Seg1) -> P0

  // We need to know the start point of each segment to reverse it.
  // Reconstruct points:
  const points: Point[] = [startPoint];
  for (const s of segments) {
    points.push(s.p);
  }

  // points[0] is start. points[len-1] should match endPoint.

  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    const segmentStart = points[i];
    // The reversed segment connects points[i+1] (current in reverse) to points[i]

    if (s.type === "L") {
      reversed.push({ type: "L", p: segmentStart });
    } else if (s.type === "C") {
      reversed.push({
        type: "C",
        cp1: s.cp2, // Control points swapped
        cp2: s.cp1,
        p: segmentStart, // Goal is original start
      });
    }
  }

  return reversed;
}

// ------ SEGMENT GENERATORS ------

function generateVerticalTabSegments(
  x: number,
  yStart: number,
  yEnd: number,
  segmentHeight: number,
  pattern: PuzzlePattern,
  row: number,
  col: number
): Segment[] {
  const yMid = yStart + segmentHeight / 2;
  const direction = generateDeterministicDirection(row, col, 0);
  const tabSize = segmentHeight * 0.2;
  const tabWidth = tabSize * 0.8;

  switch (pattern) {
    case "classic":
      return generateClassicVerticalSegments(
        x,
        yStart,
        yEnd,
        yMid,
        segmentHeight,
        tabWidth,
        tabSize,
        direction
      );
    case "rounded":
      return generateRoundedVerticalSegments(
        x,
        yStart,
        yEnd,
        yMid,
        tabWidth,
        direction
      );
    case "angular":
      return generateAngularVerticalSegments(
        x,
        yStart,
        yEnd,
        yMid,
        segmentHeight,
        tabWidth,
        direction
      );
    case "wave":
      return generateWaveVerticalSegments(
        x,
        yStart,
        yEnd,
        yMid,
        segmentHeight,
        tabWidth,
        direction
      );
  }
}

function generateHorizontalTabSegments(
  y: number,
  xStart: number,
  xEnd: number,
  segmentWidth: number,
  pattern: PuzzlePattern,
  row: number,
  col: number
): Segment[] {
  const xMid = xStart + segmentWidth / 2;
  const direction = generateDeterministicDirection(row, col, 1);
  const tabSize = segmentWidth * 0.2;
  const tabHeight = tabSize * 0.8;

  switch (pattern) {
    case "classic":
      return generateClassicHorizontalSegments(
        y,
        xStart,
        xEnd,
        xMid,
        segmentWidth,
        tabHeight,
        tabSize,
        direction
      );
    case "rounded":
      return generateRoundedHorizontalSegments(
        y,
        xStart,
        xEnd,
        xMid,
        tabHeight,
        direction
      );
    case "angular":
      return generateAngularHorizontalSegments(
        y,
        xStart,
        xEnd,
        xMid,
        segmentWidth,
        tabHeight,
        direction
      );
    case "wave":
      return generateWaveHorizontalSegments(
        y,
        xStart,
        xEnd,
        xMid,
        segmentWidth,
        tabHeight,
        direction
      );
  }
}

// --- IMPLEMENTATIONS ---

function generateClassicVerticalSegments(
  x: number,
  yStart: number,
  yEnd: number,
  yMid: number,
  segmentHeight: number,
  tabWidth: number,
  tabSize: number,
  direction: number
): Segment[] {
  return [
    { type: "L", p: { x, y: yStart + segmentHeight * 0.3 } },
    {
      type: "C",
      cp1: {
        x: x + tabWidth * 0.5 * direction,
        y: yStart + segmentHeight * 0.35,
      },
      cp2: { x: x + tabWidth * direction, y: yMid - tabSize * 0.3 },
      p: { x: x + tabWidth * direction, y: yMid },
    },
    {
      type: "C",
      cp1: { x: x + tabWidth * direction, y: yMid + tabSize * 0.3 },
      cp2: {
        x: x + tabWidth * 0.5 * direction,
        y: yEnd - segmentHeight * 0.35,
      },
      p: { x, y: yEnd - segmentHeight * 0.3 },
    },
  ];
}

function generateClassicHorizontalSegments(
  y: number,
  xStart: number,
  xEnd: number,
  xMid: number,
  segmentWidth: number,
  tabHeight: number,
  tabSize: number,
  direction: number
): Segment[] {
  return [
    { type: "L", p: { x: xStart + segmentWidth * 0.3, y } },
    {
      type: "C",
      cp1: {
        x: xStart + segmentWidth * 0.35,
        y: y + tabHeight * 0.5 * direction,
      },
      cp2: { x: xMid - tabSize * 0.3, y: y + tabHeight * direction },
      p: { x: xMid, y: y + tabHeight * direction },
    },
    {
      type: "C",
      cp1: { x: xMid + tabSize * 0.3, y: y + tabHeight * direction },
      cp2: {
        x: xEnd - segmentWidth * 0.35,
        y: y + tabHeight * 0.5 * direction,
      },
      p: { x: xEnd - segmentWidth * 0.3, y },
    },
  ];
}

function generateRoundedVerticalSegments(
  x: number,
  yStart: number,
  yEnd: number,
  yMid: number,
  tabWidth: number,
  direction: number
): Segment[] {
  // Approximate circle with cubic beziers (kappa = 0.5522847...)
  const r = tabWidth;

  const startY = yMid - r;
  const endY = yMid + r;

  const segments: Segment[] = [{ type: "L", p: { x, y: startY } }];

  // Arc 1: (x, startY) to (x + r*dir, yMid)
  segments.push({
    type: "C",
    cp1: { x: x + r * 0.1 * direction, y: startY + r * 0.5 },
    cp2: { x: x + r * 0.8 * direction, y: yMid - r * 0.2 },
    p: { x: x + r * direction, y: yMid },
  });

  // Arc 2: (x + r*dir, yMid) -> (x, yMid+r)
  segments.push({
    type: "C",
    cp1: { x: x + r * direction, y: yMid + r * 0.2 },
    cp2: { x: x + r * 0.1 * direction, y: endY - r * 0.5 },
    p: { x, y: endY },
  });

  return segments;
}

function generateRoundedHorizontalSegments(
  y: number,
  xStart: number,
  xEnd: number,
  xMid: number,
  tabHeight: number,
  direction: number
): Segment[] {
  const r = tabHeight;
  const startX = xMid - r;
  const endX = xMid + r;

  const segments: Segment[] = [{ type: "L", p: { x: startX, y } }];

  // Approx quarter circles again
  segments.push({
    type: "C",
    cp1: { x: startX + r * 0.5, y: y + r * 0.1 * direction },
    cp2: { x: xMid - r * 0.2, y: y + r * 0.8 * direction },
    p: { x: xMid, y: y + r * direction },
  });

  segments.push({
    type: "C",
    cp1: { x: xMid + r * 0.2, y: y + r * direction },
    cp2: { x: endX - r * 0.5, y: y + r * 0.1 * direction },
    p: { x: endX, y },
  });

  return segments;
}

function generateAngularVerticalSegments(
  x: number,
  yStart: number,
  yEnd: number,
  yMid: number,
  segmentHeight: number,
  tabWidth: number,
  direction: number
): Segment[] {
  return [
    { type: "L", p: { x, y: yStart + segmentHeight * 0.35 } },
    {
      type: "L",
      p: { x: x + tabWidth * direction, y: yStart + segmentHeight * 0.35 },
    },
    {
      type: "L",
      p: { x: x + tabWidth * direction, y: yEnd - segmentHeight * 0.35 },
    },
    { type: "L", p: { x, y: yEnd - segmentHeight * 0.35 } },
  ];
}

function generateAngularHorizontalSegments(
  y: number,
  xStart: number,
  xEnd: number,
  xMid: number,
  segmentWidth: number,
  tabHeight: number,
  direction: number
): Segment[] {
  return [
    { type: "L", p: { x: xStart + segmentWidth * 0.35, y } },
    {
      type: "L",
      p: { x: xStart + segmentWidth * 0.35, y: y + tabHeight * direction },
    },
    {
      type: "L",
      p: { x: xEnd - segmentWidth * 0.35, y: y + tabHeight * direction },
    },
    { type: "L", p: { x: xEnd - segmentWidth * 0.35, y } },
  ];
}

function generateWaveVerticalSegments(
  x: number,
  yStart: number,
  yEnd: number,
  yMid: number,
  segmentHeight: number,
  tabWidth: number,
  direction: number
): Segment[] {
  const segments: Segment[] = [
    { type: "L", p: { x, y: yStart + segmentHeight * 0.25 } },
  ];

  const amplitude = tabWidth * direction;
  const waveHeight = segmentHeight * 0.5;
  const steps = 4;

  // Re-implement the loop from original string generation
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const y = yStart + segmentHeight * 0.25 + waveHeight * t;
    const xOffset = amplitude * Math.sin(t * Math.PI);

    const prevT = (i - 1) / steps;
    const prevY = yStart + segmentHeight * 0.25 + waveHeight * prevT;
    const prevXOffset = amplitude * Math.sin(prevT * Math.PI);

    const cp1x = x + prevXOffset + amplitude * Math.cos(prevT * Math.PI) * 0.3;
    const cp1y = prevY + (waveHeight / steps) * 0.33;
    const cp2x = x + xOffset - amplitude * Math.cos(t * Math.PI) * 0.3;
    const cp2y = y - (waveHeight / steps) * 0.33;

    segments.push({
      type: "C",
      cp1: { x: cp1x, y: cp1y },
      cp2: { x: cp2x, y: cp2y },
      p: { x: x + xOffset, y },
    });
  }

  return segments;
}

function generateWaveHorizontalSegments(
  y: number,
  xStart: number,
  xEnd: number,
  xMid: number,
  segmentWidth: number,
  tabHeight: number,
  direction: number
): Segment[] {
  const segments: Segment[] = [
    { type: "L", p: { x: xStart + segmentWidth * 0.25, y } },
  ];

  const amplitude = tabHeight * direction;
  const waveWidth = segmentWidth * 0.5;
  const steps = 4;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = xStart + segmentWidth * 0.25 + waveWidth * t;
    const yOffset = amplitude * Math.sin(t * Math.PI);

    const prevT = (i - 1) / steps;
    const prevX = xStart + segmentWidth * 0.25 + waveWidth * prevT;
    const prevYOffset = amplitude * Math.sin(prevT * Math.PI);

    const cp1x = prevX + (waveWidth / steps) * 0.33;
    const cp1y = y + prevYOffset + amplitude * Math.cos(prevT * Math.PI) * 0.3;
    const cp2x = x - (waveWidth / steps) * 0.33;
    const cp2y = y + yOffset - amplitude * Math.cos(t * Math.PI) * 0.3;

    segments.push({
      type: "C",
      cp1: { x: cp1x, y: cp1y },
      cp2: { x: cp2x, y: cp2y },
      p: { x, y: y + yOffset },
    });
  }

  return segments;
}
