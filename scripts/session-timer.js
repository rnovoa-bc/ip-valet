const { exec } = require("child_process");
const fs = require("fs");
const Database = require("better-sqlite3");
const net = require("net");

const dbPath = process.env.DB_PATH || "./data/library.db";

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

console.log("Session timer started");

// const ipsFile = "/etc/squid/dynamic/internet-ips.txt";
// let lastContent = "";

function sendCommand(host, port, command) {
  const client = new net.Socket();

  client.connect(port, host, () => {
    client.write(command);
    client.end();
  });

  client.on("error", (err) => {
    console.error("connection error:", err.message);
  });
}

// try {
//   lastContent = fs.readFileSync(ipsFile, "utf8");
// } catch {
//   lastContent = "";
// }

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

  const computers = db.prepare(`SELECT ip FROM computers`).all();
  for (const { ip } of computers) {
    console.log(`Checking IP: ${ip} against active sessions:`, ips);
    if (!ips.includes(ip)) {
      try {
        console.log(`Closing IP: ${ip}`);
        sendCommand(ip, 5555, "close");
      } catch (err) {
        console.error(`Failed to close IP ${ip}:`, err);
      }
    }
  }

  // const content = ips.join("\n") + "\n";

  // if (content === lastContent) {
  //   return;
  // }

  // lastContent = content;
  // const tmpFile = ipsFile + ".tmp";
  // fs.writeFileSync(tmpFile, content);
  // fs.renameSync(tmpFile, ipsFile);
  // exec("/usr/sbin/squid -k reconfigure", (err) => {
  //   if (err) {
  //     console.error("Failed to reload squid:", err);
  //   }
  // });
}, 30000);
