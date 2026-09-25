import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateRecoveryOptions } from '@/lib/recoveryRanker';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    const [nodes, edges, trip] = await Promise.all([
      db.collection('nodes').find({ tripId: id }).toArray(),
      db.collection('edges').find({ tripId: id }).toArray(),
      db.collection('trips').findOne({ _id: new ObjectId(id) })
    ]);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // In a real app, we'd pass the specific broken node id
    // For now, we mock it.
    const brokenNodeId = nodes.find((n: any) => n.status === 'broken')?.id || 'mock-id';
    
    // @ts-ignore
    const options = generateRecoveryOptions(id, nodes, edges, brokenNodeId);

    return NextResponse.json({ recoveryOptions: options });
  } catch (error) {
    console.error('Failed to get recovery options', error);
    return NextResponse.json({ error: 'Failed to get recovery options' }, { status: 500 });
  }
}
