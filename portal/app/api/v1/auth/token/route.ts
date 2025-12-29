import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs"; // jwt uses node crypto

const DEMO_CLIENT_ID = process.env.DEMO_CLIENT_ID ?? "demo";
const DEMO_CLIENT_SECRET = process.env.DEMO_CLIENT_SECRET ?? "demo-secret";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-change-me";

function corsHeaders(origin: string | null) {
  // For dev only. In prod, restrict to your domains.
  const allowOrigin = origin ?? "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-Id, X-Tenant-Id, Idempotency-Key",
  };
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Invalid JSON body", requestId: "req_demo" } },
      { status: 400, headers }
    );
  }

  const clientId = String(body?.clientId ?? "");
  const clientSecret = String(body?.clientSecret ?? "");

  if (clientId !== DEMO_CLIENT_ID || clientSecret !== DEMO_CLIENT_SECRET) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Invalid credentials", requestId: "req_demo" } },
      { status: 401, headers }
    );
  }

  // Minimal claims; add tenant/roles to match your API expectations.
  const token = jwt.sign(
    { sub: "demo-user", tenantId: "demo-tenant", roles: ["admin"] },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return NextResponse.json(
  {
    access_token: token,
    token_type: "Bearer",
    expires_in: 3600,

    // optional aliases (nice for your own UI)
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: 3600,
  },
  { status: 200, headers }
);



}
