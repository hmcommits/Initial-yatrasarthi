import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { proofRef, confirmType } = body; // 'self-reported' | 'vendor-verified'

    const client = await clientPromise;
    const db = client.db();

    // Mark action as confirmed
    await db.collection('actions').updateOne(
      { id }, // or _id depending on schema
      { $set: { state: 'completed', confirmType, proofRef, confirmedAt: new Date() } }
    );

    // In a real flow, this triggers the cascade/re-eval to turn trip status back to 'healthy'
    // if all recovery actions are complete.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to confirm action', error);
    return NextResponse.json({ error: 'Failed to confirm action' }, { status: 500 });
  }
}
