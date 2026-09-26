import { NextResponse } from 'next/server';
import { twilioClient, VERIFY_SERVICE_SID, formatToE164 } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Phone number is required' } },
        { status: 400 }
      );
    }

    const formattedPhone = formatToE164(phone);

    let userExists = false;
    try {
      const client = await import('@/lib/mongodb').then(m => m.default);
      const db = client.db();
      const userDoc = await db.collection('users').findOne({ phone: formattedPhone });
      if (userDoc && userDoc.name && userDoc.name.toLowerCase() !== 'traveler') {
        userExists = true;
      }
    } catch (e) {
      console.warn('Failed to check user existence:', e);
    }

    if (!twilioClient || !VERIFY_SERVICE_SID) {
      console.warn('Twilio credentials not configured; in mock development mode');
      return NextResponse.json({ data: { sent: true, mock: true, userExists } });
    }

    try {
      const verification = await twilioClient.verify.v2
        .services(VERIFY_SERVICE_SID)
        .verifications.create({
          to: formattedPhone,
          channel: 'sms',
        });

      return NextResponse.json({
        data: {
          sent: true,
          status: verification.status,
          userExists,
        },
      });
    } catch (twilioErr: any) {
      console.error('Twilio Verify Send Error:', twilioErr);
      
      // Twilio error 60203: Max send attempts reached / throttled
      if (twilioErr.status === 429 || twilioErr.code === 60203) {
        return NextResponse.json(
          { error: { code: 'RATE_LIMITED', message: 'Too many OTP requests. Please wait a few minutes before trying again.' } },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: { code: 'TWILIO_ERROR', message: twilioErr.message || 'Failed to send OTP' } },
        { status: twilioErr.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('API Send OTP Error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: error.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
