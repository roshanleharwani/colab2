/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server"
import connect from "@/lib/connect"
import { Project } from "@/app/models/project"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("I am here")
    const slug = await params.id
    console.log(slug)

    return NextResponse.json({ slug })
}