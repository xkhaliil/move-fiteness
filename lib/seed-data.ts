import type { Activity, ActivityLevel, ActivityType, User } from "./types";

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export const SEED_USER_IDS = {
  marta: "u-marta",
  jordi: "u-jordi",
  laia: "u-laia",
  pau: "u-pau",
  nora: "u-nora",
  youssef: "u-youssef",
  elena: "u-elena",
  marc: "u-marc",
  sofia: "u-sofia",
  dani: "u-dani",
} as const;

export function createSeedUsers(): User[] {
  const base: Array<
    Pick<User, "id" | "name" | "bio" | "interests"> & {
      ratingSum: number;
      ratingCount: number;
    }
  > = [
    {
      id: SEED_USER_IDS.marta,
      name: "Marta Puig",
      bio: "Early riser, beach runs before work. Always up for a coffee after.",
      interests: ["running", "walking", "yoga"],
      ratingSum: 4.9 * 31,
      ratingCount: 31,
    },
    {
      id: SEED_USER_IDS.jordi,
      name: "Jordi Serra",
      bio: "Grew up playing 5-a-side in Sant Antoni. Still not great at it.",
      interests: ["football", "running"],
      ratingSum: 4.7 * 18,
      ratingCount: 18,
    },
    {
      id: SEED_USER_IDS.laia,
      name: "Laia Vidal",
      bio: "Poblenou local. Open-water swimmer, fair-weather only.",
      interests: ["swimming", "cycling"],
      ratingSum: 4.8 * 22,
      ratingCount: 22,
    },
    {
      id: SEED_USER_IDS.pau,
      name: "Pau Costa",
      bio: "Padel obsessive. Will happily teach you the wall shot.",
      interests: ["padel", "basketball"],
      ratingSum: 4.9 * 27,
      ratingCount: 27,
    },
    {
      id: SEED_USER_IDS.nora,
      name: "Nora Whitfield",
      bio: "Moved from London a year ago. Gym in the morning keeps me sane.",
      interests: ["gym", "yoga"],
      ratingSum: 4.6 * 14,
      ratingCount: 14,
    },
    {
      id: SEED_USER_IDS.youssef,
      name: "Youssef El Amrani",
      bio: "New in Barcelona, looking for regular pickup games and cycling buddies.",
      interests: ["basketball", "cycling"],
      ratingSum: 4.8 * 19,
      ratingCount: 19,
    },
    {
      id: SEED_USER_IDS.elena,
      name: "Elena Rossi",
      bio: "Sunset walker. Montjuïc has the best views in the city, fight me.",
      interests: ["walking", "yoga"],
      ratingSum: 5.0 * 12,
      ratingCount: 12,
    },
    {
      id: SEED_USER_IDS.marc,
      name: "Marc Ferran",
      bio: "Badminton on weeknights, otherwise glued to a desk.",
      interests: ["badminton", "running"],
      ratingSum: 4.5 * 9,
      ratingCount: 9,
    },
    {
      id: SEED_USER_IDS.sofia,
      name: "Sofia Bianchi",
      bio: "Yoga teacher on weekends, always looking for an excuse to be outside.",
      interests: ["yoga", "walking"],
      ratingSum: 4.9 * 24,
      ratingCount: 24,
    },
    {
      id: SEED_USER_IDS.dani,
      name: "Dani Roig",
      bio: "Trail running around Collserola most Saturdays. Slow pace, good company.",
      interests: ["running", "cycling"],
      ratingSum: 4.4 * 11,
      ratingCount: 11,
    },
  ];

  return base.map((u) => ({
    id: u.id,
    name: u.name,
    city: "Barcelona",
    interests: u.interests,
    bio: u.bio,
    isPremium: false,
    ratingSum: u.ratingSum,
    ratingCount: u.ratingCount,
    createdAt: hoursFromNow(-24 * 200),
  }));
}

