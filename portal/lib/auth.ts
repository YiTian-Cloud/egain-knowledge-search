// portal/lib/auth.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET ?? "suepr-long-dev-secret";

type RequireAuthResult =
  | { ok: true; claims: any }
  | { ok: false; response: NextResponse };

export function requireAuth(req: Request): RequireAuthResult {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Missing Bearer token", requestId: "req_demo" } },
        { status: 401 }
      ),
    };
  }

  try {
    const claims = jwt.verify(token, JWT_SECRET);
    return { ok: true, claims };
  } catch (e: any) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: `Invalid token: ${e?.message ?? "verify failed"}`,
            requestId: "req_demo",
          },
        },
        { status: 401 }
      ),
    };
  }
}
