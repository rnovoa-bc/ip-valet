"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pin, setPin] = useState("");

  const login = () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Invalid PIN");
        }
        return res.json();
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div
        className="flex flex-col items-center justify-center bg-zinc-300 dark:bg-zinc-700 border-2
       border-zinc-600 dark:border-zinc-400 w-100 h-60 rounded-2xl"
      >
        <h1 className="text-2xl font-bold">Introduir el PIN</h1>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") login();
          }}
          className="mt-4 p-2 rounded border border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={login}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
