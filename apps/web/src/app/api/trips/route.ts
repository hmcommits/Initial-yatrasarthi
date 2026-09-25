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
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      ownerId: body.userId || 'demo',
      memberIds: body.userId ? [body.userId] : ['demo'],
      joinCode,
      healthScore: 100,
      status: 'healthy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    const result = await db.collection('trips').insertOne(newTrip);
    
    return NextResponse.json({ data: { id: result.insertedId.toString(), ...newTrip } }, { status: 201 });
  } catch (error) {
    console.error('Failed to create trip', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const trips = await db.collection('trips').find({}).toArray();
    
    const mapped = trips.map(t => ({ id: t._id.toString(), ...t }));
    return NextResponse.json({ data: { trips: mapped } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}
