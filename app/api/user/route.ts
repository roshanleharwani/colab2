import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/connect";
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
        return NextResponse.json({error: "Authentication required"}, {status: 401})
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return NextResponse.json({error: "Server configuration error"}, {status: 500})
    }
    
    try {
        // Decode the token as an object, not a string
        const decoded = jwt.verify(token, secret) as { email: string, id: string };
        
        // Extract id directly from the decoded object
        const id = decoded.id;
        if (!id) {
            return NextResponse.json({error: "Authentication required"}, {status: 401})
        }
        
        await connect();
        
        const user = await User.findOne({_id: id}).select(["-password", "-reset_token"]);
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }
        
        return NextResponse.json(user);
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json({error: "Authentication failed"}, {status: 401})
    }
}

export async function PUT(request:NextRequest){
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
        return NextResponse.json({error: "Authentication required"}, {status: 401})
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return NextResponse.json({error: "Server configuration error"}, {status: 500})
    }
    try {
        const decoded = jwt.verify(token, secret) as { email: string, id: string };
        
        const id = decoded.id;
        if (!id) {
            return NextResponse.json({error: "Authentication required"}, {status: 401})
        }
        const {name,registration_number,phone,degree} = await request.json();
        if(!name || !registration_number || !phone || !degree){
            return NextResponse.json({error: "All fields are required"}, {status: 400})
        }
        await connect();
        
        const user = await User.findOne({_id: id});
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }
        user.name = name;
        user.registration_number = registration_number;
        user.phone = phone;
        user.degree = degree;
        await user.save();
        return NextResponse.json(user);
    }
    catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json({error: "Authentication failed"}, {status: 401})
    }

}

export async function DELETE(request:NextRequest){
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
        return NextResponse.json({error: "Authentication required"}, {status: 401})
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return NextResponse.json({error: "Server configuration error"}, {status: 500})
    }
    try {
        const decoded = jwt.verify(token, secret) as { email: string, id: string };
        
        const id = decoded.id;
        if (!id) {
            return NextResponse.json({error: "Authentication required"}, {status: 401})
        }
        await connect();
        
        const user = await User.findOneAndDelete({_id: id});
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }
        request.cookies.delete("auth-token");
        const response =  NextResponse.json({message: "User deleted successfully"});
        response.cookies.set("auth-token", "", { expires: new Date(0) });
        return response;
    }
    catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json({error: "Authentication failed"}, {status: 401})
    }
}