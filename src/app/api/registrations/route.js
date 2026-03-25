import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event';
import { sendTicketEmail } from '@/lib/mail';

export async function GET(request) {
  try {
    await dbConnect();
    const registrations = await Registration.find({}).sort({ timestamp: -1 });
    return NextResponse.json(registrations);
  } catch (err) {
    console.error('Registration GET Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const newRegistration = await Registration.create(data);
    
    // Attempt to send email confirmation
    try {
      const event = await Event.findOne({ id: data.eventId }) || await Event.findOne({});
      if (event) {
        await sendTicketEmail(newRegistration, event);
      }
    } catch (mailErr) {
      console.error('Mail Sending Error:', mailErr);
      // We don't want to fail the registration if only the email fails
    }

    return NextResponse.json(newRegistration);
  } catch (err) {
    console.error('Registration POST Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create registration' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { id, updatedData } = await request.json();
    const registration = await Registration.findOneAndUpdate(
      { id: id },
      { $set: updatedData },
      { new: true }
    );
    
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: registration });
  } catch (err) {
    console.error('Registration PUT Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update registration' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    const result = await Registration.findOneAndDelete({ id: id });
    
    if (!result) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Registration DELETE Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete registration' }, { status: 500 });
  }
}
