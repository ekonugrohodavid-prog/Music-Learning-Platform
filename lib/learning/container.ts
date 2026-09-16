import { createClient } from "@/lib/supabase/server";
import { DefaultCompetencyDetailService } from "./service";
import { SupabaseActivityRepository } from "@/repositories/supabase/activity";
import { SupabaseCompetencyRepository } from "@/repositories/supabase/competency";
import { SupabaseLearningContentRepository } from "@/repositories/supabase/learning-content";
import { SupabaseMasteryRepository } from "@/repositories/supabase/mastery";

export async function createCompetencyDetailService() {
  const supabase = await createClient();

  return new DefaultCompetencyDetailService(
    new SupabaseCompetencyRepository(),
    new SupabaseLearningContentRepository(),
    new SupabaseActivityRepository(),
    new SupabaseMasteryRepository(supabase),
  );
}
