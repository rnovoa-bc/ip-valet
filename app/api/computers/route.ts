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

async function updateComputerStatus(computerId: number, enabled: boolean) {
  const result = db
    .prepare(
      `
    UPDATE computers
    SET enabled = ?
    WHERE id = ?
    RETURNING id, name, ip, description, enabled;
    `,
    )
    .run(enabled ? 1 : 0, computerId);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Computer not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const { computerId, enabled } = await request.json();
  return updateComputerStatus(computerId, enabled);
}
