
import * as z from "zod";

// Define the form schema with validation rules
export const profileFormSchema = z.object({
  clubName: z.string().min(2, "Club name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  memberCount: z.coerce.number().int().nonnegative("Member count must be a positive number"),
  description: z.string().max(500, "Description cannot exceed 500 characters"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  instagramHandle: z.string().optional(),
  instagramFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
  twitterHandle: z.string().optional(),
  twitterFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
  facebookPage: z.string().optional(),
  facebookFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
  averageGroupSize: z.coerce.number().int().nonnegative("Group size must be a positive number"),
  coreDemographic: z.string(),
  runTypes: z.array(z.string()),
  eventExperience: z.array(z.string())
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const defaultProfileValues: ProfileFormValues = {
  clubName: "Sunrise Runners",
  location: "San Francisco, CA",
  memberCount: 45,
  description: "A diverse run club meeting twice weekly for morning and evening runs, welcoming runners of all levels. We organize monthly events and participate in local races.",
  website: "https://sunriserunners.com",
  instagramHandle: "sunrise_runners",
  instagramFollowers: 1200,
  twitterHandle: "sunriserunSF",
  twitterFollowers: 750,
  facebookPage: "Sunrise Runners Club",
  facebookFollowers: 980,
  averageGroupSize: 25,
  coreDemographic: "25-34",
  runTypes: ["Road", "Trail", "Track", "Urban"],
  eventExperience: ["Races", "Charity Runs", "Sponsored Events", "Community Meetups"]
};
