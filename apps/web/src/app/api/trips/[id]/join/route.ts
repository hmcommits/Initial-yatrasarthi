import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, joinCode } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const tripId = new ObjectId(id);
    const trip = await db.collection('trips').findOne({ _id: tripId });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Usually joinCode is required to join, but keeping it flexible for now
    if (trip.joinCode && joinCode && trip.joinCode !== joinCode) {
      return NextResponse.json({ error: 'Invalid join code' }, { status: 403 });
    }

    await db.collection('trips').updateOne(
      { _id: tripId },
      { $addToSet: { memberIds: userId } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to join trip', error);
    return NextResponse.json({ error: 'Failed to join trip' }, { status: 500 });
  }
}
