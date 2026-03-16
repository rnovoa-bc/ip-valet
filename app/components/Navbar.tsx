"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    fetch("/api/logout", {
      method: "POST",
    })
      .then(() => {
        router.push("/login");
      })
      .catch((err) => {
        alert("Error logging out");
      });
  };
  return (
    <div className="w-full h-16 text-black dark:text-white flex justify-between items-center">
      <div className="ml-4 font-bold text-lg">
        <img src="/bc.svg" alt="Logo" className="h-14" />
      </div>
      <div className="mr-4">
        <h2 className="text-4xl font-bold">
          IP Valet <span className="text-2xl">(Gestió d'accès a Internet)</span>
        </h2>
      </div>
      <div className="mr-4">
        <div className="flex justify-end items-end">
          {pathname !== "/login" && (
            <button className="cursor-pointer" onClick={logout}>
              Sortir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
