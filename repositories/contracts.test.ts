import type {
  AchievementRepository,
  ActivityRepository,
  AttemptRepository,
  CompositionRepository,
  MasteryRepository,
  ProfileRepository,
  ProgressRepository,
  XPRepository,
} from "./contracts";

type Fixture = { id: string };
type CreateInput = { name: string };
type UpdateInput = Partial<CreateInput>;

const profileRepository: ProfileRepository<Fixture, CreateInput, UpdateInput> = null as never;
const activityRepository: ActivityRepository<Fixture, CreateInput, UpdateInput> = null as never;
const attemptRepository: AttemptRepository<Fixture, CreateInput, UpdateInput> = null as never;
const compositionRepository: CompositionRepository<Fixture, CreateInput, UpdateInput> = null as never;
const progressRepository: ProgressRepository<Fixture, CreateInput, UpdateInput> = null as never;
const masteryRepository: MasteryRepository<Fixture, CreateInput, UpdateInput> = null as never;
const xpRepository: XPRepository<Fixture, CreateInput, UpdateInput> = null as never;
const achievementRepository: AchievementRepository<Fixture, CreateInput, UpdateInput> = null as never;

void profileRepository;
void activityRepository;
void attemptRepository;
void compositionRepository;
void progressRepository;
void masteryRepository;
void xpRepository;
void achievementRepository;
