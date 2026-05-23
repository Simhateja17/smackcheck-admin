// SmackCheck Admin — mock data (TypeScript)

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  status: string;
  role: string;
  xp: number;
  level: number;
  badges: number;
  ratings: number;
  reports: number;
  joined: string;
  lastActive: number;
  location: string;
  verified: boolean;
  avatar: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  price: string;
  area: string;
  city: string;
  rating: number;
  ratingsCount: number;
  status: string;
  img: string;
  added: string;
  featured: boolean;
  dishes: number;
}

export interface Dish {
  id: string;
  name: string;
  restaurant: string;
  cuisine: string;
  price: number;
  img: string;
  rating: number;
  ratings: number;
  likes: number;
  status: string;
  reports: number;
}

export interface Report {
  id: string;
  status: string;
  severity: string;
  category: string;
  targetType: string;
  targetTitle: string;
  targetSnippet: string;
  targetMedia: string | null;
  reporter: User | null;
  reportedUser: User | null;
  restaurant: string | null;
  dish: string | null;
  reasonText: string;
  submitted: number;
  aiConfidence: number;
  aiLabel: string;
  aiAction: string;
  similarReports: number;
  resolvedBy?: string;
  resolvedAction?: string;
  resolvedAt?: number;
}

export interface RatingFeed {
  id: string;
  user: User;
  restaurant: string;
  dish: string | null;
  stars: number;
  text: string;
  img: string | null;
  status: string;
  time: number;
  likes: number;
  ai: number;
  kind?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  audience: string;
  status: string;
  sentAt: string | null;
  reach: number | null;
  ctr: number | null;
  scheduled: string | null;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  rarity: string;
  earned: number;
  criteria: string;
  xp: number;
}

export interface Challenge {
  id: string;
  name: string;
  type: string;
  xp: number;
  participants: number;
  completion: number;
  start: string;
  end: string;
  status: string;
  desc: string;
}

export interface ModLog {
  id: string;
  time: number;
  actor: string;
  action: string;
  target: string;
  detail: string;
  evidence: string;
}

export interface ActivityItem {
  kind: string;
  dot: string;
  text: string;
  time: number;
  who: string;
}

export const PHOTOS = {
  truffle:   "https://images.unsplash.com/photo-1626844131082-256783844137?w=400&q=70&auto=format&fit=crop",
  sushi:     "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=70&auto=format&fit=crop",
  burger:    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=70&auto=format&fit=crop",
  pasta:     "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=70&auto=format&fit=crop",
  scallops:  "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=400&q=70&auto=format&fit=crop",
  steak:     "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=70&auto=format&fit=crop",
  ramen:     "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=70&auto=format&fit=crop",
  pizza:     "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=70&auto=format&fit=crop",
  tacos:     "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=70&auto=format&fit=crop",
  oysters:   "https://images.unsplash.com/photo-1614546149792-2f0a2dde0ed6?w=400&q=70&auto=format&fit=crop",
  croissant: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=70&auto=format&fit=crop",
  curry:     "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&q=70&auto=format&fit=crop",
  rest1:     "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70&auto=format&fit=crop",
  rest2:     "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=70&auto=format&fit=crop",
  rest3:     "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=70&auto=format&fit=crop",
  rest4:     "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=70&auto=format&fit=crop",
  rest5:     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&auto=format&fit=crop",
};

export const AVATAR_URL = (seed: string) => `https://i.pravatar.cc/120?u=${encodeURIComponent(seed)}`;

