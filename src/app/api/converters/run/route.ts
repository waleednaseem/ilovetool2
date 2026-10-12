import { COLLECTIONS } from "@/lib/db/collections";
import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connection();
  try {
    const body = (await req.json()) as {
      slug?: string;
      input?: number | string;
      output?: number | string;
      title?: string;
    };
    if (!body.slug) {
      return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    }
    const db = await getDb();
    const doc = {
      slug: body.slug,
      title: body.title || null,
      input: body.input ?? null,
      output: body.output ?? null,
      createdAt: new Date(),
    };
    const result = await db.collection(COLLECTIONS.converterRuns).insertOne(doc);
    return NextResponse.json({ ok: true, id: String(result.insertedId) });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connection();
  try {
    const db = await getDb();
    const runs = await db
      .collection(COLLECTIONS.converterRuns)
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
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
