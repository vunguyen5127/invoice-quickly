export interface SavedItem {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  rate: number;
  created_at: string;
}