export const USERS: User[] = [
  { id: "u_001", name: "Alex Chen",          username: "alexnyc",      email: "alex.chen@smtxr.com",     status: "active",    role: "user",    xp: 14820, level: 14, badges: 24, ratings: 512,  reports: 0,  joined: "2024-03-12", lastActive: 12,    location: "Brooklyn, NY",     verified: true,  avatar: AVATAR_URL("alexnyc") },
  { id: "u_002", name: "Mariana Cheraputti", username: "marianach",    email: "mariana.c@gmail.com",     status: "active",    role: "creator", xp: 28403, level: 22, badges: 41, ratings: 1204, reports: 1,  joined: "2023-08-04", lastActive: 4,     location: "São Paulo, BR",    verified: true,  avatar: AVATAR_URL("marianach") },
  { id: "u_003", name: "Julian Thorne",      username: "julianth",     email: "j.thorne@me.com",         status: "warned",    role: "user",    xp: 5230,  level: 8,  badges: 11, ratings: 87,   reports: 4,  joined: "2024-11-19", lastActive: 41,    location: "Manchester, UK",   verified: false, avatar: AVATAR_URL("julianth") },
  { id: "u_004", name: "Priya Iyer",         username: "priyatastes",  email: "priya.i@hotmail.com",     status: "active",    role: "user",    xp: 9410,  level: 11, badges: 18, ratings: 254,  reports: 0,  joined: "2024-01-22", lastActive: 88,    location: "Mumbai, IN",       verified: false, avatar: AVATAR_URL("priyatastes") },
  { id: "u_005", name: "Marcus Chen",        username: "marcus_eats",  email: "marcus@chenfam.io",       status: "active",    role: "user",    xp: 3120,  level: 6,  badges: 7,  ratings: 64,   reports: 0,  joined: "2025-02-14", lastActive: 320,   location: "Vancouver, CA",    verified: false, avatar: AVATAR_URL("marcus_eats") },
  { id: "u_006", name: "Elena Sokolova",     username: "elenas",       email: "elena.s@protonmail.com",  status: "active",    role: "creator", xp: 41209, level: 28, badges: 57, ratings: 2103, reports: 2,  joined: "2023-04-09", lastActive: 21,    location: "Lisbon, PT",       verified: true,  avatar: AVATAR_URL("elenas") },
  { id: "u_007", name: "Devon Park",         username: "devpark",      email: "devon.park@kakao.com",    status: "suspended", role: "user",    xp: 102,   level: 2,  badges: 1,  ratings: 8,    reports: 12, joined: "2025-04-30", lastActive: 4320,  location: "Seoul, KR",        verified: false, avatar: AVATAR_URL("devpark") },
  { id: "u_008", name: "Kofi Mensah",        username: "kofiplate",    email: "k.mensah@gmail.com",      status: "active",    role: "user",    xp: 11240, level: 13, badges: 22, ratings: 318,  reports: 0,  joined: "2024-06-11", lastActive: 6,     location: "Accra, GH",        verified: false, avatar: AVATAR_URL("kofiplate") },
  { id: "u_009", name: "Sofia Lindqvist",    username: "sofialinds",   email: "sofia.l@yahoo.se",        status: "active",    role: "user",    xp: 6740,  level: 9,  badges: 14, ratings: 142,  reports: 0,  joined: "2024-09-02", lastActive: 19,    location: "Stockholm, SE",    verified: false, avatar: AVATAR_URL("sofialinds") },
  { id: "u_010", name: "Ravi Bhandari",      username: "ravibites",    email: "ravi.b@outlook.com",      status: "banned",    role: "user",    xp: 0,     level: 1,  badges: 0,  ratings: 3,    reports: 28, joined: "2025-09-14", lastActive: 14400, location: "Delhi, IN",        verified: false, avatar: AVATAR_URL("ravibites") },
  { id: "u_011", name: "Naomi Bridges",      username: "naomi_b",      email: "naomi@bridges.studio",    status: "active",    role: "user",    xp: 8120,  level: 10, badges: 16, ratings: 188,  reports: 0,  joined: "2024-05-28", lastActive: 60,    location: "Toronto, CA",      verified: false, avatar: AVATAR_URL("naomi_b") },
  { id: "u_012", name: "Tomás Vega",         username: "tomasvega",    email: "tomas.v@gmail.com",       status: "active",    role: "user",    xp: 2418,  level: 5,  badges: 5,  ratings: 42,   reports: 0,  joined: "2025-01-08", lastActive: 380,   location: "Buenos Aires, AR", verified: false, avatar: AVATAR_URL("tomasvega") },
];

