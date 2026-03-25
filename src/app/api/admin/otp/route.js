import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import nodemailer from 'nodemailer';

// Reuse mail transporter logic or import from mail.js
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

export async function POST(request) {
    try {
        await dbConnect();
        const { adminId } = await request.json();
        
        const admin = await Admin.findOne({ adminId });
        if (!admin || !admin.adminEmail) {
            return NextResponse.json({ error: 'No recovery email configured for this Admin ID. Please login with password first.' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        admin.otpCode = otp;
        admin.otpExpires = expires;
        await admin.save();

        // Send Email
        await transporter.sendMail({
            from: `"Admin Security" <${process.env.EMAIL_USER}>`,
            to: admin.adminEmail,
            subject: 'Your Admin Login Code',
            html: `
                <div style="font-family: sans-serif; padding: 20px; text-align: center; background: #000; color: #fff;">
                    <h2 style="color: #3b82f6;">Secure Admin Login</h2>
                    <p>Use the code below to log in to your Didaar Exhibition Dashboard:</p>
                    <div style="font-size: 3rem; font-weight: 800; letter-spacing: 10px; margin: 30px 0; color: #3b82f6;">${otp}</div>
                    <p style="color: #666; font-size: 0.8rem;">This code will expire in 10 minutes.</p>
                </div>
            `
        });

        return NextResponse.json({ success: true, message: 'OTP sent to your registered email' });

    } catch (err) {
        console.error('OTP Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const { adminId, otp } = await request.json();

        const admin = await Admin.findOne({ adminId });
        
        if (!admin || !admin.otpCode || admin.otpCode !== otp) {
            return NextResponse.json({ error: 'Invalid or incorrect code' }, { status: 401 });
        }

        if (new Date() > admin.otpExpires) {
            return NextResponse.json({ error: 'Code has expired. Please request a new one.' }, { status: 401 });
        }

        // Success - Clear OTP
        admin.otpCode = undefined;
        admin.otpExpires = undefined;
        await admin.save();

        return NextResponse.json({ success: true });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