interface SeedActivitySpec {
  id: string;
  hostId: string;
  type: ActivityType;
  title: string;
  description: string;
  neighborhood: string;
  locationName: string;
  hoursOffset: number;
  capacity: number;
  level: ActivityLevel;
  approvedParticipantIds: string[];
}

export const PAST_ONBOARDING_ACTIVITY_ID = "a-beach-run-past";

export function createSeedActivities(): Activity[] {
  const specs: SeedActivitySpec[] = [
    {
      id: PAST_ONBOARDING_ACTIVITY_ID,
      hostId: SEED_USER_IDS.marta,
      type: "running",
      title: "Sunset Beach Run",
      description: "Easy-pace run along the beach, coffee after for anyone who wants it.",
      neighborhood: "Barceloneta",
      locationName: "Barceloneta Beach boardwalk",
      hoursOffset: -22,
      capacity: 8,
      level: "any",
      approvedParticipantIds: [SEED_USER_IDS.jordi, SEED_USER_IDS.laia],
    },
    {
      id: "a-padel-sunrise",
      hostId: SEED_USER_IDS.pau,
      type: "padel",
      title: "Sunrise Padel",
      description: "Two courts booked, looking for two more to fill out the second.",
      neighborhood: "Vall d'Hebron",
      locationName: "Vall d'Hebron padel courts",
      hoursOffset: 26,
      capacity: 4,
      level: "intermediate",
      approvedParticipantIds: [SEED_USER_IDS.marc],
    },
    {
      id: "a-basketball-poblenou",
      hostId: SEED_USER_IDS.youssef,
      type: "basketball",
      title: "Pickup Basketball",
      description: "Casual run, all levels welcome. We usually get a full court going.",
      neighborhood: "Poblenou",
      locationName: "Parc del Centre del Poblenou court",
      hoursOffset: 48,
      capacity: 10,
      level: "any",
      approvedParticipantIds: [SEED_USER_IDS.pau, SEED_USER_IDS.jordi, SEED_USER_IDS.dani],
    },
    {
      id: "a-gym-gracia",
      hostId: SEED_USER_IDS.nora,
      type: "gym",
      title: "Gràcia Gym Session",
      description: "Upper body day, happy to share the machines and spot each other.",
      neighborhood: "Gràcia",
      locationName: "Gràcia municipal gym",
      hoursOffset: 4,
      capacity: 3,
      level: "any",
      approvedParticipantIds: [],
    },
    {
      id: "a-walk-montjuic",
      hostId: SEED_USER_IDS.elena,
      type: "walking",
      title: "Montjuïc Sunset Walk",
      description: "Slow, scenic walk up to the castle for the view. Not a workout, a wind-down.",
      neighborhood: "Montjuïc",
      locationName: "Montjuïc cable car base",
      hoursOffset: 30,
      capacity: 8,
      level: "any",
      approvedParticipantIds: [SEED_USER_IDS.sofia, SEED_USER_IDS.marta],
    },
    {
      id: "a-badminton-eixample",
      hostId: SEED_USER_IDS.marc,
      type: "badminton",
      title: "Badminton Night",
      description: "Court booked for two hours, rotating doubles.",
      neighborhood: "Eixample",
      locationName: "Eixample sports centre",
      hoursOffset: 96,
      capacity: 4,
      level: "beginner",
      approvedParticipantIds: [SEED_USER_IDS.nora],
    },
    {
      id: "a-yoga-ciutadella",
      hostId: SEED_USER_IDS.sofia,
      type: "yoga",
      title: "Ciutadella Park Yoga",
      description: "Mat and good mood required, nothing else. Bring water.",
      neighborhood: "Ciutadella",
      locationName: "Ciutadella Park, near the lake",
      hoursOffset: 50,
      capacity: 12,
      level: "any",
      approvedParticipantIds: [SEED_USER_IDS.elena, SEED_USER_IDS.marta, SEED_USER_IDS.nora],
    },
    {
      id: "a-trail-collserola",
      hostId: SEED_USER_IDS.dani,
      type: "running",
      title: "Collserola Trail Run",
      description: "Forest trails, moderate hills, slow and steady pace with regular regroup stops.",
      neighborhood: "Collserola",
      locationName: "Collserola park entrance, Peu del Funicular",
      hoursOffset: 120,
      capacity: 6,
      level: "intermediate",
      approvedParticipantIds: [SEED_USER_IDS.jordi],
    },
    {
      id: "a-football-santantoni",
      hostId: SEED_USER_IDS.jordi,
      type: "football",
      title: "Sant Antoni 5-a-side",
      description: "Regular Thursday game, always short a couple of players.",
      neighborhood: "Sant Antoni",
      locationName: "Sant Antoni municipal pitch",
      hoursOffset: 144,
      capacity: 10,
      level: "any",
      approvedParticipantIds: [SEED_USER_IDS.youssef, SEED_USER_IDS.marc, SEED_USER_IDS.dani, SEED_USER_IDS.pau],
    },
    {
      id: "a-swim-poblenou",
      hostId: SEED_USER_IDS.laia,
      type: "swimming",
      title: "Poblenou Beach Swim",
      description: "Open water, short loop between the flags. Not a race, just company.",
      neighborhood: "Poblenou",
      locationName: "Bogatell Beach",
      hoursOffset: 72,
      capacity: 5,
      level: "any",
      approvedParticipantIds: [],
    },
    {
      id: "a-cycling-elborn",
      hostId: SEED_USER_IDS.youssef,
      type: "cycling",
      title: "El Born Evening Ride",
      description: "Easy loop through the old town and out along the coast, back for a drink.",
      neighborhood: "El Born",
      locationName: "El Born Cultural Centre",
      hoursOffset: 54,
      capacity: 8,
      level: "any",
      approvedParticipantIds: [SEED_USER_IDS.laia, SEED_USER_IDS.dani],
    },
    {
      id: "a-basketball-past",
      hostId: SEED_USER_IDS.pau,
      type: "basketball",
      title: "Barceloneta Court Session",
      description: "Beachside court, casual 3-on-3.",
      neighborhood: "Barceloneta",
      locationName: "Barceloneta outdoor courts",
      hoursOffset: -70,
      capacity: 6,
      level: "any",
      approvedParticipantIds: [SEED_USER_IDS.youssef, SEED_USER_IDS.jordi],
    },
  ];

  return specs.map((s) => ({
    id: s.id,
    hostId: s.hostId,
    type: s.type,
    title: s.title,
    description: s.description,
    neighborhood: s.neighborhood,
    locationName: s.locationName,
    dateTime: hoursFromNow(s.hoursOffset),
    capacity: s.capacity,
    level: s.level,
    createdAt: hoursFromNow(s.hoursOffset - 48),
  }));
}

