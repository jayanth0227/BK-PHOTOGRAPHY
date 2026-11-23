import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ message: "Status updated (local mode)", status });
    }

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("PATCH Inquiry Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json({ message: "Inquiry deleted (local mode)" });
    }

    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE Inquiry Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
