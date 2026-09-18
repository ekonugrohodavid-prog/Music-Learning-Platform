import type { Activity } from "@/types";

export interface ActivityDetailService {
  getById(id: Activity["id"]): Promise<Activity | null>;
}
