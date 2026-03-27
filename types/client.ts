export interface SavedClient {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  address: string | null;
  phone: string | null;
  created_at: string;
}
