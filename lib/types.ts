export type ActivityType =
  | "running"
  | "walking"
  | "cycling"
  | "basketball"
  | "football"
  | "padel"
  | "badminton"
  | "gym"
  | "yoga"
  | "swimming";

export type ActivityCategory =
  | "running"
  | "ball-sports"
  | "racket-sports"
  | "gym-fitness"
  | "outdoors";

export type ActivityLevel = "any" | "beginner" | "intermediate" | "advanced";

export const ACTIVITY_CATEGORY_BY_TYPE: Record<ActivityType, ActivityCategory> = {
  running: "running",
  walking: "outdoors",
  cycling: "outdoors",
  basketball: "ball-sports",
  football: "ball-sports",
  padel: "racket-sports",
  badminton: "racket-sports",
  gym: "gym-fitness",
  yoga: "gym-fitness",
  swimming: "outdoors",
};

export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  running: "Running",
  walking: "Walking",
  cycling: "Cycling",
  basketball: "Basketball",
  football: "Football",
  padel: "Padel",
  badminton: "Badminton",
  gym: "Gym session",
  yoga: "Yoga",
  swimming: "Swimming",
};

export const ACTIVITY_CATEGORY_LABEL: Record<ActivityCategory, string> = {
  running: "Running",
  "ball-sports": "Ball Sports",
  "racket-sports": "Racket Sports",
  "gym-fitness": "Gym & Fitness",
  outdoors: "Outdoors",
};

export interface User {
  id: string;
  name: string;
  city: string;
  interests: ActivityType[];
  bio: string;
  isPremium: boolean;
  ratingSum: number;
  ratingCount: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  hostId: string;
  type: ActivityType;
  title: string;
  description: string;
  neighborhood: string;
  locationName: string;
  dateTime: string;
  capacity: number;
  level: ActivityLevel;
  createdAt: string;
}

export type JoinRequestStatus = "pending" | "approved" | "declined";

export interface JoinRequest {
  id: string;
  activityId: string;
  userId: string;
  status: JoinRequestStatus;
  requestedAt: string;
}

export type RatingTag = "no-show" | "great-vibe" | "good-pace" | null;

export interface Rating {
  id: string;
  activityId: string;
  raterId: string;
  rateeId: string;
  score: number;
  tag: RatingTag;
  createdAt: string;
}

export type NotificationType = "join_request" | "request_approved";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  activityId: string;
  read: boolean;
  createdAt: string;
}
