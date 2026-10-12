import { getClientPdfTools, pdfTools } from "@/lib/pdf/registry";
import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

/** Seeds DB-only features: queued stub jobs, sample esign, recent, favorites. */
export async function POST() {
  await connection();
  try {
    const db = await getDb();
    const now = new Date();
    const stubs = pdfTools.filter((t) => t.mode === "stub");

    const jobs = stubs.map((t) => ({
      slug: t.slug,
      title: t.title,
      status: "queued",
      files: [{ name: `sample-${t.slug}.pdf`, size: 1024, type: "application/pdf" }],
      note: "Seeded queue for API processing",
      source: "seed-db-features",
      createdAt: now,
      updatedAt: now,
    }));
    const jobResult = await db.collection("pdf_jobs").insertMany(jobs);

    const esign = {
      id: `req_seed_${Date.now()}`,
      title: "Seed signature request",
      message: "Please sign",
      signers: [{ name: "Waleed", email: "waleed@example.com" }],
      slots: [],
      status: "pending",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    await db.collection("esign_requests").insertOne(esign);

    const clients = getClientPdfTools().slice(0, 10);
    for (const t of clients) {
      const toolId = `pdf:${t.slug}`;
      await db.collection("recent").updateOne(
        { toolId },
        { $set: { toolId, updatedAt: now } },
        { upsert: true }
      );
      await db.collection("favorites").updateOne(
        { toolId },
        { $set: { toolId, updatedAt: now } },
        { upsert: true }
      );
    }

    await db.collection("app_events").insertOne({
      type: "seed-db-features",
      pdfJobs: jobResult.insertedCount,
      esignId: esign.id,
      createdAt: now,
    });

    const names = [
      "pdf_jobs",
      "esign_requests",
      "recent",
      "favorites",
      "usage_daily",
      "tool_runs",
      "converter_runs",
      "app_events",
    ];
    const counts: Record<string, number> = {};
    for (const name of names) {
      counts[name] = await db.collection(name).countDocuments();
    }

    return NextResponse.json({
      ok: true,
      database: db.databaseName,
      insertedJobs: jobResult.insertedCount,
      esignId: esign.id,
      counts,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Seed failed" },
      { status: 500 }
    );
  }
}