export const RESTAURANTS: Restaurant[] = [
  { id: "r_001", name: "The Ember Grill",    cuisine: "Modern Fusion", price: "$$$",  area: "Culinary District", city: "New York",  rating: 4.9, ratingsCount: 1203, status: "verified",  img: PHOTOS.rest1, added: "2024-02-10", featured: true,  dishes: 32 },
  { id: "r_002", name: "Nami Sushi",         cuisine: "Japanese",      price: "$$$",  area: "Tribeca",           city: "New York",  rating: 4.8, ratingsCount: 982,  status: "verified",  img: PHOTOS.rest2, added: "2023-11-22", featured: false, dishes: 28 },
  { id: "r_003", name: "Osteria Marco",      cuisine: "Italian",       price: "$$",   area: "West Village",      city: "New York",  rating: 4.9, ratingsCount: 1502, status: "verified",  img: PHOTOS.rest3, added: "2023-04-30", featured: true,  dishes: 44 },
  { id: "r_004", name: "Stack & Co.",        cuisine: "American",      price: "$$",   area: "Williamsburg",      city: "Brooklyn",  rating: 4.6, ratingsCount: 712,  status: "verified",  img: PHOTOS.rest4, added: "2024-01-15", featured: false, dishes: 21 },
  { id: "r_005", name: "L'Atelier Gourmet",  cuisine: "French",        price: "$$$$", area: "Midtown",           city: "New York",  rating: 4.7, ratingsCount: 488,  status: "pending",   img: PHOTOS.rest5, added: "2025-09-02", featured: false, dishes: 18 },
  { id: "r_006", name: "Orizon Seafood",     cuisine: "Seafood",       price: "$$$",  area: "Battery Park",      city: "New York",  rating: 4.5, ratingsCount: 340,  status: "verified",  img: PHOTOS.rest1, added: "2024-07-18", featured: false, dishes: 26 },
  { id: "r_007", name: "Ginza Grill",        cuisine: "Japanese BBQ",  price: "$$$",  area: "Murray Hill",       city: "New York",  rating: 4.7, ratingsCount: 612,  status: "verified",  img: PHOTOS.rest2, added: "2024-04-04", featured: false, dishes: 19 },
  { id: "r_008", name: "Casa Manuel",        cuisine: "Spanish",       price: "$$",   area: "East Village",      city: "New York",  rating: 4.4, ratingsCount: 198,  status: "duplicate", img: PHOTOS.rest3, added: "2025-08-21", featured: false, dishes: 14 },
];

export const DISHES: Dish[] = [
  { id: "d_001", name: "Truffle Tagliatelle",          restaurant: "Osteria Marco",     cuisine: "Italian",    price: 32, img: PHOTOS.truffle,  rating: 5.0, ratings: 542, likes: 1212, status: "approved", reports: 0 },
  { id: "d_002", name: "Salmon Aburi Nigiri",          restaurant: "Nami Sushi",        cuisine: "Japanese",   price: 28, img: PHOTOS.sushi,    rating: 4.9, ratings: 342, likes: 987,  status: "approved", reports: 0 },
  { id: "d_003", name: "Smoked Brisket Smash Burger",  restaurant: "Stack & Co.",       cuisine: "American",   price: 22, img: PHOTOS.burger,   rating: 4.5, ratings: 217, likes: 612,  status: "approved", reports: 0 },
  { id: "d_004", name: "Yuzu Glazed Scallops",         restaurant: "The Ember Grill",   cuisine: "Fusion",     price: 28, img: PHOTOS.scallops, rating: 4.9, ratings: 184, likes: 502,  status: "approved", reports: 0 },
  { id: "d_005", name: "Char-Grilled Ribeye",          restaurant: "The Ember Grill",   cuisine: "Steakhouse", price: 64, img: PHOTOS.steak,    rating: 4.8, ratings: 233, likes: 488,  status: "approved", reports: 0 },
  { id: "d_006", name: "Wild Mushroom Truffle Pasta",  restaurant: "L'Atelier Gourmet", cuisine: "Italian",    price: 36, img: PHOTOS.pasta,    rating: 4.9, ratings: 102, likes: 287,  status: "pending",  reports: 1 },
  { id: "d_007", name: "Pan-Seared Hokkaido Scallops", restaurant: "Orizon Seafood",    cuisine: "Seafood",    price: 38, img: PHOTOS.scallops, rating: 4.5, ratings: 88,  likes: 199,  status: "approved", reports: 0 },
  { id: "d_008", name: "A5 Wagyu Katsu Sando",         restaurant: "Ginza Grill",       cuisine: "Japanese",   price: 48, img: PHOTOS.steak,    rating: 5.0, ratings: 64,  likes: 312,  status: "approved", reports: 0 },
  { id: "d_009", name: "Tonkotsu Ramen",               restaurant: "Nami Sushi",        cuisine: "Japanese",   price: 18, img: PHOTOS.ramen,    rating: 4.6, ratings: 188, likes: 421,  status: "approved", reports: 0 },
  { id: "d_010", name: "Margherita Pizza",             restaurant: "Osteria Marco",     cuisine: "Italian",    price: 18, img: PHOTOS.pizza,    rating: 4.7, ratings: 312, likes: 818,  status: "approved", reports: 0 },
  { id: "d_011", name: "Birria Tacos",                 restaurant: "Casa Manuel",       cuisine: "Mexican",    price: 14, img: PHOTOS.tacos,    rating: 4.4, ratings: 142, likes: 388,  status: "approved", reports: 0 },
  { id: "d_012", name: "Oyster Trio",                  restaurant: "Orizon Seafood",    cuisine: "Seafood",    price: 24, img: PHOTOS.oysters,  rating: 4.7, ratings: 71,  likes: 144,  status: "approved", reports: 0 },
];

