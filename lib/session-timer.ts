import { db } from "./db";

export function startSessionTimer() {
  if ((global as any)._sessionTimerStarted) return;

  (global as any)._sessionTimerStarted = true;

  console.log("Session timer started");

  const ipsFile = "/tmp/internet-ips.txt";
  let lastContent = "";

  setInterval(() => {
    console.log("Checking sessions...");

    const result = db
      .prepare(
        `
        SELECT DISTINCT c.ip AS ip
        FROM sessions s
        JOIN computers c ON s.computer_id = c.id
        WHERE s.end_time > ? AND s.ended_at IS NULL
      `,
      )
      .all(Math.floor(Date.now() / 1000)) as { ip: string }[];

    const ips = result.map((row) => row.ip).sort();
    const content = ips.join("\n") + "\n";

    console.log(`Active sessions: ${result.length}, IPs:\n${content}`);

    if (content === lastContent) {
      console.log("No changes in active sessions, skipping file write");
      return;
    }

    lastContent = content;

    const fs = require("fs");
    fs.writeFileSync(ipsFile, content);
  }, 30000);
}
