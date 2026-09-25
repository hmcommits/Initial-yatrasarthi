import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getExtractor } from '@yatrasarthi/llm';
import type { Node, NodeType } from '@yatrasarthi/types';
import { getSessionUser } from '@/lib/auth';
import { publishTripEvent } from '@/lib/realtime';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tripId = formData.get('tripId') as string;
    const text = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    if (!tripId) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'tripId is required' } }, { status: 422 });
    }

    const extractor = getExtractor();
    let extracted;

    if (file) {
      const buffer = await file.arrayBuffer();
      const imageBase64 = Buffer.from(buffer).toString('base64');
      extracted = await extractor.extractBooking({ imageBase64, mimeType: file.type });
    } else if (text) {
      extracted = await extractor.extractBooking({ text });
    } else {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'file or text is required' } }, { status: 422 });
    }

    if (!extracted || !extracted.type) {
      return NextResponse.json({ error: { code: 'EXTRACTION_FAILED', message: "We couldn't read that clearly" } }, { status: 422 });
    }

    const client = await clientPromise;
    const db = client.db();

    const sessionUser = await getSessionUser(request);
    const now = new Date().toISOString();
    const doc = {
      tripId,
      ownerId: sessionUser?.id ?? 'anonymous',
      type: extracted.type as NodeType,
      label: (extracted.fields?.vendor as string) || (extracted.fields?.from as string) || extracted.type,
      vendor: extracted.fields?.vendor as string | undefined,
      time: (extracted.fields?.time as string) || (extracted.fields?.date as string) || now,
      constraintType: 'soft' as const,
      status: 'pending_review' as const,
      rawExtract: extracted.fields,
      confidence: extracted.confidence,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('nodes').insertOne(doc);
    const node: Node = { id: result.insertedId.toString(), ...doc };

    // Publish realtime so the trip timeline updates live for all members
    await publishTripEvent(tripId, { type: 'node.created', entityId: result.insertedId.toString() });

    return NextResponse.json({ data: node }, { status: 201 });
  } catch (err) {
    console.error('ingest/upload error', err);
    return NextResponse.json({ error: { code: 'EXTRACTION_FAILED', message: "We couldn't read that clearly" } }, { status: 422 });
  }
}