export const REPORTS: Report[] = [
  {
    id: "RP-3041", status: "open", severity: "critical", category: "Hate speech",
    targetType: "comment",
    targetTitle: "Comment on Truffle Tagliatelle",
    targetSnippet: "you people from [redacted slur] don't know real italian food. this place is trash and so are you—",
    targetMedia: null,
    reporter: USERS[3],
    reportedUser: USERS[6],
    restaurant: "Osteria Marco",
    dish: "Truffle Tagliatelle",
    reasonText: "Targeted ethnic slur. The comment is directly attacking other commenters.",
    submitted: 14,
    aiConfidence: 0.97,
    aiLabel: "Hate speech (severe)",
    aiAction: "remove_and_warn",
    similarReports: 3,
  },
  {
    id: "RP-3040", status: "open", severity: "high", category: "Harassment",
    targetType: "rating",
    targetTitle: "1★ rating on Stack & Co.",
    targetSnippet: "owner is a literal scammer. i will be camping outside this place until they refund me. anyone reading this should DM me their address so we can—",
    targetMedia: null,
    reporter: USERS[7],
    reportedUser: USERS[9],
    restaurant: "Stack & Co.",
    dish: null,
    reasonText: "Implied threat / soliciting personal information.",
    submitted: 38,
    aiConfidence: 0.84,
    aiLabel: "Harassment + PII solicitation",
    aiAction: "hide_pending_review",
    similarReports: 1,
  },
  {
    id: "RP-3039", status: "reviewing", severity: "med", category: "Spam",
    targetType: "story",
    targetTitle: "Story by @ravibites",
    targetSnippet: "🔥🔥 GET 60% OFF ALL ORDERS WITH MY CODE: BITES60 — link in bio — also follow @cheapeats_promo @foodieboost @bestofnyc_eats",
    targetMedia: PHOTOS.burger,
    reporter: USERS[5],
    reportedUser: USERS[9],
    restaurant: null,
    dish: null,
    reasonText: "Multi-account promo spam. Same template posted across 4 stories.",
    submitted: 92,
    aiConfidence: 0.91,
    aiLabel: "Coordinated promo spam",
    aiAction: "remove_account_warn",
    similarReports: 4,
  },
  {
    id: "RP-3038", status: "reviewing", severity: "high", category: "Misinformation",
    targetType: "rating",
    targetTitle: "5★ rating on L'Atelier Gourmet",
    targetSnippet: "i'm the head chef and i'm telling you this place serves expired meat. michelin people don't actually inspect, i know because—",
    targetMedia: null,
    reporter: USERS[1],
    reportedUser: USERS[2],
    restaurant: "L'Atelier Gourmet",
    dish: null,
    reasonText: "Impersonation + unverified food safety claims. Multiple users flagged.",
    submitted: 240,
    aiConfidence: 0.72,
    aiLabel: "Impersonation, possible defamation",
    aiAction: "hide_pending_review",
    similarReports: 7,
  },
  {
    id: "RP-3037", status: "open", severity: "low", category: "Wrong info",
    targetType: "restaurant",
    targetTitle: "Restaurant: Casa Manuel",
    targetSnippet: "Hours are wrong — they close at 10pm not midnight. Also the address is the old location, they moved 6 blocks south.",
    targetMedia: null,
    reporter: USERS[8],
    reportedUser: null,
    restaurant: "Casa Manuel",
    dish: null,
    reasonText: "Outdated business info reported by 3 users this week.",
    submitted: 420,
    aiConfidence: 0.43,
    aiLabel: "Data quality (low severity)",
    aiAction: "queue_for_data_team",
    similarReports: 2,
  },
  {
    id: "RP-3036", status: "open", severity: "high", category: "NSFW image",
    targetType: "image",
    targetTitle: "Image on rating by @devpark",
    targetSnippet: "Image attached to 2★ rating on Ginza Grill. Auto-flagged by vision model.",
    targetMedia: PHOTOS.steak,
    reporter: null,
    reportedUser: USERS[6],
    restaurant: "Ginza Grill",
    dish: null,
    reasonText: "AI-flagged. Off-topic content unrelated to food.",
    submitted: 50,
    aiConfidence: 0.88,
    aiLabel: "Off-topic / possible NSFW",
    aiAction: "remove_and_warn",
    similarReports: 0,
  },
  {
    id: "RP-3035", status: "resolved", severity: "med", category: "Fake review",
    targetType: "rating",
    targetTitle: "5★ rating on Nami Sushi",
    targetSnippet: "Best place in town!!! 10/10 amazing perfect see you tomorrow!!!",
    targetMedia: null,
    reporter: USERS[5],
    reportedUser: USERS[4],
    restaurant: "Nami Sushi",
    dish: null,
    reasonText: "Suspected fake — account has 14 5★ ratings posted within 9 minutes.",
    submitted: 1440,
    aiConfidence: 0.94,
    aiLabel: "Coordinated fake reviews",
    aiAction: "remove_and_warn",
    similarReports: 13,
    resolvedBy: "You",
    resolvedAction: "Removed 14 fake ratings, warned user",
    resolvedAt: 60,
  },
  {
    id: "RP-3034", status: "dismissed", severity: "low", category: "Wrong info",
    targetType: "dish",
    targetTitle: "Dish: Margherita Pizza",
    targetSnippet: "This isn't really margherita — they put basil oil instead of fresh leaves. Misleading.",
    targetMedia: null,
    reporter: USERS[11],
    reportedUser: null,
    restaurant: "Osteria Marco",
    dish: "Margherita Pizza",
    reasonText: "User taste complaint, not a moderation issue.",
    submitted: 2880,
    aiConfidence: 0.18,
    aiLabel: "User preference, not a violation",
    aiAction: "dismiss",
    similarReports: 0,
    resolvedBy: "Alex Chen",
    resolvedAction: "Dismissed — not a violation",
    resolvedAt: 1200,
  },
];

