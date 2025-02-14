import {generateToken} from "@/lib/auth/generateToken"

import connect from "@/lib/connect";
import User from "@/app/models/User";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
      // Parse the request body
      const body = await req.json();
      const { name, email, phone, password, registration_number, degree   } = body;
  
      // Validate the request body fields
      if (!name || !email || !phone || !password || !registration_number || !degree) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }
  
      // Connect to the database
      await connect();
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      // Prepare user data
      const data = {
        name,
        email,
        phone,
        degree,
        registration_number,
        password: hash,
        reset_token:""
      };
  
      // Create the user in the database
      const result = await User.create(data);
  
      // Return success response
      const token = generateToken(result);
      const response = NextResponse.json(result, { status: 201 });
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 60, // 1 hour
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    } catch (error) {
      // Return error response
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }