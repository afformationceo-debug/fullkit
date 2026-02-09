"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: {
  title: string;
  client_id: string;
  service_type: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert(formData);

  if (error) return { success: false, error: error.message };
  revalidatePath("/projects");
  return { success: true };
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update(data).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

export async function updateProjectStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ status }).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

export async function createTask(formData: {
  project_id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee_id?: string;
  due_date?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert(formData);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/projects/${formData.project_id}`);
  return { success: true };
}

export async function updateTaskStatus(taskId: string, status: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function deleteTask(taskId: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/projects");
  return { success: true };
}
