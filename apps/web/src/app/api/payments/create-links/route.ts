import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { tripId, actionId, payers } = await request.json();
    
    const client = await clientPromise;
    const db = client.db();

    const paymentLinks = payers.map((payer: any) => {
      // Mock Razorpay test-mode link creation
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 9)}`;
      return {
        id: mockPaymentId,
        tripId,
        actionId,
        memberId: payer.memberId,
        amount: payer.amount,
        status: 'pending',
        paymentUrl: `https://test.razorpay.com/pay/${mockPaymentId}`,
        createdAt: new Date()
      };
    });

    await db.collection('payments').insertMany(paymentLinks);

    return NextResponse.json({ success: true, links: paymentLinks }, { status: 201 });
  } catch (error) {
    console.error('Failed to create payment links', error);
    return NextResponse.json({ error: 'Failed to create payment links' }, { status: 500 });
  }
}
