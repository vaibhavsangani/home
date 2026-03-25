import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendTicketEmail = async (attendee, event) => {
  if (!process.env.EMAIL_USER) {
    console.warn('Email service not configured. Skipping email.');
    return false;
  }

  const ticketUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://didaar-exhibition.vercel.app'}/ticket/${attendee.id}`;

  const mailOptions = {
    from: `"Didaar Exhibition" <${process.env.EMAIL_USER}>`,
    to: attendee.email,
    subject: `Your Entry Pass: ${event.name} - ${event.city}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000; margin: 0;">Didaar Exhibition</h1>
          <p style="color: #666; margin: 5px 0;">Official Entry Pass</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="margin-top: 0;">Hello ${attendee.name},</h2>
          <p>Thank you for registering for <strong>${event.name}</strong>. Your registration is confirmed!</p>
          
          <div style="margin: 25px 0; padding: 20px; border: 1px dashed #ddd; border-radius: 10px;">
            <p style="margin: 5px 0; font-size: 14px; color: #888; text-transform: uppercase;">Exhibition Details</p>
            <h3 style="margin: 5px 0; color: #3b82f6;">${event.venue}</h3>
            <p style="margin: 5px 0;">${event.city}</p>
            <p style="margin: 5px 0; font-weight: bold;">${new Date(event.startDate).toDateString()} - ${new Date(event.endDate).toDateString()}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${ticketUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
              View & Download Ticket
            </a>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center;">
            Please present the QR code on your digital ticket at the entrance for quick entry.
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Didaar Exhibition. All rights reserved.
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendVendorConfirmation = async (vendor) => {
    if (!process.env.EMAIL_USER) return false;

    const mailOptions = {
        from: `"Didaar Exhibition" <${process.env.EMAIL_USER}>`,
        to: vendor.email,
        subject: `Stall Application Received: ${vendor.companyName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #eee;">
            <h2 style="color: #000;">Application Received</h2>
            <p>Dear ${vendor.firstName},</p>
            <p>Thank you for applying for a stall at the Didaar Exhibition. We have received your details for <strong>${vendor.companyName}</strong>.</p>
            
            <p>Our team will review your application and documents (Aadhar/PAN/Product Photos). You will receive an update once your application is verified.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #fcfcfc;">
                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Application ID</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${vendor.id}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Stall Size</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${vendor.stallSize}</td>
                </tr>
                <tr style="background: #fcfcfc;">
                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Category</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${vendor.businessCategory || vendor.category}</td>
                </tr>
            </table>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Required next steps: Our team might contact you for payment details or further clarification.
            </p>
          </div>
        `
    };

    return await transporter.sendMail(mailOptions);
}
