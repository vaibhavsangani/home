import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Vendor from '@/models/Vendor';
import Event from '@/models/Event';

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Basic Counts
    const totalVisitors = await Registration.countDocuments({});
    const totalVendors = await Vendor.countDocuments({});
    const checkedInCount = await Registration.countDocuments({ checkedIn: true }) + await Vendor.countDocuments({ checkedIn: true });

    // 2. Registration Trends (Last 7 Days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentRegs = await Registration.find({ timestamp: { $gte: sevenDaysAgo } });
    
    const dailyStats = {};
    for (let i = 0; i < 7; i++) {
        const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        dailyStats[date] = 0;
    }

    recentRegs.forEach(reg => {
        const date = new Date(reg.timestamp).toISOString().split('T')[0];
        if (dailyStats[date] !== undefined) dailyStats[date]++;
    });

    const trendData = Object.entries(dailyStats).map(([date, count]) => ({ date, count })).reverse();

    // 3. Category Breakdown (Vendors)
    const vendors = await Vendor.find({});
    const categories = {};
    vendors.forEach(v => {
        const cat = v.businessCategory || v.category || 'Other';
        categories[cat] = (categories[cat] || 0) + 1;
    });

    return NextResponse.json({
      summary: {
        visitors: totalVisitors,
        vendors: totalVendors,
        checkedIn: checkedInCount,
        revenue: registrationsToRevenue(recentRegs) // Placeholder for revenue logic
      },
      trends: trendData,
      categories: Object.entries(categories).map(([name, value]) => ({ name, value }))
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function registrationsToRevenue(regs) {
    // Assuming 49 per paid ticket
    const count = regs.filter(r => r.ticketType === 'paid' && r.status === 'confirmed').length;
    return count * 49;
}
