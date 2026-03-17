import net from "net";

export function sendCommand(host: string, port: number, command: string) {
  const client = new net.Socket();

  client.connect(port, host, () => {
    client.write(command);
    client.end();
  });

  client.on("error", (err) => {
    console.error("connection error:", err.message);
  });
}
