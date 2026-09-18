import { SupabaseActivityRepository } from "@/repositories/supabase/activity";
import { DefaultActivityService } from "./service";

export function createActivityService() {
  const repository = new SupabaseActivityRepository();

  return new DefaultActivityService(repository);
}
