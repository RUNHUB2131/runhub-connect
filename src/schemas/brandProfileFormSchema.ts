
import * as z from "zod";

// Define the form schema with validation rules for brands
export const brandProfileFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  linkedinHandle: z.string().optional(),
  twitterHandle: z.string().optional(),
  instagramHandle: z.string().optional(),
  facebookPage: z.string().optional(),
  foundedYear: z.coerce.number().int().min(1800, "Invalid year").optional(),
  companySize: z.string().optional(),
  targetAudience: z.array(z.string()),
  previousSponsorship: z.array(z.string())
});

export type BrandProfileFormValues = z.infer<typeof brandProfileFormSchema>;

export const defaultBrandProfileValues: BrandProfileFormValues = {
  companyName: "Example Brand",
  location: "New York, NY",
  industry: "Sports Apparel",
  description: "A premium sports apparel company focused on running gear and accessories for athletes of all levels.",
  website: "https://examplebrand.com",
  linkedinHandle: "examplebrand",
  twitterHandle: "examplebrand",
  instagramHandle: "examplebrand",
  facebookPage: "Example Brand",
  foundedYear: 2010,
  companySize: "51-200",
  targetAudience: ["Runners", "Athletes", "Fitness Enthusiasts"],
  previousSponsorship: ["Local Marathons", "College Track Teams", "Charity Runs"]
};
