import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { getAdminSession } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

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
      return NextResponse.json({ message: "Item deleted successfully (local mode)" });
    }

    const item = await Portfolio.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // If item was stored in Cloudinary, delete from Cloudinary
    if (item.cloudinaryPublicId) {
      await deleteFromCloudinary(item.cloudinaryPublicId);
    }

    await Portfolio.findByIdAndDelete(id);

    return NextResponse.json({ message: "Portfolio item deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE Portfolio Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete item" },
      { status: 500 }
    );
  }
}
