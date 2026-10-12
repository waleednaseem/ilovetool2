import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

const RECENT = "recent";
const MAX = 24;

export async function GET() {
  await connection();
  try {
    const db = await getDb();
    const docs = await db
      .collection(RECENT)
      .find({})
      .sort({ updatedAt: -1 })
      .limit(MAX)
      .toArray();
    return NextResponse.json({
      ok: true,
      recent: docs.map((d) => d.toolId as string),
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
    const body = (await req.json()) as { toolId?: string };
    if (!body.toolId) {
      return NextResponse.json({ ok: false, error: "toolId required" }, { status: 400 });
    }
    const db = await getDb();
    await db.collection(RECENT).updateOne(
      { toolId: body.toolId },
      { $set: { toolId: body.toolId, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
