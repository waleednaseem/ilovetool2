import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

const JOBS = "pdf_jobs";
const USAGE = "usage_daily";

export async function GET(req: Request) {
  await connection();
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const db = await getDb();
    const filter = status ? { status } : {};
    const jobs = await db
      .collection(JOBS)
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return NextResponse.json({
      ok: true,
      count: jobs.length,
      jobs: jobs.map(({ _id, ...rest }) => ({ id: String(_id), ...rest })),
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
    const body = await req.json();
    if (!body.slug) {
      return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    }
    const db = await getDb();
    const doc = {
      slug: body.slug as string,
      title: (body.title as string) || body.slug,
      status: (body.status as string) || "queued",
      files: (body.files as { name: string; size: number; type: string }[]) || [],
      note: (body.note as string) || null,
      source: (body.source as string) || "app",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection(JOBS).insertOne(doc);

    const day = new Date().toISOString().slice(0, 10);
    await db.collection(USAGE).updateOne(
      { day, slug: body.slug },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, id: String(result.insertedId), job: doc });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
