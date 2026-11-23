import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { INITIAL_PORTFOLIO_ITEMS } from "@/lib/sampleData";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const conn = await connectToDatabase();
    if (!conn) {
      // Graceful fallback to sample data if DB connection is unavailable
      if (category && category !== "All") {
        return NextResponse.json(
          INITIAL_PORTFOLIO_ITEMS.filter(
            (item) => item.category.toLowerCase() === category.toLowerCase()
          )
        );
      }
      return NextResponse.json(INITIAL_PORTFOLIO_ITEMS);
    }

    const query: Record<string, unknown> = {};
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const items = await Portfolio.find(query).sort({ createdAt: -1 });

    // If database is empty, return initial showcase items
    if (items.length === 0) {
      return NextResponse.json(INITIAL_PORTFOLIO_ITEMS);
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET Portfolio Error:", error);
    return NextResponse.json(INITIAL_PORTFOLIO_ITEMS);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conn = await connectToDatabase();
    const body = await request.json();

    const { title, category, imageUrl, cloudinaryPublicId, location, featured, eventDate } = body;

    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { error: "Title, Category, and Image URL are required" },
        { status: 400 }
      );
    }

    if (!conn) {
      // In local mode without active DB, return mock created item
      const newItem = {
        _id: "local-" + Date.now(),
        title,
        category,
        imageUrl,
        cloudinaryPublicId: cloudinaryPublicId || "",
        location: location || "",
        featured: Boolean(featured),
        eventDate: eventDate || "",
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json(newItem, { status: 201 });
    }

    const newItem = await Portfolio.create({
      title,
      category,
      imageUrl,
      cloudinaryPublicId,
      location,
      featured: Boolean(featured),
      eventDate,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    console.error("POST Portfolio Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add portfolio item" },
      { status: 500 }
    );
  }
}
