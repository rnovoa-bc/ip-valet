import { exec } from "child_process";
import fs from "fs";
import Database from "better-sqlite3";

const dbPath = process.env.DB_PATH || "./data/library.db";

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

console.log("Session timer started");

const ipsFile = "/etc/squid/dynamic/internet-ips.txt";
let lastContent = "";

try {
  lastContent = fs.readFileSync(ipsFile, "utf8");
} catch {
  lastContent = "";
}

setInterval(() => {
  const result = db
    .prepare(
      `
        SELECT DISTINCT c.ip AS ip
        FROM sessions s
        JOIN computers c ON s.computer_id = c.id
        WHERE s.end_time > ? AND s.ended_at IS NULL
      `,
    )
    .all(Math.floor(Date.now() / 1000));

  const ips = result.map((row) => row.ip).sort();
  const content = ips.join("\n") + "\n";

  if (content === lastContent) {
    return;
  }

  lastContent = content;
  const tmpFile = ipsFile + ".tmp";
  fs.writeFileSync(tmpFile, content);
  fs.renameSync(tmpFile, ipsFile);
  exec("/usr/sbin/squid -k reconfigure", (err) => {
    if (err) {
      console.error("Failed to reload squid:", err);
    }
  });
}, 30000);
