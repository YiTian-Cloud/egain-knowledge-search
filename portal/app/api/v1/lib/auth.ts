import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-change-me";

export type AuthClaims = {
  sub: string;
  tenantId?: string;
  roles?: string[];
};

export function getBearerToken(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}



export function requireAuth(req: Request): AuthClaims {
  const authHeader = req.headers.get("authorization");
  const token = getBearerToken(req);

  // Server-side debug (shows in terminal running `npm run dev`)
  console.log("[auth] authorization header:", authHeader);
  console.log("[auth] token present:", Boolean(token));

  if (!token) {
    throw new Error("MISSING_TOKEN");
  }

  try {
    const claims = jwt.verify(token, JWT_SECRET) as AuthClaims;
    console.log("[auth] verified claims:", claims);
    return claims;
  } catch (e: any) {
    console.log("[auth] verify failed:", e?.message ?? e);
    throw new Error("INVALID_TOKEN");
  }
}

export type BearerAuthOk = { ok: true; claims: AuthClaims };
export type BearerAuthErr = {
  ok: false;
  status: number;
  code: string;
  message: string;
};

export type BearerAuthResult = BearerAuthOk | BearerAuthErr;

// ✅ Type guard — this makes TS narrow correctly everywhere
export function isBearerAuthErr(x: BearerAuthResult): x is BearerAuthErr {
  return x.ok === false;
}

export function requireBearer(req: Request): BearerAuthResult {
  try {
    const claims = requireAuth(req);
    return { ok: true, claims }; // ok:true literal
  } catch (err: any) {
    const code = String(err?.message ?? "UNAUTHORIZED");

    if (code === "MISSING_TOKEN") {
      return { ok: false, status: 401, code, message: "Missing Bearer token" };
    }
    if (code === "INVALID_TOKEN") {
      return { ok: false, status: 401, code, message: "Invalid Bearer token" };
    }
    return { ok: false, status: 401, code: "UNAUTHORIZED", message: "Unauthorized" };
  }
}