export function createSeedApprovedParticipants(): Record<string, string[]> {
  return {
    [PAST_ONBOARDING_ACTIVITY_ID]: [SEED_USER_IDS.jordi, SEED_USER_IDS.laia],
    "a-padel-sunrise": [SEED_USER_IDS.marc],
    "a-basketball-poblenou": [SEED_USER_IDS.pau, SEED_USER_IDS.jordi, SEED_USER_IDS.dani],
    "a-gym-gracia": [],
    "a-walk-montjuic": [SEED_USER_IDS.sofia, SEED_USER_IDS.marta],
    "a-badminton-eixample": [SEED_USER_IDS.nora],
    "a-yoga-ciutadella": [SEED_USER_IDS.elena, SEED_USER_IDS.marta, SEED_USER_IDS.nora],
    "a-trail-collserola": [SEED_USER_IDS.jordi],
    "a-football-santantoni": [SEED_USER_IDS.youssef, SEED_USER_IDS.marc, SEED_USER_IDS.dani, SEED_USER_IDS.pau],
    "a-swim-poblenou": [],
    "a-cycling-elborn": [SEED_USER_IDS.laia, SEED_USER_IDS.dani],
    "a-basketball-past": [SEED_USER_IDS.youssef, SEED_USER_IDS.jordi],
  };
}