export const RATINGS_FEED: RatingFeed[] = [
  { id: "rt_01", user: USERS[1], restaurant: "Nami Sushi",        dish: "Salmon Aburi Nigiri",         stars: 5, text: "The torching was perfect, creating that melt-in-your-mouth texture with just a hint of smokiness. Best Aburi in the city, hands down.", img: PHOTOS.sushi,    status: "approved", time: 12,   likes: 142, ai: 0.04 },
  { id: "rt_02", user: USERS[3], restaurant: "Stack & Co.",        dish: "Smoked Brisket Smash Burger", stars: 5, text: "Wasn't expecting much but this hit different. The brisket blend adds a deep, savory punch that you just don't get in standard chuck patties.", img: PHOTOS.burger,   status: "approved", time: 60,   likes: 89,  ai: 0.02 },
  { id: "rt_03", user: USERS[5], restaurant: "L'Atelier Gourmet",  dish: "Truffle Pasta",               stars: 4, text: "Yuzu Scallops were life-changing. Perfectly balanced acidity and the plating was a work of art. The atmosphere is upscale yet intimate.", img: PHOTOS.scallops, status: "pending",  time: 240,  likes: 0,   ai: 0.21 },
  { id: "rt_04", user: USERS[9], restaurant: "Nami Sushi",         dish: null,                          stars: 1, text: "owner is a literal scammer. i will be camping outside this place until they refund me. DM me—", img: null,           status: "hidden",   time: 38,   likes: 0,   ai: 0.84 },
  { id: "rt_05", user: USERS[2], restaurant: "Osteria Marco",       dish: "Truffle Tagliatelle",         stars: 5, text: "Earthy depth of the fresh truffles was perfectly balanced by the silkiness of the hand-cut tagliatelle. Service warm without being intrusive.", img: PHOTOS.truffle,  status: "approved", time: 480,  likes: 312, ai: 0.01 },
  { id: "rt_06", user: USERS[4], restaurant: "Nami Sushi",         dish: null,                          stars: 5, text: "Best place in town!!! 10/10 amazing perfect see you tomorrow!!!", img: null,           status: "rejected", time: 1440, likes: 0,   ai: 0.94 },
  { id: "rt_07", user: USERS[8], restaurant: "The Ember Grill",    dish: "Yuzu Glazed Scallops",        stars: 5, text: "Char on the scallops was impeccable. Citrus foam added a bright acidity that elevated the dish into something I'll be thinking about for weeks.", img: PHOTOS.scallops, status: "approved", time: 720,  likes: 188, ai: 0.03 },
  { id: "rt_08", user: USERS[10], restaurant: "Ginza Grill",       dish: "A5 Wagyu Katsu Sando",        stars: 5, text: "Melt-in-your-mouth quality of the beef is unmatched. The house-made katsu sauce ties everything together — sweet, tangy, deeply savory.", img: PHOTOS.steak,    status: "approved", time: 1200, likes: 204, ai: 0.02 },
  { id: "rt_09", user: USERS[6], restaurant: "Ginza Grill",        dish: null,                          stars: 2, text: "[image attached — auto-flagged]", img: PHOTOS.steak,    status: "pending",  time: 50,   likes: 0,   ai: 0.88 },
];

