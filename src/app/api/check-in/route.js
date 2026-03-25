import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Vendor from '@/models/Vendor';

export async function POST(request) {
  try {
    await dbConnect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Search in both collections
    let attendee = await Registration.findOne({ id });
    let type = 'visitor';

    if (!attendee) {
      attendee = await Vendor.findOne({ id });
      type = 'vendor';
    }

    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }

    if (attendee.checkedIn) {
      return NextResponse.json({ 
        error: 'Already Checked In', 
        attendee: {
          name: attendee.name || attendee.companyName,
          checkInTime: attendee.checkInTime
        }
      }, { status: 409 });
    }

    // Update check-in status
    attendee.checkedIn = true;
    attendee.checkInTime = new Date();
    await attendee.save();

    return NextResponse.json({
      success: true,
      type,
      name: attendee.name || attendee.companyName,
      checkInTime: attendee.checkInTime
    });

  } catch (err) {
    console.error('Check-in Error:', err);
    return NextResponse.json({ error: err.message || 'Check-in failed' }, { status: 500 });
  }
}

export async function GET(request) {
    try {
      await dbConnect();
      const visitorCount = await Registration.countDocuments({ checkedIn: true });
      const vendorCount = await Vendor.countDocuments({ checkedIn: true });
      
      return NextResponse.json({
        totalCheckedIn: visitorCount + vendorCount,
        visitors: visitorCount,
        vendors: vendorCount
      });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
