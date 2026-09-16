import { SupabaseLearningContentRepository } from "@/repositories/supabase/learning-content";
import { DefaultLearningContentReaderService } from "./service";

export function createLearningContentReaderService() {
  const repository = new SupabaseLearningContentRepository();

  return new DefaultLearningContentReaderService(repository);
}
