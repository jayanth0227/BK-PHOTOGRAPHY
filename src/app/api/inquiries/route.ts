import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      // In local mode without active DB, return empty or mock inquiries
      return NextResponse.json([]);
    }

    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("GET Inquiries Error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventType, eventDate, location, message } = body;

    if (!name || !email || !phone || !eventType) {
      return NextResponse.json(
        { error: "Name, email, phone, and celebration type are required." },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      // If DB is offline, log and return graceful success
      console.log("Local inquiry recorded (offline DB):", { name, email, phone, eventType });
      return NextResponse.json(
        { message: "Inquiry received successfully (demo mode)", id: "demo-" + Date.now() },
        { status: 201 }
      );
    }

    const newInquiry = await Inquiry.create({
      name,
      email,
      phone,
      eventType,
      eventDate: eventDate || "",
      location: location || "",
      message: message || "",
      status: "new",
    });

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error: unknown) {
    console.error("POST Inquiry Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
