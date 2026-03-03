"use client";
import { useState, useEffect, use } from "react";
import { SquarePower, ScreenShare, ScreenShareOff } from "lucide-react";
import { Button } from "./components/Button";

interface Computer {
  id: number;
  name: string;
  ip: string;
  description: string;
  enabled: boolean;
  available: boolean;
}

export default function Home() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    fetch("/api/computers")
      .then((res) => res.json())
      .then(setComputers)
      .catch((err) => console.error("Error fetching computers:", err));
  }, [renderTrigger]);

  const lend = (id: number) => {
    fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ computerId: id, duration: 1 }),
    })
      .then((res) => res.json())
      .then(() => setRenderTrigger((prev) => prev + 1))
      .catch((err) => console.error("Error creating session:", err));
  };

  const cancel = (id: number) => {
    fetch("/api/sessions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId: id }),
    })
      .then((res) => res.json())
      .then(() => setRenderTrigger((prev) => prev + 1))
      .catch((err) => console.error("Error ending session:", err));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-10 mb-10">
        Ordinadors OPAC-Internet
      </h1>

      <table className="min-w-full border border-zinc-200 text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b">
              Name
            </th>
            <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b">
              IP
            </th>
            <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b">
              Description
            </th>
            <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {computers.map((pc) => (
            <tr key={pc.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700">
              <td className="px-4 py-2 border-b">{pc.name}</td>
              <td className="px-4 py-2 border-b font-mono">{pc.ip}</td>
              <td className="px-4 py-2 border-b">{pc.description}</td>
              <td>
                <div className="flex justify-end gap-2 m-2">
                  {pc.enabled ? (
                    <>
                      {pc.available ? (
                        <>
                          <Button variant="blue" onClick={() => lend(pc.id)}>
                            <ScreenShare size={24} /> Llogar 1h
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="zinc" onClick={() => cancel(pc.id)}>
                            <ScreenShareOff size={24} /> Tancar
                          </Button>
                        </>
                      )}
                      <Button variant="red">
                        <SquarePower size={24} /> Deshabilita
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="green">
                        <SquarePower size={24} /> Habilita
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
