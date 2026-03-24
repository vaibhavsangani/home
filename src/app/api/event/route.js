import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ timestamp: -1 });
    return NextResponse.json(events);
  } catch (err) {
    console.error('Event GET Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const newEventData = await request.json();
    if (!newEventData.id) {
        newEventData.id = Date.now().toString();
    }
    const event = await Event.create(newEventData);
    return NextResponse.json(event);
  } catch (err) {
    console.error('Event POST Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const updatedEventData = await request.json();
    const event = await Event.findOneAndUpdate(
      { id: updatedEventData.id },
      { $set: updatedEventData },
      { new: true }
    );
    
    if (event) {
      return NextResponse.json(event);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err) {
    console.error('Event PUT Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request) {
    try {
      await dbConnect();
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      const result = await Event.findOneAndDelete({ id: id });
      
      if (result) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    } catch (err) {
      console.error('Event DELETE Error:', err);
      return NextResponse.json({ error: err.message || 'Failed to delete event' }, { status: 500 });
    }
}
