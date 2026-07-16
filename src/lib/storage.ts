import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Configure Supabase Storage access."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const BUCKET = "uploads";

/** Upload a file to the public `uploads` bucket, returning its public URL. */
export async function uploadFile(
  path: string,
  file: File,
  contentType: string
): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
