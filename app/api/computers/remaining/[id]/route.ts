import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type RemainingRow = {
  end_time: number;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const computerId = parseInt(id, 10);

  const now = Math.floor(Date.now() / 1000);
  const remaining = db
    .prepare(
      `
        SELECT s.end_time
        FROM sessions s
        WHERE s.computer_id = ?
          AND s.end_time > ?
          AND s.ended_at IS NULL
  `,
    )
    .get(computerId, now) as RemainingRow;

  if (!remaining) {
    return NextResponse.json({ remaining: 0 });
  }
  const remainingMinutes = Math.floor((remaining.end_time - now) / 60); // convert to minutes
  return NextResponse.json({ remaining: remainingMinutes });
}
