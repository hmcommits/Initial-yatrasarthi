import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Trip } from '@yatrasarthi/types';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newTrip: Omit<Trip, 'id'> & { _id?: ObjectId } = {
      name: body.name || 'New Trip',
      destination: body.destination || 'Unknown',
      dates: {
        start: body.startDate ? new Date(body.startDate) : new Date(),
        end: body.endDate ? new Date(body.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      memberIds: body.userId ? [body.userId] : [],
      joinCode,
      healthScore: 100,
      status: 'planning'
    };

    const result = await db.collection('trips').insertOne(newTrip);
    
    return NextResponse.json({ id: result.insertedId, ...newTrip }, { status: 201 });
  } catch (error) {
    console.error('Failed to create trip', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}
