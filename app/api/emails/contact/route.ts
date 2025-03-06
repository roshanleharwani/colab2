import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";


export async function POST(req:NextRequest) {
 
  const { name,email,subject,message } = await req.json();

  if (!email || !name || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" },{status: 400});
  }
 
    await connect();

  const EMAIL = process.env.EMAIL_USER
  const password = process.env.PASS
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: password,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) {
      throw new Error("BASE_URL environment variable is not defined");
    }


    const mailOptions = {
      from: EMAIL,
      to: EMAIL,
      subject: ` ${subject}`,
      text: `Mail from CoLab:\n\n ${message}\n\nSent by: ${name}\nEmail: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email Sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email." });
  }
}
