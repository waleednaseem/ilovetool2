import { COLLECTIONS } from "@/lib/db/collections";
import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

export async function GET() {
  await connection();
  try {
    const db = await getDb();
    const docs = await db
      .collection(COLLECTIONS.favorites)
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();
    return NextResponse.json({
      ok: true,
      favorites: docs.map((d) => d.toolId as string),
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
      toolId?: string;
      action?: "add" | "remove";
    };
    if (!body.toolId) {
      return NextResponse.json({ ok: false, error: "toolId required" }, { status: 400 });
    }
    const db = await getDb();
    const col = db.collection(COLLECTIONS.favorites);
    if (body.action === "remove") {
      await col.deleteOne({ toolId: body.toolId });
    } else {
      await col.updateOne(
        { toolId: body.toolId },
        { $set: { toolId: body.toolId, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
