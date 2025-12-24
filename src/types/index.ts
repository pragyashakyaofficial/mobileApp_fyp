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
  status: 'pending' | 'assigned' | 'completed' | 'cancelled' | 'in_progress';
  created_at: string;
  updated_at: string;
  designer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    fcm_token: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  worker: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    fcm_token: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  skills: Array<{
    id: number;
    name: string;
    pivot: {
      job_id: number;
      skill_id: number;
    };
  }>;
  files: Array<{
    id: number;
    uploader_id: number;
    attachable_id: number;
    attachable_type: string;
    path: string;
    filename: string;
    mime_type: string;
    size: number;
    storage_driver: string;
    created_at: string;
    updated_at: string;
  }>;
}
