import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request: Request) {
  const { computerId } = await request.json();
  const now = Math.floor(Date.now() / 1000);
  const result = db
    .prepare(
      `
    UPDATE sessions
    SET end_time = end_time + 3600
    WHERE computer_id = ?
      AND end_time > ?
      AND ended_at IS NULL;
    `,
    )
    .run(computerId, now);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Computer not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
