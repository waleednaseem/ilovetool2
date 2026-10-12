import { COLLECTIONS } from "@/lib/db/collections";
import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

export async function GET() {
  await connection();
  try {
    const db = await getDb();
    const runs = await db
      .collection(COLLECTIONS.toolRuns)
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return NextResponse.json({
      ok: true,
      count: runs.length,
      runs: runs.map(({ _id, ...rest }) => ({ id: String(_id), ...rest })),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connection();
  try {
    const body = (await req.json()) as {
      family?: string;
      slug?: string;
      toolId?: string;
      title?: string;
      source?: string;
    };
    if (!body.slug && !body.toolId) {
      return NextResponse.json(
        { ok: false, error: "slug or toolId required" },
        { status: 400 }
      );
    }
    const db = await getDb();
    const doc = {
      family: body.family || "unknown",
      slug: body.slug || body.toolId?.split(":").pop() || "",
      toolId: body.toolId || `${body.family}:${body.slug}`,
      title: body.title || null,
      source: body.source || "app",
      createdAt: new Date(),
    };
    const result = await db.collection(COLLECTIONS.toolRuns).insertOne(doc);
    return NextResponse.json({ ok: true, id: String(result.insertedId) });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
