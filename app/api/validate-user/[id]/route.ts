import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from '@/lib/connect';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  
  try {
    const { id } = await params;
    const user = await User.findOne({ reset_token: id });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ userId: user._id }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { 
        message: err instanceof Error ? err.message : "Invalid or expired reset token" 
      },
      { status: 400 }
    );
  }
}