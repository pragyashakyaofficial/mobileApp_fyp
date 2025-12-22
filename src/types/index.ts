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
