import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    // Mock response that follows the API contract
    return NextResponse.json({
      data: {
        members: [
          { memberId: 'm1', name: 'Tanvi', currentLeg: 'IndiGo 6E-204', status: 'on_track' },
          { memberId: 'm2', name: 'Priya', currentLeg: 'Vande Bharat Express', status: 'at_risk' },
        ],
        sharedNodes: [
          { nodeId: 'n_shared', label: 'Goa airport cab', sharedByCount: 4 }
        ],
        weakestLinkMemberId: 'm2'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch group' }, { status: 500 });
  }
}
