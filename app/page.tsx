"use client";
import { useState, useEffect, use } from "react";
import {
  SquarePower,
  ScreenShare,
  ScreenShareOff,
  X,
  RefreshCcw,
} from "lucide-react";
import { Button } from "./components/Button";

interface Computer {
  id: number;
  name: string;
  ip: string;
  description: string;
  enabled: boolean;
  available: boolean;
  remaining?: number;
}

export default function Home() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    fetch("/api/computers")
      .then((res) => res.json())
      .then((data) => {
        setComputers(data);
        data.forEach((pc: Computer) => {
          if (pc.enabled && !pc.available) {
            fetch(`/api/computers/remaining/${pc.id}`)
              .then((res) => res.json())
              .then((data) => {
                const remaining = data.remaining;

                setComputers((prev) =>
                  prev.map((p) => (p.id === pc.id ? { ...p, remaining } : p)),
                );
              })
              .catch((err) =>
                console.error(
                  `Error fetching remaining time for computer ${pc.id}:`,
                  err,
                ),
              );
          }
        });
      })
      .catch((err) => console.error("Error fetching computers:", err));
  }, [renderTrigger]);

  const fetchRemainingTime = async (computerId: number) => {
    return fetch(`/api/computers/remaining/${computerId}`)
      .then((res) => res.json())
      .then((data) => {
        const remaining = data.remaining;
        console.log(
          `Remaining time for computer ${computerId}: ${remaining} minutes`,
        );
        setComputers((prev) =>
          prev.map((pc) => (pc.id === computerId ? { ...pc, remaining } : pc)),
        );
        return remaining;
      })
      .catch((err) => {
        console.error("Error fetching remaining time:", err);
        return 0;
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setComputers((prev) => {
        prev.forEach((pc) => {
          if (pc.enabled && !pc.available) {
            fetchRemainingTime(pc.id);
          }
        });
        setRenderTrigger((prev) => prev + 1);
        return prev;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const lend = (id: number, ip: string) => {
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
    fetchRemainingTime(id);
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

  const updateComputerStatus = (id: number, enabled: boolean) => {
    fetch("/api/computers", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ computerId: id, enabled }),
    })
      .then((res) => res.json())
      .then(() => setRenderTrigger((prev) => prev + 1))
      .catch((err) => console.error("Error updating computer status:", err));
  };

  const updateComputerEndTime = (id: number) => {
    fetch("/api/sessions/renew", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ computerId: id }),
    })
      .then((res) => res.json())
      .then(() => setRenderTrigger((prev) => prev + 1))
      .catch((err) => console.error("Error updating computer status:", err));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-10 mb-10">
        Ordinadors d'OPAC
      </h1>

      <table className="min-w-full border border-zinc-200 text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b">
              Nom
            </th>
            <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b">
              IP
            </th>
            <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b">
              Descripció
            </th>
            <th className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b">
              Temps restant
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
              <td className="px-4 py-2 border-b">{pc.remaining || ""}</td>
              <td className="px-4 py-2 border-b">
                <div className="flex justify-end gap-2 m-2">
                  {pc.enabled ? (
                    <>
                      {pc.available ? (
                        <>
                          <Button
                            variant="blue"
                            onClick={() => lend(pc.id, pc.ip)}
                          >
                            <ScreenShare size={24} /> Llogar 1h
                          </Button>
                          <Button
                            variant="zinc"
                            onClick={() => updateComputerStatus(pc.id, false)}
                          >
                            <X size={24} /> Deshabilitar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="blue"
                            onClick={() => updateComputerEndTime(pc.id)}
                          >
                            <RefreshCcw size={24} /> Renovar 1h
                          </Button>
                          <Button variant="zinc" onClick={() => cancel(pc.id)}>
                            <ScreenShareOff size={24} /> Tancar
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        variant="green"
                        onClick={() => {
                          cancel(pc.id);
                          updateComputerStatus(pc.id, true);
                        }}
                      >
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
