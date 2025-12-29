import { NextRequest, NextResponse } from "next/server";
import { requireBearer } from "../../lib/auth";

export async function POST(req: NextRequest) {
  const auth = requireBearer(req);
  if (!auth.ok) {
    return NextResponse.json(
      { error: { code: auth.code, message: auth.message, requestId: crypto.randomUUID() } },
      { status: auth.status }
    );
  }

  const body = await req.json().catch(() => ({}));
  const events = Array.isArray(body?.events) ? body.events : [];

  // Minimal validation
  let accepted = 0;
  let rejected = 0;
  const rejectionReasons: any[] = [];

  events.forEach((e: any, idx: number) => {
    if (!e?.eventId || !e?.type || !e?.timestamp) {
      rejected++;
      rejectionReasons.push({
        index: idx,
        code: "INVALID_EVENT",
        message: "eventId, type, timestamp are required",
      });
      return;
    }
    accepted++;
  });

  return NextResponse.json(
    {
      requestId: crypto.randomUUID(),
      accepted,
      rejected,
      rejectionReasons,
    },
    { status: 202 }
  );
}
