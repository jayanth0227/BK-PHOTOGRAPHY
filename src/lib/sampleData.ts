export interface PortfolioItemType {
  _id: string;
  title: string;
  category: "Marriage" | "Haldi" | "Birthday" | "Pre-Wedding" | "Portraits";
  imageUrl: string;
  cloudinaryPublicId?: string;
  location?: string;
  featured?: boolean;
  eventDate?: string;
  createdAt: string;
}

const STATIC_CREATED_DATE = "2026-02-14T10:00:00.000Z";

export const INITIAL_PORTFOLIO_ITEMS: PortfolioItemType[] = [
  {
    _id: "demo-1",
    title: "The Royal Sindoor Ritual",
    category: "Marriage",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    location: "Taj Falaknuma, Hyderabad",
    featured: true,
    eventDate: "2026-02-14",
    createdAt: STATIC_CREATED_DATE,
  },
  {
    _id: "demo-2",
    title: "Golden Smiles & Haldi Splashes",
    category: "Haldi",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    location: "Golkonda Resorts",
    featured: true,
    eventDate: "2026-03-01",
    createdAt: STATIC_CREATED_DATE,
  },
  {
    _id: "demo-3",
    title: "First Birthday Princess Celebration",
    category: "Birthday",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    location: "Park Hyatt, Banjara Hills",
    featured: true,
    eventDate: "2026-01-20",
    createdAt: STATIC_CREATED_DATE,
  },
  {
    _id: "demo-4",
    title: "Eternal Promises by the Waterfront",
    category: "Pre-Wedding",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    location: "Ananthagiri Hills",
    featured: true,
    eventDate: "2026-02-05",
    createdAt: STATIC_CREATED_DATE,
  },
  {
    _id: "demo-5",
    title: "Traditional Bride in Silk & Gold",
    category: "Marriage",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    location: "JRC Conventions",
    featured: true,
    eventDate: "2026-01-15",
    createdAt: STATIC_CREATED_DATE,
  },
  {
    _id: "demo-6",
    title: "Festive Marigold Laughs",
    category: "Haldi",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    location: "Pragati Resorts",
    featured: false,
    eventDate: "2026-03-10",
    createdAt: STATIC_CREATED_DATE,
  },
  {
    _id: "demo-7",
    title: "Sweet 16 Glow & Confetti",
    category: "Birthday",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    location: "Novotel Hitec City",
    featured: false,
    eventDate: "2026-02-28",
    createdAt: STATIC_CREATED_DATE,
  },
  {
    _id: "demo-8",
    title: "Sunset Whispers & Silhouette",
    category: "Pre-Wedding",
    imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
    location: "Gandipet Lake",
    featured: true,
    eventDate: "2026-02-18",
    createdAt: STATIC_CREATED_DATE,
  },
  {
    _id: "demo-9",
    title: "Classic Groom Portrait",
    category: "Portraits",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    location: "BK Studio",
    featured: false,
    eventDate: "2026-01-25",
    createdAt: STATIC_CREATED_DATE,
  },
];
