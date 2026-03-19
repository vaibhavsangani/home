import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await dbConnect();
    let admin = await Admin.findOne({});
    if (!admin) {
      // Fallback for first-time setup
      return NextResponse.json({ adminId: 'vaibhav', adminPassword: '123456789' });
    }
    return NextResponse.json(admin);
  } catch (error) {
    console.error('Admin GET Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    // Update existing or create new
    const admin = await Admin.findOneAndUpdate({}, { $set: data }, { upsert: true, new: true });
    return NextResponse.json({ success: true, admin });
  } catch (error) {
    console.error('Admin POST Error:', error);
    return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 });
  }
}
