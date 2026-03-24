import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';

export async function GET(request) {
  try {
    await dbConnect();
    const vendors = await Vendor.find({}).sort({ timestamp: -1 });
    return NextResponse.json(vendors);
  } catch (err) {
    console.error('Vendor GET Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Data is now sent as Base64 strings from the frontend
    console.log('Received Vendor Data (keys):', Object.keys(data));
    const newVendor = await Vendor.create(data);
    return NextResponse.json(newVendor);
  } catch (err) {
    console.error('Vendor POST Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create vendor' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { id, updatedData } = await request.json();
    const vendor = await Vendor.findOneAndUpdate(
      { id: id },
      { $set: updatedData },
      { new: true }
    );
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: vendor });
  } catch (err) {
    console.error('Vendor PUT Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update vendor' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    const result = await Vendor.findOneAndDelete({ id: id });
    
    if (!result) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Vendor DELETE Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete vendor' }, { status: 500 });
  }
}
