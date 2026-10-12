import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

export async function GET() {
  await connection();
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name);
    const counts: Record<string, number> = {};
    for (const name of names) {
      if (name === "local") continue;
      counts[name] = await db.collection(name).countDocuments();
    }
    return NextResponse.json({
      ok: true,
      database: db.databaseName,
      collections: names,
      counts,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "DB connection failed",
      },
      { status: 500 }
    );
  }
}
