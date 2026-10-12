import { getDb } from "@/lib/db/mongodb";
import { connection } from "next/server";
import { NextResponse } from "next/server";

const ESIGN = "esign_requests";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  await connection();
  const { id } = await params;
  try {
    const db = await getDb();
    const doc = await db.collection(ESIGN).findOne({ id });
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    const { _id, ...rest } = doc;
    return NextResponse.json({ ok: true, request: { id: rest.id || String(_id), ...rest } });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Props) {
  await connection();
  const { id } = await params;
  try {
    const body = await req.json();
    const db = await getDb();
    const result = await db.collection(ESIGN).findOneAndUpdate(
      { id },
      { $set: { ...body, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );
    if (!result) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    const { _id, ...rest } = result;
    return NextResponse.json({ ok: true, request: { id: rest.id || String(_id), ...rest } });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
