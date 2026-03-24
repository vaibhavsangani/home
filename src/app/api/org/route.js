import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Org from '@/models/Org';

export async function GET() {
  try {
    await dbConnect();
    let data = await Org.findOne({});
    if (!data) {
      data = {
        companyName: 'Didaar Exhibition',
        visionStatement: '',
        coreTeam: {
          owner: { name: '', detail: '', photo: '' },
          manager: { name: '', detail: '', photo: '' },
          company: { name: '', detail: '', photo: '' }
        },
        additionalMembers: [],
        stats: {
          visitors: '15k+',
          vendors: '500+',
          cities: '50+',
          success: '98%'
        }
      };
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Org GET Error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const newData = await request.json();
    const data = await Org.findOneAndUpdate({}, { $set: newData }, { upsert: true, new: true });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Org POST Error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
