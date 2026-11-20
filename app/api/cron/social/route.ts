import { NextResponse } from "next/server";

import { dispatchWorkflow, isAuthorized } from "@/lib/dispatch";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    await dispatchWorkflow("social.yml");

    return NextResponse.json({ ok: true, workflow: "social.yml" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error).slice(0, 300) },
      { status: 502 },
    );
  }
}