// Dashboard time series — 30 days
export const SERIES_30D: number[] = Array.from({length: 30}, (_, i) => {
  const trend = 80 + i * 2.5;
  const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.7)) * 18;
  return Math.round(trend + noise + Math.random() * 8);
});

export const RATINGS_24H: number[] = Array.from({length: 24}, (_, h) => {
  const lunch = Math.exp(-((h-13)**2)/8) * 60;
  const dinner = Math.exp(-((h-20)**2)/6) * 110;
  return Math.round(lunch + dinner + Math.random() * 14 + 6);
});

export const MODERATION_WEEK = [
  { d: "Mon", open: 24, reviewing: 11, resolved: 38, dismissed: 6 },
  { d: "Tue", open: 31, reviewing: 8,  resolved: 41, dismissed: 4 },
  { d: "Wed", open: 19, reviewing: 14, resolved: 52, dismissed: 9 },
  { d: "Thu", open: 27, reviewing: 12, resolved: 44, dismissed: 7 },
  { d: "Fri", open: 38, reviewing: 18, resolved: 36, dismissed: 11 },
  { d: "Sat", open: 47, reviewing: 22, resolved: 31, dismissed: 8 },
  { d: "Sun", open: 33, reviewing: 9,  resolved: 28, dismissed: 5 },
];

