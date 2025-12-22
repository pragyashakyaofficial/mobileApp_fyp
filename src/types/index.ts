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
  id: string;
  title: string;
  client: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Pending' | 'Completed';
  distance: string;
  time: string;
  location: {
    latitude: number;
    longitude: number;
  };
  materials: string[];
  images: string[];
}
