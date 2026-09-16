import type { CompetencyDetail } from "@/types";

export interface CompetencyDetailService {
  getByCode(code: string): Promise<CompetencyDetail | null>;
}
