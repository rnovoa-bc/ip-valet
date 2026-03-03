import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  console.log("Received session creation request");
  const { computerId, duration } = await request.json();

  const now = Math.floor(Date.now() / 1000);
  const endTime = now + duration * 3600;

  const result = db
    .prepare(
      `
    INSERT INTO sessions (computer_id, start_time, end_time)
    VALUES (?, ?, ?)
    RETURNING id, computer_id, start_time, end_time;
    `,
    )
    .run(computerId, now, endTime);

  if (result.changes === 0) {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }

  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const { sessionId } = await request.json();

  const now = Math.floor(Date.now() / 1000);
  let sql: string;

  const result = db
    .prepare(
      `
    UPDATE sessions
    SET ended_at = ?
    WHERE id = ? AND ended_at IS NULL
    RETURNING id, computer_id, start_time, end_time, ended_at;
    `,
    )
    .run(now, sessionId);

  if (result.changes === 0) {
    return NextResponse.json(
      { error: "Session not found or already ended" },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
