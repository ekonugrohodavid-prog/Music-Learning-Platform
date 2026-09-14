import type { UserId, UserProfile } from "@/types";
import type { ProfileRepository } from "@/repositories";
import { NotFoundError } from "@/types/errors";

export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository<
      UserProfile,
      never,
      never,
      UserId
    >,
  ) {}

  async getCurrentProfile(userId: UserId): Promise<UserProfile> {
    const profile = await this.profileRepository.findById(userId);

    if (!profile) {
      throw new NotFoundError("User profile not found.", {
        details: {
          userId,
        },
      });
    }

    return profile;
  }
}