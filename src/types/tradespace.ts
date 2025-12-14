export type Tradespace = {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  trending?: boolean;
  memberCount?: number;
  postsPerDay?: number;
  activeListings?: number;
  tags?: Array<string>;
  category?: string;
  verified?: boolean;
};
