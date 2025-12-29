import { NextRequest, NextResponse } from "next/server";
import { requireBearer, isBearerAuthErr } from "../../lib/auth";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
 const auth = requireBearer(req);

if (isBearerAuthErr(auth)) {
  return NextResponse.json(
    {
      error: {
        code: auth.code,
        message: auth.message,
        requestId: crypto.randomUUID(),
      },
    },
    { status: auth.status }
  );
}


  const { id } = await ctx.params;
  const now = new Date().toISOString();

  return NextResponse.json({
    id,
    title: `Demo Article ${id}`,
    content: `Demo content for article ${id}.`,
    category: "Troubleshooting",
    tags: ["Demo", "Swagger"],
    relevanceScore: 0.88,
    createdDate: now,
    lastUpdated: now,
    viewCount: 42,
  });
}