export const ACTIVITY: ActivityItem[] = [
  { kind: "report", dot: "danger", text: "New report — Hate speech on comment by @devpark", time: 12,  who: "Auto" },
  { kind: "ban",    dot: "danger", text: "Banned @ravibites — 28 reports, fake review ring",  time: 38,  who: "Alex Chen" },
  { kind: "verify", dot: "ok",     text: "Verified restaurant: L'Atelier Gourmet",             time: 92,  who: "Marcus Q." },
  { kind: "badge",  dot: "brand",  text: "Created badge: 'Truffle Hunter' (criteria: 25 truffle-tagged ratings)", time: 180, who: "Alex Chen" },
  { kind: "merge",  dot: "",       text: "Merged duplicate restaurants: 'Stack and Co' → Stack & Co.", time: 240, who: "Marcus Q." },
  { kind: "push",   dot: "ok",     text: "Sent broadcast push — 'Weekend challenge: 3 ratings for 500 XP' (118,402 users)", time: 720, who: "Alex Chen" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n_01", title: "Weekend challenge unlocked",        body: "Rate 3 dishes this weekend to earn 500 bonus XP and the Weekender badge.", audience: "All users",       status: "sent",      sentAt: "2026-05-10 18:00", reach: 118402, ctr: 12.4, scheduled: null },
  { id: "n_02", title: "Your streak is at risk",           body: "You haven't rated a dish in 2 days. Keep your streak alive!",              audience: "Inactive 2d+",    status: "scheduled", sentAt: null,               reach: 14210,  ctr: null, scheduled: "2026-05-15 09:00" },
  { id: "n_03", title: "New badge available",              body: "We just dropped the 'Late Night' badge — rate 10 dishes after 10pm.",       audience: "Level 5+",        status: "draft",     sentAt: null,               reach: null,   ctr: null, scheduled: null },
  { id: "n_04", title: "Truffle Tagliatelle is trending",  body: "Your follower @marianach just rated a dish in your area.",                  audience: "Friends of poster",status: "sent",      sentAt: "2026-05-09 19:24", reach: 4218,   ctr: 22.1, scheduled: null },
  { id: "n_05", title: "Your report was resolved",         body: "Thanks for flagging — we removed the content and warned the user.",         audience: "Reporters",       status: "sent",      sentAt: "2026-05-08 14:02", reach: 312,    ctr: 41.0, scheduled: null },
];

export const BADGES: Badge[] = [
  { id: "b_01", name: "First Bite",     emoji: "🍴", desc: "Posted your first rating",               rarity: "Common",    earned: 84210, criteria: "1 rating",                     xp: 50 },
  { id: "b_02", name: "Truffle Hunter", emoji: "🍄", desc: "25 ratings tagged 'truffle'",             rarity: "Rare",      earned: 1240,  criteria: "25 truffle ratings",            xp: 500 },
  { id: "b_03", name: "Late Night",     emoji: "🌙", desc: "10 dishes rated after 10pm",             rarity: "Uncommon",  earned: 8930,  criteria: "10 ratings 22:00–04:00",        xp: 250 },
  { id: "b_04", name: "Gourmet",        emoji: "🥂", desc: "5 ratings at $$$$ restaurants",          rarity: "Epic",      earned: 412,   criteria: "5 ratings at $$$$ tier",        xp: 750 },
  { id: "b_05", name: "Streak Master",  emoji: "🔥", desc: "30-day rating streak",                   rarity: "Legendary", earned: 124,   criteria: "30 consecutive days",            xp: 2000 },
  { id: "b_06", name: "Local Hero",     emoji: "📍", desc: "100 ratings in your home city",          rarity: "Rare",      earned: 2104,  criteria: "100 ratings same city",         xp: 800 },
  { id: "b_07", name: "Snap Quality",   emoji: "📸", desc: "50 ratings with photos > 4.5★ AI quality", rarity: "Rare",   earned: 1860,  criteria: "50 high-quality photos",        xp: 600 },
  { id: "b_08", name: "Quality Critic", emoji: "✏️", desc: "Posted detailed reviews on 50 dishes",  rarity: "Uncommon",  earned: 6440,  criteria: "50 reviews >120 chars",         xp: 400 },
];

export const CHALLENGES: Challenge[] = [
  { id: "c_01", name: "Truffle Weekend",   type: "weekly",  xp: 500,  participants: 4218,  completion: 0.62, start: "2026-05-10", end: "2026-05-17", status: "active",    desc: "Rate 3 dishes containing truffle this weekend" },
  { id: "c_02", name: "Morning Ritual",    type: "daily",   xp: 100,  participants: 12410, completion: 0.78, start: "2026-05-14", end: "2026-05-15", status: "active",    desc: "Log a coffee or breakfast item before 10am" },
  { id: "c_03", name: "Local Hero Sprint", type: "weekly",  xp: 750,  participants: 2104,  completion: 0.31, start: "2026-05-12", end: "2026-05-19", status: "active",    desc: "Rate 5 restaurants within 2km of your home" },
  { id: "c_04", name: "Date Night",        type: "weekly",  xp: 600,  participants: 0,     completion: 0,    start: "2026-05-17", end: "2026-05-24", status: "scheduled", desc: "Rate a $$$+ restaurant with a partner tag" },
  { id: "c_05", name: "5-Borough Tour",    type: "monthly", xp: 2000, participants: 814,   completion: 0.12, start: "2026-05-01", end: "2026-05-31", status: "active",    desc: "Rate at least 1 dish in each of NYC's 5 boroughs" },
  { id: "c_06", name: "April Showers",     type: "monthly", xp: 1500, participants: 9402,  completion: 1.0,  start: "2026-04-01", end: "2026-04-30", status: "ended",     desc: "Rate 15 dishes during April" },
];

export const MOD_LOGS: ModLog[] = [
  { id: "L-918341", time: 8,    actor: "Alex Chen",   action: "ban",          target: "@ravibites",                  detail: "Permanent ban — fake review ring (28 reports)",     evidence: "RP-3041, RP-3040" },
  { id: "L-918340", time: 14,   actor: "Auto-mod",    action: "hide",         target: "Comment c_82041",             detail: "AI confidence 0.97 — hate speech",                  evidence: "Vision + LLM" },
  { id: "L-918339", time: 38,   actor: "Marcus Q.",   action: "warn",         target: "@julianth",                   detail: "Final warning — repeated harassment",               evidence: "RP-3033" },
  { id: "L-918338", time: 92,   actor: "Alex Chen",   action: "verify",       target: "L'Atelier Gourmet",           detail: "Verified after documentation review",               evidence: "Email thread" },
  { id: "L-918337", time: 180,  actor: "Alex Chen",   action: "create_badge", target: "Badge: Truffle Hunter",       detail: "Created with criteria: 25 truffle ratings",         evidence: "—" },
  { id: "L-918336", time: 240,  actor: "Marcus Q.",   action: "merge",        target: "Restaurant duplicates",       detail: "Merged 'Stack and Co' into 'Stack & Co.'",          evidence: "Manual review" },
  { id: "L-918335", time: 480,  actor: "Auto-mod",    action: "approve",      target: "Rating rt_92041",             detail: "AI score 0.01 — auto-approved",                     evidence: "LLM gate" },
  { id: "L-918334", time: 720,  actor: "Alex Chen",   action: "broadcast",    target: "Push: Weekend Challenge",     detail: "Sent to 118,402 users",                              evidence: "Campaign N-218" },
  { id: "L-918333", time: 1440, actor: "Sara Kwon",   action: "unban",        target: "@elenas",                     detail: "Appeal accepted — reinstated",                      evidence: "Appeal A-1209" },
  { id: "L-918332", time: 1800, actor: "Auto-mod",    action: "remove",       target: "14 ratings on Nami Sushi",    detail: "Coordinated 5★ spam from same IP cluster",          evidence: "Anomaly model" },
  { id: "L-918331", time: 2880, actor: "Marcus Q.",   action: "dismiss",      target: "Report RP-3034",              detail: "Not a violation — user taste complaint",            evidence: "RP-3034" },
  { id: "L-918330", time: 4320, actor: "Alex Chen",   action: "feature",      target: "Restaurant: The Ember Grill", detail: "Added to homepage 'Editor's Picks'",                evidence: "Editorial" },
];

export const ANALYTICS = {
  topRestaurants: [
    { name: "Osteria Marco",     ratings: 1502, growth: 12.4 },
    { name: "The Ember Grill",   ratings: 1203, growth: 18.2 },
    { name: "Nami Sushi",        ratings: 982,  growth: 4.1 },
    { name: "Stack & Co.",       ratings: 712,  growth: 22.0 },
    { name: "Ginza Grill",       ratings: 612,  growth: -3.2 },
    { name: "L'Atelier Gourmet", ratings: 488,  growth: 41.0 },
  ],
  topDishes: [
    { name: "Truffle Tagliatelle",   restaurant: "Osteria Marco",   rating: 5.0, ratings: 542 },
    { name: "Salmon Aburi Nigiri",   restaurant: "Nami Sushi",      rating: 4.9, ratings: 342 },
    { name: "Margherita Pizza",      restaurant: "Osteria Marco",   rating: 4.7, ratings: 312 },
    { name: "Char-Grilled Ribeye",   restaurant: "The Ember Grill", rating: 4.8, ratings: 233 },
    { name: "Smoked Brisket Burger", restaurant: "Stack & Co.",     rating: 4.5, ratings: 217 },
  ],
  geoSplit: [
    { region: "New York",  users: 84210, pct: 42 },
    { region: "São Paulo", users: 32104, pct: 16 },
    { region: "London",    users: 21408, pct: 11 },
    { region: "Mumbai",    users: 18402, pct: 9 },
    { region: "Toronto",   users: 14210, pct: 7 },
    { region: "Stockholm", users: 10408, pct: 5 },
    { region: "Other",     users: 19258, pct: 10 },
  ],
};
