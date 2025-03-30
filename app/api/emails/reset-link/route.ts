import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import User from '@/app/models/User';

export async function POST(req:NextRequest) {
 
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" },{status: 400});
  }
  const hash = Math.random().toString(36).substring(2, 15);
  try{

        await connect();

        const user = await User.findOne({ email: email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        user.reset_token = hash;
        user.save();
        

  }catch(e){
    console.log(e);
  }

  const EMAIL = process.env.EMAIL_USER
  const password = process.env.PASS
  console.log(EMAIL, password)
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
    const resetLink = `${baseUrl}/reset-password/${hash}`;

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Password Reset Link",
      text: `Mail from CoLab: Here is your password reset link: ${resetLink}`,
      html: `<p>Mail from <strong>CoLab</strong>:</p><p>Here is your password reset link:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email." });
  }
}
