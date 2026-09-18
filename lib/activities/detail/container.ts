import { SupabaseActivityRepository } from "@/repositories/supabase/activity";
import { DefaultActivityDetailService } from "./service";

export function createActivityDetailService() {
  const repository = new SupabaseActivityRepository();

  return new DefaultActivityDetailService(repository);
}
