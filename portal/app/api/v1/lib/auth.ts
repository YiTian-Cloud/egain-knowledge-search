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
