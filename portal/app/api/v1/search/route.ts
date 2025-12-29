import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const claims = requireAuth(req);

    // (optional) echo claims in response for debugging
    // console.log("[search] claims:", claims);

    return NextResponse.json({
      ok: true,
      message: "Authorized",
      whoami: claims,
      // return whatever fake search response you want
      results: [],
    });
  } catch (e: any) {
    const code = e?.message === "MISSING_TOKEN" ? "MISSING_TOKEN" : "INVALID_TOKEN";

    return NextResponse.json(
      {
        error: {
          code,
          message:
            code === "MISSING_TOKEN"
              ? "No Authorization: Bearer <token> header found"
              : "Bearer token invalid/expired",
          requestId: "req_debug",
        },
        debug: {
          gotAuthorizationHeader: Boolean(req.headers.get("authorization")),
          authorizationHeader: req.headers.get("authorization") ?? null,
        },
      },
      { status: 401 }
    );
  }
}
