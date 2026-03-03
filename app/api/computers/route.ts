import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const now = Math.floor(Date.now() / 1000);
  const computers = db
    .prepare(
      `
    SELECT
      c.id,
      c.name,
      c.ip,
      c.description,
      c.enabled,
      NOT EXISTS (
        SELECT 1
        FROM sessions s
        WHERE s.computer_id = c.id
          AND s.end_time > ?
          AND s.ended_at IS NULL
      ) AS available
    FROM computers c
    ORDER BY c.name;
    `,
    )
    .all(now);

  return NextResponse.json(computers);
}
