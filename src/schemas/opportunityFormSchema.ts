
import { z } from "zod";

export const opportunityTypeOptions = [
  { value: "Sponsorship", label: "Sponsorship" },
  { value: "Event", label: "Event" },
  { value: "Product Testing", label: "Product Testing" },
  { value: "Affiliate", label: "Affiliate" },
] as const;

export const opportunityFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  detailed_description: z.string().optional(),
  type: z.string({
    required_error: "Please select a type",
  }),
  reward: z.string().min(1, "Reward is required"),
  deadline: z.string().min(1, "Deadline is required"),
  duration: z.string().min(1, "Duration is required"),
  requirements: z.string().optional(),
});

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

export const defaultOpportunityValues: OpportunityFormValues = {
  title: "",
  description: "",
  detailed_description: "",
  type: "",
  reward: "",
  deadline: "",
  duration: "",
  requirements: "",
};
