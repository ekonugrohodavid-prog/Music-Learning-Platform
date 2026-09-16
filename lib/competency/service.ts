import type { Competency } from "@/types";
import { requireStudent } from "@/lib/auth/authorization";
import {
  SupabaseCompetencyRepository,
} from "@/repositories/supabase/competency";

export class CompetencyService {
  constructor(
    private readonly repository =
      new SupabaseCompetencyRepository(),
  ) {}

  async getCompetencies(): Promise<readonly Competency[]> {
    await requireStudent();

    return this.repository.list();
  }

  async getCompetency(
    id: string,
  ): Promise<Competency | null> {
    await requireStudent();

    return this.repository.findById(id);
  }
}
