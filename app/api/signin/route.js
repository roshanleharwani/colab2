import {generateToken} from "@/lib/auth/generateToken"

import connect from "@/lib/connect";
import User from "@/app/models/User";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
      // Parse the query parameters
      const body = await req.json();
      const {email,password} = body;
  
      // Validate the query parameters
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }
  
      // Connect to the database
      await connect();
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
        const token = generateToken(user);
      // Return success response
      const response =  NextResponse.json(token,{ message: 'Sign-in successful' }, { status: 200 });
      
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 60, // 1 hour
        secure: (process.env.NODE_ENV === 'production') || false,
      });
      
      return response;
    } catch (error) {
      // Return error response
      return NextResponse.json({ error: error.message }, { status: 500 },{user:{email:email}});
    }
  }