export interface User {
  id: number;
  name: string;
  email: string;
  contact?: string;
  position?: string;
  joineddate?: string;
  branch?: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Job {
  id: number;
  designer_id: number;
  worker_id: number;
  title: string;
  description: string;
  priority: number;
  room_type: string;
  location_lat: string;
  location_lng: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  budget: string | null;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  designer: {
    id: number;
    name: string;
  };
}
