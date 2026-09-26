import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    const tripId = id; // Or new ObjectId(id) if trip ids are ObjectIds in nodes/edges

    const [trip, nodes, edges] = await Promise.all([
      db.collection('trips').findOne({ _id: new ObjectId(tripId) }),
      db.collection('nodes').find({ tripId }).toArray(),
      db.collection('edges').find({ tripId }).toArray()
    ]);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const mappedNodes = nodes.map(n => ({ ...n, id: n._id.toString() }));
    const mappedEdges = edges.map(e => ({ ...e, id: e._id.toString() }));

    return NextResponse.json({
      healthScore: trip.healthScore,
      status: trip.status,
      nodes: mappedNodes,
      edges: mappedEdges
    });
  } catch (error) {
    console.error('Failed to fetch graph', error);
    return NextResponse.json({ error: 'Failed to fetch graph' }, { status: 500 });
  }
}
