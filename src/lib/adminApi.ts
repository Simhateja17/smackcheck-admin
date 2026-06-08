'use client';

import { supabase } from './supabase';

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '');

export type AdminAction = {
  action: string;
  reason?: string;
  resolve?: boolean;
};

export async function getAccessToken() {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data.session?.access_token;
  if (!token) throw new Error('Not signed in');
  return token;
}

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with ${response.status}`);
  }
  return payload as T;
}

export async function getAdminMe() {
  return adminFetch<AdminProfile>('/admin/me');
}

export const adminApi = {
  dashboard: () => adminFetch<AdminDashboardResponse>('/admin/dashboard'),
  users: (params = '') => adminFetch<AdminUsersResponse>(`/admin/users${params}`),
  user: (id: string) => adminFetch<AdminUserDetailResponse>(`/admin/users/${id}`),
  userAction: (id: string, body: AdminAction) => adminFetch(`/admin/users/${id}/action`, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  reports: (params = '') => adminFetch<AdminReportsResponse>(`/admin/reports${params}`),
  reportAction: (id: string, body: AdminAction) => adminFetch(`/admin/reports/${id}/action`, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  content: (params = '') => adminFetch<AdminContentResponse>(`/admin/content${params}`),
  contentAction: (type: string, id: string, body: AdminAction) => adminFetch(`/admin/content/${type}/${id}/action`, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  restaurants: (params = '') => adminFetch<AdminRestaurantsResponse>(`/admin/restaurants${params}`),
  restaurantStatus: (id: string, body: { status: string; reason?: string }) => adminFetch(`/admin/restaurants/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }),
  dishes: (params = '') => adminFetch<AdminDishesResponse>(`/admin/dishes${params}`),
  dishStatus: (id: string, body: { status: string; reason?: string }) => adminFetch(`/admin/dishes/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }),
  notifications: (params = '') => adminFetch<AdminNotificationsResponse>(`/admin/notifications${params}`),
  broadcast: (body: { title: string; body: string; targetUserIds?: string[]; reason?: string }) => adminFetch('/admin/notifications/broadcast', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  badges: () => adminFetch<AdminBadgesResponse>('/admin/badges'),
  challenges: () => adminFetch<AdminChallengesResponse>('/admin/challenges'),
  logs: (params = '') => adminFetch<AdminLogsResponse>(`/admin/logs${params}`),
  analytics: () => adminFetch<AdminAnalyticsResponse>('/admin/analytics'),
};

export type AdminDashboardResponse = {
  stats: Record<string, number>;
  recentUsers: AdminProfile[];
  recentReports: AdminReport[];
  recentActions: AdminModerationAction[];
  topDishes: AdminDish[];
};

export type AdminUsersResponse = {
  users: AdminProfile[];
  count: number;
  limit: number;
  offset: number;
};

export type AdminUserDetailResponse = {
  user: AdminProfile;
  ratings: AdminRating[];
  reports: AdminReport[];
  badges: unknown[];
  actions: AdminModerationAction[];
};

export type AdminReportsResponse = {
  reports: AdminReport[];
  count: number;
  limit: number;
  offset: number;
};

export type AdminContentResponse = {
  items: AdminRating[];
  count: number;
  limit: number;
  offset: number;
};

export type AdminRestaurantsResponse = {
  restaurants: AdminRestaurant[];
  count: number;
  limit: number;
  offset: number;
};

export type AdminDishesResponse = {
  dishes: AdminDish[];
  count: number;
  limit: number;
  offset: number;
};

export type AdminNotificationsResponse = {
  notifications: AdminNotification[];
  count: number;
  limit: number;
  offset: number;
};

export type AdminBadgesResponse = { badges: AdminBadge[] };
export type AdminChallengesResponse = { challenges: AdminChallenge[] };
export type AdminLogsResponse = { logs: AdminModerationAction[]; count: number; limit: number; offset: number };
export type AdminAnalyticsResponse = { days: string[]; newUsers: number[]; ratings: number[]; reports: number[] };

export type AdminProfile = {
  id: string;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  profile_photo_url?: string | null;
  bio?: string | null;
  last_location?: string | null;
  level?: number | null;
  xp?: number | null;
  followers_count?: number | null;
  following_count?: number | null;
  last_rating_date?: string | null;
  account_status?: string | null;
  is_admin?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminReport = {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  details?: string | null;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminRating = {
  id: string;
  user_id?: string | null;
  dish_id?: string | null;
  restaurant_id?: string | null;
  rating?: number | null;
  comment?: string | null;
  image_url?: string | null;
  content_status?: string | null;
  likes_count?: number | null;
  created_at?: string | null;
  profiles?: AdminProfile | null;
  dishes?: AdminDish | null;
  restaurants?: AdminRestaurant | null;
};

export type AdminRestaurant = {
  id: string;
  name?: string | null;
  city?: string | null;
  cuisine?: string | null;
  category?: string | null;
  image_url?: string | null;
  image_urls?: string[] | null;
  photo_urls?: string[] | null;
  average_rating?: number | null;
  review_count?: number | null;
  catalog_status?: string | null;
  featured?: boolean | null;
  created_at?: string | null;
  first_reviewer?: AdminProfile | null;
};

export type AdminDish = {
  id: string;
  name?: string | null;
  restaurant_id?: string | null;
  image_url?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
  catalog_status?: string | null;
  created_at?: string | null;
  restaurants?: AdminRestaurant | null;
  first_reviewer?: AdminProfile | null;
};

export type AdminNotification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  event_type: string;
  created_at?: string | null;
  is_read?: boolean | null;
};

export type AdminBadge = {
  id: string;
  name?: string | null;
  description?: string | null;
  category?: string | null;
  icon_url?: string | null;
};

export type AdminChallenge = {
  id: string;
  title?: string | null;
  name?: string | null;
  description?: string | null;
  action_type?: string | null;
  target_count?: number | null;
  xp_reward?: number | null;
  is_active?: boolean | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type AdminModerationAction = {
  id: string;
  moderator_id?: string | null;
  target_type: string;
  target_id: string;
  action: string;
  reason?: string | null;
  created_at?: string | null;
  profiles?: AdminProfile | null;
};
