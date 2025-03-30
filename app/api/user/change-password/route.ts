import  jwt  from "jsonwebtoken";
import { NextRequest ,NextResponse} from "next/server";
import connect from "@/lib/connect";
import User from "@/app/models/User";
import bcrypt from 'bcrypt';

export async function PUT(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        const decoded = jwt.verify(token, secret) as { email: string, id: string };

        const id = decoded.id;
        if (!id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }
        const { currentPassword, newPassword } = await request.json();
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        await connect();
        const user = await User.findOne({ _id: id });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        return NextResponse.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
}