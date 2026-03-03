import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full h-16 text-black dark:text-white flex justify-between items-center">
      <div className="ml-4 font-bold text-lg">
        <img src="/bc.svg" alt="Logo" className="h-14" />
      </div>
      <div className="mr-4">
        <h2 className="text-4xl font-bold">IP Valet</h2>
      </div>
      <div className="mr-4">
        <div className="flex justify-end items-end">
          <Link href="/logs">Logs</Link>
        </div>
      </div>
    </div>
  );
}
