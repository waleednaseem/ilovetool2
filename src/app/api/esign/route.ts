import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

const ESIGN = "esign_requests";

export async function GET() {
  await connection();
  try {
    const db = await getDb();
    const docs = await db
      .collection(ESIGN)
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    return NextResponse.json({
      ok: true,
      requests: docs.map(({ _id, ...rest }) => ({
        id: rest.id || String(_id),
        ...rest,
      })),
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
    const id = body.id || `req_${Date.now()}`;
    const doc = {
      id,
      title: body.title || "Signature request",
      message: body.message || "",
      signers: body.signers || [],
      slots: body.slots || [],
      status: body.status || "pending",
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const db = await getDb();
    await db.collection(ESIGN).updateOne({ id }, { $set: doc }, { upsert: true });
    return NextResponse.json({ ok: true, id, request: doc });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
