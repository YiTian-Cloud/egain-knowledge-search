import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const headersObj: Record<string, string> = {};
  req.headers.forEach((v, k) => (headersObj[k] = v));

  return NextResponse.json({
    ok: true,
    method: "GET",
    url: req.url,
    headers: headersObj,
  });
}
