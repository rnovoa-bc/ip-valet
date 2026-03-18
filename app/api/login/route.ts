import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  const pinHash = process.env.CONSOLE_PIN || "";
  console.log("Received login attempt with PIN:", pin);
  console.log("Expected PIN hash:", pinHash);

  const isValid = await bcrypt.compare(pin, pinHash);

  if (!isValid) {
    return NextResponse.json({ error: "Invàlid PIN" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("library-auth", "1", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true if using https
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return res;
}
