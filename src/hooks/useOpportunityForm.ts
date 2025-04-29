
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { OpportunityFormValues, opportunityFormSchema, defaultOpportunityValues } from "@/schemas/opportunityFormSchema";
import { createOpportunity } from "@/api/opportunityApi";

export function useOpportunityForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: defaultOpportunityValues,
  });
  
  async function onSubmit(data: OpportunityFormValues) {
    setIsSubmitting(true);
    
    try {
      const result = await createOpportunity(data);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success!",
        description: "Your opportunity has been posted.",
      });
      
      // Redirect to manage opportunities page
      navigate("/dashboard/brand/manage-opportunities");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
