
import { useCallback } from 'react';
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/schemas/profileFormSchema";

export function useTagManagement(form: UseFormReturn<ProfileFormValues>) {
  const addRunType = useCallback((selectedRunType: string) => {
    if (!selectedRunType) return;
    
    const currentRunTypes = form.getValues("runTypes");
    if (!currentRunTypes.includes(selectedRunType)) {
      form.setValue("runTypes", [...currentRunTypes, selectedRunType], { shouldDirty: true });
      return true;
    }
    return false;
  }, [form]);

  const removeRunType = useCallback((type: string) => {
    const currentRunTypes = form.getValues("runTypes");
    // Immediately update the form value
    form.setValue(
      "runTypes", 
      currentRunTypes.filter(t => t !== type),
      { shouldDirty: true }
    );
  }, [form]);

  const addEventExperience = useCallback((selectedEventExp: string) => {
    if (!selectedEventExp) return;
    
    const currentEvents = form.getValues("eventExperience");
    if (!currentEvents.includes(selectedEventExp)) {
      form.setValue("eventExperience", [...currentEvents, selectedEventExp], { shouldDirty: true });
      return true;
    }
    return false;
  }, [form]);

  const removeEventExperience = useCallback((event: string) => {
    const currentEvents = form.getValues("eventExperience");
    // Immediately update the form value
    form.setValue(
      "eventExperience", 
      currentEvents.filter(e => e !== event),
      { shouldDirty: true }
    );
  }, [form]);

  return {
    addRunType,
    removeRunType,
    addEventExperience,
    removeEventExperience
  };
}
