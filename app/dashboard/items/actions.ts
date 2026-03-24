"use server";

import { createClient } from "@supabase/supabase-js";
import config from "@/utils/config";
import { revalidatePath } from "next/cache";
import { SavedItem } from "@/types/item";

function getServerSupabase(token: string) {
  const { url, anonKey } = config.supabase;
  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

export async function getItems(
  token: string,
  options: { page?: number; pageSize?: number; search?: string } = {}
): Promise<{ data: SavedItem[]; totalCount: number }> {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { page = 1, pageSize = 10, search = "" } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("items")
    .select("*", { count: "exact" })
    .eq("user_id", user.id);

  if (search.trim()) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching items:", error);
    throw new Error("Failed to fetch items");
  }

  return {
    data: data as SavedItem[],
    totalCount: count || 0
  };
}

export async function createItem(token: string, name: string, rate: number): Promise<SavedItem> {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("items")
    .insert([{
      user_id: user.id,
      name,
      rate
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating item:", error);
    throw new Error("Failed to create item");
  }

  revalidatePath("/dashboard/items");
  return data as SavedItem;
}

export async function updateItem(token: string, id: string, name: string, rate: number): Promise<SavedItem> {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("items")
    .update({ name, rate })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating item:", error);
    throw new Error("Failed to update item");
  }

  revalidatePath("/dashboard/items");
  return data as SavedItem;
}

export async function deleteItem(token: string, id: string): Promise<void> {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting item:", error);
    throw new Error("Failed to delete item");
  }

  revalidatePath("/dashboard/items");
}
