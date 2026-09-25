import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { TripGraph } from '@yatrasarthi/graph';
import { ObjectId } from 'mongodb';
import { Node, Edge } from '@yatrasarthi/types';

export async function POST(request: Request) {
  try {
    const { tripId, nodeId, delayMin } = await request.json();
    if (!tripId || !nodeId || delayMin == null) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // 1. Mark the reported node as delayed/broken
    await db.collection('nodes').updateOne(
      { _id: new ObjectId(nodeId) }, // or { id: nodeId } depending on schema
      { $set: { status: 'broken', delay: delayMin } }
    );

    // 2. Fetch all nodes and edges for the cascade
    const nodes = await db.collection('nodes').find({ tripId }).toArray() as unknown as Node[];
    const edges = await db.collection('edges').find({ tripId }).toArray() as unknown as Edge[];

    // 3. Build graph
    const graph = new TripGraph();
    nodes.forEach(n => graph.addNode(n.id || (n as any)._id.toString()));
    edges.forEach(e => graph.addEdge({
      from: e.fromNodeId,
      to: e.toNodeId,
      bufferMin: e.bufferMin,
      paddingMin: e.paddingMin,
      constraint: e.constraint
    }));

    // 4. Run cascade
    const startNodeId = nodes.find(n => n.id === nodeId || (n as any)._id?.toString() === nodeId)?.id || nodeId;
    const { broken, atRisk, delay } = graph.propagateDelay(startNodeId, delayMin);

    // 5. Update impacted nodes in DB
    if (broken.length > 0) {
      await db.collection('nodes').updateMany(
        { tripId, id: { $in: broken } },
        { $set: { status: 'broken' } }
      );
    }
    if (atRisk.length > 0) {
      await db.collection('nodes').updateMany(
        { tripId, id: { $in: atRisk } },
        { $set: { status: 'at_risk' } }
      );
    }

    // 6. Compute new health score (simple mock logic: 100 - broken * 20 - atRisk * 10)
    const newHealth = Math.max(0, 100 - (broken.length * 20) - (atRisk.length * 10));
    await db.collection('trips').updateOne(
      { _id: new ObjectId(tripId) },
      { $set: { healthScore: newHealth, status: 'disrupted' } }
    );

    return NextResponse.json({ success: true, cascade: { broken, atRisk, delay: Object.fromEntries(delay) }, healthScore: newHealth });
  } catch (error) {
    console.error('Failed to report disruption', error);
    return NextResponse.json({ error: 'Failed to report disruption' }, { status: 500 });
  }
}
