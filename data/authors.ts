export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  email?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export const authors: Record<string, Author> = {
  "vubuilds": {
    id: "vubuilds",
    name: "VuBuilds",
    role: "Founder & Product Creator",
    bio: "VuBuilds is the creator of Invoice-Quickly. With a deep passion for building tools that help freelancers and small businesses streamline their operations, Vu focuses on creating efficient, beautiful, and secure software solutions.",
    avatarUrl: "/avatars/vubuilds.png",
    email: "vu.nguyen@invoice-quickly.com",
    socials: {
      twitter: "https://x.com/sakura_lol_girl",
      website: "https://invoice-quickly.com",
    },
  },
};
