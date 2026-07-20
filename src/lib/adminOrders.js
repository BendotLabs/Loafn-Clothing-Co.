import { supabase } from "./supabaseClient";

// Relies on the admin RLS policies added in 006_admin_orders_policies.sql.
// A non-admin calling these gets an empty result / rejected write from
// Supabase directly — no separate permission check needed here.

export async function fetchAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  return { data, error };
}