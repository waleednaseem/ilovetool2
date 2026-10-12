import { getAllCatalogTools } from "@/lib/catalog";
import { COLLECTIONS } from "@/lib/db/collections";
import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

/** Inserts one tool_run (+ converter_run for convert family) per catalog tool. */
export async function POST() {
  await connection();
  try {
    const db = await getDb();
    const tools = getAllCatalogTools();
    const now = new Date();

    const toolDocs = tools.map((t) => ({
      family: t.family,
      slug: t.slug,
      toolId: `${t.family}:${t.slug}`,
      title: t.title,
      source: "seed-run-all",
      createdAt: now,
    }));

    const toolResult = await db.collection(COLLECTIONS.toolRuns).insertMany(toolDocs);

    const converterTools = tools.filter((t) => t.family === "convert");
    let converterInserted = 0;
    if (converterTools.length) {
      const converterDocs = converterTools.map((t) => ({
        slug: t.slug,
        title: t.title,
        input: 10,
        output: "seed",
        createdAt: now,
      }));
      const c = await db
        .collection(COLLECTIONS.converterRuns)
        .insertMany(converterDocs);
      converterInserted = c.insertedCount;
    }

    // Sample favorites from featured tools
    const favs = tools
      .filter((t) => t.featured)
      .slice(0, 8)
      .map((t) => ({
        toolId: `${t.family}:${t.slug}`,
        updatedAt: now,
      }));
    if (favs.length) {
      const col = db.collection(COLLECTIONS.favorites);
      for (const f of favs) {
        await col.updateOne(
          { toolId: f.toolId },
          { $set: f },
          { upsert: true }
        );
      }
    }

    await db.collection(COLLECTIONS.appEvents).insertOne({
      type: "seed-run-all",
      toolRuns: toolResult.insertedCount,
      converterRuns: converterInserted,
      favorites: favs.length,
      createdAt: now,
    });

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      ok: true,
      database: db.databaseName,
      inserted: {
        toolRuns: toolResult.insertedCount,
        converterRuns: converterInserted,
        favorites: favs.length,
      },
      collections: collections.map((c) => c.name),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Seed failed" },
      { status: 500 }
    );
  }
}
