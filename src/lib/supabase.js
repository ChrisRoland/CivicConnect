// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations

// Fetch all issues
export async function getIssues(filters = {}) {
  let query = supabase
    .from("issues")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// Create a new issue
export async function createIssue(issueData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("issues")
    .insert([
      {
        ...issueData,
        user_id: user?.id,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

// Update issue status (for admin dashboard)
export async function updateIssueStatus(issueId, newStatus) {
  const { data, error } = await supabase
    .from("issues")
    .update({ status: newStatus })
    .eq("id", issueId)
    .select();

  if (error) throw error;
  return data[0];
}

// Upvote an issue
export async function upvoteIssue(issueId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Must be logged in to upvote");

  // Check if already upvoted (use maybeSingle instead of single to handle 0 results)
  const { data: existing, error: checkError } = await supabase
    .from("issue_upvotes")
    .select("*")
    .eq("issue_id", issueId)
    .eq("user_id", user.id)
    .maybeSingle();

  // Handle any errors except "no rows" which is expected
  if (checkError && checkError.code !== "PGRST116") {
    throw checkError;
  }

  if (existing) {
    // Remove upvote
    const { data: deleteData, error: deleteError } = await supabase
      .from("issue_upvotes")
      .delete()
      .eq("issue_id", issueId)
      .eq("user_id", user.id)
      .select();

    console.log("Delete result:", { deleteData, deleteError });

    if (deleteError) {
      console.error("Failed to delete upvote:", deleteError);
      throw deleteError;
    }

    // Get actual count from issue_upvotes table AFTER deletion
    const { count, error: countError } = await supabase
      .from("issue_upvotes")
      .select("*", { count: "exact", head: true })
      .eq("issue_id", issueId);

    console.log("Count after deletion:", count);

    if (countError) throw countError;

    // Update with actual count
    const { data: updateData, error: updateError } = await supabase
      .from("issues")
      .update({ upvotes: count || 0 })
      .eq("id", issueId)
      .select();

    console.log("Update result:", { updateData, updateError });

    if (updateError) throw updateError;

    return { action: "removed", count: count || 0 };
  } else {
    // Add upvote
    const { error: insertError } = await supabase
      .from("issue_upvotes")
      .insert([{ issue_id: issueId, user_id: user.id }]);

    if (insertError) throw insertError;

    // Get actual count from issue_upvotes table AFTER insertion
    const { count, error: countError } = await supabase
      .from("issue_upvotes")
      .select("*", { count: "exact", head: true })
      .eq("issue_id", issueId);

    if (countError) throw countError;

    // Update with actual count
    const { error: updateError } = await supabase
      .from("issues")
      .update({ upvotes: count || 0 })
      .eq("id", issueId);

    if (updateError) throw updateError;

    return { action: "added", count: count || 0 };
  }
}

// Upload image to Supabase Storage
export async function uploadIssueImage(file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `issue-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("issues")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("issues").getPublicUrl(filePath);

  return data.publicUrl;
}

// Sign in anonymously (for quick testing)
export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data;
}

// // Sign in with email
// export async function signInWithEmail(email, password) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password
//   })
//   if (error) throw error
//   return data
// }

// // Sign up with email
// export async function signUpWithEmail(email, password) {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password
//   })
//   if (error) throw error
//   return data
// }

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Sign up with email
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
    },
  });
  if (error) throw error;
  return data;
}

// Sign in with email
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Check if current user is admin
export async function isUserAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;

  const role = user.user_metadata?.role || user.app_metadata?.role;
  return role === "admin";
}
