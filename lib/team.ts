export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  /** Extra CSS scale applied to the photo, for shots where the face is small in frame. */
  photoZoom?: number;
  /** Pan the photo within its circle after zooming, in px (positive = right / down). */
  photoOffsetX?: number;
  photoOffsetY?: number;
}

export const TEAM: TeamMember[] = [
  { name: "Diganta", role: "Founder", photo: "/team/diganta.jpeg" },
  { name: "Iliya", role: "Co-Founder", photo: "/team/ilya.jpeg" },
  { name: "Kathe", role: "Head of Operations", photo: "/team/kathe.jpeg" },
  {
    name: "Khalil",
    role: "CTO",
    photo: "/team/khalil.jpeg",
    photoZoom: 3.06,
    photoOffsetX: -4,
  },
  { name: "Ju", role: "CCO", photo: "/team/ju.jpeg" },
];
