import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tripId, optionId, memberId } = body;

    const client = await clientPromise;
    const db = client.db();

    const action = {
      id: `action_${id}_${Date.now()}`,
      tripId,
      state: 'proposed',
      confirmType: 'self-reported',
      optionId,
      proposedBy: memberId,
      createdAt: new Date()
    };

    await db.collection('actions').insertOne(action);

    // Broadcast via realtime channel here (Person 5 logic)
    
    return NextResponse.json({ success: true, action }, { status: 201 });
  } catch (error) {
    console.error('Failed to propose action', error);
    return NextResponse.json({ error: 'Failed to propose action' }, { status: 500 });
  }
}
